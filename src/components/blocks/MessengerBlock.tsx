import { memo } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { MessengerBlock as MessengerBlockType, PageTheme } from '@/types/page';
import { Card } from '@/components/ui/card';
import { getShadowClass } from '@/lib/block-utils';

interface MessengerBlockProps {
  block: MessengerBlockType;
  theme?: PageTheme;
}

export const MessengerBlock = memo(function MessengerBlock({ block, theme }: MessengerBlockProps) {
  const getMessengerIcon = (platform: string) => {
    const icons: Record<string, string> = {
      whatsapp: '🟢',
      telegram: '✈️',
      viber: '🟣',
      wechat: '💬',
    };
    return icons[platform] || '💬';
  };

  const getMessengerUrl = (platform: string, username: string, message?: string) => {
    const encodedMessage = message ? encodeURIComponent(message) : '';
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/${username}${message ? `?text=${encodedMessage}` : ''}`,
      telegram: `https://t.me/${username}`,
      viber: `viber://chat?number=${username}`,
      wechat: `weixin://dl/chat?${username}`,
    };
    return urls[platform] || '#';
  };

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      viber: 'Viber',
      wechat: 'WeChat',
    };
    return names[platform] || platform;
  };

  return (
    <Card 
      className="p-6 border-current/20"
      style={{ 
        backgroundColor: theme?.textColor ? `${theme.textColor}08` : undefined,
        borderColor: theme?.textColor ? `${theme.textColor}33` : undefined
      }}
    >
      {block.title && (
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5" style={{ color: theme?.accentColor || theme?.textColor }} />
          <h3 className="font-semibold text-lg" style={{ color: theme?.textColor }}>{block.title}</h3>
        </div>
      )}
      <div className="grid gap-3">
        {block.messengers.map((messenger, index) => (
          <a
            key={index}
            href={getMessengerUrl(messenger.platform, messenger.username, messenger.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md"
            style={{
              backgroundColor: theme?.textColor ? `${theme.textColor}05` : undefined,
              borderColor: theme?.textColor ? `${theme.textColor}33` : undefined
            }}
          >
            <span className="text-2xl">{getMessengerIcon(messenger.platform)}</span>
            <div className="flex-1">
              <div className="font-medium" style={{ color: theme?.textColor }}>{getPlatformName(messenger.platform)}</div>
              <div className="text-sm opacity-60" style={{ color: theme?.textColor }}>@{messenger.username}</div>
            </div>
            <Send className="h-4 w-4 opacity-60" style={{ color: theme?.textColor }} />
          </a>
        ))}
      </div>
    </Card>
  );
});
