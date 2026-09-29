import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd"; 
import { Header } from "@/widgets/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enduro helper",
  description: "Помощник в мире эндуро",
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
                },
              },
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1, backgroundColor: '#fafafa' }}>
                {children}
              </main>
            </div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}