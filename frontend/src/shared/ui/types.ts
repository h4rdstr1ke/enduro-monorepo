export interface Motorcycle {
  ID: number;
  ModelName: string;
  Image: string;
  Status: string;
  Category: string;
  Brand: {
    Name: string;
  };
  PriceAnalytics?: {
    Average: number;
    Min: number;
    Max: number;
  };
}