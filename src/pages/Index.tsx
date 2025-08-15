import { useState } from 'react';
import StudyTimer from '@/components/StudyTimer';
import StudyStats from '@/components/StudyStats';
import StudySchedule from '@/components/StudySchedule';
import FocusTips from '@/components/FocusTips';
import Navigation from '@/components/Navigation';
import OnboardingForm from '@/components/OnboardingForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { GraduationCap } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [userProfile, setUserProfile] = useLocalStorage('userProfile', null);

  const handleOnboardingComplete = (data: any) => {
    setUserProfile(data);
  };

  // Show onboarding if no user profile exists
  if (!userProfile) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <StudyTimer />;
      case 'stats':
        return <StudyStats />;
      case 'schedule':
        return <StudySchedule />;
      case 'tips':
        return <FocusTips />;
      default:
        return <StudyTimer />;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {userProfile.studentName}!
              </h1>
              <p className="text-muted-foreground">
                {userProfile.studyLevel} • Goal: {userProfile.dailyGoal}h daily
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
