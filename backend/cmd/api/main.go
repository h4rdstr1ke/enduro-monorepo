package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/database"
	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

func main() {
	// Подключаемся к нашей БД
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}

	// Инициализируем роутер Gin
	r := gin.Default()

	// Разрешаем CORS для локальной разработки фронтенда
	r.Use(cors.Default())

	// Группируем роуты
	v1 := r.Group("/api/v1")
	{
		// 1. Эндпоинт для главной страницы (список)
		v1.GET("/motorcycles", func(c *gin.Context) {
			var motorcycles []models.Motorcycle

			result := db.Preload("Brand").Preload("PriceAnalytics").Find(&motorcycles)

			if result.Error != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
				return
			}
			c.JSON(http.StatusOK, motorcycles)
		})

		// 2. Эндпоинт для страницы конкретного мотоцикла
		v1.GET("/motorcycles/:id", func(c *gin.Context) {
			id := c.Param("id")
			var motorcycle models.Motorcycle

			// Для детальной страницы подтягиваем еще и технические характеристики (Spec)
			result := db.Preload("Brand").Preload("Spec").Preload("PriceAnalytics").First(&motorcycle, id)

			if result.Error != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Мотоцикл не найден"})
				return
			}
			c.JSON(http.StatusOK, motorcycle)
		})
	}

	log.Println("API сервер запущен на http://localhost:8080")

	// Запускаем сервер на порту 8080
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
