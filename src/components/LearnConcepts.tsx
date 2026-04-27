import { useState } from 'react';
import { BookOpen, ArrowLeft, Layers, ListOrdered, Binary, BarChart4, GitMerge, TrendingUp, CircleDot, ArrowRightLeft, Network } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { User, Screen } from '../App';
import { StackVisualizer } from './visualizers/StackVisualizer';
import { QueueVisualizer } from './visualizers/QueueVisualizer';
import { TreeVisualizer } from './visualizers/TreeVisualizer';
import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { MergeSortTeacher } from './visualizers/MergeSortTeacher';
import { SelectionSortEducational } from './visualizers/SelectionSortEducational';
import { BubbleSortTeacher } from './visualizers/BubbleSortTeacher';
import { InsertionSortTeacher } from './visualizers/InsertionSortTeacher';
import { HeapSortTeacher } from './visualizers/HeapSortTeacher';

interface LearnConceptsProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

type ConceptType = 'stack' | 'queue' | 'tree' | 'sorting' | 'mergesort' | 'selectionsort' | 'bubblesort' | 'insertionsort' | 'heapsort' | null;

const concepts = [
  {
    id: 'stack' as const,
    title: 'Stack (LIFO)',
    description: 'Last In First Out - Learn push, pop, and peek operations',
    icon: Layers,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'queue' as const,
    title: 'Queue (FIFO)',
    description: 'First In First Out - Learn enqueue and dequeue operations',
    icon: ListOrdered,
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'tree' as const,
    title: 'Binary Search Tree',
    description: 'Hierarchical structure - Learn insertion and traversal',
    icon: Binary,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'mergesort' as const,
    title: 'Merge Sort Teacher 🤖',
    description: 'Interactive divide & conquer - Learn with robot guidance',
    icon: GitMerge,
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: 'selectionsort' as const,
    title: 'Selection Sort Teacher 🤖',
    description: 'Watch the robot find minimum elements step-by-step',
    icon: TrendingUp,
    color: 'from-indigo-400 to-blue-500',
  },
  {
    id: 'bubblesort' as const,
    title: 'Bubble Sort Teacher 🤖',
    description: 'Interactive bubble animations with robot guidance',
    icon: CircleDot,
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 'insertionsort' as const,
    title: 'Insertion Sort Teacher 🤖',
    description: 'Watch elements slide into their correct positions',
    icon: ArrowRightLeft,
    color: 'from-violet-400 to-indigo-500',
  },
  {
    id: 'heapsort' as const,
    title: 'Heap Sort Teacher 🤖',
    description: 'Learn sorting using binary heap tree structures',
    icon: Network,
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'sorting' as const,
    title: 'Learn Sorting Yourself',
    description: 'Practice sorting algorithms with interactive controls',
    icon: BarChart4,
    color: 'from-amber-400 to-orange-500',
  },
];

export function LearnConcepts({ user, onNavigate }: LearnConceptsProps) {
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>(null);

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
                onClick={() => selectedConcept ? setSelectedConcept(null) : onNavigate('dashboard')}
                className="gap-2 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">
                  Learn Concepts
                </h1>
                <p className="text-sm text-white/60">Interactive Data Structure Visualizations</p>
              </div>
            </div>
            <div className="text-sm text-white/60">Welcome, {user.name}</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {!selectedConcept ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl text-white mb-2">Choose a Concept to Learn</h2>
              <p className="text-white/60">
                Select a data structure or algorithm to explore its interactive visualization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {concepts.map((concept) => (
                <Card
                  key={concept.id}
                  className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                  onClick={() => setSelectedConcept(concept.id)}
                >
                  <CardHeader>
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${concept.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <concept.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white">{concept.title}</CardTitle>
                    <CardDescription className="text-white/60">{concept.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className={`w-full bg-gradient-to-br ${concept.color} hover:opacity-90 text-white`}
                    >
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div>
            {selectedConcept === 'stack' && <StackVisualizer />}
            {selectedConcept === 'queue' && <QueueVisualizer />}
            {selectedConcept === 'tree' && <TreeVisualizer />}
            {selectedConcept === 'sorting' && <SortingVisualizer />}
            {selectedConcept === 'mergesort' && <MergeSortTeacher />}
            {selectedConcept === 'selectionsort' && <SelectionSortEducational />}
            {selectedConcept === 'bubblesort' && <BubbleSortTeacher />}
            {selectedConcept === 'insertionsort' && <InsertionSortTeacher />}
            {selectedConcept === 'heapsort' && <HeapSortTeacher />}
          </div>
        )}
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
