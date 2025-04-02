
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const DashboardLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-inventory-background">
          <div className="p-6">
            <SidebarTrigger className="mb-6 lg:hidden" />
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
