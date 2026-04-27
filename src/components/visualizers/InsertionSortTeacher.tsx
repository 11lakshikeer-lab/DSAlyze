import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Play, SkipForward, RotateCcw, Pause, ArrowLeft, Sparkles } from 'lucide-react';

interface InsertionStep {
  array: number[];
  keyIndex: number;
  keyValue: number | null;
  comparingIndex: number;
  sortedBoundary: number;
  shifting: boolean;
  inserting: boolean;
  description: string;
  robotMessage: string;
  robotPosition: number;
  action: 'selecting' | 'comparing' | 'shifting' | 'inserting' | 'placed' | 'complete';
}

const INITIAL_ARRAY = [6, 3, 8, 2, 9, 1];

const BLOCK_COLORS = [
  'from-indigo-400 to-blue-500',
  'from-pink-400 to-rose-500',
  'from-cyan-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-purple-400 to-violet-500',
  'from-emerald-400 to-green-500',
];

export function InsertionSortTeacher() {
  const [steps, setSteps] = useState<InsertionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1600);

  const generateSteps = (arr: number[]): InsertionStep[] => {
    const allSteps: InsertionStep[] = [];
    const workArray = [...arr];
    const n = workArray.length;

    // Initial state
    allSteps.push({
      array: [...workArray],
      keyIndex: -1,
      keyValue: null,
      comparingIndex: -1,
      sortedBoundary: 0,
      shifting: false,
      inserting: false,
      description: "Let's learn Insertion Sort! We'll build a sorted array one element at a time.",
      robotMessage: "Hi! I'll teach you Insertion Sort! We pick elements and insert them in order. 🎓",
      robotPosition: -1,
      action: 'selecting',
    });

    for (let i = 1; i < n; i++) {
      const key = workArray[i];

      // Select key element
      allSteps.push({
        array: [...workArray],
        keyIndex: i,
        keyValue: key,
        comparingIndex: -1,
        sortedBoundary: i - 1,
        shifting: false,
        inserting: false,
        description: `Selecting key element: ${key}`,
        robotMessage: `Let's pick ${key} and find its correct position in the sorted part!`,
        robotPosition: i,
        action: 'selecting',
      });

      let j = i - 1;

      // Compare and shift
      while (j >= 0 && workArray[j] > key) {
        // Comparing
        allSteps.push({
          array: [...workArray],
          keyIndex: i,
          keyValue: key,
          comparingIndex: j,
          sortedBoundary: i - 1,
          shifting: false,
          inserting: false,
          description: `Is ${workArray[j]} > ${key}? Yes! Need to shift...`,
          robotMessage: `${workArray[j]} is bigger than ${key}, so we need to make space!`,
          robotPosition: j,
          action: 'comparing',
        });

        // Shifting
        allSteps.push({
          array: [...workArray],
          keyIndex: i,
          keyValue: key,
          comparingIndex: j,
          sortedBoundary: i - 1,
          shifting: true,
          inserting: false,
          description: `Shifting ${workArray[j]} one position to the right...`,
          robotMessage: `Moving ${workArray[j]} to make room for ${key}!`,
          robotPosition: j,
          action: 'shifting',
        });

        workArray[j + 1] = workArray[j];
        j--;

        // After shift
        allSteps.push({
          array: [...workArray],
          keyIndex: i,
          keyValue: key,
          comparingIndex: j,
          sortedBoundary: i - 1,
          shifting: false,
          inserting: false,
          description: `Shifted! Continue checking...`,
          robotMessage: j >= 0 ? `Now let's check ${workArray[j]}...` : 'Reached the beginning!',
          robotPosition: j >= 0 ? j : 0,
          action: 'comparing',
        });
      }

      // Check last element if we didn't enter the loop
      if (j >= 0) {
        allSteps.push({
          array: [...workArray],
          keyIndex: i,
          keyValue: key,
          comparingIndex: j,
          sortedBoundary: i - 1,
          shifting: false,
          inserting: false,
          description: `Is ${workArray[j]} > ${key}? No! Found the position.`,
          robotMessage: `${workArray[j]} is smaller or equal. This is the right spot!`,
          robotPosition: j,
          action: 'comparing',
        });
      }

      // Insert the key
      allSteps.push({
        array: [...workArray],
        keyIndex: i,
        keyValue: key,
        comparingIndex: -1,
        sortedBoundary: i - 1,
        shifting: false,
        inserting: true,
        description: `Inserting ${key} at position ${j + 1}...`,
        robotMessage: `Perfect spot! Let's place ${key} here! ✨`,
        robotPosition: j + 1,
        action: 'inserting',
      });

      workArray[j + 1] = key;

      // Placed
      allSteps.push({
        array: [...workArray],
        keyIndex: -1,
        keyValue: null,
        comparingIndex: -1,
        sortedBoundary: i,
        shifting: false,
        inserting: false,
        description: `${key} is now in its correct position! ✓`,
        robotMessage: `Great! Now ${i + 1} elements are sorted. Moving to the next!`,
        robotPosition: j + 1,
        action: 'placed',
      });
    }

    // Complete
    allSteps.push({
      array: [...workArray],
      keyIndex: -1,
      keyValue: null,
      comparingIndex: -1,
      sortedBoundary: n - 1,
      shifting: false,
      inserting: false,
      description: '🎉 Array is completely sorted!',
      robotMessage: 'Amazing! We inserted all elements in order! The array is sorted! 🌟',
      robotPosition: -1,
      action: 'complete',
    });

    return allSteps;
  };

  const handleStart = () => {
    const newSteps = generateSteps(INITIAL_ARRAY);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
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
  const Robot = ({ message, action, position }: { message: string; action: string; position: number }) => {
    return (
      <div className="relative">
        <motion.div
          className="text-6xl absolute"
          style={{
            left: position >= 0 ? `${position * 105 + 25}px` : '50%',
            transform: position >= 0 ? 'translateY(-75px)' : 'translateX(-50%) translateY(-75px)',
          }}
          animate={{
            y: action === 'inserting' ? [-75, -85, -75] : action === 'complete' ? [-75, -95, -75] : -75,
            rotate: action === 'shifting' ? [0, -8, 8, 0] : 0,
            scale: action === 'complete' ? [1, 1.15, 1] : action === 'inserting' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: action === 'complete' ? 0.6 : 0.7,
            repeat: action === 'complete' ? Infinity : action === 'inserting' ? 2 : 0,
            ease: 'easeInOut',
          }}
        >
          🤖
        </motion.div>

        {/* Pointing arrow */}
        {position >= 0 && (action === 'selecting' || action === 'comparing') && (
          <motion.div
            className="absolute text-2xl"
            style={{
              left: `${position * 105 + 45}px`,
              top: '-25px',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            👇
          </motion.div>
        )}

        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.85, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="mt-4 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border-2 border-white/20 shadow-2xl relative max-w-2xl mx-auto"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-white/20"></div>
            <p className="text-white text-center text-lg">{message}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl text-white mb-2"
          >
            Insertion Sort Interactive Teacher 🤖
          </motion.h1>
          <p className="text-white/70 text-lg">
            Watch how elements are inserted into their correct positions!
          </p>
        </div>

        {/* Control Panel */}
        <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {steps.length === 0 && (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-lg px-6"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
            )}

            {steps.length > 0 && (
              <>
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
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
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
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
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    <option value={2200} className="bg-gray-800 text-white">Slow</option>
                    <option value={1600} className="bg-gray-800 text-white">Normal</option>
                    <option value={900} className="bg-gray-800 text-white">Fast</option>
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
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card className="p-5 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">
                    {currentState.sortedBoundary + 1} of {currentState.array.length} elements sorted
                  </span>
                  <Badge className="bg-gradient-to-r from-violet-500 to-indigo-500">
                    {Math.round(((currentState.sortedBoundary + 1) / currentState.array.length) * 100)}% Complete
                  </Badge>
                </div>
                <Progress
                  value={((currentState.sortedBoundary + 1) / currentState.array.length) * 100}
                  className="h-3 bg-white/10"
                />
              </div>
            </Card>

            {/* Robot Teacher */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 min-h-40">
              <Robot
                message={currentState.robotMessage}
                action={currentState.action}
                position={currentState.robotPosition}
              />
            </Card>

            {/* Array Visualization */}
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              {/* Key Value Display (floating) */}
              {currentState.keyValue !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-500 px-6 py-3 rounded-2xl shadow-2xl border-2 border-yellow-300/50 relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent"></div>
                    <div className="flex items-center gap-2 relative z-10">
                      <Sparkles className="w-5 h-5 text-white" />
                      <span className="text-white text-xl">Key: {currentState.keyValue}</span>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Array Blocks */}
              <div className="flex justify-center items-center gap-3 min-h-48 relative">
                {currentState.array.map((value, idx) => {
                  const isKey = idx === currentState.keyIndex;
                  const isComparing = idx === currentState.comparingIndex;
                  const isSorted = idx <= currentState.sortedBoundary && !isKey;
                  const isShifting = currentState.shifting && idx === currentState.comparingIndex;

                  let blockColor = BLOCK_COLORS[value % BLOCK_COLORS.length];
                  let glowClass = '';
                  let scaleValue = 1;

                  if (isKey) {
                    blockColor = 'from-yellow-400 to-amber-500';
                    glowClass = 'ring-4 ring-yellow-300/80 shadow-2xl shadow-yellow-400/50';
                    scaleValue = 1.08;
                  } else if (isComparing) {
                    glowClass = 'ring-4 ring-cyan-300/70 shadow-xl shadow-cyan-400/40';
                    scaleValue = 1.05;
                  } else if (isSorted) {
                    blockColor = 'from-emerald-400 to-green-500';
                    glowClass = 'ring-2 ring-emerald-300/40';
                  }

                  return (
                    <motion.div
                      key={`${idx}-${value}`}
                      className="relative"
                      layout
                      transition={{
                        layout: { duration: 0.5, type: 'spring', bounce: 0.25 },
                      }}
                    >
                      {/* Shifting arrow */}
                      {isShifting && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 10 }}
                          exit={{ opacity: 0 }}
                          className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-2xl z-20"
                        >
                          <ArrowLeft className="w-6 h-6 text-cyan-300 rotate-180" />
                        </motion.div>
                      )}

                      {/* Status Badge */}
                      {(isSorted || isKey) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-7 left-1/2 transform -translate-x-1/2 z-10"
                        >
                          <Badge
                            className={`text-xs ${
                              isKey
                                ? 'bg-yellow-500/30 border-yellow-400 text-yellow-100'
                                : 'bg-emerald-500/30 border-emerald-400 text-emerald-100'
                            }`}
                          >
                            {isKey ? '🔑 Key' : '✓'}
                          </Badge>
                        </motion.div>
                      )}

                      {/* Block */}
                      <motion.div
                        className={`w-20 h-28 rounded-2xl bg-gradient-to-br ${blockColor} ${glowClass} shadow-2xl flex flex-col items-center justify-center relative overflow-hidden`}
                        animate={{
                          scale: scaleValue,
                          rotate: isKey ? [0, -3, 3, 0] : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          rotate: { duration: 0.5, repeat: isKey ? Infinity : 0 },
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>

                        {/* Value */}
                        <motion.div
                          className="text-3xl text-white drop-shadow-lg z-10"
                          animate={{
                            scale: isKey ? [1, 1.15, 1] : 1,
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: isKey ? Infinity : 0,
                          }}
                        >
                          {value}
                        </motion.div>

                        {/* Index */}
                        <div className="text-xs text-white/70 mt-1 z-10">
                          [{idx}]
                        </div>

                        {/* Pulse effect for key */}
                        {isKey && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-amber-300/20 rounded-2xl"
                            animate={{
                              opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                            }}
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Description */}
              <motion.div
                key={currentState.description}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <Badge
                  variant="outline"
                  className="border-white/30 text-white text-lg px-6 py-3 bg-white/5"
                >
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  <span dangerouslySetInnerHTML={{ __html: currentState.description }} />
                </Badge>
              </motion.div>
            </Card>

            {/* Legend */}
            <Card className="p-5 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 ring-2 ring-emerald-300/40"></div>
                  <span className="text-white/80 text-sm">Sorted Elements</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 ring-4 ring-yellow-300/80"></div>
                  <span className="text-white/80 text-sm">Key (Being Inserted)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 ring-4 ring-cyan-300/70"></div>
                  <span className="text-white/80 text-sm">Comparing</span>
                </div>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-xl mb-3">How Insertion Sort Works:</h3>
              <div className="space-y-2 text-white/70">
                <p>1. Start with the second element (index 1) as the key</p>
                <p>2. Compare the key with elements in the sorted portion (left side)</p>
                <p>3. Shift larger elements one position to the right</p>
                <p>4. Insert the key in its correct position</p>
                <p>5. Repeat for all elements until the array is sorted</p>
              </div>
              <div className="mt-4 p-3 bg-violet-500/10 border border-violet-400/30 rounded-lg">
                <p className="text-violet-200 text-sm">
                  <strong>Time Complexity:</strong> O(n²) | <strong>Space Complexity:</strong> O(1) | <strong>Stable:</strong> Yes
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Initial State */}
        {!currentState && (
          <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <motion.div
              className="text-8xl mb-6"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🤖
            </motion.div>
            <h2 className="text-3xl text-white mb-4">
              Ready to Learn Insertion Sort?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              I'll show you how to insert elements one by one into their correct positions!
            </p>

            {/* Preview Array */}
            <div className="flex justify-center gap-3">
              {INITIAL_ARRAY.map((value, idx) => (
                <motion.div
                  key={idx}
                  className={`w-20 h-28 rounded-2xl bg-gradient-to-br ${
                    BLOCK_COLORS[value % BLOCK_COLORS.length]
                  } shadow-2xl flex items-center justify-center relative overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: idx * 0.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
                  <span className="text-3xl text-white z-10">{value}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
