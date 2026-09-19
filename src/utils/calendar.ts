import { RFP } from '../types/rfp.js';

export interface ParsedDeadline {
  date: Date | null;
  isValid: boolean;
  rawString: string;
  isPast: boolean;
  formattedDate: string;
  formattedTime: string;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  urgencyLevel: 'expired' | 'critical' | 'urgent' | 'upcoming' | 'distant' | 'unknown';
}

/**
 * Intelligent parser for RFP submission deadline strings.
 * Supports ISO, DD-MM-YYYY, DD/MM/YYYY, natural text ("15 Oct 2026", "October 30, 2026 5:00 PM"),
 * and sets tender closing time to 17:00 (5:00 PM) if time is omitted.
 */
export function parseRfpDeadline(raw?: string | null): ParsedDeadline {
  const fallback: ParsedDeadline = {
    date: null,
    isValid: false,
    rawString: raw || 'Not specified',
    isPast: false,
    formattedDate: 'Date not specified',
    formattedTime: '--:--',
    timeRemaining: { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 },
    urgencyLevel: 'unknown'
  };

  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return fallback;
  }

  const trimmed = raw.trim();
  let parsedDate: Date | null = null;

  // 1. Check for standard ISO formats (e.g. 2026-10-15 or 2026-10-15T17:00:00)
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    if (trimmed.length === 10) {
      // Date only: YYYY-MM-DD -> Set tender closing time to 17:00:00 local time
      const [y, m, d] = trimmed.split('-').map(Number);
      parsedDate = new Date(y, m - 1, d, 17, 0, 0);
    } else {
      parsedDate = new Date(trimmed);
    }
  } 
  // 2. Check for DD/MM/YYYY or DD-MM-YYYY (Common in Indian & multilateral tenders)
  else if (/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/.test(trimmed)) {
    const match = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const hours = match[4] ? parseInt(match[4], 10) : 17; // default 5:00 PM
      const minutes = match[5] ? parseInt(match[5], 10) : 0;
      const seconds = match[6] ? parseInt(match[6], 10) : 0;
      parsedDate = new Date(year, month, day, hours, minutes, seconds);
    }
  }

  // 3. Fallback to native Date parser (handles "Oct 15, 2026", "15 October 2026", etc.)
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    const nativeParsed = new Date(trimmed);
    if (!isNaN(nativeParsed.getTime())) {
      parsedDate = nativeParsed;
      // If native string has no colon (no time specified), default to 17:00
      if (!trimmed.includes(':')) {
        parsedDate.setHours(17, 0, 0, 0);
      }
    }
  }

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    return {
      ...fallback,
      rawString: trimmed
    };
  }

  const now = new Date();
  const diffMs = parsedDate.getTime() - now.getTime();
  const isPast = diffMs <= 0;
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Urgency classification
  let urgencyLevel: ParsedDeadline['urgencyLevel'] = 'upcoming';
  if (isPast) {
    urgencyLevel = 'expired';
  } else if (totalSeconds <= 48 * 3600) {
    // Less than 48 hours
    urgencyLevel = 'critical';
  } else if (days <= 7) {
    // Within 7 days
    urgencyLevel = 'urgent';
  } else if (days <= 14) {
    urgencyLevel = 'upcoming';
  } else {
    urgencyLevel = 'distant';
  }

  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = parsedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return {
    date: parsedDate,
    isValid: true,
    rawString: trimmed,
    isPast,
    formattedDate,
    formattedTime,
    timeRemaining: {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds
    },
    urgencyLevel
  };
}

/**
 * Format Date to UTC iCalendar timestamp (YYYYMMDDTHHMMSSZ)
 */
function toIcsUtcFormat(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Clean and escape text for RFC 5545 iCalendar values
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generate standard RFC 5545 compliant iCalendar (.ics) content
 */
export function generateIcsContent(rfp: RFP, deadlineDate: Date): string {
  const now = new Date();
  const stamp = toIcsUtcFormat(now);

  // Set start time to 1 hour before the deadline for final submission preparation
  const startTime = new Date(deadlineDate.getTime() - 60 * 60 * 1000);
  const dtStart = toIcsUtcFormat(startTime);
  const dtEnd = toIcsUtcFormat(deadlineDate);

  const uid = `rfp-deadline-${rfp.id || 'bid'}-${rfp.rfp_id || 'item'}-${Date.now()}@rfp-intelligence-studio.ai`;
  const summary = escapeIcsText(`[RFP DEADLINE] ${rfp.title}`);
  
  const descriptionLines = [
    `RFP / Tender Submission Deadline: ${rfp.title}`,
    `----------------------------------------------------`,
    `Tender Reference: ${rfp.rfp_id || 'N/A'}`,
    `Client / Funder: ${rfp.client_name || 'Designated Client'}`,
    `Consulting Practice: ${rfp.category || 'Advisory'}`,
    `Geography: ${rfp.location || 'India'}`,
    `Estimated Budget: ${rfp.estimated_cost || rfp.budget_range || 'Not specified'}`,
    rfp.source_url ? `Portal Link: ${rfp.source_url}` : '',
    ``,
    `IMPORTANT SUBMISSION CHECKLIST:`,
    `- Ensure technical proposal and financial envelope are verified against RFP ToR.`,
    `- Verify institutional credentials, empanelment certificates, and partner CV sign-offs.`,
    `- Submit bid at least 3 hours before formal portal cut-off.`
  ].filter(Boolean).join('\n');

  const description = escapeIcsText(descriptionLines);
  const location = escapeIcsText(rfp.location || 'Online Tender Portal');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RFP Intelligence Studio//Proposal Deadline Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'CLASS:PUBLIC',
    'PRIORITY:1',
    // 24-Hour Advance Alert
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: 24 Hours until RFP Bid Submission for ${summary}`,
    'END:VALARM',
    // 2-Hour Advance Alert
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:CRITICAL: 2 Hours until RFP Bid Submission cut-off!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Generate a downloadable .ics data URI link
 */
export function generateIcsDataUri(rfp: RFP, deadlineDate: Date): string {
  const content = generateIcsContent(rfp, deadlineDate);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}

/**
 * Trigger browser download of the .ics calendar file
 */
export function downloadIcsFile(rfp: RFP, deadlineDate: Date): void {
  const icsContent = generateIcsContent(rfp, deadlineDate);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const cleanId = (rfp.rfp_id || `RFP-${rfp.id}`).replace(/[^a-zA-Z0-9-_]/g, '_');
  const filename = `RFP_Deadline_${cleanId}.ics`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate quick Google Calendar direct web link for convenience
 */
export function generateGoogleCalendarUrl(rfp: RFP, deadlineDate: Date): string {
  const startTime = new Date(deadlineDate.getTime() - 60 * 60 * 1000);
  const dtStart = toIcsUtcFormat(startTime);
  const dtEnd = toIcsUtcFormat(deadlineDate);

  const title = encodeURIComponent(`[RFP DEADLINE] ${rfp.title}`);
  const details = encodeURIComponent(
    `Tender Submission Deadline for ${rfp.title}\nClient: ${rfp.client_name}\nRef: ${rfp.rfp_id}\nPractice: ${rfp.category}`
  );
  const location = encodeURIComponent(rfp.location || 'Online Tender Portal');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
}
