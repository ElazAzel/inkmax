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
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    message?: {
      chat: { id: number };
    };
    data?: string;
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

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const chatId = callbackQuery.message?.chat?.id || callbackQuery.from.id;
      const data = callbackQuery.data;
      const firstName = callbackQuery.from.first_name;

      let responseText = '';
      let replyMarkup: any = null;

      if (data === 'get_id' || data === 'copy_id') {
        responseText = `📋 <b>Ваш Chat ID:</b>\n\n` +
          `<code>${chatId}</code>\n\n` +
          `☝️ Нажмите на номер → Скопируйте → Вставьте в LinkMAX`;
        replyMarkup = {
          inline_keyboard: [
            [{ text: '✅ Продолжить регистрацию', url: 'https://lnkmx.my/auth' }]
          ]
        };
      } else if (data === 'help') {
        responseText = `ℹ️ <b>Как подключить Telegram к LinkMAX:</b>\n\n` +
          `1️⃣ Скопируйте Chat ID: <code>${chatId}</code>\n` +
          `2️⃣ Вставьте его при регистрации на lnkmx.my\n` +
          `3️⃣ Нажмите "Подтвердить"\n\n` +
          `После этого вы будете получать уведомления о заявках прямо сюда! 📩`;
        replyMarkup = {
          inline_keyboard: [
            [{ text: '📝 Регистрация', url: 'https://lnkmx.my/auth' }]
          ]
        };
      }

      // Answer callback query (removes loading state)
      await fetch(
        `https://api.telegram.org/bot${telegramBotToken}/answerCallbackQuery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            callback_query_id: callbackQuery.id,
            text: 'Chat ID скопирован!',
            show_alert: false
          }),
        }
      );

      // Send response message
      if (responseText) {
        const messageBody: any = {
          chat_id: chatId,
          text: responseText,
          parse_mode: 'HTML',
        };
        if (replyMarkup) messageBody.reply_markup = replyMarkup;

        await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageBody),
          }
        );
      }

      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    // Handle text messages
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();
      const firstName = update.message.from.first_name || 'друг';

      let responseText = '';
      let replyMarkup: any = null;

      if (text === '/start' || text.startsWith('/start ')) {
        // Main welcome message - clear and simple
        responseText = `👋 Привет, ${firstName}!\n\n` +
          `📋 <b>Ваш Chat ID для регистрации:</b>\n\n` +
          `<code>${chatId}</code>\n\n` +
          `☝️ <b>Нажмите на номер чтобы скопировать</b>\n\n` +
          `Затем вернитесь в LinkMAX и вставьте его в поле регистрации.`;
        
        replyMarkup = {
          inline_keyboard: [
            [{ text: '📋 Скопировать ещё раз', callback_data: 'copy_id' }],
            [{ text: '✅ Продолжить регистрацию', url: 'https://lnkmx.my/auth' }],
            [{ text: 'ℹ️ Как это работает?', callback_data: 'help' }]
          ]
        };
      } else if (text === '/help') {
        responseText = `ℹ️ <b>Как подключить Telegram к LinkMAX:</b>\n\n` +
          `1️⃣ Скопируйте Chat ID: <code>${chatId}</code>\n` +
          `2️⃣ Вставьте его при регистрации на lnkmx.my\n` +
          `3️⃣ Нажмите "Подтвердить"\n\n` +
          `После этого вы будете получать уведомления о заявках прямо сюда! 📩`;
        
        replyMarkup = {
          inline_keyboard: [
            [{ text: '📋 Скопировать Chat ID', callback_data: 'copy_id' }],
            [{ text: '📝 Регистрация', url: 'https://lnkmx.my/auth' }]
          ]
        };
      } else if (text === '/id') {
        responseText = `📋 <b>Ваш Chat ID:</b>\n\n<code>${chatId}</code>\n\n` +
          `☝️ Нажмите чтобы скопировать`;
        
        replyMarkup = {
          inline_keyboard: [
            [{ text: '✅ Вставить в LinkMAX', url: 'https://lnkmx.my/auth' }]
          ]
        };
      } else {
        // Any other message - just show the ID
        responseText = `📋 <b>Ваш Chat ID:</b>\n\n<code>${chatId}</code>\n\n` +
          `Скопируйте и вставьте в LinkMAX`;
        
        replyMarkup = {
          inline_keyboard: [
            [{ text: '📋 Скопировать', callback_data: 'copy_id' }],
            [{ text: '📝 Регистрация', url: 'https://lnkmx.my/auth' }]
          ]
        };
      }

      // Send response with buttons
      const messageBody: any = {
        chat_id: chatId,
        text: responseText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      };
      
      if (replyMarkup) {
        messageBody.reply_markup = replyMarkup;
      }

      const sendResponse = await fetch(
        `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageBody),
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
