import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Timer configurations for different study levels
const TIMER_CONFIGS = {
  '9-12': { focus: 25, break: 5, longBreak: 15 },
  'NEET': { focus: 45, break: 10, longBreak: 30 },
  'IIT-JEE': { focus: 50, break: 10, longBreak: 30 }
};

interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
}

interface StudyStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  lastStudyDate: string;
}

const StudyTimer = () => {
  const { toast } = useToast();
  
  // Get user profile for timer configuration
  const [userProfile] = useLocalStorage('userProfile', null);
  const config = userProfile ? TIMER_CONFIGS[userProfile.studyLevel as keyof typeof TIMER_CONFIGS] || TIMER_CONFIGS['9-12'] : TIMER_CONFIGS['9-12'];
  
  // Persistent timer state
  const [timer, setTimer] = useLocalStorage<TimerState>('studyTimer', {
    minutes: config.focus,
    seconds: 0,
    isActive: false,
    isBreak: false,
    sessionCount: 0
  });

  // Persistent study stats
  const [studyStats, setStudyStats] = useLocalStorage<StudyStats>('studyStats', {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    lastStudyDate: ''
  });

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      minutes: prev.isBreak ? config.break : config.focus,
      seconds: 0,
      isActive: false
    }));
  }, [config]);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const switchMode = () => {
    const newIsBreak = !timer.isBreak;
    const today = new Date().toISOString().split('T')[0];
    const isLongBreak = timer.sessionCount > 0 && (timer.sessionCount + 1) % 4 === 0;
    const breakDuration = newIsBreak && isLongBreak ? config.longBreak : config.break;
    
    setTimer(prev => ({
      ...prev,
      isBreak: newIsBreak,
      minutes: newIsBreak ? breakDuration : config.focus,
      seconds: 0,
      isActive: false,
      sessionCount: newIsBreak ? prev.sessionCount : prev.sessionCount + 1
    }));

    // Update study stats when completing a focus session
    if (newIsBreak) {
      setStudyStats(prev => {
        const isNewDay = prev.lastStudyDate !== today;
        return {
          totalSessions: prev.totalSessions + 1,
          totalMinutes: prev.totalMinutes + config.focus,
          currentStreak: isNewDay ? (prev.currentStreak + 1) : prev.currentStreak,
          lastStudyDate: today
        };
      });
    }

    const breakType = newIsBreak && timer.sessionCount > 0 && (timer.sessionCount + 1) % 4 === 0 ? "Long Break!" : "Break";
    toast({
      title: newIsBreak ? "Session Complete! 🎉" : "Break Over! 💪",
      description: newIsBreak ? `Great focus session! Take a ${breakType.toLowerCase()}.` : "Ready for another focused session",
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              // Timer finished - auto switch mode
              const newIsBreak = !prev.isBreak;
              const today = new Date().toISOString().split('T')[0];
              const isLongBreak = prev.sessionCount > 0 && (prev.sessionCount + 1) % 4 === 0;
              const breakDuration = newIsBreak && isLongBreak ? config.longBreak : config.break;
              
              // Update stats if completing a focus session
              if (newIsBreak) {
                setStudyStats(prevStats => {
                  const isNewDay = prevStats.lastStudyDate !== today;
                  return {
                    totalSessions: prevStats.totalSessions + 1,
                    totalMinutes: prevStats.totalMinutes + config.focus,
                    currentStreak: isNewDay ? (prevStats.currentStreak + 1) : prevStats.currentStreak,
                    lastStudyDate: today
                  };
                });
              }
              
              const breakType = newIsBreak && isLongBreak ? "Long Break!" : "Break";
              toast({
                title: newIsBreak ? "Session Complete! 🎉" : "Break Over! 💪",
                description: newIsBreak ? `Time for a ${breakType.toLowerCase()}` : "Ready to focus again",
              });
              
              return {
                ...prev,
                minutes: newIsBreak ? breakDuration : config.focus,
                seconds: 0,
                isActive: false,
                isBreak: newIsBreak,
                sessionCount: newIsBreak ? prev.sessionCount + 1 : prev.sessionCount
              };
            }
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isActive, toast]);

  const maxTime = timer.isBreak ? 
    (timer.sessionCount > 0 && timer.sessionCount % 4 === 0 ? config.longBreak : config.break) : 
    config.focus;
  const progress = ((maxTime * 60 - (timer.minutes * 60 + timer.seconds)) / (maxTime * 60)) * 100;

  return (
    <Card className="glass-card p-8 text-center max-w-md mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {timer.isBreak ? (
            <Coffee className="w-6 h-6 text-accent" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary" />
          )}
          <span className="text-lg font-medium text-muted-foreground">
            {timer.isBreak ? 
              (timer.sessionCount > 0 && timer.sessionCount % 4 === 0 ? 'Long Break' : 'Break Time') : 
              `Focus Time (${userProfile?.studyLevel || '9-12'})`
            }
          </span>
        </div>

        <div className="relative">
          {/* Progress ring */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={timer.isBreak ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Timer display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-1">
                  {formatTime(timer.minutes, timer.seconds)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Session {timer.sessionCount + 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`glow-button ${timer.isBreak ? 'bg-accent hover:bg-accent/90' : ''}`}
          >
            {timer.isActive ? (
              <Pause className="w-5 h-5 mr-2" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            {timer.isActive ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        <Button
          onClick={switchMode}
          variant="ghost"
          className="w-full"
        >
          Switch to {timer.isBreak ? 'Focus' : 'Break'} Mode
        </Button>
      </div>
    </Card>
  );
};

export default StudyTimer;