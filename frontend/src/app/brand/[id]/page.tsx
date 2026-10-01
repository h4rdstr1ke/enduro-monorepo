import { Row, Col, Divider, Breadcrumb } from "antd";
import { EncyclopediaGrid } from "@/widgets/encyclopedia-grid";
import type { Brand } from "@/shared/ui/types";
import Link from "next/link";

export default async function BrandPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const res = await fetch(process.env.API_URL + `/brands/${resolvedParams.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Бренд не найден</h2>
      </main>
    );
  }

  const brand: Brand = await res.json();

  return (
    <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Breadcrumb
        items={[
          { title: <Link href="/">Главная</Link> },
          { title: 'Бренды' },
          { title: brand.name }
        ]}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[32, 32]}>
        <Col xs={24} md={16}>
          <h1 style={{ fontSize: 32, marginBottom: 8, marginTop: 0 }}>{brand.name}</h1>
          <p style={{ fontSize: 16, color: '#888', marginBottom: 24 }}>
            {brand.country || "Страна не указана"}
          </p>

          {brand.description ? (
            <div dangerouslySetInnerHTML={{ __html: brand.description }} style={{ fontSize: 16, lineHeight: '1.6' }} />
          ) : (
            <p style={{ fontSize: 16, color: '#888' }}>
              История этого бренда пока не добавлена в нашу энциклопедию.
            </p>
          )}
        </Col>
        
        <Col xs={24} md={8}>
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={`Логотип ${brand.name}`} style={{ width: '100%', maxWidth: 300, objectFit: 'contain' }} />
          ) : (
            <div style={{ width: '100%', height: 200, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
              <span style={{ color: '#aaa', fontSize: 24 }}>Логотип</span>
            </div>
          )}
        </Col>
      </Row>

      <Divider style={{ margin: '40px 0' }} />

      <h2 style={{ fontSize: 24, marginBottom: 24 }}>Модельный ряд {brand.name}</h2>
      
      {brand.motorcycles && brand.motorcycles.length > 0 ? (
        <EncyclopediaGrid motorcycles={brand.motorcycles} />
      ) : (
        <p>В базе пока нет мотоциклов этого бренда.</p>
      )}
    </main>
  );
}
