import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStats from '@/components/inventory/DashboardStats';
import { useInventory } from '@/hooks/use-inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { parts, brands, models } = useInventory();

  const totalValue = parts.reduce((sum, part) => sum + part.price, 0);
  const uniqueMerchants = new Set(parts.map(p => p.merchantName).filter(Boolean)).size;
  const recentParts = parts.slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">لوحة التحكم</h1>
          <p className="text-slate-500">نظرة عامة على حالة المخزون والنشاط الأخير.</p>
        </div>

        <DashboardStats 
          totalParts={parts.length}
          totalValue={totalValue}
          totalBrands={brands.length}
          totalMerchants={uniqueMerchants}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">آخر القطع المضافة</CardTitle>
              <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-700">
                <Link to="/parts" className="flex items-center gap-2">
                  عرض الكل
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentParts.length > 0 ? (
                <div className="space-y-4">
                  {recentParts.map((part) => {
                    const brand = brands.find(b => b.id === part.brandId);
                    return (
                      <div key={part.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{part.partName}</h3>
                            <p className="text-sm text-slate-500">{brand?.name} - {part.serialNumber || 'بدون رقم تسلسلي'}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-slate-900">{part.price} ر.س</div>
                          <div className="text-xs text-slate-400">
                            {format(new Date(part.createdAt), 'dd MMMM yyyy', { locale: ar })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  لا توجد قطع مضافة حالياً.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">توزيع الماركات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brands.map(brand => {
                  const count = parts.filter(p => p.brandId === brand.id).length;
                  const percentage = parts.length > 0 ? (count / parts.length) * 100 : 0;
                  return (
                    <div key={brand.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{brand.name}</span>
                        <span className="text-slate-500">{count} قطعة</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;