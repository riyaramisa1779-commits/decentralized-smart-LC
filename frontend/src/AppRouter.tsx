import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/wagmi";

// Layout Components
import Layout from "@/components/Layout/Layout";

// Page Components
import Dashboard from "@/pages/Dashboard";
import UserRegistration from "@/pages/UserRegistration";
import DealManagement from "@/pages/DealManagement";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/NotFound";

// const queryClient = new QueryClient();

const AppRouter: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      {/* <QueryClientProvider client={queryClient}> */}
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="registration" element={<UserRegistration />} />
              <Route path="deals" element={<DealManagement />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      {/* </QueryClientProvider> */}
    </WagmiProvider>
  );
};

export default AppRouter;
