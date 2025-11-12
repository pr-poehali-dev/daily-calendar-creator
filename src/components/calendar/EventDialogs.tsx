import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { EventCategory, categoryColors, categoryLabels } from './types';

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  newEvent: {
    title: string;
    category: EventCategory;
    description: string;
  };
  onEventChange: (event: { title: string; category: EventCategory; description: string }) => void;
  onAddEvent: () => void;
}

interface ScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newScheduleEvent: {
    title: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    category: EventCategory;
    description: string;
  };
  onScheduleEventChange: (event: {
    title: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    category: EventCategory;
    description: string;
  }) => void;
  onAddScheduleEvent: () => void;
}

export const EventDialog = ({
  isOpen,
  onOpenChange,
  selectedDate,
  newEvent,
  onEventChange,
  onAddEvent
}: EventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={(e) => onEventChange({ ...newEvent, title: e.target.value })}
              placeholder="Введите название..."
            />
          </div>

          <div>
            <Label htmlFor="category">Категория</Label>
            <Select
              value={newEvent.category}
              onValueChange={(value: EventCategory) => onEventChange({ ...newEvent, category: value })}
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
              onChange={(e) => onEventChange({ ...newEvent, description: e.target.value })}
              placeholder="Добавьте подробности..."
              rows={3}
            />
          </div>

          <Button onClick={onAddEvent} className="w-full" disabled={!newEvent.title}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить событие
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ScheduleDialog = ({
  isOpen,
  onOpenChange,
  newScheduleEvent,
  onScheduleEventChange,
  onAddScheduleEvent
}: ScheduleDialogProps) => {
  const fullDayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить занятие в расписание</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="schedule-title">Название занятия</Label>
            <Input
              id="schedule-title"
              value={newScheduleEvent.title}
              onChange={(e) => onScheduleEventChange({ ...newScheduleEvent, title: e.target.value })}
              placeholder="Введите название..."
            />
          </div>

          <div>
            <Label htmlFor="day">День недели</Label>
            <Select
              value={newScheduleEvent.dayOfWeek.toString()}
              onValueChange={(value) => onScheduleEventChange({ ...newScheduleEvent, dayOfWeek: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fullDayNames.map((name, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Начало</Label>
              <Input
                id="start-time"
                type="time"
                value={newScheduleEvent.startTime}
                onChange={(e) => onScheduleEventChange({ ...newScheduleEvent, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-time">Конец</Label>
              <Input
                id="end-time"
                type="time"
                value={newScheduleEvent.endTime}
                onChange={(e) => onScheduleEventChange({ ...newScheduleEvent, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="schedule-category">Категория</Label>
            <Select
              value={newScheduleEvent.category}
              onValueChange={(value: EventCategory) => onScheduleEventChange({ ...newScheduleEvent, category: value })}
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

          <Button onClick={onAddScheduleEvent} className="w-full" disabled={!newScheduleEvent.title}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить занятие
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
