import React from "react";
import { Outlet } from "react-router-dom";
import PageHeader from "./PageHeader";
import AppSidebar from "./AppSidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Container } from "../ui/container";

const Layout: React.FC = () => {
  return (
    //  <AppInitializer>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="px-2 pb-4">
          <PageHeader />
          <div className="flex w-full justify-center">
            <Container>
              <div className="grid grid-cols-1 py-8">
                <Outlet />
              </div>
            </Container>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    // </AppInitializer>
  );
};

export default Layout;
