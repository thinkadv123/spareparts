import { useState, useEffect } from 'react';
import { InventoryData, Brand, Model, SparePart } from '../types/inventory';

const STORAGE_KEY = 'al_makhzan_inventory_data';

const initialData: InventoryData = {
  brands: [
    { id: '1', name: 'تويوتا' },
    { id: '2', name: 'هيونداي' },
    { id: '3', name: 'مرسيدس' }
  ],
  models: [
    { id: '1', brandId: '1', name: 'كامري' },
    { id: '2', brandId: '1', name: 'كورولا' },
    { id: '3', brandId: '2', name: 'إلنترا' },
    { id: '4', brandId: '2', name: 'أكسنت' },
    { id: '5', brandId: '3', name: 'S-Class' }
  ],
  parts: []
};

export function useInventory() {
  const [data, setData] = useState<InventoryData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addBrand = (name: string) => {
    const newBrand: Brand = { id: crypto.randomUUID(), name };
    setData(prev => ({ ...prev, brands: [...prev.brands, newBrand] }));
  };

  const updateBrand = (id: string, name: string) => {
    setData(prev => ({
      ...prev,
      brands: prev.brands.map(b => b.id === id ? { ...b, name } : b)
    }));
  };

  const deleteBrand = (id: string) => {
    setData(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b.id !== id),
      models: prev.models.filter(m => m.brandId !== id),
      parts: prev.parts.filter(p => p.brandId !== id)
    }));
  };

  const addModel = (brandId: string, name: string) => {
    const newModel: Model = { id: crypto.randomUUID(), brandId, name };
    setData(prev => ({ ...prev, models: [...prev.models, newModel] }));
  };

  const updateModel = (id: string, name: string) => {
    setData(prev => ({
      ...prev,
      models: prev.models.map(m => m.id === id ? { ...m, name } : m)
    }));
  };

  const deleteModel = (id: string) => {
    setData(prev => ({
      ...prev,
      models: prev.models.filter(m => m.id !== id),
      parts: prev.parts.map(p => ({
        ...p,
        modelIds: p.modelIds.filter(mid => mid !== id)
      }))
    }));
  };

  const addPart = (part: Omit<SparePart, 'id' | 'createdAt'>) => {
    const newPart: SparePart = {
      ...part,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, parts: [newPart, ...prev.parts] }));
  };

  const updatePart = (id: string, part: Partial<SparePart>) => {
    setData(prev => ({
      ...prev,
      parts: prev.parts.map(p => p.id === id ? { ...p, ...part } : p)
    }));
  };

  const deletePart = (id: string) => {
    setData(prev => ({
      ...prev,
      parts: prev.parts.filter(p => p.id !== id)
    }));
  };

  return {
    ...data,
    addBrand,
    updateBrand,
    deleteBrand,
    addModel,
    updateModel,
    deleteModel,
    addPart,
    updatePart,
    deletePart
  };
}