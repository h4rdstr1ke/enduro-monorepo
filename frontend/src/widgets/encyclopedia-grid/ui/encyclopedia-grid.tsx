"use client";

import { Breadcrumb, Flex, Typography, Select, Row, Col } from "antd";
import { MotorcycleCard } from "@/entities/motorcycle-card";

const { Text } = Typography;

// Моковые данные для проверки верстки
const MOCK_DATA = [
  { id: 1, title: "Kayo K1 250 MX", image: "https://placehold.co/400x300?text=Kayo+K1", engineCapacity: "250 куб.см", power: "21 л.с.", rating: 4.5, reviewsCount: 23 },
  { id: 2, title: "BSE Z5 300", image: "https://placehold.co/400x300?text=BSE+Z5", engineCapacity: "300 куб.см", power: "27 л.с.", rating: 4.5, reviewsCount: 23 },
  { id: 3, title: "GR7 F250A", image: "https://placehold.co/400x300?text=GR7", engineCapacity: "250 куб.см", power: "21 л.с.", rating: 4.5, reviewsCount: 23 },
  { id: 4, title: "ZUUMAV FX 250", image: "https://placehold.co/400x300?text=ZUUMAV", engineCapacity: "250 куб.см", power: "21 л.с.", rating: 4.5, reviewsCount: 23 },
  { id: 5, title: "Avantis Enduro 250", image: "https://placehold.co/400x300?text=Avantis", engineCapacity: "250 куб.см", power: "21 л.с.", rating: 4.5, reviewsCount: 23 },
  { id: 6, title: "Kayo T2 MX 250", image: "https://placehold.co/400x300?text=Kayo+T2", engineCapacity: "250 куб.см", power: "20 л.с.", rating: 4.5, reviewsCount: 23 },
];

export const EncyclopediaGrid = () => {
  return (
    <Flex vertical gap="large" style={{ padding: '24px 0', maxWidth: 1200, margin: '0 auto' }}>
      <Breadcrumb
        items={[
          { title: 'Главная' },
          { title: 'Энциклопедия' },
        ]}
      />

      <Flex justify="space-between" align="center">
        <Text strong style={{ fontSize: 16 }}>Найдено: 847 моделей</Text>
        <Select
          defaultValue="popular"
          style={{ width: 180 }}
          options={[
            { value: 'popular', label: 'По популярности' },
            { value: 'price_asc', label: 'Сначала дешевые' },
            { value: 'price_desc', label: 'Сначала дорогие' },
          ]}
        />
      </Flex>

      <Row gutter={[24, 24]}>
        {MOCK_DATA.map((bike) => (
          <Col xs={24} sm={12} md={8} key={bike.id}>
            <MotorcycleCard {...bike} />
          </Col>
        ))}
      </Row>
    </Flex>
  );
};