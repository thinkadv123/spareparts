import { Package, Car, Users, DollarSign, TrendingUp, Zap, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatsProps {
  totalParts: number;
  totalValue: number;
  totalBrands: number;
  totalMerchants: number;
}

const DashboardStats = ({ totalParts, totalValue, totalBrands, totalMerchants }: DashboardStatsProps) => {
  const stats = [
    {
      title: 'إجمالي قطع الغيار',
      value: totalParts,
      icon: Package,
      gradient: 'from-blue-600 to-indigo-700',
      shadow: 'shadow-blue-200',
      trend: '+12% هذا الشهر'
    },
    {
      title: 'قيمة المخزون',
      value: `${totalValue.toLocaleString()} ر.س`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-700',
      shadow: 'shadow-emerald-200',
      trend: 'مستقر'
    },
    {
      title: 'الماركات المسجلة',
      value: totalBrands,
      icon: Car,
      gradient: 'from-orange-500 to-rose-600',
      shadow: 'shadow-orange-200',
      trend: '+2 ماركة جديدة'
    },
    {
      title: 'الموردين النشطين',
      value: totalMerchants,
      icon: Users,
      gradient: 'from-purple-600 to-fuchsia-700',
      shadow: 'shadow-purple-200',
      trend: '85% تقييم إيجابي'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`border-none overflow-hidden relative group hover:scale-[1.02] transition-all duration-300 ${stat.shadow} shadow-xl rounded-[2rem]`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
          <CardContent className="relative p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/80 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
            </div>
            <div className="absolute -bottom-4 -left-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-24 h-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;