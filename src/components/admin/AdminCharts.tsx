import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface DailyData {
  date: string;
  users: number;
  pages: number;
  views: number;
  clicks: number;
  shares: number;
}

interface UserStatusData {
  name: string;
  value: number;
  color: string;
}

interface EventTypeData {
  name: string;
  count: number;
  color: string;
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  users: '#8b5cf6',
  pages: '#10b981',
  views: '#06b6d4',
  clicks: '#f97316',
  shares: '#ec4899',
  premium: '#eab308',
  trial: '#3b82f6',
  free: '#6b7280'
};

export function AdminCharts() {
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [userStatusData, setUserStatusData] = useState<UserStatusData[]>([]);
  const [eventTypeData, setEventTypeData] = useState<EventTypeData[]>([]);
  const [cumulativeUsers, setCumulativeUsers] = useState<{ date: string; total: number }[]>([]);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    setLoading(true);
    await Promise.all([
      loadDailyGrowth(),
      loadUserStatus(),
      loadEventTypes(),
      loadCumulativeUsers()
    ]);
    setLoading(false);
  };

  const loadDailyGrowth = async () => {
    try {
      const days = 14;
      const startDate = subDays(new Date(), days);
      
      // Get users created in last N days
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      // Get pages created in last N days
      const { data: pagesData } = await supabase
        .from('pages')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      // Get analytics events
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('event_type, created_at')
        .gte('created_at', startDate.toISOString());

      // Generate daily breakdown
      const dateRange = eachDayOfInterval({ start: startDate, end: new Date() });
      
      const dailyStats = dateRange.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dateStr = format(day, 'dd.MM');
        
        const usersCount = usersData?.filter(u => {
          const d = new Date(u.created_at);
          return d >= dayStart && d < dayEnd;
        }).length || 0;

        const pagesCount = pagesData?.filter(p => {
          const d = new Date(p.created_at);
          return d >= dayStart && d < dayEnd;
        }).length || 0;

        const dayEvents = analyticsData?.filter(e => {
          const d = new Date(e.created_at);
          return d >= dayStart && d < dayEnd;
        }) || [];

        return {
          date: dateStr,
          users: usersCount,
          pages: pagesCount,
          views: dayEvents.filter(e => e.event_type === 'view').length,
          clicks: dayEvents.filter(e => e.event_type === 'click').length,
          shares: dayEvents.filter(e => e.event_type === 'share').length
        };
      });

      setDailyData(dailyStats);
    } catch (error) {
      console.error('Error loading daily growth:', error);
    }
  };

  const loadUserStatus = async () => {
    try {
      const now = new Date().toISOString();
      
      const { count: premiumCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      const { count: trialCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', false)
        .gt('trial_ends_at', now);

      const { count: totalCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      const freeCount = (totalCount || 0) - (premiumCount || 0) - (trialCount || 0);

      setUserStatusData([
        { name: 'Premium', value: premiumCount || 0, color: COLORS.premium },
        { name: 'Trial', value: trialCount || 0, color: COLORS.trial },
        { name: 'Free', value: Math.max(0, freeCount), color: COLORS.free }
      ]);
    } catch (error) {
      console.error('Error loading user status:', error);
    }
  };

  const loadEventTypes = async () => {
    try {
      const { data } = await supabase
        .from('analytics')
        .select('event_type');

      const counts = {
        view: 0,
        click: 0,
        share: 0
      };

      data?.forEach(e => {
        if (e.event_type in counts) {
          counts[e.event_type as keyof typeof counts]++;
        }
      });

      setEventTypeData([
        { name: 'Просмотры', count: counts.view, color: COLORS.views },
        { name: 'Клики', count: counts.click, color: COLORS.clicks },
        { name: 'Шейры', count: counts.share, color: COLORS.shares }
      ]);
    } catch (error) {
      console.error('Error loading event types:', error);
    }
  };

  const loadCumulativeUsers = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (!data || data.length === 0) {
        setCumulativeUsers([]);
        return;
      }

      // Group by date and calculate cumulative
      const dateMap = new Map<string, number>();
      let cumulative = 0;

      data.forEach(u => {
        const dateStr = format(new Date(u.created_at), 'dd.MM');
        cumulative++;
        dateMap.set(dateStr, cumulative);
      });

      // Get last 30 days or all data if less
      const entries = Array.from(dateMap.entries());
      const last30 = entries.slice(-30);

      setCumulativeUsers(last30.map(([date, total]) => ({ date, total })));
    } catch (error) {
      console.error('Error loading cumulative users:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Рост пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeUsers}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.users} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.users} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Всего пользователей"
                  stroke={COLORS.users}
                  fill="url(#userGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Новые регистрации (14 дней)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="users" 
                    name="Пользователи" 
                    fill={COLORS.users} 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="pages" 
                    name="Страницы" 
                    fill={COLORS.pages} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Events Chart */}
        <Card>
          <CardHeader>
            <CardTitle>События (14 дней)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    name="Просмотры" 
                    stroke={COLORS.views} 
                    strokeWidth={2}
                    dot={false}
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
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {userStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Типы событий</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Количество"
                    radius={[0, 4, 4, 0]}
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
