import { useTranslation } from 'react-i18next';
import { usePageAnalytics, TimePeriod } from '@/hooks/usePageAnalytics';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  MousePointerClick, 
  Share2, 
  Users, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calendar,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';

export function AnalyticsPanel() {
  const { t } = useTranslation();
  const { analytics, loading, period, setPeriod, refresh } = usePageAnalytics();

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
        {t('messages.loading', 'Loading...')}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t('analytics.noData', 'No analytics data available')}
      </div>
    );
  }

  const chartData = period === 'month' || period === 'all' 
    ? analytics.monthlyData 
    : period === 'week' 
      ? analytics.weeklyData 
      : analytics.dailyData;

  const DEVICE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
  
  const deviceData = [
    { name: 'Mobile', value: analytics.deviceBreakdown.mobile, icon: Smartphone },
    { name: 'Tablet', value: analytics.deviceBreakdown.tablet, icon: Tablet },
    { name: 'Desktop', value: analytics.deviceBreakdown.desktop, icon: Monitor },
  ].filter(d => d.value > 0);

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="p-4 space-y-4">
        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="day" className="text-xs">
              {t('analytics.today', 'Today')}
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs">
              {t('analytics.week', 'Week')}
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs">
              {t('analytics.month', 'Month')}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs">
              {t('analytics.all', 'All')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Eye}
            label={t('analytics.views', 'Views')}
            value={analytics.totalViews}
            change={analytics.viewsChange}
          />
          <StatCard
            icon={MousePointerClick}
            label={t('analytics.clicks', 'Clicks')}
            value={analytics.totalClicks}
            change={analytics.clicksChange}
          />
          <StatCard
            icon={Share2}
            label={t('analytics.shares', 'Shares')}
            value={analytics.totalShares}
          />
          <StatCard
            icon={Users}
            label={t('analytics.visitors', 'Visitors')}
            value={analytics.uniqueVisitors}
          />
        </div>

        {/* Average Stats */}
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            {t('analytics.avgPerDay', 'Average per day')}
          </div>
          <div className="text-2xl font-bold">{analytics.avgViewsPerDay}</div>
          <div className="text-xs text-muted-foreground">
            {t('analytics.viewsPerDay', 'views / day')}
          </div>
        </Card>

        {/* Chart */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('analytics.activityChart', 'Activity')}
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  name={t('analytics.views', 'Views')}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                  name={t('analytics.clicks', 'Clicks')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Blocks */}
        {analytics.topBlocks.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-4">
              {t('analytics.topBlocks', 'Top Content')}
            </h3>
            <div className="space-y-3">
              {analytics.topBlocks.map((block, index) => (
                <div key={block.blockId} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {block.blockTitle}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {block.blockType}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{block.clicks}</div>
                    <div className="text-xs text-muted-foreground">
                      {block.ctr.toFixed(1)}% CTR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Clicks by Block Chart */}
        {analytics.topBlocks.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-4">
              {t('analytics.clicksByBlock', 'Clicks by Block')}
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={analytics.topBlocks.slice(0, 5)} 
                  layout="vertical"
                  margin={{ left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis 
                    type="category" 
                    dataKey="blockTitle" 
                    tick={{ fontSize: 10 }} 
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Traffic Sources */}
        {analytics.trafficSources.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('analytics.trafficSources', 'Traffic Sources')}
            </h3>
            <div className="space-y-3">
              {analytics.trafficSources.slice(0, 6).map((source, index) => (
                <div key={source.source} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize">{source.source}</div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all" 
                        style={{ width: `${Math.min(source.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{source.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {source.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Device Breakdown */}
        {deviceData.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              {t('analytics.devices', 'Devices')}
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {deviceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {deviceData.map((device, index) => {
                  const Icon = device.icon;
                  const total = analytics.deviceBreakdown.mobile + analytics.deviceBreakdown.tablet + analytics.deviceBreakdown.desktop;
                  const percentage = total > 0 ? (device.value / total) * 100 : 0;
                  return (
                    <div key={device.name} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: DEVICE_COLORS[index] }}
                      />
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{device.name}</span>
                      <span className="font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Refresh Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={refresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('analytics.refresh', 'Refresh')}
        </Button>
      </div>
    </ScrollArea>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  change?: number;
}

function StatCard({ icon: Icon, label, value, change }: StatCardProps) {
  const showChange = change !== undefined && change !== 0;
  const isPositive = change && change > 0;
  
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value.toLocaleString()}</span>
        {showChange && (
          <span className={`text-xs flex items-center gap-0.5 ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change).toFixed(0)}%
          </span>
        )}
      </div>
    </Card>
  );
}
