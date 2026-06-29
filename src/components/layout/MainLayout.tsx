import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Car, Settings, Menu, X, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'لوحة التحكم', path: '/', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: 'قطع الغيار', path: '/parts', icon: Package, color: 'text-orange-500' },
    { name: 'الماركات والموديلات', path: '/brands', icon: Car, color: 'text-emerald-500' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950 text-white p-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-slate-900 p-2.5 rounded-xl">
            <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">المخزن</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pro Inventory</p>
        </div>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-orange-500 rounded-l-full" />
              )}
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? item.color : "group-hover:text-white")} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-300">النظام مؤمن</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">جميع البيانات مشفرة ومحفوظة سحابياً بشكل تلقائي.</p>
        </div>
        <p className="text-[10px] text-slate-600 text-center font-medium">المخزن الذكي © 2024</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-row-reverse font-sans" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 right-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl">
            <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tighter">المخزن</span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl bg-slate-100">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-72 border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:mr-72 pt-24 lg:pt-0 min-h-screen">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;