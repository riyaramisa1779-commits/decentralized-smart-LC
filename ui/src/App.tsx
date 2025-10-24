import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import UserRegistration from './components/Registration/UserRegistration';
import DealManagement from './components/Deals/DealManagement';
import EscrowManagement from './components/Escrow/EscrowManagement';
import AdminPanel from './components/Admin/AdminPanel';
import DocumentManagement from './components/Documents/DocumentManagement';
import ExporterDashboard from './components/Exporter/ExporterDashboard';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'registration':
        return <UserRegistration />;
      case 'deals':
        return <DealManagement />;
      case 'escrow':
        return <EscrowManagement />;
      case 'admin':
        return <AdminPanel />;
      case 'exporter':
        return <ExporterDashboard />;
      case 'documents':
        return <DocumentManagement />;
      case 'analytics':
        return (
          <div className="glass-effect rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h2>
            <p className="text-white/70">Coming soon - Trade analytics and insights</p>
          </div>
        );
      case 'settings':
        return (
          <div className="glass-effect rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <p className="text-white/70">Coming soon - User preferences and configuration</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Header />
          <div className="flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-8">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
