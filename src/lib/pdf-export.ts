/**
 * PDF Export utility for event registrations with analytics charts
 * Uses jsPDF for generating PDF files with tables and charts
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import type { EventFormField } from '@/types/page';

interface Registration {
  id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string | null;
  answers_json: Record<string, unknown> | null;
  status: string;
  payment_status: string;
  created_at: string;
  event_tickets?: Array<{
    ticket_code: string;
    status: string;
    checked_in_at: string | null;
  }> | null;
}

interface EventAnalytics {
  total: number;
  confirmed: number;
  pending: number;
  rejected: number;
  checkedIn: number;
  dailyRegistrations: Array<{ date: string; count: number }>;
  statusBreakdown: Array<{ status: string; count: number; percentage: number }>;
  answerStats?: Array<{
    fieldId: string;
    fieldLabel: string;
    type: 'choice' | 'text' | 'number';
    options?: Array<{ label: string; count: number; percentage: number }>;
  }>;
}

interface PDFExportOptions {
  eventTitle: string;
  eventDate?: string;
  eventLocation?: string;
  registrations: Registration[];
  analytics: EventAnalytics;
  formFields?: EventFormField[];
  language: SupportedLanguage;
  includeAnalytics?: boolean;
  includeRegistrationsList?: boolean;
}

// Colors for charts
const CHART_COLORS = [
  [59, 130, 246],   // Blue
  [16, 185, 129],   // Green
  [245, 158, 11],   // Amber
  [239, 68, 68],    // Red
  [139, 92, 246],   // Purple
  [236, 72, 153],   // Pink
  [6, 182, 212],    // Cyan
  [249, 115, 22],   // Orange
];

/**
 * Export event data to PDF with analytics charts
 */
export function exportEventToPDF({
  eventTitle,
  eventDate,
  eventLocation,
  registrations,
  analytics,
  formFields = [],
  language,
  includeAnalytics = true,
  includeRegistrationsList = true,
}: PDFExportOptions): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(eventTitle, margin, yPos);
  yPos += 10;

  // Event info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  if (eventDate) {
    doc.text(`📅 ${eventDate}`, margin, yPos);
    yPos += 5;
  }
  if (eventLocation) {
    doc.text(`📍 ${eventLocation}`, margin, yPos);
    yPos += 5;
  }
  doc.text(`📊 ${getLabel('exportDate', language)}: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, margin, yPos);
  yPos += 15;

  // Summary stats
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text(getLabel('summary', language), margin, yPos);
  yPos += 10;

  // Stats cards
  const statsCardWidth = (pageWidth - margin * 2 - 15) / 4;
  drawStatCard(doc, margin, yPos, statsCardWidth, analytics.total, getLabel('total', language), [59, 130, 246]);
  drawStatCard(doc, margin + statsCardWidth + 5, yPos, statsCardWidth, analytics.confirmed, getLabel('confirmed', language), [16, 185, 129]);
  drawStatCard(doc, margin + (statsCardWidth + 5) * 2, yPos, statsCardWidth, analytics.pending, getLabel('pending', language), [245, 158, 11]);
  drawStatCard(doc, margin + (statsCardWidth + 5) * 3, yPos, statsCardWidth, analytics.checkedIn, getLabel('checkedIn', language), [139, 92, 246]);
  yPos += 30;

  if (includeAnalytics && analytics.statusBreakdown.length > 0) {
    // Status pie chart
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(getLabel('statusDistribution', language), margin, yPos);
    yPos += 5;

    const pieSize = 40;
    const pieX = margin + pieSize;
    const pieY = yPos + pieSize;
    
    drawPieChart(doc, pieX, pieY, pieSize, analytics.statusBreakdown.map((s, i) => ({
      value: s.count,
      label: translateStatus(s.status, language),
      color: CHART_COLORS[i % CHART_COLORS.length],
    })));

    // Legend
    let legendY = yPos + 10;
    analytics.statusBreakdown.forEach((stat, i) => {
      const color = CHART_COLORS[i % CHART_COLORS.length];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(margin + pieSize * 2 + 20, legendY - 3, 8, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`${translateStatus(stat.status, language)}: ${stat.count} (${stat.percentage.toFixed(1)}%)`, margin + pieSize * 2 + 32, legendY + 2);
      legendY += 12;
    });

    yPos += pieSize * 2 + 10;
  }

  // Form field analytics (like Google Forms)
  if (includeAnalytics && analytics.answerStats && analytics.answerStats.length > 0) {
    for (const fieldStat of analytics.answerStats) {
      // Check if we need a new page
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text(fieldStat.fieldLabel, margin, yPos);
      yPos += 8;

      if (fieldStat.type === 'choice' && fieldStat.options) {
        // Bar chart for choice fields
        const barHeight = 12;
        const maxBarWidth = pageWidth - margin * 2 - 60;
        const maxCount = Math.max(...fieldStat.options.map(o => o.count), 1);

        fieldStat.options.forEach((option, i) => {
          const barWidth = (option.count / maxCount) * maxBarWidth;
          const color = CHART_COLORS[i % CHART_COLORS.length];

          // Bar
          doc.setFillColor(color[0], color[1], color[2]);
          doc.roundedRect(margin, yPos, Math.max(barWidth, 2), barHeight - 2, 2, 2, 'F');

          // Label
          doc.setFontSize(8);
          doc.setTextColor(60, 60, 60);
          const labelText = `${option.label}: ${option.count} (${option.percentage.toFixed(1)}%)`;
          doc.text(labelText, margin + 5, yPos + barHeight - 5);

          yPos += barHeight + 2;
        });
        yPos += 10;
      }
    }
  }

  // Registrations list
  if (includeRegistrationsList && registrations.length > 0) {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(getLabel('registrationsList', language), margin, yPos);
    yPos += 8;

    // Build table headers
    const headers = [
      getLabel('name', language),
      'Email',
      getLabel('phone', language),
      getLabel('status', language),
      getLabel('ticket', language),
      getLabel('date', language),
    ];

    // Build table rows
    const rows = registrations.map(reg => {
      const ticket = reg.event_tickets?.[0];
      return [
        reg.attendee_name,
        reg.attendee_email,
        reg.attendee_phone || '-',
        translateStatus(reg.status, language),
        ticket?.ticket_code || '-',
        format(new Date(reg.created_at), 'dd.MM.yyyy HH:mm'),
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [headers],
      body: rows,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: margin, right: margin },
    });
  }

  // Save the PDF
  const safeTitle = eventTitle.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_').slice(0, 30);
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  doc.save(`${safeTitle}_report_${dateStr}.pdf`);
}

/**
 * Draw a stat card
 */
function drawStatCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  value: number,
  label: string,
  color: number[]
): void {
  // Background
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x, y, width, 20, 3, 3, 'F');

  // Value
  doc.setFontSize(16);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(value.toString(), x + width / 2, y + 10, { align: 'center' });

  // Label
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(label, x + width / 2, y + 17, { align: 'center' });
}

/**
 * Draw a simple pie chart
 */
function drawPieChart(
  doc: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  data: Array<{ value: number; label: string; color: number[] }>
): void {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return;

  let startAngle = -Math.PI / 2; // Start from top

  data.forEach(({ value, color }) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    doc.setFillColor(color[0], color[1], color[2]);
    
    // Create pie slice path
    const segments = 50;
    const points: [number, number][] = [[cx, cy]];
    
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (i / segments) * sliceAngle;
      points.push([
        cx + radius * Math.cos(angle),
        cy + radius * Math.sin(angle),
      ]);
    }
    
    // Draw as filled polygon
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    
    // Use lines to draw pie slice
    const x = points.map(p => p[0]);
    const y = points.map(p => p[1]);
    
    doc.lines(
      points.slice(1).map((p, i) => [p[0] - points[i][0], p[1] - points[i][1]]),
      points[0][0],
      points[0][1],
      [1, 1],
      'F'
    );

    startAngle = endAngle;
  });
}

/**
 * Calculate analytics from registrations
 */
export function calculateEventAnalytics(
  registrations: Registration[],
  formFields: EventFormField[] = [],
  language: SupportedLanguage
): EventAnalytics {
  const total = registrations.length;
  const confirmed = registrations.filter(r => r.status === 'confirmed').length;
  const pending = registrations.filter(r => r.status === 'pending').length;
  const rejected = registrations.filter(r => r.status === 'rejected' || r.status === 'cancelled').length;
  const checkedIn = registrations.filter(r => r.event_tickets?.[0]?.status === 'used').length;

  // Status breakdown
  const statusCounts = new Map<string, number>();
  registrations.forEach(r => {
    statusCounts.set(r.status, (statusCounts.get(r.status) || 0) + 1);
  });
  const statusBreakdown = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));

  // Daily registrations
  const dailyCounts = new Map<string, number>();
  registrations.forEach(r => {
    const date = format(new Date(r.created_at), 'dd.MM');
    dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
  });
  const dailyRegistrations = Array.from(dailyCounts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Form field answer statistics (like Google Forms)
  const answerStats: EventAnalytics['answerStats'] = [];
  
  const choiceFields = formFields.filter(f => 
    ['radio', 'checkbox', 'select', 'dropdown'].includes(f.type) && f.options?.length
  );

  choiceFields.forEach(field => {
    const fieldLabel = getTranslatedString(field.label_i18n, language) || field.id;
    const optionCounts = new Map<string, number>();
    
    // Initialize all options with 0
    field.options?.forEach(opt => {
      optionCounts.set(opt.id, 0);
    });

    // Count answers
    registrations.forEach(reg => {
      const answer = reg.answers_json?.[field.id];
      if (Array.isArray(answer)) {
        answer.forEach(a => optionCounts.set(a as string, (optionCounts.get(a as string) || 0) + 1));
      } else if (answer) {
        optionCounts.set(answer as string, (optionCounts.get(answer as string) || 0) + 1);
      }
    });

    const totalAnswers = registrations.filter(r => r.answers_json?.[field.id]).length;
    const options = field.options?.map(opt => {
      const count = optionCounts.get(opt.id) || 0;
      return {
        label: getTranslatedString(opt.label_i18n, language) || opt.id,
        count,
        percentage: totalAnswers > 0 ? (count / totalAnswers) * 100 : 0,
      };
    }).sort((a, b) => b.count - a.count);

    answerStats.push({
      fieldId: field.id,
      fieldLabel,
      type: 'choice',
      options,
    });
  });

  return {
    total,
    confirmed,
    pending,
    rejected,
    checkedIn,
    dailyRegistrations,
    statusBreakdown,
    answerStats,
  };
}

function translateStatus(status: string, lang: SupportedLanguage): string {
  const translations: Record<string, Record<SupportedLanguage, string>> = {
    pending: { ru: 'Ожидает', en: 'Pending', kk: 'Күтуде' },
    confirmed: { ru: 'Подтверждён', en: 'Confirmed', kk: 'Расталды' },
    rejected: { ru: 'Отклонён', en: 'Rejected', kk: 'Қабылданбады' },
    cancelled: { ru: 'Отменён', en: 'Cancelled', kk: 'Болдырылмады' },
  };
  return translations[status]?.[lang] || status;
}

function getLabel(key: string, lang: SupportedLanguage): string {
  const labels: Record<string, Record<SupportedLanguage, string>> = {
    exportDate: { ru: 'Дата экспорта', en: 'Export date', kk: 'Экспорт күні' },
    summary: { ru: 'Сводка', en: 'Summary', kk: 'Жиынтық' },
    total: { ru: 'Всего', en: 'Total', kk: 'Барлығы' },
    confirmed: { ru: 'Подтв.', en: 'Confirmed', kk: 'Расталды' },
    pending: { ru: 'Ожидает', en: 'Pending', kk: 'Күтуде' },
    checkedIn: { ru: 'Check-in', en: 'Check-in', kk: 'Check-in' },
    statusDistribution: { ru: 'Распределение по статусам', en: 'Status Distribution', kk: 'Мәртебе бойынша бөлу' },
    registrationsList: { ru: 'Список регистраций', en: 'Registrations List', kk: 'Тіркеулер тізімі' },
    name: { ru: 'Имя', en: 'Name', kk: 'Аты' },
    phone: { ru: 'Телефон', en: 'Phone', kk: 'Телефон' },
    status: { ru: 'Статус', en: 'Status', kk: 'Мәртебе' },
    ticket: { ru: 'Билет', en: 'Ticket', kk: 'Билет' },
    date: { ru: 'Дата', en: 'Date', kk: 'Күні' },
  };
  return labels[key]?.[lang] || key;
}
