export interface Brand {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
}

export interface SparePart {
  id: string;
  partName: string;
  brandId: string;
  modelIds: string[];
  productionYears: string[];
  serialNumber: string;
  price: number;
  merchantName: string;
  merchantPhone: string;
  notes: string;
  createdAt: string;
}

export interface InventoryData {
  brands: Brand[];
  models: Model[];
  parts: SparePart[];
}