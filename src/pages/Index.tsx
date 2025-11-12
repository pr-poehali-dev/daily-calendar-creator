import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar';
import WeeklySchedule from '@/components/calendar/WeeklySchedule';
import { EventDialog, ScheduleDialog } from '@/components/calendar/EventDialogs';
import { CalendarEvent, ScheduleEvent, EventCategory } from '@/components/calendar/types';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Встреча с командой',
      date: new Date(2025, 10, 15),
      category: 'work',
      description: 'Обсуждение новых проектов'
    },
    {
      id: '2',
      title: 'День рождения мамы',
      date: new Date(2025, 10, 20),
      category: 'important',
      description: 'Не забыть купить подарок'
    },
    {
      id: '3',
      title: 'Поход в кино',
      date: new Date(2025, 10, 18),
      category: 'leisure'
    }
  ]);

  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([
    {
      id: 's1',
      title: 'Йога',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '09:00',
      category: 'personal'
    },
    {
      id: 's2',
      title: 'Рабочая встреча',
      dayOfWeek: 1,
      startTime: '10:00',
      endTime: '11:30',
      category: 'work'
    },
    {
      id: 's3',
      title: 'Английский язык',
      dayOfWeek: 2,
      startTime: '18:00',
      endTime: '19:30',
      category: 'important'
    },
    {
      id: 's4',
      title: 'Тренировка',
      dayOfWeek: 3,
      startTime: '19:00',
      endTime: '20:30',
      category: 'personal'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'personal' as EventCategory,
    description: ''
  });

  const [newScheduleEvent, setNewScheduleEvent] = useState({
    title: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00',
    category: 'personal' as EventCategory,
    description: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedScheduleSlot, setSelectedScheduleSlot] = useState<{ day: number; time: string } | null>(null);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return;
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      category: newEvent.category,
      description: newEvent.description
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: '', category: 'personal', description: '' });
    setIsDialogOpen(false);
  };

  const handleAddScheduleEvent = () => {
    if (!newScheduleEvent.title) return;
    
    const event: ScheduleEvent = {
      id: Date.now().toString(),
      ...newScheduleEvent
    };
    
    setScheduleEvents([...scheduleEvents, event]);
    setNewScheduleEvent({
      title: '',
      dayOfWeek: selectedScheduleSlot?.day || 1,
      startTime: '09:00',
      endTime: '10:00',
      category: 'personal',
      description: ''
    });
    setIsScheduleDialogOpen(false);
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleScheduleSlotClick = (day: number, time: string) => {
    setSelectedScheduleSlot({ day, time });
    setNewScheduleEvent({ ...newScheduleEvent, dayOfWeek: day, startTime: time });
    setIsScheduleDialogOpen(true);
  };

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            Мой Календарь
          </h1>
          <p className="text-muted-foreground text-lg">Планируйте события и расписание занятий</p>
        </header>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Icon name="CalendarClock" size={16} />
              Расписание
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <MonthlyCalendar
              currentDate={currentDate}
              events={events}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              onDateClick={handleDateClick}
              upcomingEvents={upcomingEvents}
            />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <WeeklySchedule
              scheduleEvents={scheduleEvents}
              onScheduleSlotClick={handleScheduleSlotClick}
              onAddSchedule={() => setIsScheduleDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        newEvent={newEvent}
        onEventChange={setNewEvent}
        onAddEvent={handleAddEvent}
      />

      <ScheduleDialog
        isOpen={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        newScheduleEvent={newScheduleEvent}
        onScheduleEventChange={setNewScheduleEvent}
        onAddScheduleEvent={handleAddScheduleEvent}
      />
    </div>
  );
};

export default Index;
