"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  IndianRupeeIcon,
  LayoutDashboardIcon,
  PiggyBank
} from "lucide-react";
import { usePathname } from "next/navigation";

const SideNav: React.FC = () => {
  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutDashboardIcon, link: "/dashboard/console" },
    { id: 2, name: "Log expenses", icon: IndianRupeeIcon, link: "/dashboard" },
    {
      id: 3,
      name: "Expenses",
      icon: ArrowUpDown,
      link: "/dashboard/expenses",
    },
    { id: 4, name: "Budgets", icon: PiggyBank, link: "/dashboard/budgets" },
    
  ];

  const pathname = usePathname();

  useEffect(() => {
    console.log("Current path:", pathname);
  }, [pathname]);

  return (
    <aside className="h-screen w-64 p-5 border shadow-sm">
      {/* Logo + Title */}
      <div className="flex items-center space-x-3 mb-8">
        <Image src="/logo.svg" alt="logo" width={30} height={40} />
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold text-gray-900">
            Personal Finance
          </span>
          <span className="text-base font-bold text-gray-900">
            Visualizer
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="space-y-4">
          {menuList.map((menu) => {
            const IconComponent = menu.icon;
            const isActive = pathname === menu.link;

            return (
              <li key={menu.id}>
                <Link
                  href={menu.link}
                  className={`
                    flex items-center space-x-2 p-2 rounded 
                    hover:bg-red-100 
                    ${isActive ? "text-red-700" : "text-gray-800"}
                  `}
                >
                  <IconComponent size={20} />
                  <span>{menu.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SideNav;
