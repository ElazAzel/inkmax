import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Heart, Megaphone, Search, X, Check, Loader2, ExternalLink, Copy, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCollaboration } from '@/hooks/useCollaboration';
import { NICHES, NICHE_ICONS, type Niche } from '@/lib/niches';
import { CollabBlockManager } from './CollabBlockManager';
import { TeamEditor } from './TeamEditor';
import type { Team } from '@/services/collaboration';

interface CollaborationPanelProps {
  userId: string;
  pageId: string;
}

export function CollaborationPanel({ userId, pageId }: CollaborationPanelProps) {
  const { t } = useTranslation();
  const {
    collaborations,
    teams,
    shoutouts,
    loading,
    pendingRequests,
    activeCollabs,
    sendRequest,
    respondRequest,
    removeCollab,
    createNewTeam,
    inviteMember,
    leaveTeam,
    removeTeam,
    addShoutout,
    removeShoutout,
    search,
    findByNiche,
    refresh,
  } = useCollaboration(userId);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    niche?: string | null;
  }>>([]);
  const [searching, setSearching] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [nicheUsers, setNicheUsers] = useState<typeof searchResults>([]);

  // New team form
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSlug, setNewTeamSlug] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  // Shoutout form
  const [shoutoutMessage, setShoutoutMessage] = useState('');
  const [selectedShoutoutUser, setSelectedShoutoutUser] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingCollab, setEditingCollab] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const results = await search(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  const handleNicheSearch = async (niche: string) => {
    setSelectedNiche(niche);
    const users = await findByNiche(niche);
    setNicheUsers(users);
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !newTeamSlug.trim()) return;
    const result = await createNewTeam(newTeamName, newTeamSlug, newTeamDesc);
    if (result.success) {
      setNewTeamName('');
      setNewTeamSlug('');
      setNewTeamDesc('');
    }
  };

  const handleSendShoutout = async (toUserId: string) => {
    await addShoutout(toUserId, shoutoutMessage);
    setShoutoutMessage('');
    setSelectedShoutoutUser(null);
  };

  const handleTeamUpdate = (updatedTeam: Team) => {
    setSelectedTeam(updatedTeam);
  };

  const handleTeamDelete = () => {
    setSelectedTeam(null);
    refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="collabs" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50">
          <TabsTrigger value="collabs" className="text-xs">
            <Users className="h-4 w-4 mr-1" />
            Коллабы
          </TabsTrigger>
          <TabsTrigger value="promo" className="text-xs">
            <Heart className="h-4 w-4 mr-1" />
            Взаимный пиар
          </TabsTrigger>
          <TabsTrigger value="shoutouts" className="text-xs">
            <Megaphone className="h-4 w-4 mr-1" />
            Шаут-ауты
          </TabsTrigger>
          <TabsTrigger value="teams" className="text-xs">
            <UserPlus className="h-4 w-4 mr-1" />
            Команды
          </TabsTrigger>
        </TabsList>

        {/* Collaborations Tab */}
        <TabsContent value="collabs" className="space-y-4">
          {/* Pending requests */}
          {pendingRequests.length > 0 && (
            <Card className="border-primary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="destructive">{pendingRequests.length}</Badge>
                  Входящие запросы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={req.requester?.avatar_url || ''} />
                        <AvatarFallback>{req.requester?.display_name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{req.requester?.display_name || req.requester?.username}</p>
                        {req.message && <p className="text-xs text-muted-foreground">{req.message}</p>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => respondRequest(req.id, true, pageId)}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => respondRequest(req.id, false)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Active collabs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Активные коллаборации</CardTitle>
            </CardHeader>
            <CardContent>
              {activeCollabs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет активных коллабораций
                </p>
              ) : (
                <div className="space-y-2">
                  {activeCollabs.map(collab => {
                    const partner = collab.requester_id === userId ? collab.target : collab.requester;
                    const collabUrl = collab.collab_slug ? `${window.location.origin}/collab/${collab.collab_slug}` : null;
                    const blockSettings = (collab as { block_settings?: { requester_blocks: string[]; target_blocks: string[]; show_all: boolean } }).block_settings || {
                      requester_blocks: [],
                      target_blocks: [],
                      show_all: true,
                    };
                    return (
                      <div key={collab.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={partner?.avatar_url || ''} />
                              <AvatarFallback>{partner?.display_name?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{partner?.display_name || partner?.username}</span>
                          </div>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => setEditingCollab(collab.id)}>
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Управление блоками</DialogTitle>
                                </DialogHeader>
                                <CollabBlockManager
                                  collabId={collab.id}
                                  requesterId={collab.requester_id}
                                  targetId={collab.target_id}
                                  requesterPageId={collab.requester_page_id}
                                  targetPageId={collab.target_page_id}
                                  currentSettings={blockSettings}
                                  requesterProfile={collab.requester || null}
                                  targetProfile={collab.target || null}
                                  onSettingsChange={() => refresh()}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="ghost" onClick={() => removeCollab(collab.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {collabUrl && (
                          <div className="flex items-center gap-2 text-xs">
                            <Link to={`/collab/${collab.collab_slug}`} className="text-primary hover:underline flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              Совместная страница
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => {
                                navigator.clipboard.writeText(collabUrl);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search for new collab */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Найти партнёра</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Поиск по имени..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback>{user.display_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{user.display_name || user.username}</p>
                          {user.niche && (
                            <Badge variant="secondary" className="text-xs">
                              {NICHE_ICONS[user.niche as Niche]} {t(`niches.${user.niche}`, user.niche)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => sendRequest(user.id, pageId)}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mutual Promo Tab */}
        <TabsContent value="promo" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Взаимный пиар по нише</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {NICHES.slice(0, 8).map((niche) => (
                  <Button
                    key={niche}
                    size="sm"
                    variant={selectedNiche === niche ? 'default' : 'outline'}
                    onClick={() => handleNicheSearch(niche)}
                  >
                    {NICHE_ICONS[niche as Niche]} {t(`niches.${niche}`, niche)}
                  </Button>
                ))}
              </div>

              {nicheUsers.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-xs text-muted-foreground">
                    Пользователи в нише "{t(`niches.${selectedNiche}`, selectedNiche)}"
                  </p>
                  {nicheUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback>{user.display_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.display_name || user.username}</span>
                      </div>
                      <Button size="sm" onClick={() => sendRequest(user.id, pageId)}>
                        Предложить
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shoutouts Tab */}
        <TabsContent value="shoutouts" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Мои рекомендации</CardTitle>
            </CardHeader>
            <CardContent>
              {shoutouts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Вы ещё никого не рекомендовали
                </p>
              ) : (
                <div className="space-y-2">
                  {shoutouts.map(shoutout => (
                    <div key={shoutout.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={shoutout.to_user?.avatar_url || ''} />
                          <AvatarFallback>{shoutout.to_user?.display_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{shoutout.to_user?.display_name || shoutout.to_user?.username}</p>
                          {shoutout.message && (
                            <p className="text-xs text-muted-foreground">{shoutout.message}</p>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeShoutout(shoutout.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add shoutout */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Добавить шаут-аут</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Поиск пользователя..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback>{user.display_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.display_name || user.username}</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedShoutoutUser(user.id)}>
                            <Megaphone className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Рекомендовать {user.display_name || user.username}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Напишите почему рекомендуете этого человека..."
                              value={shoutoutMessage}
                              onChange={(e) => setShoutoutMessage(e.target.value)}
                            />
                            <Button className="w-full" onClick={() => handleSendShoutout(user.id)}>
                              Добавить шаут-аут
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Мои команды</CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Вы не состоите ни в одной команде
                </p>
              ) : (
                <div className="space-y-2">
                  {teams.map(team => (
                    <div key={team.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={team.avatar_url || ''} />
                          <AvatarFallback>{team.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-xs text-muted-foreground">/{team.slug}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Link to={`/team/${team.slug}`}>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedTeam(team)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Настройки команды</DialogTitle>
                            </DialogHeader>
                            {selectedTeam && selectedTeam.id === team.id && (
                              <TeamEditor
                                team={selectedTeam}
                                isOwner={team.owner_id === userId}
                                onTeamUpdate={handleTeamUpdate}
                                onTeamDelete={handleTeamDelete}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        {team.owner_id !== userId && (
                          <Button size="sm" variant="outline" onClick={() => leaveTeam(team.id)}>
                            Выйти
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create team */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Создать команду</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Название команды"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <Input
                placeholder="URL команды (slug)"
                value={newTeamSlug}
                onChange={(e) => setNewTeamSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              />
              <Textarea
                placeholder="Описание команды"
                value={newTeamDesc}
                onChange={(e) => setNewTeamDesc(e.target.value)}
              />
              <Button className="w-full" onClick={handleCreateTeam} disabled={!newTeamName || !newTeamSlug}>
                Создать команду
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
