import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useInventory } from '@/hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2, Car, Tag } from 'lucide-react';
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
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">الماركات <span className="text-emerald-500">والموديلات</span></h1>
          <p className="text-slate-500 font-medium mt-1">إدارة ماركات السيارات والموديلات التابعة لها في النظام.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Brands Management */}
          <div className="space-y-6">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-2xl">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900">إضافة ماركة جديدة</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleAddBrand} className="flex gap-3">
                  <Input 
                    placeholder="اسم الماركة (مثلاً: تويوتا)" 
                    value={newBrandName}
                    onChange={e => setNewBrandName(e.target.value)}
                    className="h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-2xl font-bold shadow-lg shadow-blue-200">إضافة</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-slate-900">قائمة الماركات</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="grid grid-cols-1 gap-3">
                  {brands.map(brand => (
                    <div key={brand.id} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                          <Tag className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-700">{brand.name}</span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl" className="rounded-[2rem] border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-black">حذف الماركة؟</AlertDialogTitle>
                            <AlertDialogDescription className="font-medium">
                              سيؤدي حذف الماركة إلى حذف جميع الموديلات وقطع الغيار المرتبطة بها نهائياً.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3 mt-4">
                            <AlertDialogCancel className="rounded-xl font-bold">إلغاء</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700 rounded-xl font-bold"
                              onClick={() => {
                                deleteBrand(brand.id);
                                showSuccess('تم حذف الماركة بنجاح');
                              }}
                            >
                              حذف نهائي
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
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-2xl">
                    <Plus className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900">إضافة موديل جديد</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleAddModel} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">اختر الماركة</Label>
                    <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                      <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium">
                        <SelectValue placeholder="اختر الماركة" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">اسم الموديل</Label>
                    <div className="flex gap-3">
                      <Input 
                        placeholder="اسم الموديل (مثلاً: كامري)" 
                        value={newModelName}
                        onChange={e => setNewModelName(e.target.value)}
                        className="h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                      />
                      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-2xl font-bold shadow-lg shadow-emerald-200">إضافة</Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-slate-900 text-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black">قائمة الموديلات</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-8">
                  {brands.map(brand => {
                    const brandModels = models.filter(m => m.brandId === brand.id);
                    if (brandModels.length === 0) return null;
                    return (
                      <div key={brand.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                          <h3 className="font-black text-lg">{brand.name}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {brandModels.map(model => (
                            <div key={model.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                              <span className="font-bold text-sm">{model.name}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => {
                                  deleteModel(model.id);
                                  showSuccess('تم حذف الموديل بنجاح');
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {models.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-slate-500 font-bold">لا توجد موديلات مسجلة حالياً</p>
                    </div>
                  )}
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