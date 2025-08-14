import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DeadlineItem {
  id: string;
  title: string;
  date: string;
  type: 'homework' | 'project' | 'exam';
  priority: 'low' | 'medium' | 'high';
}

const StudySchedule = () => {
  const { toast } = useToast();
  
  // Persistent deadlines storage
  const [deadlines, setDeadlines] = useLocalStorage<DeadlineItem[]>('studyDeadlines', [
    {
      id: '1',
      title: 'Math Assignment Chapter 5',
      date: '2024-08-20',
      type: 'homework',
      priority: 'medium'
    },
    {
      id: '2',
      title: 'History Research Project',
      date: '2024-08-25',
      type: 'project',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Chemistry Midterm Exam',
      date: '2024-08-30',
      type: 'exam',
      priority: 'high'
    }
  ]);

  const [newItem, setNewItem] = useState({
    title: '',
    date: '',
    type: 'homework' as const,
    priority: 'medium' as const
  });

  const addDeadline = () => {
    if (newItem.title && newItem.date) {
      const deadline: DeadlineItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setDeadlines(prev => [...prev, deadline]);
      setNewItem({ title: '', date: '', type: 'homework', priority: 'medium' });
      toast({
        title: "Deadline Added! 📅",
        description: `${newItem.title} has been added to your schedule.`,
      });
    }
  };

  const removeDeadline = (id: string) => {
    setDeadlines(prev => prev.filter(item => item.id !== id));
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-primary/10 text-primary';
      case 'project': return 'bg-accent/10 text-accent';
      case 'exam': return 'bg-warning/10 text-warning';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const sortedDeadlines = [...deadlines].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Study Schedule</h2>
        <p className="text-muted-foreground">
          Keep track of your deadlines and never miss an assignment
        </p>
      </div>

      {/* Add New Deadline */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Add New Deadline</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment/Task</Label>
              <Input
                id="title"
                placeholder="e.g., Math homework Chapter 3"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Due Date</Label>
              <Input
                id="date"
                type="date"
                value={newItem.date}
                onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                value={newItem.type}
                onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
              >
                <option value="homework">Homework</option>
                <option value="project">Project</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                value={newItem.priority}
                onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as any }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <Button onClick={addDeadline} className="w-full glow-button">
            <Plus className="w-4 h-4 mr-2" />
            Add Deadline
          </Button>
        </div>
      </Card>

      {/* Deadlines List */}
      <div className="space-y-4">
        {sortedDeadlines.length === 0 ? (
          <Card className="glass-card p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No deadlines yet
            </h3>
            <p className="text-muted-foreground">
              Add your first deadline to start organizing your schedule
            </p>
          </Card>
        ) : (
          sortedDeadlines.map((item) => {
            const daysUntil = getDaysUntil(item.date);
            const isOverdue = daysUntil < 0;
            const isDueToday = daysUntil === 0;
            const isDueSoon = daysUntil <= 3 && daysUntil > 0;

            return (
              <Card key={item.id} className="glass-card p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {isOverdue && (
                            <span className="text-destructive font-medium">
                              {Math.abs(daysUntil)} days overdue
                            </span>
                          )}
                          {isDueToday && (
                            <span className="text-warning font-medium">Due today!</span>
                          )}
                          {isDueSoon && (
                            <span className="text-warning font-medium">
                              Due in {daysUntil} days
                            </span>
                          )}
                          {daysUntil > 3 && (
                            <span>In {daysUntil} days</span>
                          )}
                        </span>
                      </div>

                      {(isOverdue || isDueToday || isDueSoon) && (
                        <AlertCircle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => removeDeadline(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudySchedule;