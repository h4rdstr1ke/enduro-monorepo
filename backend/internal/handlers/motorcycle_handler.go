package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

type MotorcycleHandler struct {
	DB *gorm.DB
}

func NewMotorcycleHandler(db *gorm.DB) *MotorcycleHandler {
	return &MotorcycleHandler{DB: db}
}

// GetMotorcycles возвращает список мотоциклов
func (h *MotorcycleHandler) GetMotorcycles(c *gin.Context) {
	var motorcycles []models.Motorcycle

	result := h.DB.Preload("Brand").Preload("PriceAnalytics").Find(&motorcycles)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, motorcycles)
}

// GetMotorcycleByID возвращает детальную информацию по одному мотоциклу
func (h *MotorcycleHandler) GetMotorcycleByID(c *gin.Context) {
	id := c.Param("id")
	var motorcycle models.Motorcycle

	result := h.DB.Preload("Brand").Preload("Spec").Preload("PriceAnalytics").First(&motorcycle, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Мотоцикл не найден"})
		return
	}
	c.JSON(http.StatusOK, motorcycle)
}
