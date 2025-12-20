import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval, eachHourOfInterval, startOfHour } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Loader2, Eye, MousePointer, Share2, TrendingUp, TrendingDown,
  Users, Clock, Globe, Smartphone, Monitor, Tablet, Activity,
  BarChart3, Target, Zap, Calendar
} from 'lucide-react';

interface AnalyticsData {
  // Overview stats
  totalViews: number;
  totalClicks: number;
  totalShares: number;
  totalEvents: number;
  uniqueVisitors: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  
  // Trends
  viewsTrend: number;
  clicksTrend: number;
  sharesTrend: number;
  
  // Time series
  dailyEvents: DailyEventData[];
  hourlyEvents: HourlyEventData[];
  
  // Breakdowns
  eventsByType: { name: string; count: number; color: string }[];
  eventsByDevice: { name: string; count: number; color: string }[];
  eventsBySource: { name: string; count: number; color: string }[];
  topPages: { page_id: string; slug: string; views: number; clicks: number; ctr: number }[];
  topBlocks: { block_id: string; type: string; clicks: number }[];
  
  // Engagement metrics
  engagementByHour: { hour: number; events: number }[];
  engagementByDay: { day: string; events: number }[];
}

interface DailyEventData {
  date: string;
  views: number;
  clicks: number;
  shares: number;
  sessions: number;
  visitors: number;
}

interface HourlyEventData {
  hour: string;
  views: number;
  clicks: number;
}

const COLORS = {
  views: '#06b6d4',
  clicks: '#f97316',
  shares: '#ec4899',
  sessions: '#8b5cf6',
  visitors: '#10b981',
  desktop: '#3b82f6',
  mobile: '#10b981',
  tablet: '#f59e0b',
  direct: '#6366f1',
  social: '#ec4899',
  search: '#10b981',
  referral: '#f97316',
  other: '#6b7280'
};

export function AdminAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '14d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const getPeriodDays = () => {
    switch (period) {
      case '7d': return 7;
      case '14d': return 14;
      case '30d': return 30;
      case '90d': return 90;
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = getPeriodDays();
      const startDate = subDays(new Date(), days);
      const prevStartDate = subDays(startDate, days);

      // Load all analytics data
      const [
        { data: currentEvents },
        { data: previousEvents },
        { data: pagesData },
        { data: blocksData }
      ] = await Promise.all([
        supabase.from('analytics')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true }),
        supabase.from('analytics')
          .select('*')
          .gte('created_at', prevStartDate.toISOString())
          .lt('created_at', startDate.toISOString()),
        supabase.from('pages')
          .select('id, slug, view_count'),
        supabase.from('blocks')
          .select('id, type, click_count, page_id')
      ]);

      const events = currentEvents || [];
      const prevEvents = previousEvents || [];

      // Calculate overview stats
      const views = events.filter(e => e.event_type === 'view').length;
      const clicks = events.filter(e => e.event_type === 'click').length;
      const shares = events.filter(e => e.event_type === 'share').length;
      
      const prevViews = prevEvents.filter(e => e.event_type === 'view').length;
      const prevClicks = prevEvents.filter(e => e.event_type === 'click').length;
      const prevShares = prevEvents.filter(e => e.event_type === 'share').length;

      // Extract unique visitors and sessions from metadata
      const visitorIds = new Set<string>();
      const sessionIds = new Set<string>();
      
      events.forEach(e => {
        const meta = e.metadata as Record<string, any> | null;
        if (meta?.visitor_id) visitorIds.add(meta.visitor_id);
        if (meta?.session_id) sessionIds.add(meta.session_id);
      });

      // Calculate trends
      const calcTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      // Generate daily data
      const dateRange = eachDayOfInterval({ start: startDate, end: new Date() });
      const dailyEvents: DailyEventData[] = dateRange.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayEvents = events.filter(e => {
          const d = new Date(e.created_at);
          return d >= dayStart && d < dayEnd;
        });

        const dayVisitors = new Set<string>();
        const daySessions = new Set<string>();
        dayEvents.forEach(e => {
          const meta = e.metadata as Record<string, any> | null;
          if (meta?.visitor_id) dayVisitors.add(meta.visitor_id);
          if (meta?.session_id) daySessions.add(meta.session_id);
        });

        return {
          date: format(day, 'dd.MM'),
          views: dayEvents.filter(e => e.event_type === 'view').length,
          clicks: dayEvents.filter(e => e.event_type === 'click').length,
          shares: dayEvents.filter(e => e.event_type === 'share').length,
          sessions: daySessions.size,
          visitors: dayVisitors.size
        };
      });

      // Generate hourly data for last 24 hours
      const last24Hours = eachHourOfInterval({
        start: subDays(new Date(), 1),
        end: new Date()
      });
      
      const hourlyEvents: HourlyEventData[] = last24Hours.map(hour => {
        const hourStart = startOfHour(hour);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hourEnd.getHours() + 1);

        const hourEvents = events.filter(e => {
          const d = new Date(e.created_at);
          return d >= hourStart && d < hourEnd;
        });

        return {
          hour: format(hour, 'HH:00'),
          views: hourEvents.filter(e => e.event_type === 'view').length,
          clicks: hourEvents.filter(e => e.event_type === 'click').length
        };
      });

      // Event type breakdown
      const eventsByType = [
        { name: 'Просмотры', count: views, color: COLORS.views },
        { name: 'Клики', count: clicks, color: COLORS.clicks },
        { name: 'Шейры', count: shares, color: COLORS.shares }
      ];

      // Device breakdown
      const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0, unknown: 0 };
      events.forEach(e => {
        const meta = e.metadata as Record<string, any> | null;
        const device = meta?.device_type || 'unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });

      const eventsByDevice = [
        { name: 'Desktop', count: deviceCounts.desktop, color: COLORS.desktop },
        { name: 'Mobile', count: deviceCounts.mobile, color: COLORS.mobile },
        { name: 'Tablet', count: deviceCounts.tablet, color: COLORS.tablet },
        { name: 'Unknown', count: deviceCounts.unknown, color: COLORS.other }
      ].filter(d => d.count > 0);

      // Source breakdown
      const sourceCounts: Record<string, number> = {};
      events.forEach(e => {
        const meta = e.metadata as Record<string, any> | null;
        const source = meta?.referrer_source || 'direct';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const sourceColors: Record<string, string> = {
        direct: COLORS.direct,
        social: COLORS.social,
        search: COLORS.search,
        referral: COLORS.referral
      };

      const eventsBySource = Object.entries(sourceCounts)
        .map(([name, count]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          count,
          color: sourceColors[name] || COLORS.other
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Top pages by views
      const pageViewCounts: Record<string, { views: number; clicks: number }> = {};
      events.forEach(e => {
        if (!e.page_id) return;
        if (!pageViewCounts[e.page_id]) {
          pageViewCounts[e.page_id] = { views: 0, clicks: 0 };
        }
        if (e.event_type === 'view') pageViewCounts[e.page_id].views++;
        if (e.event_type === 'click') pageViewCounts[e.page_id].clicks++;
      });

      const pageMap = new Map(pagesData?.map(p => [p.id, p]) || []);
      const topPages = Object.entries(pageViewCounts)
        .map(([page_id, stats]) => {
          const page = pageMap.get(page_id);
          return {
            page_id,
            slug: page?.slug || 'Unknown',
            views: stats.views,
            clicks: stats.clicks,
            ctr: stats.views > 0 ? Math.round((stats.clicks / stats.views) * 100) : 0
          };
        })
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Top blocks by clicks
      const blockClickCounts: Record<string, { type: string; clicks: number }> = {};
      events.forEach(e => {
        if (!e.block_id || e.event_type !== 'click') return;
        const meta = e.metadata as Record<string, any> | null;
        if (!blockClickCounts[e.block_id]) {
          blockClickCounts[e.block_id] = { type: meta?.block_type || 'Unknown', clicks: 0 };
        }
        blockClickCounts[e.block_id].clicks++;
      });

      const topBlocks = Object.entries(blockClickCounts)
        .map(([block_id, stats]) => ({
          block_id,
          type: stats.type,
          clicks: stats.clicks
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Engagement by hour of day
      const hourCounts: Record<number, number> = {};
      events.forEach(e => {
        const hour = new Date(e.created_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const engagementByHour = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        events: hourCounts[hour] || 0
      }));

      // Engagement by day of week
      const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const dayCounts: Record<number, number> = {};
      events.forEach(e => {
        const day = new Date(e.created_at).getDay();
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      });

      const engagementByDay = Array.from({ length: 7 }, (_, i) => ({
        day: dayNames[i],
        events: dayCounts[i] || 0
      }));

      setAnalytics({
        totalViews: views,
        totalClicks: clicks,
        totalShares: shares,
        totalEvents: events.length,
        uniqueVisitors: visitorIds.size,
        totalSessions: sessionIds.size,
        avgSessionDuration: 0, // Would need proper tracking
        bounceRate: 0, // Would need proper tracking
        viewsTrend: calcTrend(views, prevViews),
        clicksTrend: calcTrend(clicks, prevClicks),
        sharesTrend: calcTrend(shares, prevShares),
        dailyEvents,
        hourlyEvents,
        eventsByType,
        eventsByDevice,
        eventsBySource,
        topPages,
        topBlocks,
        engagementByHour,
        engagementByDay
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrend = (value: number) => {
    if (value > 0) {
      return (
        <span className="flex items-center text-green-500 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          +{value}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="flex items-center text-red-500 text-sm">
          <TrendingDown className="h-4 w-4 mr-1" />
          {value}%
        </span>
      );
    }
    return <span className="text-muted-foreground text-sm">0%</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center py-12 text-muted-foreground">Нет данных</div>;
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Детальная аналитика</h2>
        <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 дней</SelectItem>
            <SelectItem value="14d">14 дней</SelectItem>
            <SelectItem value="30d">30 дней</SelectItem>
            <SelectItem value="90d">90 дней</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Eye className="h-5 w-5 text-cyan-500" />
              {renderTrend(analytics.viewsTrend)}
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Просмотры</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <MousePointer className="h-5 w-5 text-orange-500" />
              {renderTrend(analytics.clicksTrend)}
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Клики</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Share2 className="h-5 w-5 text-pink-500" />
              {renderTrend(analytics.sharesTrend)}
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{analytics.totalShares.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Шейры</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Activity className="h-5 w-5 text-purple-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{analytics.totalEvents.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Всего событий</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Уник. посетители</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{analytics.totalSessions.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Сессии</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTR Metric */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Общий CTR (Click-Through Rate)</p>
              <p className="text-3xl font-bold">
                {analytics.totalViews > 0 
                  ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(2)
                  : 0}%
              </p>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {analytics.totalClicks} кликов из {analytics.totalViews} просмотров
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Динамика</TabsTrigger>
          <TabsTrigger value="breakdown">Распределение</TabsTrigger>
          <TabsTrigger value="engagement">Вовлечённость</TabsTrigger>
          <TabsTrigger value="top">Топ контента</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          {/* Daily Events Chart */}
          <Card>
            <CardHeader>
              <CardTitle>События по дням</CardTitle>
              <CardDescription>Просмотры, клики и шейры за период</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analytics.dailyEvents}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.views} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.views} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Просмотры"
                      stroke={COLORS.views}
                      fill="url(#viewsGrad)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      name="Клики"
                      stroke={COLORS.clicks}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="shares"
                      name="Шейры"
                      stroke={COLORS.shares}
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sessions & Visitors */}
          <Card>
            <CardHeader>
              <CardTitle>Сессии и посетители</CardTitle>
              <CardDescription>Уникальные сессии и посетители по дням</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.dailyEvents}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sessions" name="Сессии" fill={COLORS.sessions} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="visitors" name="Посетители" fill={COLORS.visitors} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Активность за 24 часа</CardTitle>
              <CardDescription>Почасовое распределение событий</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.hourlyEvents}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Просмотры"
                      stroke={COLORS.views}
                      fill={COLORS.views}
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      name="Клики"
                      stroke={COLORS.clicks}
                      fill={COLORS.clicks}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Types */}
            <Card>
              <CardHeader>
                <CardTitle>Типы событий</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.eventsByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {analytics.eventsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {analytics.eventsByType.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Devices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Устройства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.eventsByDevice}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {analytics.eventsByDevice.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {analytics.eventsByDevice.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {item.name === 'Desktop' && <Monitor className="h-4 w-4" />}
                        {item.name === 'Mobile' && <Smartphone className="h-4 w-4" />}
                        {item.name === 'Tablet' && <Tablet className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Источники трафика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.eventsBySource}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {analytics.eventsBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {analytics.eventsBySource.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Hour of Day */}
            <Card>
              <CardHeader>
                <CardTitle>Активность по часам</CardTitle>
                <CardDescription>В какое время пользователи наиболее активны</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.engagementByHour}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickFormatter={(h) => `${h}:00`} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        labelFormatter={(h) => `${h}:00`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="events" name="События" fill={COLORS.sessions} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* By Day of Week */}
            <Card>
              <CardHeader>
                <CardTitle>Активность по дням недели</CardTitle>
                <CardDescription>В какие дни пользователи наиболее активны</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.engagementByDay} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="day" type="category" tick={{ fontSize: 11 }} width={30} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="events" name="События" fill={COLORS.visitors} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Content Tab */}
        <TabsContent value="top" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Топ страницы</CardTitle>
                <CardDescription>По количеству просмотров</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Нет данных</p>
                  ) : (
                    analytics.topPages.map((page, index) => (
                      <div key={page.page_id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono text-sm w-6">#{index + 1}</span>
                          <div>
                            <p className="font-medium">/{page.slug}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>{page.views} просмотров</span>
                              <span>{page.clicks} кликов</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={page.ctr >= 10 ? 'default' : 'secondary'}>
                          CTR: {page.ctr}%
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Blocks */}
            <Card>
              <CardHeader>
                <CardTitle>Топ блоки</CardTitle>
                <CardDescription>По количеству кликов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topBlocks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Нет данных</p>
                  ) : (
                    analytics.topBlocks.map((block, index) => (
                      <div key={block.block_id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono text-sm w-6">#{index + 1}</span>
                          <div>
                            <Badge variant="outline">{block.type}</Badge>
                          </div>
                        </div>
                        <span className="font-medium">{block.clicks} кликов</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
