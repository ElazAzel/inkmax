/**
 * send-attendee-email - Sends confirmation email to event attendee
 * Includes: ticket code, event details, add-to-calendar link
 * Uses Resend for email delivery
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AttendeeEmailRequest {
  registrationId: string;
  eventId: string;
  language?: string;
}

interface EventData {
  title_i18n_json: Record<string, string>;
  description_i18n_json: Record<string, string> | null;
  start_at: string | null;
  end_at: string | null;
  location_type: string | null;
  location_value: string | null;
  timezone: string | null;
  owner_id: string;
  page_id: string;
}

interface RegistrationData {
  id: string;
  attendee_name: string;
  attendee_email: string;
  status: string;
  event_tickets: Array<{ ticket_code: string; status: string }>;
}

interface PageData {
  slug: string;
  title: string | null;
}

interface OwnerData {
  display_name: string | null;
  username: string | null;
}

const translations: Record<string, {
  subject: string;
  greeting: string;
  confirmed: string;
  pending: string;
  eventDetails: string;
  date: string;
  location: string;
  online: string;
  ticketCode: string;
  saveTicket: string;
  addToCalendar: string;
  questions: string;
  organizer: string;
  footer: string;
}> = {
  ru: {
    subject: "Ваша регистрация подтверждена",
    greeting: "Здравствуйте",
    confirmed: "Ваша регистрация на событие подтверждена!",
    pending: "Ваша заявка отправлена на рассмотрение.",
    eventDetails: "Детали события",
    date: "Дата",
    location: "Место",
    online: "Онлайн",
    ticketCode: "Код вашего билета",
    saveTicket: "Сохраните этот код — он понадобится для входа на мероприятие.",
    addToCalendar: "Добавить в календарь",
    questions: "Если у вас есть вопросы, свяжитесь с организатором.",
    organizer: "Организатор",
    footer: "Это автоматическое письмо. Пожалуйста, не отвечайте на него.",
  },
  en: {
    subject: "Your registration is confirmed",
    greeting: "Hello",
    confirmed: "Your event registration is confirmed!",
    pending: "Your application has been submitted for review.",
    eventDetails: "Event Details",
    date: "Date",
    location: "Location",
    online: "Online",
    ticketCode: "Your Ticket Code",
    saveTicket: "Save this code — you'll need it to enter the event.",
    addToCalendar: "Add to Calendar",
    questions: "If you have any questions, please contact the organizer.",
    organizer: "Organizer",
    footer: "This is an automated email. Please do not reply.",
  },
  kk: {
    subject: "Сіздің тіркелуіңіз расталды",
    greeting: "Сәлеметсіз бе",
    confirmed: "Іс-шараға тіркелуіңіз расталды!",
    pending: "Сіздің өтінішіңіз қарауға жіберілді.",
    eventDetails: "Іс-шара мәліметтері",
    date: "Күні",
    location: "Орны",
    online: "Онлайн",
    ticketCode: "Сіздің билет кодыңыз",
    saveTicket: "Бұл кодты сақтаңыз — іс-шараға кіру үшін қажет болады.",
    addToCalendar: "Күнтізбеге қосу",
    questions: "Сұрақтарыңыз болса, ұйымдастырушыға хабарласыңыз.",
    organizer: "Ұйымдастырушы",
    footer: "Бұл автоматты хат. Жауап бермеңіз.",
  },
  de: {
    subject: "Ihre Registrierung ist bestätigt",
    greeting: "Hallo",
    confirmed: "Ihre Veranstaltungsregistrierung ist bestätigt!",
    pending: "Ihre Anfrage wurde zur Prüfung eingereicht.",
    eventDetails: "Veranstaltungsdetails",
    date: "Datum",
    location: "Ort",
    online: "Online",
    ticketCode: "Ihr Ticketcode",
    saveTicket: "Speichern Sie diesen Code — Sie benötigen ihn zum Eintritt.",
    addToCalendar: "Zum Kalender hinzufügen",
    questions: "Bei Fragen wenden Sie sich an den Veranstalter.",
    organizer: "Veranstalter",
    footer: "Dies ist eine automatische E-Mail. Bitte antworten Sie nicht.",
  },
  fr: {
    subject: "Votre inscription est confirmée",
    greeting: "Bonjour",
    confirmed: "Votre inscription à l'événement est confirmée!",
    pending: "Votre demande a été soumise pour examen.",
    eventDetails: "Détails de l'événement",
    date: "Date",
    location: "Lieu",
    online: "En ligne",
    ticketCode: "Votre code de billet",
    saveTicket: "Conservez ce code — vous en aurez besoin pour entrer.",
    addToCalendar: "Ajouter au calendrier",
    questions: "Si vous avez des questions, contactez l'organisateur.",
    organizer: "Organisateur",
    footer: "Ceci est un email automatique. Veuillez ne pas répondre.",
  },
  es: {
    subject: "Tu registro está confirmado",
    greeting: "Hola",
    confirmed: "¡Tu registro al evento está confirmado!",
    pending: "Tu solicitud ha sido enviada para revisión.",
    eventDetails: "Detalles del evento",
    date: "Fecha",
    location: "Ubicación",
    online: "En línea",
    ticketCode: "Tu código de entrada",
    saveTicket: "Guarda este código — lo necesitarás para entrar.",
    addToCalendar: "Añadir al calendario",
    questions: "Si tienes preguntas, contacta al organizador.",
    organizer: "Organizador",
    footer: "Este es un email automático. Por favor no respondas.",
  },
  tr: {
    subject: "Kaydınız onaylandı",
    greeting: "Merhaba",
    confirmed: "Etkinlik kaydınız onaylandı!",
    pending: "Başvurunuz incelemeye gönderildi.",
    eventDetails: "Etkinlik Detayları",
    date: "Tarih",
    location: "Konum",
    online: "Çevrimiçi",
    ticketCode: "Bilet Kodunuz",
    saveTicket: "Bu kodu kaydedin — girişte ihtiyacınız olacak.",
    addToCalendar: "Takvime Ekle",
    questions: "Sorularınız varsa organizatörle iletişime geçin.",
    organizer: "Organizatör",
    footer: "Bu otomatik bir e-postadır. Lütfen yanıtlamayın.",
  },
  uk: {
    subject: "Вашу реєстрацію підтверджено",
    greeting: "Вітаємо",
    confirmed: "Вашу реєстрацію на подію підтверджено!",
    pending: "Вашу заявку надіслано на розгляд.",
    eventDetails: "Деталі події",
    date: "Дата",
    location: "Місце",
    online: "Онлайн",
    ticketCode: "Ваш код квитка",
    saveTicket: "Збережіть цей код — він потрібен для входу.",
    addToCalendar: "Додати до календаря",
    questions: "Якщо у вас є питання, зверніться до організатора.",
    organizer: "Організатор",
    footer: "Це автоматичний лист. Будь ласка, не відповідайте.",
  },
  uz: {
    subject: "Ro'yxatdan o'tishingiz tasdiqlandi",
    greeting: "Salom",
    confirmed: "Tadbirga ro'yxatdan o'tishingiz tasdiqlandi!",
    pending: "Arizangiz ko'rib chiqish uchun yuborildi.",
    eventDetails: "Tadbir ma'lumotlari",
    date: "Sana",
    location: "Joylashuv",
    online: "Onlayn",
    ticketCode: "Sizning chipta kodingiz",
    saveTicket: "Ushbu kodni saqlang — kirish uchun kerak bo'ladi.",
    addToCalendar: "Taqvimga qo'shish",
    questions: "Savollaringiz bo'lsa, tashkilotchiga murojaat qiling.",
    organizer: "Tashkilotchi",
    footer: "Bu avtomatik xat. Iltimos, javob bermang.",
  },
};

function formatDate(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US';
  return date.toLocaleDateString(locale, options);
}

function generateICSLink(event: EventData, lang: string): string {
  const title = event.title_i18n_json?.[lang] || event.title_i18n_json?.ru || event.title_i18n_json?.en || 'Event';
  const description = event.description_i18n_json?.[lang] || event.description_i18n_json?.ru || '';
  const location = event.location_value || '';
  
  const startDate = event.start_at ? new Date(event.start_at) : new Date();
  const endDate = event.end_at ? new Date(event.end_at) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  
  const formatICSDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatICSDate(startDate)}/${formatICSDate(endDate)}`,
    details: description,
    location: location,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateQRCodeDataUrl(ticketCode: string): string {
  // Generate QR code using Google Charts API (simple, no dependencies)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketCode)}&format=png&margin=10`;
  return qrUrl;
}

function generateEmailHTML(
  event: EventData,
  registration: RegistrationData,
  owner: OwnerData | null,
  page: PageData | null,
  lang: string,
  baseUrl: string
): string {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const eventTitle = event.title_i18n_json?.[lang] || event.title_i18n_json?.ru || event.title_i18n_json?.en || 'Event';
  const ticketCode = registration.event_tickets?.[0]?.ticket_code || 'N/A';
  const calendarLink = generateICSLink(event, lang);
  const isConfirmed = registration.status === 'confirmed';
  const organizerName = owner?.display_name || owner?.username || 'Organizer';
  const pageUrl = page?.slug ? `${baseUrl}/${page.slug}` : baseUrl;
  const qrCodeUrl = generateQRCodeDataUrl(ticketCode);
  
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">${eventTitle}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
                ${t.greeting}, <strong>${registration.attendee_name}</strong>! 👋
              </p>
              
              <p style="font-size: 16px; color: #333; margin: 0 0 30px 0;">
                ${isConfirmed ? t.confirmed : t.pending}
              </p>
              
              <!-- QR Code and Ticket Box -->
              ${isConfirmed ? `
              <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
                <p style="color: #15803d; font-size: 14px; margin: 0 0 16px 0; font-weight: 500;">${t.ticketCode}</p>
                
                <!-- QR Code -->
                <img src="${qrCodeUrl}" alt="QR Code" width="160" height="160" style="display: block; margin: 0 auto 16px auto; border-radius: 8px;" />
                
                <p style="font-size: 28px; font-weight: 700; color: #166534; margin: 0; letter-spacing: 2px;">${ticketCode}</p>
                <p style="color: #16a34a; font-size: 12px; margin: 12px 0 0 0;">${t.saveTicket}</p>
              </div>
              ` : ''}
              
              <!-- Event Details -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 16px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">${t.eventDetails}</h3>
                
                ${event.start_at ? `
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <span style="font-size: 20px; margin-right: 12px;">📅</span>
                  <div>
                    <p style="margin: 0; font-size: 14px; color: #64748b;">${t.date}</p>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #1e293b; font-weight: 500;">${formatDate(event.start_at, lang)}</p>
                  </div>
                </div>
                ` : ''}
                
                ${event.location_value || event.location_type ? `
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 20px; margin-right: 12px;">📍</span>
                  <div>
                    <p style="margin: 0; font-size: 14px; color: #64748b;">${t.location}</p>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #1e293b; font-weight: 500;">
                      ${event.location_type === 'online' ? t.online : (event.location_value || '')}
                    </p>
                  </div>
                </div>
                ` : ''}
              </div>
              
              <!-- Add to Calendar Button -->
              ${event.start_at ? `
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${calendarLink}" target="_blank" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  📆 ${t.addToCalendar}
                </a>
              </div>
              ` : ''}
              
              <!-- Organizer Info -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
                <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0;">${t.organizer}</p>
                <a href="${pageUrl}" style="color: #6366f1; font-weight: 600; text-decoration: none; font-size: 16px;">
                  ${organizerName}
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                ${t.footer}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { registrationId, eventId, language = 'ru' }: AttendeeEmailRequest = await req.json();

    if (!registrationId || !eventId) {
      throw new Error("Missing required fields: registrationId, eventId");
    }

    // Fetch event data
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("title_i18n_json, description_i18n_json, start_at, end_at, location_type, location_value, timezone, owner_id, page_id")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      console.error("Event not found:", eventError);
      throw new Error("Event not found");
    }

    const eventData = event as EventData;

    // Fetch registration with ticket
    const { data: registration, error: regError } = await supabase
      .from("event_registrations")
      .select("id, attendee_name, attendee_email, status, event_tickets(ticket_code, status)")
      .eq("id", registrationId)
      .single();

    if (regError || !registration) {
      console.error("Registration not found:", regError);
      throw new Error("Registration not found");
    }

    const regData = registration as unknown as RegistrationData;

    // Fetch owner profile
    const { data: owner } = await supabase
      .from("user_profiles")
      .select("display_name, username")
      .eq("id", eventData.owner_id)
      .single();

    // Fetch page for URL
    const { data: page } = await supabase
      .from("pages")
      .select("slug, title")
      .eq("id", eventData.page_id)
      .single();

    // Normalize language - fallback to English if not supported
    const supportedLangs = Object.keys(translations);
    const lang = supportedLangs.includes(language) ? language : 'en';
    const t = translations[lang];
    const eventTitle = eventData.title_i18n_json?.[lang] || eventData.title_i18n_json?.ru || eventData.title_i18n_json?.en || 'Event';
    
    // Base URL for links
    const baseUrl = "https://linkmax.lovable.app";

    const emailHTML = generateEmailHTML(
      eventData,
      regData,
      owner as OwnerData | null,
      page as PageData | null,
      lang,
      baseUrl
    );

    // Send email via Resend
    // NOTE: Using onboarding@resend.dev for testing. Replace with your verified domain.
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "LNKMX Events <onboarding@resend.dev>",
      to: [regData.attendee_email],
      subject: `🎫 ${t.subject} — ${eventTitle}`,
      html: emailHTML,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log("Email sent successfully:", emailResult?.id, "to:", regData.attendee_email);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending attendee email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
