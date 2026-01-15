/**
 * CRMTab - Messenger-style CRM with leads as dialogs
 * Features: swipe actions, statuses, tags, quick replies
 */
import { memo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeads, LeadStatus } from '@/hooks/useLeads';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import {
  Search,
  Plus,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Crown,
  MoreHorizontal,
  Send,
  Archive,
  Star,
  Tag,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddLeadDialog } from '@/components/crm/AddLeadDialog';
import { LeadDetails } from '@/components/crm/LeadDetails';
import { BookingsPanel } from '@/components/crm/BookingsPanel';
import { cn } from '@/lib/utils';
import { openPremiumPurchase } from '@/lib/upgrade-utils';
import type { Lead } from '@/hooks/useLeads';

interface CRMTabProps {
  isPremium: boolean;
}

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-blue-500/20', text: 'text-blue-600', label: 'Новый' },
  contacted: { bg: 'bg-amber-500/20', text: 'text-amber-600', label: 'В работе' },
  qualified: { bg: 'bg-purple-500/20', text: 'text-purple-600', label: 'Квалифицирован' },
  converted: { bg: 'bg-emerald-500/20', text: 'text-emerald-600', label: 'Сделка' },
  lost: { bg: 'bg-gray-500/20', text: 'text-gray-600', label: 'Потерян' },
};

const SOURCE_ICONS: Record<string, string> = {
  form: '📝',
  messenger: '💬',
  manual: '✏️',
  page_view: '👁️',
  other: '📌',
};

export const CRMTab = memo(function CRMTab({ isPremium }: CRMTabProps) {
  const { t } = useTranslation();
  const { leads, loading, getLeadStats, refreshLeads } = useLeads();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'bookings'>('leads');

  const stats = getLeadStats();

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Только что';
    if (hours < 24) return `${hours}ч назад`;
    if (days < 7) return `${days}д назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  // Premium gate
  if (!isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 safe-area-top">
        <div className="text-center max-w-sm">
          <div className="h-20 w-20 rounded-3xl bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Crown className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black mb-3">{t('crm.premiumRequired', 'CRM для Premium')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('crm.premiumDescription', 'Управляйте заявками как в мессенджере. Статусы, теги, быстрые ответы и история.')}
          </p>
          <Button 
            size="lg" 
            className="h-14 px-8 rounded-2xl text-base font-bold"
            onClick={openPremiumPurchase}
          >
            <Crown className="h-5 w-5 mr-2" />
            {t('crm.upgradeToPremium', 'Получить Premium')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-top">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-nav px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black">{t('crm.title', 'CRM')}</h1>
            <p className="text-sm text-muted-foreground">
              {stats.total} {t('crm.leads', 'заявок')}
            </p>
          </div>
          <Button 
            size="icon"
            className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/25"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'leads' | 'bookings')}>
          <TabsList className="grid grid-cols-2 h-12 rounded-2xl bg-muted/50 p-1">
            <TabsTrigger 
              value="leads" 
              className="rounded-xl data-[state=active]:shadow-sm font-bold"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('crm.leads', 'Заявки')}
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="rounded-xl data-[state=active]:shadow-sm font-bold"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {t('crm.bookings', 'Записи')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {activeTab === 'leads' && (
        <>
          {/* Status Filters */}
          <div className="px-5 py-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                  statusFilter === 'all' 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                Все ({stats.total})
              </button>
              {Object.entries(STATUS_COLORS).map(([status, style]) => (
                stats[status as LeadStatus] > 0 && (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as LeadStatus)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                      statusFilter === status
                        ? `${style.bg} ${style.text} ring-2 ring-offset-2`
                        : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {style.label} ({stats[status as LeadStatus]})
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t('crm.searchPlaceholder', 'Поиск по имени, телефону...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 rounded-2xl bg-muted/50 border-0 text-base"
              />
            </div>
          </div>

          {/* Leads List - Messenger Style */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-bold mb-2">
                  {searchQuery ? t('crm.noResults', 'Ничего не найдено') : t('crm.noLeads', 'Пока нет заявок')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('crm.noLeadsHint', 'Заявки появятся здесь, когда посетители заполнят формы на вашей странице')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {filteredLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onClick={() => setSelectedLead(lead)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </>
      )}

      {activeTab === 'bookings' && (
        <BookingsPanel />
      )}

      {/* Add Lead Dialog */}
      <AddLeadDialog
        open={showAddDialog}
        onOpenChange={(isOpen) => {
          setShowAddDialog(isOpen);
          if (!isOpen) refreshLeads();
        }}
      />

      {/* Lead Details Sheet */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedLead(null);
              refreshLeads();
            }
          }}
        />
      )}
    </div>
  );
});

// Individual Lead Row - Messenger style
interface LeadRowProps {
  lead: Lead;
  onClick: () => void;
}

function LeadRow({ lead, onClick }: LeadRowProps) {
  const statusStyle = STATUS_COLORS[lead.status];
  const sourceIcon = SOURCE_ICONS[lead.source] || '📌';

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'сейчас';
    if (hours < 24) return `${hours}ч`;
    if (days < 7) return `${days}д`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <button
      onClick={onClick}
      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 active:bg-muted/50 transition-colors text-left"
    >
      {/* Avatar */}
      <Avatar className="h-14 w-14 rounded-2xl shrink-0">
        <AvatarFallback className={cn("rounded-2xl text-lg font-bold", statusStyle.bg, statusStyle.text)}>
          {lead.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">{sourceIcon}</span>
          <span className="font-bold truncate">{lead.name}</span>
          {lead.status === 'new' && (
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {lead.phone && (
            <span className="flex items-center gap-1 truncate">
              <Phone className="h-3 w-3" />
              {lead.phone}
            </span>
          )}
          {lead.email && !lead.phone && (
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3" />
              {lead.email}
            </span>
          )}
        </div>

        {lead.notes && (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {lead.notes}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(lead.created_at)}
        </span>
        <Badge 
          variant="outline" 
          className={cn("text-xs", statusStyle.bg, statusStyle.text, "border-0")}
        >
          {statusStyle.label}
        </Badge>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
    </button>
  );
}
