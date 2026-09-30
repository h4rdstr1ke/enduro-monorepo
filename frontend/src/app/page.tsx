import { EncyclopediaGrid } from "@/widgets/encyclopedia-grid";
import { Typography } from "antd";
import type { Motorcycle } from "@/shared/ui/types"; 

export default async function Home() {

  const res = await fetch("http://localhost:8080/api/v1/motorcycles", {
    cache: "no-store", 
  });
  
  if (!res.ok) {
    return (
      <main style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Ошибка загрузки каталога</h2>
      </main>
    );
  }

  const motorcycles: Motorcycle[] = await res.json();

  return (
    <main style={{ padding: '0 24px' }}>
      <EncyclopediaGrid motorcycles={motorcycles} />
    </main>
  );
}