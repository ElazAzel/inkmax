import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, FileText, Eye, MousePointer, Share2, 
  TrendingUp, Calendar, Shield, LogOut, Search,
  BarChart3, Activity, Globe, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface PlatformStats {
  totalUsers: number;
  totalPages: number;
  publishedPages: number;
  totalViews: number;
  totalClicks: number;
  totalShares: number;
  premiumUsers: number;
  activeTrials: number;
}

interface UserData {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  is_premium: boolean;
  trial_ends_at: string | null;
  created_at: string;
  current_streak: number;
}

interface PageData {
  id: string;
  slug: string;
  title: string | null;
  is_published: boolean;
  view_count: number;
  is_in_gallery: boolean;
  created_at: string;
  user_id: string;
  username?: string;
}

interface AnalyticsEvent {
  id: string;
  event_type: string;
  page_id: string;
  created_at: string;
  metadata: any;
}

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, loading, user } = useAdminAuth();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/auth');
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const loadAllData = async () => {
    setLoadingData(true);
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadPages(),
      loadRecentEvents()
    ]);
    setLoadingData(false);
  };

  const loadStats = async () => {
    try {
      // Get user stats
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      const { count: premiumUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      const { count: activeTrials } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gt('trial_ends_at', new Date().toISOString());

      // Get page stats
      const { count: totalPages } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true });

      const { count: publishedPages } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Get total views from pages
      const { data: viewData } = await supabase
        .from('pages')
        .select('view_count');
      const totalViews = viewData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

      // Get analytics counts
      const { count: totalClicks } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'click');

      const { count: totalShares } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'share');

      setStats({
        totalUsers: totalUsers || 0,
        totalPages: totalPages || 0,
        publishedPages: publishedPages || 0,
        totalViews,
        totalClicks: totalClicks || 0,
        totalShares: totalShares || 0,
        premiumUsers: premiumUsers || 0,
        activeTrials: activeTrials || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, username, display_name, is_premium, trial_ends_at, created_at, current_streak')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Get emails from auth.users via a separate query
      const userIds = data?.map(u => u.id) || [];
      
      // For now, we'll show users without emails since we can't query auth.users directly
      const usersWithEmail = data?.map(u => ({
        ...u,
        email: 'hidden@example.com' // Emails are not accessible from client
      })) || [];

      setUsers(usersWithEmail as UserData[]);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          id, slug, title, is_published, view_count, is_in_gallery, created_at, user_id
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Get usernames for pages
      const userIds = [...new Set(data?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, username')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.username]) || []);

      const pagesWithUsernames = data?.map(p => ({
        ...p,
        username: profileMap.get(p.user_id) || 'Unknown'
      })) || [];

      setPages(pagesWithUsernames);
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  };

  const loadRecentEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('id, event_type, page_id, created_at, metadata')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRecentEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const toggleUserPremium = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_premium: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        title: 'Статус обновлён',
        description: `Premium ${!currentStatus ? 'включён' : 'отключён'}`,
      });
      
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const extendTrial = async (userId: string, days: number) => {
    try {
      const newTrialEnd = new Date();
      newTrialEnd.setDate(newTrialEnd.getDate() + days);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ trial_ends_at: newTrialEnd.toISOString() })
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        title: 'Триал продлён',
        description: `+${days} дней`,
      });
      
      loadUsers();
    } catch (error) {
      console.error('Error extending trial:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось продлить триал',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPages = pages.filter(p =>
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="pages">
              <FileText className="h-4 w-4 mr-2" />
              Страницы
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Activity className="h-4 w-4 mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {loadingData ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Всего пользователей
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold">{stats?.totalUsers}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Premium пользователи
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-yellow-500" />
                        <span className="text-2xl font-bold">{stats?.premiumUsers}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Активные триалы
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="text-2xl font-bold">{stats?.activeTrials}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Всего страниц
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-500" />
                        <span className="text-2xl font-bold">{stats?.totalPages}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Опубликованные
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-500" />
                        <span className="text-2xl font-bold">{stats?.publishedPages}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Всего просмотров
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-cyan-500" />
                        <span className="text-2xl font-bold">{stats?.totalViews?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Всего кликов
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-5 w-5 text-orange-500" />
                        <span className="text-2xl font-bold">{stats?.totalClicks?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Всего шейров
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-pink-500" />
                        <span className="text-2xl font-bold">{stats?.totalShares?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Последние события</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {recentEvents.slice(0, 20).map(event => (
                        <div key={event.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            {event.event_type === 'view' && <Eye className="h-4 w-4 text-cyan-500" />}
                            {event.event_type === 'click' && <MousePointer className="h-4 w-4 text-orange-500" />}
                            {event.event_type === 'share' && <Share2 className="h-4 w-4 text-pink-500" />}
                            <span className="text-sm capitalize">{event.event_type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.created_at), 'dd MMM HH:mm', { locale: ru })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск пользователей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={loadUsers} variant="outline">
                  Обновить
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Триал до</TableHead>
                      <TableHead>Стрик</TableHead>
                      <TableHead>Регистрация</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.display_name || user.username || 'Без имени'}</div>
                            <div className="text-xs text-muted-foreground">@{user.username || 'unknown'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.is_premium ? (
                            <Badge className="bg-yellow-500/20 text-yellow-500">Premium</Badge>
                          ) : user.trial_ends_at && new Date(user.trial_ends_at) > new Date() ? (
                            <Badge variant="secondary">Trial</Badge>
                          ) : (
                            <Badge variant="outline">Free</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.trial_ends_at 
                            ? format(new Date(user.trial_ends_at), 'dd.MM.yyyy')
                            : '—'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            🔥 {user.current_streak || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.created_at), 'dd.MM.yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserPremium(user.id, user.is_premium)}
                            >
                              {user.is_premium ? 'Убрать Premium' : 'Дать Premium'}
                            </Button>
                            <Select onValueChange={(v) => extendTrial(user.id, parseInt(v))}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="+Триал" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">+7 дней</SelectItem>
                                <SelectItem value="14">+14 дней</SelectItem>
                                <SelectItem value="30">+30 дней</SelectItem>
                                <SelectItem value="90">+90 дней</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск страниц..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={loadPages} variant="outline">
                  Обновить
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Страница</TableHead>
                      <TableHead>Владелец</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Просмотры</TableHead>
                      <TableHead>В галерее</TableHead>
                      <TableHead>Создана</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.map(page => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{page.title || 'Без названия'}</div>
                            <div className="text-xs text-muted-foreground">/{page.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>@{page.username}</TableCell>
                        <TableCell>
                          {page.is_published ? (
                            <Badge className="bg-green-500/20 text-green-500">Опубликована</Badge>
                          ) : (
                            <Badge variant="outline">Черновик</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            {page.view_count?.toLocaleString() || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {page.is_in_gallery ? (
                            <Badge variant="secondary">Да</Badge>
                          ) : (
                            <span className="text-muted-foreground">Нет</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(page.created_at), 'dd.MM.yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Лента событий</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Тип</TableHead>
                        <TableHead>Page ID</TableHead>
                        <TableHead>Время</TableHead>
                        <TableHead>Метаданные</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEvents.map(event => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {event.event_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {event.page_id?.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {format(new Date(event.created_at), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            <code className="text-xs">
                              {JSON.stringify(event.metadata)}
                            </code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
