package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

type BrandHandler struct {
	DB *gorm.DB
}

func NewBrandHandler(db *gorm.DB) *BrandHandler {
	return &BrandHandler{DB: db}
}

// GetBrands возвращает список всех брендов
func (h *BrandHandler) GetBrands(c *gin.Context) {
	var brands []models.Brand

	// Сортируем бренды по алфавиту для удобства на фронтенде
	result := h.DB.Order("name asc").Find(&brands)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, brands)
}

// GetBrandByID возвращает бренд по ID (включая его мотоциклы)
func (h *BrandHandler) GetBrandByID(c *gin.Context) {
	id := c.Param("id")
	var brand models.Brand

	result := h.DB.Preload("Motorcycles").First(&brand, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Бренд не найден"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, brand)
}
