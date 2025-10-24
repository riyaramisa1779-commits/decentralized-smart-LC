import React from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <TrendingUp className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-white/70 mt-1">Trade analytics and business insights</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Trade Volume</p>
              <p className="text-2xl font-bold text-white">$2.4M</p>
              <p className="text-green-400 text-sm mt-1">+12% from last month</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Active Deals</p>
              <p className="text-2xl font-bold text-white">47</p>
              <p className="text-yellow-400 text-sm mt-1">8 pending approval</p>
            </div>
            <PieChart className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">94.2%</p>
              <p className="text-green-400 text-sm mt-1">+2.1% improvement</p>
            </div>
            <Activity className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="glass-effect rounded-xl p-8 text-center">
        <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Advanced Analytics Coming Soon</h2>
        <p className="text-white/70 mb-6">
          We're building comprehensive analytics including trade flow visualization, 
          risk assessment metrics, and predictive insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">📊 Trade Flow Analysis</h3>
            <p className="text-white/60 text-sm">Visual representation of import/export patterns and trade routes</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">⚠️ Risk Assessment</h3>
            <p className="text-white/60 text-sm">AI-powered risk scoring for deals and counterparties</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">📈 Performance Metrics</h3>
            <p className="text-white/60 text-sm">Detailed KPIs and performance tracking over time</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">🔮 Predictive Insights</h3>
            <p className="text-white/60 text-sm">Market trends and forecasting based on historical data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;