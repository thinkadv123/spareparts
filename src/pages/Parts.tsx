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
import { Plus, Search, Filter, Download, Edit2, Trash2, FileText, Table as TableIcon } from 'lucide-react';
import PartForm from '@/components/inventory/PartForm';
import { showSuccess } from '@/utils/toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    // Add Arabic font support would be needed for real production, 
    // for now we'll use standard table with English headers or simple text
    (doc as any).autoTable({
      head: [['Part Name', 'Brand', 'Price', 'Merchant']],
      body: filteredParts.map(p => [
        p.partName,
        brands.find(b => b.id === p.brandId)?.name || '',
        p.price.toString(),
        p.merchantName
      ]),
    });
    doc.save("inventory.pdf");
    showSuccess('تم تصدير ملف PDF بنجاح');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">إدارة قطع الغيار</h1>
            <p className="text-slate-500">إضافة وتعديل والبحث في مخزون قطع الغيار.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              إضافة قطعة جديدة
            </Button>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={handleExportExcel} title="تصدير Excel">
                <TableIcon className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExportPDF} title="تصدير PDF">
                <FileText className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-4 h-4" />
              تصفية النتائج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>بحث عام</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="الاسم، الرقم، المورد..." 
                    className="pr-9"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الماركة</Label>
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>سنة الصنع</Label>
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    {Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString()).map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>السعر من</Label>
                <Input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>السعر إلى</Label>
                <Input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-right">اسم القطعة</TableHead>
                  <TableHead className="text-right">الماركة والموديلات</TableHead>
                  <TableHead className="text-right">السنوات</TableHead>
                  <TableHead className="text-right">الرقم التسلسلي</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">المورد</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.length > 0 ? (
                  filteredParts.map((part) => (
                    <TableRow key={part.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold">{part.partName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-blue-600">
                            {brands.find(b => b.id === part.brandId)?.name}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {part.modelIds.map(mid => (
                              <Badge key={mid} variant="secondary" className="text-[10px] px-1 py-0">
                                {models.find(m => m.id === mid)?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {part.productionYears.map(y => (
                            <Badge key={y} variant="outline" className="text-[10px] px-1 py-0">{y}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{part.serialNumber || '-'}</TableCell>
                      <TableCell className="font-bold">{part.price} ر.س</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{part.merchantName}</div>
                          <div className="text-slate-500 text-xs">{part.merchantPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setEditingPart(part)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم حذف هذه القطعة نهائياً من النظام. لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => {
                                    deletePart(part.id);
                                    showSuccess('تم حذف القطعة بنجاح');
                                  }}
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      لا توجد نتائج تطابق معايير البحث.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة قطعة غيار جديدة</DialogTitle>
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل قطعة الغيار</DialogTitle>
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