import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Target, MessageCircle } from 'lucide-react';
import { getInvestorTargetingList } from '../services/investorService';

type Metric = {
  name: string;
  value: any;
  change: any;
  changeType: string;
  icon: React.ElementType;
};

const MetricsPanel = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInvestorTargetingList();
        // Assuming data.summary contains the metrics info
        // Map summary data to metrics array with existing icons and changeType logic
        const summary = data.summary || {};

        const mappedMetrics = [
          {
            name: 'Total Investors',
            value: summary.totalInvestors?.toLocaleString() || '0',
            change: summary.totalInvestorsChange || '',
            changeType: summary.totalInvestorsChange?.startsWith('+') ? 'positive' : 'negative',
            icon: Users
          },
          {
            name: 'High Fit Matches',
            value: summary.highFitMatches?.toLocaleString() || '0',
            change: summary.highFitMatchesChange || '',
            changeType: summary.highFitMatchesChange?.startsWith('+') ? 'positive' : 'negative',
            icon: Target
          },
          {
            name: 'Active Conversations',
            value: summary.activeConversations?.toLocaleString() || '0',
            change: summary.activeConversationsChange || '',
            changeType: summary.activeConversationsChange?.startsWith('+') ? 'positive' : 'negative',
            icon: MessageCircle
          },
          {
            name: 'Conversion Rate',
            value: summary.conversionRate || '0%',
            change: summary.conversionRateChange || '',
            changeType: summary.conversionRateChange?.startsWith('+') ? 'positive' : 'negative',
            icon: TrendingUp
          }
        ];

        setMetrics(mappedMetrics);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="text-center py-6 text-gray-600">Loading metrics...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsPanel;