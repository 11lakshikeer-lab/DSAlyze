import { useState } from 'react';
import { ArrowLeft, CheckCircle, ArrowRight, Layers, Zap, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import type { User, Screen } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface DSAProgressQueueProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
}

const initialTopics: Topic[] = [
  { id: '1', name: 'Stack (LIFO)', icon: '📚', completed: false },
  { id: '2', name: 'Queue (FIFO)', icon: '🎫', completed: false },
  { id: '3', name: 'Binary Search Tree', icon: '🌳', completed: false },
  { id: '4', name: 'Sorting Algorithms', icon: '📊', completed: false },
];

export function DSAProgressQueue({ user, onNavigate }: DSAProgressQueueProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [lastDequeued, setLastDequeued] = useState<Topic | null>(null);
  const [isDequeuing, setIsDequeuing] = useState(false);

  const currentTopic = topics.find(t => !t.completed);
  const completedCount = topics.filter(t => t.completed).length;
  const totalTopics = topics.length;
  const remainingCount = totalTopics - completedCount;
  const progressPercentage = (completedCount / totalTopics) * 100;

  const handleDequeueTopic = () => {
    if (!currentTopic || isDequeuing) return;
    
    setIsDequeuing(true);
    setLastDequeued(currentTopic);

    // Simulate dequeue animation delay
    setTimeout(() => {
      setTopics(prevTopics =>
        prevTopics.map(t =>
          t.id === currentTopic.id ? { ...t, completed: true } : t
        )
      );
      setIsDequeuing(false);
    }, 600);
  };

  const nextTopic = topics.find(t => !t.completed && t.id !== currentTopic?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
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
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">
                  DSA To-Do List
                </h1>
                <p className="text-sm text-white/60">Track your learning tasks and master data structures</p>
              </div>
            </div>
            <div className="text-sm text-white/60">Welcome, {user.name}</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Topics Dequeued</p>
                  <p className="text-3xl text-white">
                    {completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">In Queue</p>
                  <p className="text-3xl text-white">
                    {remainingCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Layers className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Total Progress</p>
                  <p className="text-3xl text-white">
                    {progressPercentage.toFixed(0)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        <div className="mb-8 space-y-3">
          {lastDequeued && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300">
                <strong>Dequeued:</strong> {lastDequeued.name} ✅
              </span>
            </motion.div>
          )}
          
          {currentTopic && (
            <div className="p-4 bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg flex items-center gap-2">
              <span className="text-2xl">{currentTopic.icon}</span>
              <span className="text-purple-300">
                <strong>Front of Queue:</strong> {currentTopic.name} (Currently Learning)
              </span>
            </div>
          )}
          
          {nextTopic && (
            <div className="p-4 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300">
                <strong>Next in Queue:</strong> {nextTopic.name} →
              </span>
            </div>
          )}
          
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg">
            <p className="text-white/80">
              <strong>{remainingCount} topics</strong> remaining in your DSA to-do list.
            </p>
          </div>
        </div>

        {/* Queue Visualization */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="mb-6">
              <h2 className="text-xl mb-2 text-white">Your DSA To-Do List</h2>
              <p className="text-sm text-white/60 mb-4">
                Complete topics from left to right. Check off each topic as you master it!
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-white/60">Overall Progress:</span>
                <Progress value={progressPercentage} className="flex-1 h-3" />
                <span className="text-sm text-white">
                  {completedCount}/{totalTopics}
                </span>
              </div>
            </div>

            {/* Queue Container */}
            <div className="relative overflow-x-auto pb-4 pt-6 px-4">
              <div className="flex gap-4 min-w-max">
                <AnimatePresence mode="popLayout">
                  {topics.map((topic, index) => {
                    const isCurrent = topic.id === currentTopic?.id;
                    const isCompleted = topic.completed;
                    const isNext = topic.id === nextTopic?.id;
                    
                    return (
                      <motion.div
                        key={topic.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          x: isDequeuing && isCurrent ? -300 : 0,
                        }}
                        exit={{ opacity: 0, scale: 0.8, x: -300 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                        className="relative flex-shrink-0"
                      >
                        <Card
                          className={`w-48 border-2 transition-all ${
                            isCurrent
                              ? 'border-cyan-400 shadow-xl scale-105 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm'
                              : isNext
                              ? 'border-purple-400 bg-purple-500/10 backdrop-blur-sm'
                              : isCompleted
                              ? 'border-emerald-500 bg-emerald-500/10 backdrop-blur-sm opacity-60'
                              : 'border-white/20 bg-white/5 backdrop-blur-sm'
                          }`}
                        >
                          <CardContent className="pt-6 pb-6 text-center relative">
                            {/* Queue Position Badge */}
                            {!isCompleted && (
                              <Badge 
                                variant="outline" 
                                className={`absolute -top-3 -right-3 ${
                                  isCurrent 
                                    ? 'bg-cyan-500 text-white border-cyan-500'
                                    : 'bg-white/10 border-white/20 text-white'
                                }`}
                              >
                                {isCurrent ? 'FRONT' : `Pos ${index - completedCount + 1}`}
                              </Badge>
                            )}
                            
                            {/* Topic Icon */}
                            <div className="text-5xl mb-3">{topic.icon}</div>
                            
                            {/* Topic Name */}
                            <h3 className={`mb-2 ${isCompleted ? 'text-white/40' : 'text-white'}`}>
                              {topic.name}
                            </h3>
                            
                            {/* Status */}
                            {isCompleted && (
                              <div className="flex items-center justify-center gap-1 text-emerald-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Dequeued</span>
                              </div>
                            )}
                            
                            {isCurrent && (
                              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 border-0 text-white mt-2">
                                Learning Now
                              </Badge>
                            )}
                            
                            {isNext && (
                              <Badge variant="outline" className="mt-2 border-purple-400 text-purple-300 bg-purple-500/10">
                                Up Next
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                        
                        {/* Arrow between topics */}
                        {index < topics.length - 1 && !isCompleted && (
                          <div className="absolute top-1/2 -right-7 transform -translate-y-1/2">
                            <ArrowRight className="w-6 h-6 text-white/40" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 text-center">
              {currentTopic ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleDequeueTopic}
                    disabled={isDequeuing}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg px-8 py-6 text-lg text-white"
                    size="lg"
                  >
                    {isDequeuing ? (
                      <>Dequeuing...</>
                    ) : (
                      <>Dequeue Topic: {currentTopic.name}</>
                    )}
                  </Button>
                  <p className="text-sm text-white/60 italic">
                    💪 Keep dequeuing to master DSA!
                  </p>
                </div>
              ) : (
                <div className="p-8 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-lg border-2 border-emerald-500/30">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-2xl mb-2 text-emerald-300">Queue Empty! 🎉</h3>
                  <p className="text-emerald-200 mb-4">
                    Congratulations! You've dequeued all DSA topics!
                  </p>
                  <Button
                    onClick={() => setTopics(initialTopics)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white"
                  >
                    Restart Learning Queue
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Tips */}
        <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl">
          <CardContent className="pt-6">
            <h3 className="mb-3 text-white">📚 Learning Tips</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Focus on the <strong>current topic</strong> before moving to the next</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Each topic builds on previous concepts - complete them in order for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Practice problems and take exams to truly master each topic before checking it off</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Your progress is saved - come back anytime to continue your DSA journey!</span>
              </li>
            </ul>
          </CardContent>
        </Card>
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
