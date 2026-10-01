package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/database"
	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

type AvitoBrand struct {
	Name  string `json:"name"`
	Value string `json:"value"` // Avito internal ID
}

type AvitoResponse struct {
	Values []AvitoBrand `json:"values"`
}

func main() {
	// 1. Открываем файл
	file, err := os.Open("../avito_brands.json")
	if err != nil {
		log.Fatalf("Ошибка открытия файла JSON: %v", err)
	}
	defer file.Close()

	// 2. Читаем и парсим
	bytes, err := io.ReadAll(file)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	var data AvitoResponse
	if err := json.Unmarshal(bytes, &data); err != nil {
		log.Fatalf("Ошибка парсинга JSON: %v", err)
	}

	// 3. Подключаемся к БД
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}

	// 4. Заливаем бренды
	var created, skipped int
	for _, item := range data.Values {
		cleanName := strings.TrimSpace(item.Name)
		if cleanName == "" {
			continue
		}

		var brand models.Brand
		// FirstOrCreate пытается найти бренд, если нет — создает.
		result := db.Where("name ILIKE ?", cleanName).FirstOrCreate(&brand, models.Brand{
			Name: cleanName,
		})

		if result.RowsAffected > 0 {
			created++
		} else {
			skipped++
		}
	}

	fmt.Printf("=========================================\n")
	fmt.Printf("✅ Заливка эталонной базы брендов завершена\n")
	fmt.Printf("Всего брендов в JSON: %d\n", len(data.Values))
	fmt.Printf("Новых добавлено: %d\n", created)
	fmt.Printf("Пропущено (уже есть): %d\n", skipped)
	fmt.Printf("=========================================\n")
}
