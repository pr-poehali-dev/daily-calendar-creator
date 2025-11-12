import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ScheduleEvent, categoryColors, categoryTextColors } from './types';

interface WeeklyScheduleProps {
  scheduleEvents: ScheduleEvent[];
  onScheduleSlotClick: (day: number, time: string) => void;
  onAddSchedule: () => void;
}

const WeeklySchedule = ({
  scheduleEvents,
  onScheduleSlotClick,
  onAddSchedule
}: WeeklyScheduleProps) => {
  const fullDayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getScheduleEventsForSlot = (day: number, time: string) => {
    return scheduleEvents.filter(event => {
      if (event.dayOfWeek !== day) return false;
      const eventStart = event.startTime;
      const eventEnd = event.endTime;
      return time >= eventStart && time < eventEnd;
    });
  };

  const calculateEventHeight = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return (durationMinutes / 60) * 60;
  };

  return (
    <Card className="p-6 shadow-lg animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Недельное расписание</h2>
        <Button onClick={onAddSchedule}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить занятие
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2">
            <div className="text-sm font-semibold text-muted-foreground p-2">Время</div>
            {[1, 2, 3, 4, 5, 6, 0].map(day => (
              <div key={day} className="text-center font-semibold text-sm p-2">
                {fullDayNames[day]}
              </div>
            ))}
          </div>

          <div className="relative">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 gap-2 border-t border-border">
                <div className="text-sm text-muted-foreground p-2 font-medium">
                  {time}
                </div>
                {[1, 2, 3, 4, 5, 6, 0].map(day => {
                  const slotEvents = getScheduleEventsForSlot(day, time);
                  const isFirstSlot = slotEvents.length > 0 && slotEvents[0].startTime === time;
                  
                  return (
                    <div
                      key={`${day}-${time}`}
                      className="min-h-[60px] relative"
                    >
                      {isFirstSlot ? (
                        slotEvents.map(event => (
                          <div
                            key={event.id}
                            className={`absolute inset-x-0 top-0 p-2 rounded-lg ${categoryColors[event.category]} ${categoryTextColors[event.category]} shadow-md transition-all hover:scale-105 cursor-pointer`}
                            style={{ height: `${calculateEventHeight(event.startTime, event.endTime)}px` }}
                          >
                            <div className="font-semibold text-sm">{event.title}</div>
                            <div className="text-xs opacity-90 mt-1">
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        ))
                      ) : slotEvents.length === 0 ? (
                        <button
                          onClick={() => onScheduleSlotClick(day, time)}
                          className="w-full h-full hover:bg-muted/50 rounded transition-colors"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklySchedule;
