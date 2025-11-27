import { MessageCircle, Send } from 'lucide-react';
import type { MessengerBlock as MessengerBlockType } from '@/types/page';
import { Card } from '@/components/ui/card';

interface MessengerBlockProps {
  block: MessengerBlockType;
}

export function MessengerBlock({ block }: MessengerBlockProps) {
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
    <Card className="p-6">
      {block.title && (
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">{block.title}</h3>
        </div>
      )}
      <div className="grid gap-3">
        {block.messengers.map((messenger, index) => (
          <a
            key={index}
            href={getMessengerUrl(messenger.platform, messenger.username, messenger.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-all hover:shadow-md bg-card"
          >
            <span className="text-2xl">{getMessengerIcon(messenger.platform)}</span>
            <div className="flex-1">
              <div className="font-medium">{getPlatformName(messenger.platform)}</div>
              <div className="text-sm text-muted-foreground">@{messenger.username}</div>
            </div>
            <Send className="h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </div>
    </Card>
  );
}
