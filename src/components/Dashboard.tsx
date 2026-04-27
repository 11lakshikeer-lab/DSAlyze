import { BookOpen, FileText, ClipboardList, BarChart3, LogOut, Clock, CheckCircle, Trophy, Sparkles, Target, Zap, Award, Brain, Code2, ListChecks } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { User, Screen } from '../App';
import { useState } from 'react';

interface DashboardProps {
  user: User;
  onNavigate: (screen: Screen, examId?: string) => void;
  onLogout: () => void;
}

const mockStats = [
  { label: 'Exams Taken', value: '12', icon: CheckCircle, gradient: 'from-cyan-400 to-blue-500' },
  { label: 'Pending Exams', value: '3', icon: Clock, gradient: 'from-purple-400 to-pink-500' },
  { label: 'Average Score', value: '85%', icon: BarChart3, gradient: 'from-emerald-400 to-teal-500' },
];

const navigationItems = [
  { 
    id: 'examSelection' as Screen, 
    label: 'Take Exam', 
    icon: FileText, 
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Start a new assessment'
  },
  { 
    id: 'learnConcepts' as Screen, 
    label: 'Learn Concepts', 
    icon: BookOpen, 
    gradient: 'from-purple-500 to-pink-500',
    description: 'Interactive DSA tutorials'
  },
  { 
    id: 'leaderboard' as Screen, 
    label: 'Leaderboard', 
    icon: Trophy, 
    gradient: 'from-amber-500 to-orange-500',
    description: 'View top performers'
  },
  { 
    id: 'progress' as Screen, 
    label: 'DSA To-Do List', 
    icon: ClipboardList, 
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Track your progress'
  },
];

const features = [
  {
    icon: Brain,
    title: 'Interactive Learning',
    description: 'Visualize complex data structures with interactive animations and step-by-step explanations.',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Target,
    title: 'Adaptive Assessments',
    description: 'Take quizzes tailored to your skill level and track your improvement over time.',
    gradient: 'from-purple-500 to-pink-400'
  },
  {
    icon: Zap,
    title: 'Real-time Progress',
    description: 'Monitor your learning journey with detailed analytics and performance insights.',
    gradient: 'from-emerald-500 to-teal-400'
  },
  {
    icon: Award,
    title: 'Competitive Learning',
    description: 'Compete with peers on the leaderboard and celebrate your achievements.',
    gradient: 'from-amber-500 to-orange-400'
  }
];

const dsaTopics = [
  { name: 'Stacks', icon: Code2, color: 'text-blue-400' },
  { name: 'Queues', icon: ListChecks, color: 'text-purple-400' },
  { name: 'Binary Search Trees', icon: Brain, color: 'text-emerald-400' },
  { name: 'Sorting Algorithms', icon: Zap, color: 'text-amber-400' }
];

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const [activeNav, setActiveNav] = useState<Screen | null>(null);

  const handleNavigate = (screen: Screen) => {
    setActiveNav(screen);
    onNavigate(screen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Side Navigation */}
        <aside className="w-72 border-r border-white/10 backdrop-blur-xl bg-white/5 p-6 flex flex-col">
          {/* Logo & User */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl">DSAlyze</h1>
                <p className="text-sm text-white/60">Data Structure Analyzer</p>
              </div>
            </div>
            
            {/* User Card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <span className="text-white">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/60 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeNav === item.id
                    ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg'
                    : 'hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white">{item.label}</p>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            onClick={onLogout} 
            className="w-full gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 text-sm">Welcome back!</span>
              </div>
              <h2 className="text-white text-3xl mb-2">Dashboard</h2>
              <p className="text-white/60">Track your progress and master data structures & algorithms</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {mockStats.map((stat, index) => (
                <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                        <p className="text-white text-3xl">{stat.value}</p>
                      </div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* About Section */}
            <div className="mb-8">
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl">About DSAlyze</h3>
                      <p className="text-white/60 text-sm">Your companion for mastering data structures</p>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">
                    DSAlyze is an innovative educational platform that transforms the way you learn data structures and algorithms. 
                    Through interactive visualizations, adaptive assessments, and real-time progress tracking, we make complex 
                    concepts intuitive and engaging. Whether you're preparing for technical interviews or strengthening your 
                    computer science fundamentals, DSAlyze provides the tools and insights you need to succeed.
                  </p>

                  {/* DSA Topics */}
                  <div className="mb-6">
                    <h4 className="text-white text-sm mb-3">Core Topics Covered</h4>
                    <div className="flex flex-wrap gap-3">
                      {dsaTopics.map((topic, index) => (
                        <Badge 
                          key={index} 
                          className="px-4 py-2 bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <topic.icon className={`w-4 h-4 mr-2 ${topic.color}`} />
                          <span className="text-white">{topic.name}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg flex-shrink-0 transition-transform group-hover:scale-110`}>
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white mb-1">{feature.title}</h4>
                            <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Guide */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl">Quick Start Guide</h3>
                    <p className="text-white/60 text-sm">Get started in three simple steps</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-3">
                      1
                    </div>
                    <h4 className="text-white mb-2">Learn Concepts</h4>
                    <p className="text-white/60 text-sm">Explore interactive visualizations of data structures</p>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-3">
                      2
                    </div>
                    <h4 className="text-white mb-2">Take Assessments</h4>
                    <p className="text-white/60 text-sm">Test your knowledge with adaptive quizzes</p>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-3">
                      3
                    </div>
                    <h4 className="text-white mb-2">Track Progress</h4>
                    <p className="text-white/60 text-sm">Monitor your growth with detailed analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
