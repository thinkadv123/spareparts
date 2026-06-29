import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useInventory } from '@/hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2, Car } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Brands = () => {
  const { brands, models, addBrand, updateBrand, deleteBrand, addModel, updateModel, deleteModel } = useInventory();
  
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    addBrand(newBrandName);
    setNewBrandName('');
    showSuccess('تمت إضافة الماركة بنجاح');
  };

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim() || !selectedBrandId) return;
    addModel(selectedBrandId, newModelName);
    setNewModelName('');
    showSuccess('تمت إضافة الموديل بنجاح');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">الماركات والموديلات</h1>
          <p className="text-slate-500">إدارة ماركات السيارات والموديلات التابعة لها.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Brands Management */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">إضافة ماركة جديدة</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBrand} className="flex gap-2">
                  <Input 
                    placeholder="اسم الماركة (مثلاً: تويوتا)" 
                    value={newBrandName}
                    onChange={e => setNewBrandName(e.target.value)}
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">إضافة</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">قائمة الماركات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium">{brand.name}</span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف الماركة؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيؤدي حذف الماركة إلى حذف جميع الموديلات وقطع الغيار المرتبطة بها.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                deleteBrand(brand.id);
                                showSuccess('تم حذف الماركة بنجاح');
                              }}
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Models Management */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">إضافة موديل جديد</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddModel} className="space-y-4">
                  <div className="space-y-2">
                    <Label>اختر الماركة</Label>
                    <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الماركة" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الموديل</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="اسم الموديل (مثلاً: كامري)" 
                        value={newModelName}
                        onChange={e => setNewModelName(e.target.value)}
                      />
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">إضافة</Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">قائمة الموديلات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brands.map(brand => {
                    const brandModels = models.filter(m => m.brandId === brand.id);
                    if (brandModels.length === 0) return null;
                    return (
                      <div key={brand.id} className="space-y-2">
                        <h3 className="font-bold text-slate-900 border-b pb-1">{brand.name}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {brandModels.map(model => (
                            <div key={model.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50 text-sm">
                              <span>{model.name}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-red-600"
                                onClick={() => {
                                  deleteModel(model.id);
                                  showSuccess('تم حذف الموديل بنجاح');
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Brands;