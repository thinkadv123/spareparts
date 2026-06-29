import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useInventory } from '@/hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Download, Edit2, Trash2, FileText, Table as TableIcon, Package, Hash, User, Phone, DollarSign } from 'lucide-react';
import PartForm from '@/components/inventory/PartForm';
import { showSuccess } from '@/utils/toast';
import * as XLSX from 'xlsx';

const Parts = () => {
  const { parts, brands, models, addPart, updatePart, deletePart } = useInventory();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<any>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredParts = parts.filter(part => {
    const matchesSearch = 
      part.partName.toLowerCase().includes(search.toLowerCase()) ||
      part.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      part.merchantName.toLowerCase().includes(search.toLowerCase()) ||
      part.merchantPhone.includes(search);
    
    const matchesBrand = filterBrand === 'all' || part.brandId === filterBrand;
    const matchesYear = filterYear === 'all' || part.productionYears.includes(filterYear);
    const matchesMinPrice = !minPrice || part.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || part.price <= Number(maxPrice);

    return matchesSearch && matchesBrand && matchesYear && matchesMinPrice && matchesMaxPrice;
  });

  const handleExportExcel = () => {
    const exportData = filteredParts.map(p => ({
      'اسم القطعة': p.partName,
      'الماركة': brands.find(b => b.id === p.brandId)?.name,
      'الموديلات': p.modelIds.map(id => models.find(m => m.id === id)?.name).join(', '),
      'سنوات الصنع': p.productionYears.join(', '),
      'الرقم التسلسلي': p.serialNumber,
      'السعر': p.price,
      'المورد': p.merchantName,
      'هاتف المورد': p.merchantPhone
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "قطع الغيار");
    XLSX.writeFile(wb, "المخزن_قطع_الغيار.xlsx");
    showSuccess('تم تصدير ملف Excel بنجاح');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">مستودع <span className="text-orange-500">القطع</span></h1>
            <p className="text-slate-500 font-medium mt-1">إدارة وتتبع جميع قطع الغيار المتوفرة في المخزن.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
              <Button variant="ghost" size="icon" onClick={handleExportExcel} className="rounded-xl hover:bg-emerald-50 hover:text-emerald-600" title="تصدير Excel">
                <TableIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 hover:text-red-600" title="تصدير PDF">
                <FileText className="w-5 h-5" />
              </Button>
            </div>
            <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 h-12 font-bold shadow-xl shadow-blue-200 gap-2">
              <Plus className="w-5 h-5" />
              إضافة قطعة
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-2xl">
                <Filter className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-black text-slate-900">أدوات البحث والتصفية</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-2 lg:col-span-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">البحث السريع</Label>
                <div className="relative group">
                  <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    placeholder="ابحث بالاسم، الرقم التسلسلي، أو المورد..." 
                    className="pr-12 h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">الماركة</Label>
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="all">جميع الماركات</SelectItem>
                    {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">سنة الصنع</Label>
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="all">جميع السنوات</SelectItem>
                    {Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString()).map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">نطاق السعر</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="من" 
                    className="h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                    value={minPrice} 
                    onChange={e => setMinPrice(e.target.value)} 
                  />
                  <Input 
                    type="number" 
                    placeholder="إلى" 
                    className="h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                    value={maxPrice} 
                    onChange={e => setMaxPrice(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {filteredParts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part) => {
                const brand = brands.find(b => b.id === part.brandId);
                return (
                  <Card key={part.id} className="group border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white hover:scale-[1.02] transition-all duration-300">
                    <div className="h-2 bg-gradient-to-l from-blue-500 to-orange-500" />
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50"
                            onClick={() => setEditingPart(part)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl" className="rounded-[2rem] border-none shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-black">تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription className="font-medium">
                                  هل أنت متأكد من حذف "{part.partName}"؟ هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-3 mt-4">
                                <AlertDialogCancel className="rounded-xl font-bold">إلغاء</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 rounded-xl font-bold"
                                  onClick={() => {
                                    deletePart(part.id);
                                    showSuccess('تم حذف القطعة بنجاح');
                                  }}
                                >
                                  حذف نهائي
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{part.partName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-blue-50 text-blue-600 border-none font-bold">{brand?.name}</Badge>
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {part.serialNumber || 'بدون رقم'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {part.modelIds.map(mid => (
                            <Badge key={mid} variant="secondary" className="text-[10px] font-bold bg-slate-100 text-slate-600 border-none">
                              {models.find(m => m.id === mid)?.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <User className="w-3 h-3" /> المورد
                            </span>
                            <p className="text-xs font-bold text-slate-700 truncate">{part.merchantName}</p>
                          </div>
                          <div className="space-y-1 text-left">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end">
                              السعر <DollarSign className="w-3 h-3" />
                            </span>
                            <p className="text-lg font-black text-blue-600">{part.price} <span className="text-[10px]">ر.س</span></p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-20 text-center shadow-2xl shadow-slate-200/50">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">لا توجد نتائج</h3>
              <p className="text-slate-400 font-medium">جرب تغيير معايير البحث أو إضافة قطع جديدة.</p>
            </div>
          )}
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">إضافة قطعة غيار جديدة</DialogTitle>
            </DialogHeader>
            <PartForm 
              brands={brands} 
              models={models} 
              onSubmit={(data) => {
                addPart(data);
                setIsAddOpen(false);
                showSuccess('تمت إضافة القطعة بنجاح');
              }}
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingPart} onOpenChange={(open) => !open && setEditingPart(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">تعديل بيانات القطعة</DialogTitle>
            </DialogHeader>
            {editingPart && (
              <PartForm 
                brands={brands} 
                models={models} 
                initialData={editingPart}
                onSubmit={(data) => {
                  updatePart(editingPart.id, data);
                  setEditingPart(null);
                  showSuccess('تم تحديث بيانات القطعة بنجاح');
                }}
                onCancel={() => setEditingPart(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Parts;