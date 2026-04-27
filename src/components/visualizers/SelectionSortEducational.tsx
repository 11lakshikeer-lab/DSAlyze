import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Play, SkipForward, RotateCcw, Pause } from 'lucide-react';

interface SortStep {
  array: number[];
  currentIndex: number;
  minIndex: number;
  comparingIndex: number;
  sortedCount: number;
  description: string;
  action: 'searching' | 'found-min' | 'swapping' | 'complete';
}

const INITIAL_ARRAY = [5, 2, 8, 1, 3];

const BAR_COLORS = [
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-amber-400 to-yellow-500',
  'from-emerald-400 to-teal-500',
];

export function SelectionSortEducational() {
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const generateSteps = (arr: number[]): SortStep[] => {
    const allSteps: SortStep[] = [];
    const workArray = [...arr];
    const n = workArray.length;

    // Initial state
    allSteps.push({
      array: [...workArray],
      currentIndex: -1,
      minIndex: -1,
      comparingIndex: -1,
      sortedCount: 0,
      description: 'Starting Selection Sort! We will find the minimum element in each pass.',
      action: 'searching',
    });

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      // Show starting the pass
      allSteps.push({
        array: [...workArray],
        currentIndex: i,
        minIndex: i,
        comparingIndex: -1,
        sortedCount: i,
        description: `Pass ${i + 1}: Starting at index ${i}. Current minimum is ${workArray[i]}.`,
        action: 'searching',
      });

      // Compare with rest of the array
      for (let j = i + 1; j < n; j++) {
        allSteps.push({
          array: [...workArray],
          currentIndex: i,
          minIndex: minIndex,
          comparingIndex: j,
          sortedCount: i,
          description: `Comparing ${workArray[j]} with current minimum ${workArray[minIndex]}.`,
          action: 'searching',
        });

        if (workArray[j] < workArray[minIndex]) {
          minIndex = j;
          allSteps.push({
            array: [...workArray],
            currentIndex: i,
            minIndex: minIndex,
            comparingIndex: j,
            sortedCount: i,
            description: `Found new minimum! ${workArray[minIndex]} is now the smallest.`,
            action: 'found-min',
          });
        }
      }

      // Swap if needed
      if (minIndex !== i) {
        allSteps.push({
          array: [...workArray],
          currentIndex: i,
          minIndex: minIndex,
          comparingIndex: -1,
          sortedCount: i,
          description: `Pass ${i + 1}: Swapping ${workArray[i]} with ${workArray[minIndex]}.`,
          action: 'swapping',
        });

        [workArray[i], workArray[minIndex]] = [workArray[minIndex], workArray[i]];

        allSteps.push({
          array: [...workArray],
          currentIndex: i,
          minIndex: i,
          comparingIndex: -1,
          sortedCount: i + 1,
          description: `Swapped! ${workArray[i]} is now in its correct position.`,
          action: 'swapping',
        });
      } else {
        allSteps.push({
          array: [...workArray],
          currentIndex: i,
          minIndex: i,
          comparingIndex: -1,
          sortedCount: i + 1,
          description: `${workArray[i]} is already in the correct position. No swap needed.`,
          action: 'swapping',
        });
      }
    }

    // Final state
    allSteps.push({
      array: [...workArray],
      currentIndex: -1,
      minIndex: -1,
      comparingIndex: -1,
      sortedCount: n,
      description: '🎉 Array is completely sorted!',
      action: 'complete',
    });

    return allSteps;
  };

  const handleStart = () => {
    const newSteps = generateSteps(INITIAL_ARRAY);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (steps.length === 0) {
      handleStart();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentState = steps[currentStep];

  // Robot component
  const Robot = ({ action, message }: { action: string; message: string }) => {
    return (
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="text-7xl"
          animate={{
            scale: action === 'complete' ? [1, 1.2, 1] : 1,
            rotate: action === 'swapping' ? [-10, 10, -10, 0] : 0,
            y: action === 'found-min' ? [0, -10, 0] : 0,
          }}
          transition={{
            duration: action === 'complete' ? 0.6 : 0.8,
            repeat: action === 'complete' ? Infinity : 0,
          }}
        >
          🤖
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-xl p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 relative shadow-xl"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white/20"></div>
            <p className="text-white/95 text-center">{message}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl text-white mb-3"
          >
            Selection Sort Visualization
          </motion.h1>
          <p className="text-white/70 text-lg">
            Watch how the algorithm finds the minimum element in each pass
          </p>
        </div>

        {/* Control Panel */}
        <Card className="p-5 bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {steps.length === 0 && (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-6"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Visualization
              </Button>
            )}

            {steps.length > 0 && (
              <>
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Auto Play
                    </>
                  )}
                </Button>

                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={currentStep >= steps.length - 1}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  Next Step
                  <SkipForward className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-white/70 text-sm">Speed:</span>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value={2500} className="bg-gray-800 text-white">Slow</option>
                    <option value={1500} className="bg-gray-800 text-white">Normal</option>
                    <option value={800} className="bg-gray-800 text-white">Fast</option>
                  </select>
                </div>

                <Badge variant="outline" className="border-white/30 text-white text-base px-4 py-2">
                  Step {currentStep + 1} / {steps.length}
                </Badge>
              </>
            )}
          </div>
        </Card>

        {/* Main Visualization */}
        {currentState && (
          <div className="space-y-8">
            {/* Robot Teacher */}
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              <Robot action={currentState.action} message={currentState.description} />
            </Card>

            {/* Array Visualization */}
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                  <span className="text-white/80 text-sm">Sorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-400"></div>
                  <span className="text-white/80 text-sm">Current Minimum</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-400"></div>
                  <span className="text-white/80 text-sm">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-400"></div>
                  <span className="text-white/80 text-sm">Current Position</span>
                </div>
              </div>

              {/* Array Bars */}
              <div className="flex justify-center items-end gap-4 h-64 px-4">
                {currentState.array.map((value, idx) => {
                  const isSorted = idx < currentState.sortedCount;
                  const isMin = idx === currentState.minIndex && !isSorted;
                  const isComparing = idx === currentState.comparingIndex;
                  const isCurrent = idx === currentState.currentIndex && !isSorted;

                  let barColor = BAR_COLORS[idx % BAR_COLORS.length];
                  let ringClass = '';
                  let scaleValue = 1;

                  if (isSorted) {
                    barColor = 'from-emerald-400 to-teal-500';
                  } else if (isMin) {
                    barColor = 'from-yellow-400 to-yellow-500';
                    ringClass = 'ring-4 ring-yellow-300/60';
                    scaleValue = 1.05;
                  } else if (isComparing) {
                    barColor = 'from-blue-400 to-blue-500';
                    ringClass = 'ring-4 ring-blue-300/60';
                    scaleValue = 1.05;
                  } else if (isCurrent) {
                    barColor = 'from-orange-400 to-orange-500';
                    ringClass = 'ring-2 ring-orange-300/50';
                  }

                  // Scale bars to fit container: max value (8) = 220px, min keeps proportions
                  const maxValue = Math.max(...currentState.array);
                  const barHeight = (value / maxValue) * 220 + 30; // 220px max + 30px base

                  return (
                    <motion.div
                      key={`${idx}-${value}`}
                      className="flex flex-col items-center gap-2 relative"
                      layout
                      transition={{
                        layout: { duration: 0.6, type: 'spring', bounce: 0.2 },
                      }}
                    >
                      {/* Status Badge */}
                      {(isSorted || isMin || isComparing || isCurrent) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-7"
                        >
                          <Badge
                            className={`text-xs ${
                              isSorted
                                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                                : isMin
                                ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-200'
                                : isComparing
                                ? 'bg-blue-500/20 border-blue-400/50 text-blue-200'
                                : 'bg-orange-500/20 border-orange-400/50 text-orange-200'
                            }`}
                          >
                            {isSorted ? '✓' : isMin ? 'MIN' : isComparing ? '?' : 'CUR'}
                          </Badge>
                        </motion.div>
                      )}

                      {/* Bar */}
                      <motion.div
                        className={`w-16 rounded-t-xl bg-gradient-to-t ${barColor} shadow-xl ${ringClass} relative`}
                        style={{
                          height: `${barHeight}px`,
                        }}
                        animate={{
                          scale: scaleValue,
                          height: `${barHeight}px`,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-t-xl bg-gradient-to-br from-white/30 to-transparent"></div>

                        {/* Value label on bar */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl text-white drop-shadow-lg">
                            {value}
                          </span>
                        </div>
                      </motion.div>

                      {/* Index label */}
                      <div className="text-xs text-white/60">
                        idx {idx}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pass Information */}
              <div className="mt-8 text-center">
                <Badge
                  variant="outline"
                  className="border-white/30 text-white text-lg px-6 py-2"
                >
                  {currentState.sortedCount > 0 && currentState.action !== 'complete'
                    ? `Pass ${currentState.sortedCount} - ${currentState.sortedCount} element${
                        currentState.sortedCount > 1 ? 's' : ''
                      } sorted`
                    : currentState.action === 'complete'
                    ? 'Sorting Complete!'
                    : 'Ready to start'}
                </Badge>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-xl mb-3">How Selection Sort Works:</h3>
              <div className="space-y-2 text-white/70">
                <p>1. Find the minimum element in the unsorted portion of the array</p>
                <p>2. Swap it with the first unsorted element</p>
                <p>3. Move the boundary of sorted elements one step forward</p>
                <p>4. Repeat until the entire array is sorted</p>
              </div>
              <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                <p className="text-cyan-200 text-sm">
                  <strong>Time Complexity:</strong> O(n²) | <strong>Space Complexity:</strong> O(1)
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Initial State */}
        {!currentState && (
          <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <div className="text-7xl mb-6">🤖</div>
            <h2 className="text-3xl text-white mb-4">
              Ready to Learn Selection Sort?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Click "Start Visualization" to see how this sorting algorithm works step by step!
            </p>

            {/* Preview Array */}
            <div className="flex justify-center gap-4">
              {INITIAL_ARRAY.map((value, idx) => (
                <div
                  key={idx}
                  className={`w-20 h-32 rounded-2xl bg-gradient-to-t ${
                    BAR_COLORS[idx % BAR_COLORS.length]
                  } shadow-xl flex items-center justify-center`}
                >
                  <span className="text-3xl text-white">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
