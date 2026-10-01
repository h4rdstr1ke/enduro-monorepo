package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/database"
	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

// WikiResponse структура ответа от Wikipedia REST API
type WikiResponse struct {
	Type    string `json:"type"`
	Title   string `json:"title"`
	Extract string `json:"extract"`
}

func main() {
	// 1. Подключаемся к БД
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Ошибка БД: %v", err)
	}

	// 2. Ищем бренды без описания
	var brands []models.Brand
	db.Where("description = ? OR description IS NULL", "").Find(&brands)

	log.Printf("Найдено брендов без описания: %d", len(brands))

	for _, brand := range brands {
		log.Printf("Обработка бренда: %s", brand.Name)

		// ШАГ 1: Пробуем найти в Википедии
		desc, err := getFromWikipedia(brand.Name)
		if err == nil && desc != "" {
			log.Printf("✅ Найдено в Википедии: %s", brand.Name)
			db.Model(&brand).Update("description", desc)
			continue
		} else {
			log.Printf("ℹ️ Ошибка Википедии для %s: %v", brand.Name, err)
		}

		// ШАГ 2: Fallback на Умный Поиск (RAG)
		log.Printf("⚠️ В Википедии нет. Запуск умного поиска (LLM) для %s...", brand.Name)
		desc, err = getFromSmartSearch(brand.Name)
		if err == nil && desc != "" {
			log.Printf("🤖 Найдено через Умный поиск: %s", brand.Name)
			db.Model(&brand).Update("description", desc)
		} else {
			log.Printf("❌ Не удалось найти информацию для %s", brand.Name)
		}
	}
}

// getFromWikipedia делает запрос к REST API русской Википедии
func getFromWikipedia(brandName string) (string, error) {
	// Добавляем слово "мотоциклы", если это короткий бренд, чтобы избежать неоднозначности
	// Но пока попробуем точное совпадение
	apiURL := fmt.Sprintf("https://ru.wikipedia.org/api/rest_v1/page/summary/%s", url.PathEscape(brandName))
	
	req, _ := http.NewRequest("GET", apiURL, nil)
	req.Header.Set("User-Agent", "EnduroCatalogBot/1.0 (https://enduro-catalog.ru; admin@enduro-catalog.ru)")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("статус %d", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	var wikiResp WikiResponse
	if err := json.Unmarshal(body, &wikiResp); err != nil {
		return "", fmt.Errorf("ошибка парсинга: %v", err)
	}

	// Если это страница неоднозначности
	if wikiResp.Type == "disambiguation" {
		return "", fmt.Errorf("неоднозначность")
	}

	if wikiResp.Extract == "" {
		return "", fmt.Errorf("пустой extract, ответ: %s", string(body))
	}

	return wikiResp.Extract, nil
}

// getFromSmartSearch выполняет Умный поиск + LLM (требует API ключ OpenAI/Anthropic)
func getFromSmartSearch(brandName string) (string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("не задан OPENAI_API_KEY, пропускаем умный поиск")
	}

	// ЗДЕСЬ БУДЕТ ВАША ЛОГИКА:
	// 1. Сделать запрос в Google Custom Search API или DuckDuckGo: "История бренда мотоциклов {brandName}"
	// 2. Взять текст из 3 лучших ссылок.
	// 3. Отправить в OpenAI API промпт: "Сделай выжимку истории бренда на основе этого текста: ..."
	
	// Временно возвращаем заглушку, пока вы не добавите ключи
	return "", fmt.Errorf("умный поиск пока не реализован полностью")
}
