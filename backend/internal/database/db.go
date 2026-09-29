// Package database предоставляет функции для подключения к БД и управления миграциями.
package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

func Connect() (*gorm.DB, error) {
	if err := godotenv.Load(); err != nil {
		log.Println("Предупреждение: файл .env не найден, используются системные переменные")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к БД: %w", err)
	}

	if err := db.AutoMigrate(&models.Brand{}, &models.Motorcycle{}, &models.Spec{}, &models.PriceAnalytics{}); err != nil {
		return nil, fmt.Errorf("ошибка автомиграции: %w", err)
	}

	return db, nil
}
