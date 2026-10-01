// Package models содержит структуры данных, отображаемые на таблицы базы данных (GORM).
package models

import (
	"time"

	"gorm.io/gorm"
)

// BaseModel заменяет gorm.Model для контроля JSON-тегов
type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Brand представляет производителя мотоциклов (например, KTM, Kayo).
type Brand struct {
	BaseModel
	Name        string       `gorm:"uniqueIndex;not null" json:"name"`
	Country     string       `json:"country"`
	Description string       `gorm:"type:text" json:"description"` // История бренда (Энциклопедия)
	LogoURL     string       `json:"logoUrl"`                      // Ссылка на логотип
	Motorcycles []Motorcycle `json:"motorcycles,omitempty"`
}

// Motorcycle содержит базовую информацию о конкретной модели мотоцикла.
type Motorcycle struct {
	BaseModel
	BrandID   uint   `gorm:"index;not null" json:"brandId"`
	Brand     Brand  `json:"brand"`
	ModelName string `gorm:"not null" json:"title"`
	Image     string `json:"image"`
	Status    string `json:"status"`
	Category  string `json:"category"`

	Spec           Spec           `json:"specs"`
	PriceAnalytics PriceAnalytics `gorm:"foreignKey:MotorcycleID" json:"price"`
}

// PriceAnalytics содержит агрегированные данные о стоимости
type PriceAnalytics struct {
	BaseModel
	MotorcycleID  uint      `gorm:"uniqueIndex;not null" json:"motorcycleId"`
	Average       float64   `json:"average"`
	Min           float64   `json:"min"`
	Max           float64   `json:"max"`
	MinSourceName string    `json:"minSourceName"`
	MinSourceUrl  string    `json:"minSourceUrl"`
	MaxSourceName string    `json:"maxSourceName"`
	Currency      string    `json:"currency"`
	ParsedAt      time.Time `json:"parsedAt"`
}

// Spec содержит подробные технические характеристики мотоцикла.
// Типы данных (int, float64) оставлены для удобства поиска и фильтрации в БД.
type Spec struct {
	BaseModel
	MotorcycleID uint `gorm:"uniqueIndex;not null" json:"motorcycleId"`

	Displacement int     `json:"capacity"`
	Type         string  `json:"type"`
	Power        float64 `json:"power"`
	Weight       int     `json:"weight"`
	HasPTS       bool    `json:"pts"`

	Engine       string `json:"engine"`
	Cooling      string `json:"cooling"`
	FuelSystem   string `json:"fuelSupply"`
	TankCapacity int    `json:"fuelTank"`
	Starter      string `json:"starter"`
	Clutch       string `json:"clutch"`

	FrontSusp  string `json:"frontSuspension"`
	RearSusp   string `json:"rearSuspension"`
	FrontBrake string `json:"frontBrakes"`
	RearBrake  string `json:"rearBrakes"`
	Wheels     string `json:"wheels"`

	Dimensions string `json:"dimensions"`
	Wheelbase  int    `json:"wheelbase"`
	SeatHeight int    `json:"seatHeight"`
	Clearance  int    `json:"clearance"`
}
