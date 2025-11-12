export type EventCategory = 'work' | 'personal' | 'important' | 'leisure';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  category: EventCategory;
  description?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category: EventCategory;
  description?: string;
}

export const categoryColors: Record<EventCategory, string> = {
  work: 'bg-[hsl(var(--work))]',
  personal: 'bg-[hsl(var(--personal))]',
  important: 'bg-[hsl(var(--important))]',
  leisure: 'bg-[hsl(var(--leisure))]'
};

export const categoryTextColors: Record<EventCategory, string> = {
  work: 'text-white',
  personal: 'text-white',
  important: 'text-white',
  leisure: 'text-white'
};

export const categoryLabels: Record<EventCategory, string> = {
  work: 'Работа',
  personal: 'Личное',
  important: 'Важное',
  leisure: 'Отдых'
};
