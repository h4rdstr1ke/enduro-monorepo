import { EncyclopediaGrid } from "@/widgets/encyclopedia-grid";
import { CatalogSidebar } from "@/widgets/catalog-sidebar";
import { Row, Col } from "antd";
import type { Motorcycle, Brand } from "@/shared/ui/types"; 

interface SearchParams {
  brands?: string;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.brands ? `?brands=${resolvedSearchParams.brands}` : "";
  
  // Параллельно загружаем бренды и мотоциклы
  const [motoRes, brandRes] = await Promise.all([
    fetch(process.env.API_URL + `/motorcycles${query}`, { cache: "no-store" }),
    fetch(process.env.API_URL + "/brands", { cache: "no-store" })
  ]);
  
  if (!motoRes.ok || !brandRes.ok) {
    return (
      <main style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Ошибка загрузки каталога</h2>
      </main>
    );
  }

  const motorcycles: Motorcycle[] = await motoRes.json();
  const brands: Brand[] = await brandRes.json();

  return (
    <main style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={6} lg={5}>
          <CatalogSidebar brands={brands} />
        </Col>
        <Col xs={24} md={18} lg={19}>
          <EncyclopediaGrid motorcycles={motorcycles} />
        </Col>
      </Row>
    </main>
  );
}