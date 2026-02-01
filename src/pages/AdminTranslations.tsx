import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, ArrowLeft, Search, Copy, Download, AlertTriangle,
  CheckCircle, Languages, Loader2, Upload, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { StaticSEOHead } from '@/components/seo/StaticSEOHead';
import { LANGUAGE_DEFINITIONS } from '@/lib/i18n-helpers';

import ru from '@/i18n/locales/ru.json';
import en from '@/i18n/locales/en.json';
import kk from '@/i18n/locales/kk.json';

type TranslationData = Record<string, unknown>;

interface FlattenedKey {
  key: string;
  values: Record<string, string>;
  missingIn: string[];
}

// Dynamically get available languages from loaded i18n files
const AVAILABLE_LANGUAGES = ['ru', 'en', 'kk'] as const;
type LanguageCode = typeof AVAILABLE_LANGUAGES[number];

// Flatten nested JSON object to dot notation keys
function flattenObject(obj: TranslationData, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as TranslationData, newKey));
    } else {
      result[newKey] = String(value ?? '');
    }
  }
  
  return result;
}

// Get all unique keys from all languages (dynamically supports any langs)
function getAllKeys(
  translations: Record<string, TranslationData>,
  languages: string[]
): FlattenedKey[] {
  const flattened: Record<string, Record<string, string>> = {};
  
  // Flatten each language
  languages.forEach(lang => {
    flattened[lang] = flattenObject(translations[lang] || {});
  });
  
  // Get all unique keys
  const allKeys = new Set<string>();
  languages.forEach(lang => {
    Object.keys(flattened[lang]).forEach(k => allKeys.add(k));
  });
  
  // Build FlattenedKey array
  return Array.from(allKeys).sort().map(key => {
    const values: Record<string, string> = {};
    const missingIn: string[] = [];
    
    languages.forEach(lang => {
      values[lang] = flattened[lang][key] || '';
      if (!flattened[lang][key]) {
        missingIn.push(lang);
      }
    });
    
    return { key, values, missingIn };
  });
}

// Set nested value by dot notation key
function setNestedValue(obj: TranslationData, key: string, value: string): void {
  const parts = key.split('.');
  let current: TranslationData = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]] as TranslationData;
  }
  
  current[parts[parts.length - 1]] = value;
}

export default function AdminTranslations() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const canonical = 'https://lnkmx.my/admin/translations';
  const seoTitle = t('adminTranslations.seo.title', 'lnkmx Admin Translations');
  const seoDescription = t(
    'adminTranslations.seo.description',
    'Internal translation management for lnkmx.'
  );
  const { isAdmin, loading } = useAdminAuth();
  
  // Support for dynamic languages from LANGUAGE_DEFINITIONS
  const languages = useMemo(() => {
    return Object.keys(LANGUAGE_DEFINITIONS).filter(code => 
      AVAILABLE_LANGUAGES.includes(code as LanguageCode)
    );
  }, []);
  
  const [translations, setTranslations] = useState<Record<string, TranslationData>>(() => {
    const init: Record<string, TranslationData> = {};
    (AVAILABLE_LANGUAGES as readonly string[]).forEach(lang => {
      if (lang === 'ru') init.ru = JSON.parse(JSON.stringify(ru));
      else if (lang === 'en') init.en = JSON.parse(JSON.stringify(en));
      else if (lang === 'kk') init.kk = JSON.parse(JSON.stringify(kk));
    });
    return init;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'missing'>('all');
  const [selectedLang, setSelectedLang] = useState<string>(languages[0] || 'ru');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/auth');
    }
  }, [loading, isAdmin, navigate]);

  const allKeys = useMemo(
    () => getAllKeys(translations, languages),
    [translations, languages]
  );
  
  const filteredKeys = useMemo(() => {
    return allKeys.filter(item => {
      // Search filter
      const matchesSearch = !searchQuery || 
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(item.values).some(v => 
          v.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      // Missing filter
      const matchesMissing = filterMode === 'all' || item.missingIn.length > 0;
      
      return matchesSearch && matchesMissing;
    });
  }, [allKeys, searchQuery, filterMode]);

  const stats = useMemo(() => {
    const total = allKeys.length;
    const statsByLang: Record<string, number> = {};
    const complete = allKeys.filter(k => k.missingIn.length === 0).length;
    
    languages.forEach(lang => {
      statsByLang[lang] = allKeys.filter(k => k.missingIn.includes(lang)).length;
    });
    
    return { total, complete, byLang: statsByLang };
  }, [allKeys, languages]);

  const handleValueChange = (key: string, lang: string, value: string) => {
    setTranslations(prev => {
      const updated = { ...prev };
      updated[lang] = JSON.parse(JSON.stringify(prev[lang]));
      setNestedValue(updated[lang], key, value);
      return updated;
    });
  };

  const copyToClipboard = async (lang: string) => {
    try {
      const json = JSON.stringify(translations[lang], null, 2);
      await navigator.clipboard.writeText(json);
      const langName = LANGUAGE_DEFINITIONS[lang]?.name || lang.toUpperCase();
      toast.success(`JSON для ${langName} скопирован`);
    } catch {
      toast.error('Не удалось скопировать');
    }
  };

  const downloadJSON = (lang: string) => {
    const json = JSON.stringify(translations[lang], null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lang}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const langName = LANGUAGE_DEFINITIONS[lang]?.name || lang.toUpperCase();
    toast.success(`Файл ${lang}.json скачан`);
  };

  const copyMissingKeys = async (lang: string) => {
    const missing = allKeys.filter(k => k.missingIn.includes(lang));
    const result: TranslationData = {};
    
    missing.forEach(item => {
      // Use value from another language as placeholder
      const placeholder = Object.values(item.values).find(v => v) || `[${item.key}]`;
      setNestedValue(result, item.key, `[TODO] ${placeholder}`);
    });
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      const langName = LANGUAGE_DEFINITIONS[lang]?.name || lang.toUpperCase();
      toast.success(`${missing.length} отсутствующих ключей для ${langName} скопировано`);
    } catch {
      toast.error('Не удалось скопировать');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text) as TranslationData;
      
      // Merge imported data with existing translations
      setTranslations(prev => {
        const updated = { ...prev };
        updated[selectedLang] = mergeDeep(prev[selectedLang], importedData);
        return updated;
      });
      
      const langName = LANGUAGE_DEFINITIONS[selectedLang]?.name || selectedLang.toUpperCase();
      toast.success(`JSON для ${langName} импортирован`);
    } catch (error) {
      toast.error('Ошибка парсинга JSON файла');
      console.error('Import error:', error);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Deep merge function for nested objects
  function mergeDeep(target: TranslationData, source: TranslationData): TranslationData {
    const result = { ...target };
    
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (target[key] && typeof target[key] === 'object') {
          result[key] = mergeDeep(target[key] as TranslationData, source[key] as TranslationData);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  const resetToOriginal = () => {
    const init: Record<string, TranslationData> = {};
    (AVAILABLE_LANGUAGES as readonly string[]).forEach(lang => {
      if (lang === 'ru') init.ru = JSON.parse(JSON.stringify(ru));
      else if (lang === 'en') init.en = JSON.parse(JSON.stringify(en));
      else if (lang === 'kk') init.kk = JSON.parse(JSON.stringify(kk));
    });
    setTranslations(init);
    toast.success('Переводы сброшены к исходным');
  };

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
    <>
      <StaticSEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        currentLanguage={i18n.language}
        indexable={false}
        alternates={languages.map(lang => ({
          hreflang: lang,
          href: `${canonical}?lang=${lang}`
        })).concat({
          hreflang: 'x-default',
          href: canonical
        })}
      />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Редактор переводов
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Всего ключей</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-500">{stats.complete}</div>
              <p className="text-sm text-muted-foreground">Полные</p>
            </CardContent>
          </Card>
          {languages.map(lang => {
            const missing = stats.byLang[lang] || 0;
            const langDef = LANGUAGE_DEFINITIONS[lang] || {};
            return (
              <Card key={lang} className={missing > 0 ? 'border-destructive' : ''}>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-orange-500">{missing}</div>
                  <p className="text-sm text-muted-foreground">
                    {langDef.flag} Нет в {lang.toUpperCase()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по ключу или значению..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filterMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMode('all')}
                >
                  Все
                </Button>
                <Button
                  variant={filterMode === 'missing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMode('missing')}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Только отсутствующие
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Tabs */}
        <Tabs value={selectedLang} onValueChange={setSelectedLang}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <TabsList>
              {languages.map(lang => {
                const langDef = LANGUAGE_DEFINITIONS[lang] || {};
                const missing = stats.byLang[lang] || 0;
                return (
                  <TabsTrigger key={lang} value={lang} className="gap-2">
                    <span>{langDef.flag}</span>
                    <span>{langDef.name || lang.toUpperCase()}</span>
                    {missing > 0 && (
                      <Badge variant="destructive" className="ml-1">{missing}</Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-1" />
                Импорт JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyMissingKeys(selectedLang)}>
                <AlertTriangle className="h-4 w-4 mr-1" />
                Отсутствующие
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(selectedLang)}>
                <Copy className="h-4 w-4 mr-1" />
                Копировать
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadJSON(selectedLang)}>
                <Download className="h-4 w-4 mr-1" />
                Скачать
              </Button>
              <Button variant="ghost" size="sm" onClick={resetToOriginal}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Сброс
              </Button>
            </div>
          </div>

          {languages.map(lang => (
            <TabsContent key={lang} value={lang}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Переводы ({filteredKeys.length} из {allKeys.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {filteredKeys.map(item => (
                        <div 
                          key={item.key}
                          className={`flex items-start gap-4 p-3 rounded-lg border ${
                            item.missingIn.includes(lang) 
                              ? 'border-destructive bg-destructive/5' 
                              : 'border-border'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono truncate">
                                {item.key}
                              </code>
                              {item.missingIn.length === 0 ? (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <Badge variant="destructive" className="text-xs flex-shrink-0">
                                  Нет в: {item.missingIn.map(l => l.toUpperCase()).join(', ')}
                                </Badge>
                              )}
                            </div>
                            <Input
                              value={item.values[lang] || ''}
                              onChange={(e) => handleValueChange(item.key, lang, e.target.value)}
                              placeholder={`[Отсутствует] ${Object.values(item.values).find(v => v) || ''}`}
                              className={item.missingIn.includes(lang) ? 'border-destructive' : ''}
                            />
                            {/* Show other language values for reference */}
                            <div className="mt-2 flex gap-4 text-xs text-muted-foreground flex-wrap">
                              {languages.map(otherLang => {
                                if (otherLang === lang) return null;
                                const val = item.values[otherLang];
                                if (!val) return null;
                                const otherDef = LANGUAGE_DEFINITIONS[otherLang] || {};
                                return (
                                  <span key={otherLang}>
                                    {otherDef.flag} {val.slice(0, 50)}{val.length > 50 ? '...' : ''}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredKeys.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Languages className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Ключи не найдены</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Инструкция</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p><strong>Редактирование:</strong> Изменяйте переводы прямо в полях ввода</p>
            <p><strong>Импорт:</strong> Загрузите JSON файл кнопкой "Импорт JSON" — новые ключи добавятся, существующие обновятся</p>
            <p><strong>Экспорт:</strong> Скачайте или скопируйте JSON и замените файл в <code className="bg-muted px-1 rounded">src/i18n/locales/*.json</code></p>
            <p><strong>Отсутствующие:</strong> Красные поля и бейджи показывают ключи без перевода</p>
            <p><strong>Сброс:</strong> Кнопка сброса вернёт исходные переводы из кодовой базы</p>
            <p className="text-amber-500 pt-2">⚠️ Изменения хранятся в памяти — экспортируйте перед уходом!</p>
          </CardContent>
        </Card>
      </main>
      </div>
    </>
  );
}
