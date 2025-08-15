import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, BookOpen, Target, Zap } from 'lucide-react';

const formSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  studyLevel: z.enum(['9-12', 'NEET', 'IIT-JEE'], {
    required_error: "Please select your study level",
  }),
  currentClass: z.string().optional(),
  dailyGoal: z.string().min(1, "Please set a daily study goal"),
});

type FormData = z.infer<typeof formSchema>;

interface OnboardingFormProps {
  onComplete: (data: FormData) => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      studyLevel: undefined,
      currentClass: '',
      dailyGoal: '2',
    },
  });

  const onSubmit = (data: FormData) => {
    onComplete(data);
  };

  const studyLevel = form.watch('studyLevel');

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center">
      <Card className="w-full max-w-lg glass-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome to Study Timer</CardTitle>
              <CardDescription>Let's customize your study experience</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Your Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Study Level
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-3"
                      >
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="9-12" id="9-12" />
                          <Label htmlFor="9-12" className="flex-1 cursor-pointer">
                            <div className="font-medium">Class 9-12</div>
                            <div className="text-sm text-muted-foreground">School level studies</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="NEET" id="NEET" />
                          <Label htmlFor="NEET" className="flex-1 cursor-pointer">
                            <div className="font-medium">NEET Preparation</div>
                            <div className="text-sm text-muted-foreground">Medical entrance exam</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="IIT-JEE" id="IIT-JEE" />
                          <Label htmlFor="IIT-JEE" className="flex-1 cursor-pointer">
                            <div className="font-medium">IIT-JEE Preparation</div>
                            <div className="text-sm text-muted-foreground">Engineering entrance exam</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {studyLevel === '9-12' && (
                <FormField
                  control={form.control}
                  name="currentClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                          <SelectItem value="11">Class 11</SelectItem>
                          <SelectItem value="12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="dailyGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Daily Study Goal (hours)
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select daily goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="10">10 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Start My Study Journey
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}