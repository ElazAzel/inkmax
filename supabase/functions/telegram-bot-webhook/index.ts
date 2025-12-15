import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramBotToken) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return new Response('Bot not configured', { status: 500 });
    }

    const update: TelegramUpdate = await req.json();
    console.log('Received Telegram update:', JSON.stringify(update));

    // Check if it's a message with /start command
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();
      const firstName = update.message.from.first_name || 'друг';
      const username = update.message.from.username;

      let responseText = '';

      if (text === '/start' || text.startsWith('/start ')) {
        // Welcome message with Chat ID
        responseText = `👋 Привет, ${firstName}!\n\n` +
          `🆔 Ваш Chat ID: <code>${chatId}</code>\n\n` +
          `📋 Скопируйте этот номер и вставьте его в LinkMAX для подключения уведомлений.\n\n` +
          `✅ После подключения вы будете получать:\n` +
          `• Уведомления о новых заявках\n` +
          `• Уведомления о подарках Premium\n` +
          `• Уведомления о челленджах друзей\n\n` +
          `🔗 <a href="https://linkmax.kz">Открыть LinkMAX</a>`;
      } else if (text === '/help') {
        responseText = `ℹ️ <b>LinkMAX Bot</b>\n\n` +
          `Этот бот помогает получать уведомления от LinkMAX.\n\n` +
          `<b>Команды:</b>\n` +
          `/start - Получить ваш Chat ID\n` +
          `/help - Справка\n` +
          `/id - Показать Chat ID\n\n` +
          `🆔 Ваш Chat ID: <code>${chatId}</code>`;
      } else if (text === '/id') {
        responseText = `🆔 Ваш Telegram Chat ID:\n\n<code>${chatId}</code>\n\n` +
          `Скопируйте и вставьте в настройки LinkMAX.`;
      } else {
        // Echo back Chat ID for any other message
        responseText = `🆔 Ваш Chat ID: <code>${chatId}</code>\n\n` +
          `Используйте /help для справки.`;
      }

      // Send response
      const sendResponse = await fetch(
        `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: responseText,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        }
      );

      const sendResult = await sendResponse.json();
      console.log('Send message result:', JSON.stringify(sendResult));

      if (!sendResult.ok) {
        console.error('Failed to send message:', sendResult.description);
      }
    }

    // Always return 200 OK to Telegram
    return new Response('OK', { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    // Still return 200 to prevent Telegram from retrying
    return new Response('OK', { status: 200 });
  }
});
