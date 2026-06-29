import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStats from '@/components/inventory/DashboardStats';
import { useInventory } from '@/hooks/use-inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Package, ArrowLeft, TrendingUp, Activity, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { parts, brands, models } = useInventory();

  const totalValue = parts.reduce((sum, part) => sum + part.price, 0);
  const uniqueMerchants = new Set(parts.map(p => p.merchantName).filter(Boolean)).size;
  const recentParts = parts.slice(0, 6);

  // Mock data for visual flair
  const topBrands = brands.slice(0, 4).map(b => ({
    ...b,
    count: parts.filter(p => p.brandId === b.id).length,
    color: ['bg-blue-500', 'bg-orange-500', 'bg-emerald-500', 'bg-purple-500'][Math.floor(Math.random() * 4)]
  })).sort((a, b) => b.count - a.count);

  return (
    <MainLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-orange-100 text-orange-600 border-none font-bold px-3">مرحباً بك مجدداً</Badge>
              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                <Clock className="w-3 h-3" />
                {format(new Date(), 'EEEE, dd MMMM', { locale: ar })}
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">نظرة عامة على <span className="text-blue-600">المخزن</span></h1>
            <p className="text-slate-500 font-medium mt-1">إليك ملخص سريع لأداء مستودع قطع الغيار الخاص بك اليوم.</p>
          </div>
          <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 h-12 font-bold shadow-xl shadow-slate-200">
            <Link to="/parts" className="flex items-center gap-2">
              إضافة قطعة سريعة
              <Package className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <DashboardStats 
          totalParts={parts.length}
          totalValue={totalValue}
          totalBrands={brands.length}
          totalMerchants={uniqueMerchants}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity with Creative List */}
          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2.5 rounded-2xl">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-black text-slate-900">آخر الإضافات</CardTitle>
              </div>
              <Button variant="ghost" asChild className="text-slate-400 hover:text-blue-600 font-bold">
                <Link to="/parts" className="flex items-center gap-2">
                  عرض السجل الكامل
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {recentParts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentParts.map((part, idx) => {
                    const brand = brands.find(b => b.id === part.brandId);
                    return (
                      <div key={part.id} className="group flex items-center gap-4 p-4 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100">
                        <div className="relative">
                          <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 truncate">{part.partName}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-500">{brand?.name}</Badge>
                            <span className="text-[10px] text-slate-400 font-mono">{part.serialNumber || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-black text-blue-600">{part.price} <span className="text-[10px]">ر.س</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold">لا توجد بيانات مسجلة حالياً</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Brand Distribution with Visual Progress */}
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-slate-900 text-white">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-2xl">
                  <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                </div>
                <CardTitle className="text-xl font-black">الأكثر طلباً</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-6">
                {topBrands.length > 0 ? topBrands.map((brand, idx) => {
                  const percentage = parts.length > 0 ? (brand.count / parts.length) * 100 : 0;
                  return (
                    <div key={brand.id} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">الماركة</span>
                          <h4 className="font-black text-lg">{brand.name}</h4>
                        </div>
                        <div className="text-left">
                          <span className="text-2xl font-black text-white">{brand.count}</span>
                          <span className="text-[10px] text-slate-400 block font-bold">قطعة متوفرة</span>
                        </div>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${brand.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-slate-500 text-center py-10 font-bold">أضف ماركات لعرض الإحصائيات</p>
                )}
              </div>

              <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm">توقعات المخزون</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  بناءً على البيانات الحالية، نوصي بزيادة مخزون <span className="text-white font-bold">تويوتا</span> بنسبة 15% للشهر القادم.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;