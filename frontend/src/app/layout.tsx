import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enduro Catalog",
  description: "Каталог эндуро мотоциклов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#fa8c16", 
                borderRadius: 6,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}