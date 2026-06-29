import React, { useState, useEffect } from 'react';
import { Brand, Model, SparePart } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PartFormProps {
  brands: Brand[];
  models: Model[];
  initialData?: SparePart;
  onSubmit: (part: Omit<SparePart, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const PartForm = ({ brands, models, initialData, onSubmit, onCancel }: PartFormProps) => {
  const [formData, setFormData] = useState({
    partName: initialData?.partName || '',
    brandId: initialData?.brandId || '',
    modelIds: initialData?.modelIds || [] as string[],
    productionYears: initialData?.productionYears || [] as string[],
    serialNumber: initialData?.serialNumber || '',
    price: initialData?.price || 0,
    merchantName: initialData?.merchantName || '',
    merchantPhone: initialData?.merchantPhone || '',
    notes: initialData?.notes || ''
  });

  const filteredModels = models.filter(m => m.brandId === formData.brandId);
  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

  const handleToggleModel = (modelId: string) => {
    setFormData(prev => ({
      ...prev,
      modelIds: prev.modelIds.includes(modelId)
        ? prev.modelIds.filter(id => id !== modelId)
        : [...prev.modelIds, modelId]
    }));
  };

  const handleToggleYear = (year: string) => {
    setFormData(prev => ({
      ...prev,
      productionYears: prev.productionYears.includes(year)
        ? prev.productionYears.filter(y => y !== year)
        : [...prev.productionYears, year]
    }));
  };

  return (
    <form className="space-y-6" onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>اسم القطعة</Label>
          <Input 
            required 
            value={formData.partName} 
            onChange={e => setFormData({...formData, partName: e.target.value})} 
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>الماركة</Label>
          <Select 
            value={formData.brandId} 
            onValueChange={val => setFormData({...formData, brandId: val, modelIds: []})}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="اختر الماركة" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>الموديلات</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.modelIds.map(id => {
            const model = models.find(m => m.id === id);
            return (
              <Badge key={id} variant="secondary" className="gap-1 rounded-lg">
                {model?.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleToggleModel(id)} />
              </Badge>
            );
          })}
        </div>
        <Select onValueChange={handleToggleModel}>
          <SelectTrigger disabled={!formData.brandId} className="rounded-xl">
            <SelectValue placeholder={formData.brandId ? "اختر الموديلات" : "اختر الماركة أولاً"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {filteredModels.map(m => (
              <SelectItem key={m.id} value={m.id} disabled={formData.modelIds.includes(m.id)}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>سنوات الصنع</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.productionYears.map(year => (
            <Badge key={year} variant="outline" className="gap-1 rounded-lg">
              {year}
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleToggleYear(year)} />
            </Badge>
          ))}
        </div>
        <Select onValueChange={handleToggleYear}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="اختر السنوات" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {years.map(y => (
              <SelectItem key={y} value={y} disabled={formData.productionYears.includes(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>الرقم التسلسلي</Label>
          <Input 
            value={formData.serialNumber} 
            onChange={e => setFormData({...formData, serialNumber: e.target.value})} 
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>السعر (ر.س)</Label>
          <Input 
            type="number" 
            required 
            value={formData.price} 
            onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>اسم المورد</Label>
          <Input 
            value={formData.merchantName} 
            onChange={e => setFormData({...formData, merchantName: e.target.value})} 
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>هاتف المورد</Label>
          <Input 
            value={formData.merchantPhone} 
            onChange={e => setFormData({...formData, merchantPhone: e.target.value})} 
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>ملاحظات</Label>
          <Textarea 
            value={formData.notes} 
            onChange={e => setFormData({...formData, notes: e.target.value})} 
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">إلغاء</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl">حفظ القطعة</Button>
      </div>
    </form>
  );
};

export default PartForm;