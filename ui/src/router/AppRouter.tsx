import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config/wagmi";

// Layout Components
import Layout from "../components/Layout/Layout";

// Page Components
import Dashboard from "../components/Dashboard/Dashboard";
import UserRegistration from "../components/Registration/UserRegistration";
import DealManagement from "../components/Deals/DealManagement";
import ExporterDashboard from "../components/Exporter/ExporterDashboard";
import EscrowManagement from "../components/Escrow/EscrowManagement";
import DocumentManagement from "../components/Documents/DocumentManagement";
import AdminPanel from "../components/Admin/AdminPanel";
import { Analytics, Settings, NotFound } from "../pages";

const queryClient = new QueryClient();

const AppRouter: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="registration" element={<UserRegistration />} />
              <Route path="deals" element={<DealManagement />} />
              <Route path="exporter" element={<ExporterDashboard />} />
              <Route path="escrow" element={<EscrowManagement />} />
              <Route path="documents" element={<DocumentManagement />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppRouter;
