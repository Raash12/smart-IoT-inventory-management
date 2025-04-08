
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from '@/components/ui/sidebar';
import { 
  Home, 
  Package, 
  ListOrdered, 
  LogOut, 
  UserPlus, 
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AppSidebar() {
  const { logout, userData } = useAuth();
  const location = useLocation();
  
  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      : 'U';
  };

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Add Product",
      url: "/products/add",
      icon: PlusCircle,
    },
    {
      title: "Products List",
      url: "/products",
      icon: Package,
    },
    {
      title: "Add Category",
      url: "/categories/add",
      icon: UserPlus,
    },
    {
      title: "Categories List",
      url: "/categories",
      icon: ListOrdered,
    },

  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-4 border-b">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-inventory-primary" />
          <span className="text-xl font-semibold">InventoryPro</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={location.pathname === item.url ? "text-inventory-primary font-semibold" : ""}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-inventory-primary text-white">
                {userData ? getInitials(userData.username) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userData?.username}</p>
              <p className="text-xs text-muted-foreground">{userData?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
