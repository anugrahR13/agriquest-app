'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gavel, List, Plus, BarChart3, User, Users } from 'lucide-react';

interface AuctionNavigationProps {
  userRole: string;
}

export default function AuctionNavigation({ userRole }: AuctionNavigationProps) {
  const pathname = usePathname();
  
  const isGovernmentUser = userRole === 'GOVERNMENT';
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/auction/dashboard',
      icon: BarChart3,
      showFor: ['FARMER', 'GOVERNMENT']
    },
    {
      name: 'My Auctions',
      href: '/auction/listings',
      icon: List,
      showFor: ['FARMER']
    },
    {
      name: 'All Auctions',
      href: '/auction/listings',
      icon: List,
      showFor: ['GOVERNMENT']
    },
    {
      name: 'Apply',
      href: '/auction/apply',
      icon: Plus,
      showFor: ['FARMER']
    },
    {
      name: 'Manage',
      href: '/auction/admin',
      icon: User,
      showFor: ['GOVERNMENT']
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-2 mb-6 border border-slate-200">
      <div className="flex flex-wrap gap-1 justify-center">
        {navItems
          .filter(item => item.showFor.includes(userRole))
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:shadow-sm'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}