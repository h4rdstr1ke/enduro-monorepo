// Package scraper реализует ETL-процесс (Extract, Transform, Load) для сбора
// технических характеристик мотоциклов с сайта каталога и сохранения их в базу данных.
package scraper

import (
	"log"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gocolly/colly/v2"
	"gorm.io/gorm"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

// Scraper предоставляет методы для обхода страниц и сохранения данных в БД.
type Scraper struct {
	DB           *gorm.DB
	mu           sync.Mutex // Защищает счетчики при параллельном парсинге
	ItemsFound   int
	ItemsCreated int
	ItemsUpdated int
}

// NewScraper инициализирует новый экземпляр парсера с подключением к базе данных.
func NewScraper(db *gorm.DB) *Scraper {
	return &Scraper{DB: db}
}

// Run настраивает коллекторы Colly и запускает процесс сбора данных.
func (s *Scraper) Run(startURL string) {
	c := colly.NewCollector(
		colly.AllowedDomains("rollingmoto.ru", "www.rollingmoto.ru"),
	)

	// Настройка ограничений: пауза 3 секунды для предотвращения блокировок
	c.Limit(&colly.LimitRule{
		DomainGlob:  "*",
		RandomDelay: 3 * time.Second,
	})

	// Имитация реального браузера
	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	})

	detailCollector := c.Clone()

	// --- ЛОГИРОВАНИЕ ОШИБОК ---
	detailCollector.OnError(func(r *colly.Response, err error) {
		log.Printf("Ошибка при загрузке карточки %s: %v (Статус: %d)\n", r.Request.URL, err, r.StatusCode)
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Printf("Ошибка каталога %s: %v (Статус: %d)\n", r.Request.URL, err, r.StatusCode)
	})

	// --- 1. ПАРСИНГ КАТАЛОГА ---
	c.OnHTML("a.js-notice-block__title", func(e *colly.HTMLElement) {
		fullURL := e.Request.AbsoluteURL(e.Attr("href"))

		s.mu.Lock()
		s.ItemsFound++
		s.mu.Unlock()

		if err := detailCollector.Visit(fullURL); err == nil {
			log.Println("---Нашли товар:", fullURL)
		}
	})

	// --- 2. ПАГИНАЦИЯ ---
	c.OnHTML(".module-pagination a", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		if strings.Contains(link, "PAGEN") {
			nextPage := e.Request.AbsoluteURL(link)
			if err := c.Visit(nextPage); err == nil {
				log.Println("Переходим на страницу:", nextPage)
			}
		}
	})

	// --- 3. ПАРСИНГ КАРТОЧКИ ТОВАРА ---
	detailCollector.OnHTML("body", func(e *colly.HTMLElement) {
		title := strings.TrimSpace(e.ChildText("h1"))
		if title == "" {
			return // Пропуск пустых страниц или заглушек капчи
		}

		var currentSpec models.Spec
		parsedProps := make(map[string]bool)

		e.ForEach(".props_list tr", func(_ int, el *colly.HTMLElement) {
			propName := strings.TrimSpace(el.ChildText(".char_name"))
			propValue := strings.TrimSpace(el.ChildText(".char_value"))

			if propName == "" || parsedProps[propName] {
				return
			}
			parsedProps[propName] = true

			// Вызов вынесенной логики заполнения структуры
			parseSpecProperty(propName, propValue, &currentSpec)
		})

		s.saveToDB("Unknown", title, currentSpec)
	})

	log.Println("Запускаем парсер...")
	c.Visit(startURL)

	// --- ВЫВОД СТАТИСТИКИ ПОСЛЕ ЗАВЕРШЕНИЯ ---
	log.Println("==================================================")
	log.Println("СТАТИСТИКА ПАРСИНГА:")
	log.Printf("Найдено ссылок на товары: %d\n", s.ItemsFound)
	log.Printf("Добавлено новых мотоциклов: %d\n", s.ItemsCreated)
	log.Printf("Обновлено существующих: %d\n", s.ItemsUpdated)
	log.Println("==================================================")
}

// parseSpecProperty сопоставляет название характеристики с полем структуры и очищает значение.
func parseSpecProperty(propName, propValue string, spec *models.Spec) {
	switch {
	case strings.Contains(propName, "Кубатура"):
		spec.Displacement = extractNumber(propValue)
	case strings.Contains(propName, "Тип"):
		spec.Type = propValue
	case strings.Contains(propName, "Мощность"):
		spec.Power = float64(extractNumber(propValue))
	case strings.Contains(propName, "Двигатель"):
		spec.Engine = propValue
	case strings.Contains(propName, "Охлаждение"):
		spec.Cooling = propValue
	case strings.Contains(propName, "Система подачи топлива"):
		spec.FuelSystem = propValue
	case strings.Contains(propName, "Емкость бака"):
		spec.TankCapacity = extractNumber(propValue)
	case strings.Contains(propName, "Передняя подвеска"):
		spec.FrontSusp = propValue
	case strings.Contains(propName, "Задняя подвеска"):
		spec.RearSusp = propValue
	case strings.Contains(propName, "Стартер"):
		spec.Starter = propValue
	case strings.Contains(propName, "Сцепление"):
		spec.Clutch = propValue
	case strings.Contains(propName, "Передний тормоз"):
		spec.FrontBrake = propValue
	case strings.Contains(propName, "Задний тормоз"):
		spec.RearBrake = propValue
	case strings.Contains(propName, "Колеса"):
		spec.Wheels = propValue
	case strings.Contains(propName, "Длина*Ширина"):
		spec.Dimensions = propValue
	case strings.Contains(propName, "База"):
		spec.Wheelbase = extractNumber(propValue)
	case strings.Contains(propName, "Высота по седлу"):
		spec.SeatHeight = extractNumber(propValue)
	case strings.Contains(propName, "Вес"):
		spec.Weight = extractNumber(propValue)
	case strings.Contains(propName, "Клиренс"):
		spec.Clearance = extractNumber(propValue)
	case strings.Contains(propName, "ПТС"):
		spec.HasPTS = strings.ToUpper(propValue) == "ДА"
	}
}

// extractNumber удаляет все нецифровые символы из строки и возвращает целочисленное значение.
func extractNumber(input string) int {
	re := regexp.MustCompile(`[^\d]+`)
	cleanStr := re.ReplaceAllString(input, "")

	if cleanStr != "" {
		val, err := strconv.Atoi(cleanStr)
		if err == nil {
			return val
		}
	}
	return 0
}

// saveToDB реализует логику сохранения (upsert) связки Бренд -> Мотоцикл -> Спецификация.
func (s *Scraper) saveToDB(brandName, modelName string, specs models.Spec) {
	if modelName == "" {
		return
	}

	var brand models.Brand
	s.DB.FirstOrCreate(&brand, models.Brand{Name: brandName})

	var moto models.Motorcycle
	s.DB.FirstOrCreate(&moto, models.Motorcycle{
		BrandID:   brand.ID,
		ModelName: modelName,
		Category:  "Enduro",
	})

	specs.MotorcycleID = moto.ID

	var existingSpec models.Spec
	result := s.DB.Where("motorcycle_id = ?", moto.ID).Find(&existingSpec)

	// Блокируем мьютекс только на момент изменения счетчиков и записи в БД
	s.mu.Lock()
	defer s.mu.Unlock()

	if result.RowsAffected > 0 {
		specs.ID = existingSpec.ID
		s.DB.Save(&specs)
		s.ItemsUpdated++
	} else {
		s.DB.Create(&specs)
		s.ItemsCreated++
	}

	log.Printf("Сохранено: %s (Кубатура: %d, База: %d, Мощность: %.1f)\n",
		modelName, specs.Displacement, specs.Wheelbase, specs.Power)
}
