"use client";

import { Button, Flex, Typography } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Home() {
  return (
    <Flex vertical align="center" justify="center" style={{ minHeight: '100vh', padding: 20 }}>
      <Title level={2}>Эндуро Каталог</Title>
      <Button type="primary" size="large" icon={<RocketOutlined />}>
        Ant Design успешно подключен!
      </Button>
    </Flex>
  );
}