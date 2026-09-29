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
              cssVar: { key: 'enduro' }, 
              hashed: false,             
              token: {
                colorPrimary: "#fa8c16",
                colorLink: "#fa8c16",
                colorLinkHover: "#d46b08",
                borderRadius: 6,
              },
              components: {
                Card: {
                  paddingMD: 20,
                },
                Tag: {
                  defaultColor: "#fa8c16",
                  defaultBg: "#fff7e6",
                }
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