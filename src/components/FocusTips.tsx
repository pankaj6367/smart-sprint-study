import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, Volume2, Eye, Brain, Coffee } from 'lucide-react';

const FocusTips = () => {
  const tips = [
    {
      category: 'Digital Distractions',
      icon: Smartphone,
      color: 'bg-primary/10 text-primary',
      tips: [
        'Put your phone in another room or in a drawer',
        'Use website blockers during study sessions',
        'Turn off all non-essential notifications',
        'Use app timers to limit social media access'
      ]
    },
    {
      category: 'Environment Setup',
      icon: Eye,
      color: 'bg-accent/10 text-accent',
      tips: [
        'Find a dedicated study space with good lighting',
        'Keep your desk clean and organized',
        'Use noise-canceling headphones or earplugs',
        'Maintain comfortable room temperature (68-72°F)'
      ]
    },
    {
      category: 'Mental Preparation',
      icon: Brain,
      color: 'bg-success/10 text-success',
      tips: [
        'Start with a 2-minute meditation or breathing exercise',
        'Set clear, specific goals for each study session',
        'Review your progress from previous sessions',
        'Use positive self-talk and affirmations'
      ]
    },
    {
      category: 'Break Optimization',
      icon: Coffee,
      color: 'bg-warning/10 text-warning',
      tips: [
        'Take breaks away from your study space',
        'Do light stretching or short walks',
        'Hydrate and have a healthy snack',
        'Avoid screens during break time when possible'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Focus Better</h2>
        <p className="text-muted-foreground">
          Simple strategies to eliminate distractions and maximize your study sessions
        </p>
      </div>

      <div className="grid gap-6">
        {tips.map((section, index) => {
          const IconComponent = section.icon;
          
          return (
            <Card key={index} className="glass-card p-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${section.color} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {section.category}
                  </h3>
                </div>

                <div className="grid gap-3">
                  {section.tips.map((tip, tipIndex) => (
                    <div
                      key={tipIndex}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card p-6 border-primary/20">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            💡 Pro Tip: The 2-Minute Rule
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            If you're struggling to start studying, commit to just 2 minutes. 
            Often, starting is the hardest part, and you'll naturally continue beyond the 2 minutes.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default FocusTips;