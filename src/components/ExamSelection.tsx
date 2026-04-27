import { ArrowLeft, Layers, ListOrdered, Binary, BarChart4, Zap, Target, Flame, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { User, Screen } from '../App';

interface ExamSelectionProps {
  user: User;
  onNavigate: (screen: Screen) => void;
  onSelectExam: (concept: string, difficulty: string) => void;
}

const concepts = [
  {
    id: 'stack',
    title: 'Stack (LIFO)',
    description: 'Test your knowledge of Last In First Out operations',
    icon: Layers,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'queue',
    title: 'Queue (FIFO)',
    description: 'Test your understanding of First In First Out operations',
    icon: ListOrdered,
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'tree',
    title: 'Binary Search Tree',
    description: 'Evaluate your tree structure knowledge',
    icon: Binary,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Test your sorting algorithm understanding',
    icon: BarChart4,
    color: 'from-amber-400 to-orange-500',
  },
];

const difficulties = [
  {
    id: 'easy',
    name: 'Easy',
    icon: Zap,
    color: 'from-green-400 to-emerald-500',
    description: 'Basic concepts and simple problems',
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: Target,
    color: 'from-orange-400 to-amber-500',
    description: 'Intermediate level questions',
  },
  {
    id: 'hard',
    name: 'Hard',
    icon: Flame,
    color: 'from-red-400 to-rose-500',
    description: 'Advanced and challenging problems',
  },
];

export function ExamSelection({ user, onNavigate, onSelectExam }: ExamSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="gap-2 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Select Your Exam</h1>
                  <p className="text-sm text-white/60">Choose a concept and difficulty level</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-white/60">Welcome, {user.name}</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl text-white mb-2">Available Exams</h2>
          <p className="text-white/60">
            Each exam contains 15 questions. Select a concept and choose your difficulty level.
          </p>
        </div>

        <div className="space-y-6">
          {concepts.map((concept) => (
            <Card key={concept.id} className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${concept.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <concept.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{concept.title}</CardTitle>
                    <CardDescription className="text-white/60">{concept.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map((difficulty) => (
                    <Card
                      key={difficulty.id}
                      className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer group"
                      onClick={() => onSelectExam(concept.id, difficulty.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${difficulty.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg transition-transform group-hover:scale-110`}
                          >
                            <difficulty.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="mb-1 text-white">{difficulty.name}</h3>
                          <p className="text-sm text-white/60 mb-4">
                            {difficulty.description}
                          </p>
                          <Badge className="mb-2 bg-white/10 border-white/20 text-white">15 Questions</Badge>
                          <Button
                            className={`w-full mt-2 bg-gradient-to-br ${difficulty.color} hover:opacity-90 group-hover:shadow-lg transition-all text-white`}
                          >
                            Start Exam
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

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
