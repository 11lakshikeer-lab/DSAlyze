import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Flag, BookOpen, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { User, Screen } from '../App';
import { getQuestions, type Question } from './QuestionBank';

interface ExamInterfaceProps {
  concept: string;
  difficulty: string;
  user: User;
  onNavigate: (screen: Screen) => void;
}

interface NavigationStackItem {
  questionIndex: number;
  timestamp: number;
}

const conceptTitles: Record<string, string> = {
  stack: 'Stack (LIFO)',
  queue: 'Queue (FIFO)',
  tree: 'Binary Search Tree',
  sorting: 'Sorting Algorithms',
};

export function ExamInterface({ concept, difficulty, user, onNavigate }: ExamInterfaceProps) {
  const questions = getQuestions(concept, difficulty);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [navigationStack, setNavigationStack] = useState<NavigationStackItem[]>([{ questionIndex: 0, timestamp: Date.now() }]);
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((Object.keys(answers).length / questions.length) * 100);

  // Stack-based navigation - push to stack when navigating forward
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setNavigationStack([...navigationStack, { questionIndex: newIndex, timestamp: Date.now() }]);
      setCurrentQuestionIndex(newIndex);
    }
  };

  // Stack-based navigation - pop from stack when going back
  const handlePrevious = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop(); // Remove current position
      const previousItem = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setCurrentQuestionIndex(previousItem.questionIndex);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: parseInt(value),
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    const score = questions.reduce((acc, q, idx) => {
      return answers[q.id] === q.correctAnswer ? acc + 1 : acc;
    }, 0);
    const percentage = (score / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <Card className="w-full max-w-2xl border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative z-10">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/50">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl text-white mb-2">Exam Submitted Successfully!</h2>
            <p className="text-white/60 mb-2">
              {conceptTitles[concept]} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
            </p>
            <p className="text-white/60 mb-8">Your answers have been added to the grading queue</p>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-8 mb-6 border border-purple-500/30 backdrop-blur-sm">
              <p className="text-sm text-white/60 mb-2">Your Score</p>
              <p className="text-5xl mb-2 text-white">
                {percentage.toFixed(0)}%
              </p>
              <p className="text-white/60">{score} out of {questions.length} correct</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <p className="text-sm text-white/60 mb-1">Questions Answered</p>
                <p className="text-xl text-white">{Object.keys(answers).length}/{questions.length}</p>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <p className="text-sm text-white/60 mb-1">Navigation History</p>
                <p className="text-xl text-white">{navigationStack.length} steps</p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('dashboard')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg text-white"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>

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
              <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')} className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">
                  {conceptTitles[concept]} Exam
                </h1>
                <p className="text-sm text-white/60">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} • Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-red-400">{formatTime(timeRemaining)}</span>
              </div>
              <Badge variant="outline" className="gap-1 bg-white/5 border-white/20 text-white">
                <Flag className="w-3 h-3" />
                Stack Depth: {navigationStack.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Progress</span>
            <span className="text-sm text-white/60">{Object.keys(answers).length}/{questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl mb-6">
          <CardContent className="pt-8">
            <div className="mb-6">
              <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
                Question {currentQuestionIndex + 1}
              </Badge>
              <h2 className="text-xl text-white mb-6">{currentQuestion.text}</h2>
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      answers[currentQuestion.id] === index
                        ? 'border-cyan-400 bg-cyan-500/10 backdrop-blur-sm'
                        : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-white">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Navigation - Stack Behavior Visualized */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={navigationStack.length <= 1}
            className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous (Pop Stack)
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex >= questions.length - 1}
            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg text-white"
          >
            Next (Push Stack)
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Question Navigator */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl mb-6">
          <CardContent className="pt-6">
            <p className="text-sm text-white/60 mb-3">Quick Navigation</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setNavigationStack([...navigationStack, { questionIndex: index, timestamp: Date.now() }]);
                    setCurrentQuestionIndex(index);
                  }}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    index === currentQuestionIndex
                      ? 'border-cyan-400 bg-cyan-500 text-white'
                      : answers[q.id] !== undefined
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                      : 'border-white/20 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg text-white"
          size="lg"
        >
          Submit Exam
        </Button>
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
