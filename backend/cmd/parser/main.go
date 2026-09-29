// Package main является точкой входа для приложения-парсера.
package main

import (
	"log"

	"github.com/h4rdstr1ke/enduro-backend/internal/database"
	"github.com/h4rdstr1ke/enduro-backend/internal/scraper"
)

func main() {
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Критическая ошибка базы данных: %v", err)
	}

	parser := scraper.NewScraper(db)

	// URL стартовой страницы каталога для сбора данных
	targetURL := "https://www.rollingmoto.ru/catalog/mototekhnika/mototsikly/vnedorozhnye-mototsikly/"
	parser.Run(targetURL)
}
