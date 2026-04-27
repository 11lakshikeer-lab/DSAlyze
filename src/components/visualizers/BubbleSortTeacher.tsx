import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Play, SkipForward, RotateCcw, Pause, Zap } from 'lucide-react';

interface BubbleStep {
  array: number[];
  compareIndices: [number, number] | null;
  swapping: boolean;
  passComplete: boolean;
  sortedUpTo: number;
  currentPass: number;
  totalPasses: number;
  description: string;
  robotMessage: string;
  robotPosition: number; // index where robot should be
  action: 'comparing' | 'swapping' | 'no-swap' | 'pass-complete' | 'complete';
}

const INITIAL_ARRAY = [7, 3, 8, 2, 5, 1];

const BLOCK_COLORS = [
  'from-pink-400 to-rose-500',
  'from-purple-400 to-violet-500',
  'from-blue-400 to-cyan-500',
  'from-yellow-400 to-amber-500',
  'from-green-400 to-emerald-500',
  'from-orange-400 to-red-500',
];

export function BubbleSortTeacher() {
  const [steps, setSteps] = useState<BubbleStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1800);

  const generateSteps = (arr: number[]): BubbleStep[] => {
    const allSteps: BubbleStep[] = [];
    const workArray = [...arr];
    const n = workArray.length;
    let totalSwaps = 0;

    // Initial state
    allSteps.push({
      array: [...workArray],
      compareIndices: null,
      swapping: false,
      passComplete: false,
      sortedUpTo: n,
      currentPass: 0,
      totalPasses: n - 1,
      description: "Let's learn Bubble Sort! We'll compare adjacent pairs and swap if needed.",
      robotMessage: "Hi! I'm your Bubble Sort teacher! 🎓",
      robotPosition: -1,
      action: 'comparing',
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      // Start of pass
      allSteps.push({
        array: [...workArray],
        compareIndices: null,
        swapping: false,
        passComplete: false,
        sortedUpTo: n - i,
        currentPass: i + 1,
        totalPasses: n - 1,
        description: `Starting Pass ${i + 1} of ${n - 1}`,
        robotMessage: `Pass ${i + 1}: Let's bubble up the largest element!`,
        robotPosition: 0,
        action: 'comparing',
      });

      for (let j = 0; j < n - i - 1; j++) {
        // Comparing
        allSteps.push({
          array: [...workArray],
          compareIndices: [j, j + 1],
          swapping: false,
          passComplete: false,
          sortedUpTo: n - i,
          currentPass: i + 1,
          totalPasses: n - 1,
          description: `Comparing ${workArray[j]} and ${workArray[j + 1]}`,
          robotMessage: `Is ${workArray[j]} > ${workArray[j + 1]}? Let me check...`,
          robotPosition: j,
          action: 'comparing',
        });

        if (workArray[j] > workArray[j + 1]) {
          // Need to swap
          allSteps.push({
            array: [...workArray],
            compareIndices: [j, j + 1],
            swapping: true,
            passComplete: false,
            sortedUpTo: n - i,
            currentPass: i + 1,
            totalPasses: n - 1,
            description: `${workArray[j]} > ${workArray[j + 1]} → Swapping! ✨`,
            robotMessage: `Yes! ${workArray[j]} is bigger. Let's swap them!`,
            robotPosition: j,
            action: 'swapping',
          });

          [workArray[j], workArray[j + 1]] = [workArray[j + 1], workArray[j]];
          swapped = true;
          totalSwaps++;

          // After swap
          allSteps.push({
            array: [...workArray],
            compareIndices: [j, j + 1],
            swapping: false,
            passComplete: false,
            sortedUpTo: n - i,
            currentPass: i + 1,
            totalPasses: n - 1,
            description: `Swapped! Now: [${workArray.join(', ')}]`,
            robotMessage: 'Perfect! Moving to the next pair...',
            robotPosition: j + 1,
            action: 'swapping',
          });
        } else {
          // No swap needed
          allSteps.push({
            array: [...workArray],
            compareIndices: [j, j + 1],
            swapping: false,
            passComplete: false,
            sortedUpTo: n - i,
            currentPass: i + 1,
            totalPasses: n - 1,
            description: `${workArray[j]} ≤ ${workArray[j + 1]} → No swap needed ✓`,
            robotMessage: `Nope! They're in the right order already.`,
            robotPosition: j,
            action: 'no-swap',
          });
        }
      }

      // Pass complete
      allSteps.push({
        array: [...workArray],
        compareIndices: null,
        swapping: false,
        passComplete: true,
        sortedUpTo: n - i - 1,
        currentPass: i + 1,
        totalPasses: n - 1,
        description: `Pass ${i + 1} complete! ${workArray[n - i - 1]} is in its final position! 🎯`,
        robotMessage: `Great! The largest unsorted element bubbled to the end!`,
        robotPosition: n - i - 1,
        action: 'pass-complete',
      });

      if (!swapped) break; // Optimization: already sorted
    }

    // Final state
    allSteps.push({
      array: [...workArray],
      compareIndices: null,
      swapping: false,
      passComplete: false,
      sortedUpTo: 0,
      currentPass: n - 1,
      totalPasses: n - 1,
      description: `🎉 Array is completely sorted! Total swaps: ${totalSwaps}`,
      robotMessage: "Woohoo! We did it! The array is perfectly sorted! 🌟",
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
            left: position >= 0 ? `${position * 110 + 20}px` : '50%',
            transform: position >= 0 ? 'translateY(-80px)' : 'translateX(-50%) translateY(-80px)',
          }}
          animate={{
            y: action === 'swapping' ? [-80, -90, -80] : action === 'complete' ? [-80, -100, -80] : -80,
            rotate: action === 'swapping' ? [0, -15, 15, 0] : 0,
            scale: action === 'complete' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: action === 'complete' ? 0.6 : 0.8,
            repeat: action === 'complete' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          🤖
        </motion.div>

        {/* Pointing arrow when comparing */}
        {action === 'comparing' && position >= 0 && (
          <motion.div
            className="absolute text-3xl"
            style={{
              left: `${position * 110 + 45}px`,
              top: '-30px',
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
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 shadow-2xl relative max-w-2xl mx-auto"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-white/20"></div>
            <p className="text-white text-center text-lg">{message}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl text-white mb-2"
          >
            Bubble Sort Interactive Teacher 🤖
          </motion.h1>
          <p className="text-white/70 text-lg">
            Watch the robot teach you how bubbles rise to the top!
          </p>
        </div>

        {/* Control Panel */}
        <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {steps.length === 0 && (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-lg px-6"
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
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <option value={2500} className="bg-gray-800 text-white">Slow</option>
                    <option value={1800} className="bg-gray-800 text-white">Normal</option>
                    <option value={1000} className="bg-gray-800 text-white">Fast</option>
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
            {/* Progress Indicator */}
            <Card className="p-5 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">
                    Pass {currentState.currentPass} of {currentState.totalPasses}
                  </span>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                    {Math.round((currentState.currentPass / currentState.totalPasses) * 100)}% Complete
                  </Badge>
                </div>
                <Progress
                  value={(currentState.currentPass / currentState.totalPasses) * 100}
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
              <div className="flex justify-center items-center gap-4 min-h-52 relative">
                {currentState.array.map((value, idx) => {
                  const isComparing = currentState.compareIndices?.includes(idx);
                  const isSorted = idx >= currentState.sortedUpTo;
                  const isSwapping = currentState.swapping && currentState.compareIndices?.includes(idx);

                  let blockColor = BLOCK_COLORS[value % BLOCK_COLORS.length];
                  let glowClass = '';
                  let scaleValue = 1;

                  if (isSorted) {
                    blockColor = 'from-emerald-400 to-green-500';
                    glowClass = 'ring-2 ring-emerald-300/50';
                  } else if (isSwapping) {
                    glowClass = 'ring-4 ring-yellow-300/80 shadow-2xl shadow-yellow-400/50';
                    scaleValue = 1.1;
                  } else if (isComparing) {
                    glowClass = 'ring-4 ring-cyan-300/80 shadow-xl shadow-cyan-400/50';
                    scaleValue = 1.05;
                  }

                  return (
                    <motion.div
                      key={`${idx}-${value}`}
                      className="relative"
                      layout
                      transition={{
                        layout: { duration: 0.5, type: 'spring', bounce: 0.3 },
                      }}
                    >
                      {/* Status Badge */}
                      {isSorted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                        >
                          <Badge className="bg-emerald-500/30 border-emerald-400 text-emerald-100 text-xs">
                            ✓ Sorted
                          </Badge>
                        </motion.div>
                      )}

                      {/* Comparison Arrow */}
                      {isComparing && !isSorted && (
                        <motion.div
                          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-2xl"
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        >
                          {isSwapping ? '🔄' : '👀'}
                        </motion.div>
                      )}

                      {/* Block */}
                      <motion.div
                        className={`w-24 h-32 rounded-2xl bg-gradient-to-br ${blockColor} ${glowClass} shadow-2xl flex flex-col items-center justify-center relative overflow-hidden`}
                        animate={{
                          scale: scaleValue,
                          rotate: isSwapping ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>

                        {/* Value */}
                        <motion.div
                          className="text-4xl text-white drop-shadow-lg z-10"
                          animate={{
                            scale: isSwapping ? [1, 1.2, 1] : 1,
                          }}
                        >
                          {value}
                        </motion.div>

                        {/* Index */}
                        <div className="text-xs text-white/70 mt-2 z-10">
                          [{idx}]
                        </div>

                        {/* Sparkle effect when swapping */}
                        {isSwapping && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-orange-300/30 rounded-2xl"
                            animate={{
                              opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                              duration: 0.5,
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
                  <Zap className="w-4 h-4 mr-2 inline" />
                  {currentState.description}
                </Badge>
              </motion.div>
            </Card>

            {/* Legend */}
            <Card className="p-5 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 ring-2 ring-emerald-300/50"></div>
                  <span className="text-white/80 text-sm">Sorted Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 ring-4 ring-cyan-300/80"></div>
                  <span className="text-white/80 text-sm">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 ring-4 ring-yellow-300/80"></div>
                  <span className="text-white/80 text-sm">Swapping</span>
                </div>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-xl mb-3">How Bubble Sort Works:</h3>
              <div className="space-y-2 text-white/70">
                <p>1. Compare adjacent elements in the array</p>
                <p>2. Swap them if they're in the wrong order (left &gt; right)</p>
                <p>3. Repeat until the largest element "bubbles" to the end</p>
                <p>4. Continue passes until the entire array is sorted</p>
              </div>
              <div className="mt-4 p-3 bg-pink-500/10 border border-pink-400/30 rounded-lg">
                <p className="text-pink-200 text-sm">
                  <strong>Time Complexity:</strong> O(n²) | <strong>Space Complexity:</strong> O(1)
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
              Ready to Learn Bubble Sort?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              I'll show you how elements bubble up to their correct positions!
            </p>

            {/* Preview Array */}
            <div className="flex justify-center gap-4">
              {INITIAL_ARRAY.map((value, idx) => (
                <motion.div
                  key={idx}
                  className={`w-24 h-32 rounded-2xl bg-gradient-to-br ${
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
                  <span className="text-4xl text-white z-10">{value}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
