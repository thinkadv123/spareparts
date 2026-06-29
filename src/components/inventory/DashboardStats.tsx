import { Package, Car, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'قيمة المخزون',
      value: `${totalValue.toLocaleString()} ر.س`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'إجمالي الماركات',
      value: totalBrands,
      icon: Car,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'إجمالي الموردين',
      value: totalMerchants,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
            <div className={`${stat.bg} p-2 rounded-lg`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;