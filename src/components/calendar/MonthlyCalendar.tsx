import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { CalendarEvent, EventCategory, categoryColors, categoryLabels } from './types';

interface MonthlyCalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (day: number) => void;
  upcomingEvents: CalendarEvent[];
}

const MonthlyCalendar = ({
  currentDate,
  events,
  onPreviousMonth,
  onNextMonth,
  onDateClick,
  upcomingEvents
}: MonthlyCalendarProps) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6 shadow-lg animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onPreviousMonth}>
              <Icon name="ChevronLeft" size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
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
                onClick={() => onDateClick(day)}
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
  );
};

export default MonthlyCalendar;
