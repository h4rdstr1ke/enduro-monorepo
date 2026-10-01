"use client"
import { Row, Col, Typography, Button, Flex, Tag } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface MotorcycleOverviewProps {
  title: string;
  image: string;
  price: string;
  status: string;
}

export const MotorcycleOverview = ({ title, image, price, status }: MotorcycleOverviewProps) => {
  return (
    <Row gutter={[32, 32]} style={{ marginBottom: 40 }}>
      {/* Левая колонка: Изображение */}
      <Col xs={24} md={14}>
        <div style={{ 
          backgroundColor: 'var(--enduro-color-bg-layout)', 
          borderRadius: 'var(--enduro-border-radius)', 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: 400
        }}>
          <img 
            src={image.startsWith('/') ? `http://localhost:8080${image}` : image} 
            alt={title} 
            style={{ width: '100%', height: '100%', maxHeight: 500, objectFit: 'contain', padding: 24 }} 
          />
        </div>
      </Col>

      {/* Правая колонка: Информация и покупка */}
      <Col xs={24} md={10}>
        <Flex vertical gap="large">
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>{title}</Title>
            <Tag color="green" variant="solid">{status}</Tag>
          </div>

          <Title level={1} style={{ margin: 0, color: 'var(--enduro-color-primary)' }}>
            {price}
          </Title>

          <Text type="secondary" style={{ fontSize: 16 }}>
            Отличный выбор для начинающих райдеров. Подходит для поездок по пересеченной местности и лесных троп.
          </Text>

          <Flex gap="middle" style={{ marginTop: 16 }}>
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />} style={{ flex: 1 }}>
              Где купить
            </Button>
            <Button size="large" icon={<HeartOutlined />} />
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
};