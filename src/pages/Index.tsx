import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type EventCategory = 'work' | 'personal' | 'important' | 'leisure';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  category: EventCategory;
  description?: string;
}

const categoryColors: Record<EventCategory, string> = {
  work: 'bg-[hsl(var(--work))]',
  personal: 'bg-[hsl(var(--personal))]',
  important: 'bg-[hsl(var(--important))]',
  leisure: 'bg-[hsl(var(--leisure))]'
};

const categoryLabels: Record<EventCategory, string> = {
  work: 'Работа',
  personal: 'Личное',
  important: 'Важное',
  leisure: 'Отдых'
};

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
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'personal' as EventCategory,
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
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

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            Мой Календарь
          </h1>
          <p className="text-muted-foreground text-lg">Планируйте свои события с цветовыми категориями</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 shadow-lg animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <Icon name="ChevronLeft" size={20} />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <Icon name="ChevronRight" size={20} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDate(day);
                const isToday = 
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square p-2 rounded-lg border-2 transition-all hover:scale-105 hover:shadow-md ${
                      isToday 
                        ? 'border-primary bg-primary/10 font-bold' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm mb-1">{day}</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`w-1.5 h-1.5 rounded-full ${categoryColors[event.category]}`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="space-y-6 animate-slide-up">
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Ближайшие события</h3>
                <Icon name="Bell" size={20} className="text-primary" />
              </div>
              
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Нет предстоящих событий</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-1 h-full rounded-full ${categoryColors[event.category]}`} />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {event.date.toLocaleDateString('ru-RU', { 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Категории</h3>
              <div className="space-y-2">
                {(Object.keys(categoryLabels) as EventCategory[]).map(category => (
                  <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${categoryColors[category]}`} />
                      <span className="font-medium">{categoryLabels[category]}</span>
                    </div>
                    <Badge variant="secondary">
                      {events.filter(e => e.category === category).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Добавить событие
              {selectedDate && (
                <span className="block text-sm font-normal text-muted-foreground mt-1">
                  {selectedDate.toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Название события</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Введите название..."
              />
            </div>

            <div>
              <Label htmlFor="category">Категория</Label>
              <Select
                value={newEvent.category}
                onValueChange={(value: EventCategory) => setNewEvent({ ...newEvent, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as EventCategory[]).map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${categoryColors[category]}`} />
                        {categoryLabels[category]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Описание (необязательно)</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Добавьте подробности..."
                rows={3}
              />
            </div>

            <Button onClick={handleAddEvent} className="w-full" disabled={!newEvent.title}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить событие
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
