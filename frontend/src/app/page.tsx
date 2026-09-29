"use client";

import { Button, Flex, Typography } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { EncyclopediaGrid } from "@/widgets/encyclopedia-grid";

export default function Home() {
  return (
    <main style={{padding: '0 24px' }}>
      <EncyclopediaGrid />
    </main>
  );
}