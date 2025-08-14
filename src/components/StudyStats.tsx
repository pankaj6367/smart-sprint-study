import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target, Flame, Clock, TrendingUp } from 'lucide-react';

interface StudyData {
  dailyGoal: number;
  sessionsToday: number;
  currentStreak: number;
  totalMinutes: number;
}

const StudyStats = () => {
  const [stats, setStats] = useState<StudyData>({
    dailyGoal: 4,
    sessionsToday: 2,
    currentStreak: 5,
    totalMinutes: 50
  });

  const [newGoal, setNewGoal] = useState(stats.dailyGoal.toString());

  const updateGoal = () => {
    const goal = parseInt(newGoal);
    if (goal > 0 && goal <= 20) {
      setStats(prev => ({ ...prev, dailyGoal: goal }));
    }
  };

  const progressPercentage = Math.min((stats.sessionsToday / stats.dailyGoal) * 100, 100);
  const isGoalReached = stats.sessionsToday >= stats.dailyGoal;

  return (
    <div className="space-y-6">
      {/* Daily Goal Progress */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Daily Goal</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {stats.sessionsToday} / {stats.dailyGoal} sessions
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-3"
            />
            
            {isGoalReached && (
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success-light text-success text-sm font-medium">
                  🎉 Goal Achieved!
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <div className="flex-1">
              <Label htmlFor="goal" className="text-sm text-muted-foreground">
                Sessions per day
              </Label>
              <Input
                id="goal"
                type="number"
                min="1"
                max="20"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={updateGoal}
              variant="outline"
              className="self-end"
            >
              Update
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center mx-auto">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">
              Day Streak
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalMinutes}
            </div>
            <div className="text-sm text-muted-foreground">
              Minutes Today
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-success-light flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.sessionsToday}
            </div>
            <div className="text-sm text-muted-foreground">
              Sessions Done
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudyStats;