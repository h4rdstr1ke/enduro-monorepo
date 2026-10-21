"use client";

import { Layout, Typography, Input, Button, Flex, Badge } from "antd";
import { UserOutlined, SwapOutlined } from "@ant-design/icons";
import Link from "next/link"; 
import { useCompare } from "@/features/compare";

const { Header: AntHeader } = Layout;
const { Title } = Typography;
const { Search } = Input;

export const Header = () => {
  const { items } = useCompare();

  return (
    <AntHeader 
      style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Flex 
        justify="space-between" 
        align="center" 
        style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}
      >
        {/* Логотип с ссылкой на главную */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0, color: 'var(--enduro-color-primary)' }}>
            EnduroHelper
          </Title>
        </Link>

        {/* Центральный поиск */}
        <div style={{ flex: '0 1 400px', margin: '0 24px' }}>
          <Search 
            placeholder="Поиск по модели, бренду..." 
            size="large" 
            allowClear 
          />
        </div>

        {/* Кнопка сравнения и входа */}
        <Flex align="center" gap="middle">
          <Link href="/compare">
            <Badge count={items.length} size="small" offset={[-2, 2]}>
              <Button size="large" icon={<SwapOutlined />}>
                Сравнение
              </Button>
            </Badge>
          </Link>

          <Button size="large" icon={<UserOutlined />}>
            Войти
          </Button>
        </Flex>
      </Flex>
    </AntHeader>
  );
};