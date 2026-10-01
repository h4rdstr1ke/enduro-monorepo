"use client";

import { Card, Col, Row, Typography, Tag, Flex } from "antd";
import Link from "next/link";
import type { Motorcycle } from "@/shared/ui/types"; 

const { Title, Text } = Typography;

interface EncyclopediaGridProps {
  motorcycles: Motorcycle[];
}

export const EncyclopediaGrid = ({ motorcycles }: EncyclopediaGridProps) => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Каталог эндуро</Title>
      
      <Row gutter={[24, 24]}>
        {motorcycles.map((moto) => (
          <Col xs={24} sm={12} md={8} lg={6} key={moto.id}>
            <Link href={`/motorcycle/${moto.id}`} style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 220, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {moto.image ? (
                      <img 
                        src={`http://localhost:8080${moto.image}`} 
                        alt={moto.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} 
                      />
                    ) : (
                      <Text type="secondary">Нет фото</Text>
                    )}
                  </div>
                }
                styles={{ body: { padding: 16 } }}
              >
                <Tag color="orange" style={{ marginBottom: 8 }}>
                  {moto.brand.name}
                </Tag>
                
                <Title level={5} style={{ marginTop: 0, marginBottom: 16 }} ellipsis>
                  {moto.title}
                </Title>

                <Flex justify="space-between" align="center">
                  <Text type="secondary" style={{ fontSize: 12 }}>Средняя цена:</Text>
                  <Text strong style={{ color: 'var(--enduro-color-primary)' }}>
                    {moto.price?.average ? `${moto.price.average.toLocaleString('ru-RU')} ₽` : "Нет данных"}
                  </Text>
                </Flex>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};