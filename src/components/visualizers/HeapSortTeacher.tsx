import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Play, SkipForward, RotateCcw, Pause, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeapStep {
  array: number[];
  heapSize: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  currentNode: number;
  phase: 'initial' | 'building' | 'sorting' | 'complete';
  description: string;
  robotMessage: string;
  robotPosition: number;
  action: 'heapify' | 'swap' | 'extract' | 'complete';
  parentChild: [number, number] | null;
}

const INITIAL_ARRAY = [4, 10, 3, 5, 1, 8];

const BLOCK_COLORS = [
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-500',
  'from-emerald-400 to-green-500',
  'from-indigo-400 to-blue-600',
];

export function HeapSortTeacher() {
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1800);

  const generateSteps = (arr: number[]): HeapStep[] => {
    const allSteps: HeapStep[] = [];
    const workArray = [...arr];
    const n = workArray.length;

    // Initial state
    allSteps.push({
      array: [...workArray],
      heapSize: n,
      comparing: [],
      swapping: [],
      sorted: [],
      currentNode: -1,
      phase: 'initial',
      description: 'Starting Heap Sort - First we build a Max Heap!',
      robotMessage: `Hi! I'll teach you Heap Sort! We organize data into a heap tree structure! 🌳`,
      robotPosition: -1,
      action: 'heapify',
      parentChild: null,
    });

    // Heapify helper
    const heapify = (arr: number[], n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      // Show current node
      allSteps.push({
        array: [...arr],
        heapSize: n,
        comparing: [i],
        swapping: [],
        sorted: [],
        currentNode: i,
        phase: 'building',
        description: `Checking node at index ${i} (value: ${arr[i]})`,
        robotMessage: `Let's check if ${arr[i]} is the largest among its children!`,
        robotPosition: i,
        action: 'heapify',
        parentChild: null,
      });

      // Compare with left child
      if (left < n) {
        allSteps.push({
          array: [...arr],
          heapSize: n,
          comparing: [i, left],
          swapping: [],
          sorted: [],
          currentNode: i,
          phase: 'building',
          description: `Comparing parent ${arr[i]} with left child ${arr[left]}`,
          robotMessage: `Is left child ${arr[left]} larger than parent ${arr[i]}?`,
          robotPosition: i,
          action: 'heapify',
          parentChild: [i, left],
        });

        if (arr[left] > arr[largest]) {
          largest = left;
          allSteps.push({
            array: [...arr],
            heapSize: n,
            comparing: [largest],
            swapping: [],
            sorted: [],
            currentNode: i,
            phase: 'building',
            description: `Yes! ${arr[left]} is larger`,
            robotMessage: `${arr[left]} is bigger! It might become the new parent!`,
            robotPosition: left,
            action: 'heapify',
            parentChild: [i, left],
          });
        }
      }

      // Compare with right child
      if (right < n) {
        allSteps.push({
          array: [...arr],
          heapSize: n,
          comparing: [largest, right],
          swapping: [],
          sorted: [],
          currentNode: i,
          phase: 'building',
          description: `Comparing current largest ${arr[largest]} with right child ${arr[right]}`,
          robotMessage: `Now checking right child ${arr[right]}...`,
          robotPosition: largest,
          action: 'heapify',
          parentChild: [i, right],
        });

        if (arr[right] > arr[largest]) {
          largest = right;
          allSteps.push({
            array: [...arr],
            heapSize: n,
            comparing: [largest],
            swapping: [],
            sorted: [],
            currentNode: i,
            phase: 'building',
            description: `${arr[right]} is the largest!`,
            robotMessage: `${arr[right]} is the biggest of all three!`,
            robotPosition: right,
            action: 'heapify',
            parentChild: [i, right],
          });
        }
      }

      // Swap if needed
      if (largest !== i) {
        allSteps.push({
          array: [...arr],
          heapSize: n,
          comparing: [],
          swapping: [i, largest],
          sorted: [],
          currentNode: i,
          phase: 'building',
          description: `Swapping ${arr[i]} with ${arr[largest]} to maintain heap property`,
          robotMessage: `The child is larger! Swapping ${arr[i]} ↔ ${arr[largest]} to bubble up!`,
          robotPosition: i,
          action: 'swap',
          parentChild: [i, largest],
        });

        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        allSteps.push({
          array: [...arr],
          heapSize: n,
          comparing: [],
          swapping: [],
          sorted: [],
          currentNode: largest,
          phase: 'building',
          description: `Swapped! Now ${arr[largest]} is at index ${largest}`,
          robotMessage: `Swap complete! Now let's check the subtree...`,
          robotPosition: largest,
          action: 'heapify',
          parentChild: null,
        });

        heapify(arr, n, largest);
      } else {
        allSteps.push({
          array: [...arr],
          heapSize: n,
          comparing: [],
          swapping: [],
          sorted: [],
          currentNode: i,
          phase: 'building',
          description: `Node ${arr[i]} is already in correct position!`,
          robotMessage: `Perfect! This subtree is already a valid heap! ✓`,
          robotPosition: i,
          action: 'heapify',
          parentChild: null,
        });
      }
    };

    // Build heap phase
    allSteps.push({
      array: [...workArray],
      heapSize: n,
      comparing: [],
      swapping: [],
      sorted: [],
      currentNode: -1,
      phase: 'building',
      description: '🔨 Building Max Heap - Starting from bottom up',
      robotMessage: `Building the heap from the last parent node upward!`,
      robotPosition: -1,
      action: 'heapify',
      parentChild: null,
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(workArray, n, i);
    }

    allSteps.push({
      array: [...workArray],
      heapSize: n,
      comparing: [],
      swapping: [],
      sorted: [],
      currentNode: -1,
      phase: 'building',
      description: '✅ Max Heap built! Largest element is at the root!',
      robotMessage: `Heap is ready! ${workArray[0]} is at the top! Now let's sort!`,
      robotPosition: 0,
      action: 'heapify',
      parentChild: null,
    });

    // Sorting phase
    allSteps.push({
      array: [...workArray],
      heapSize: n,
      comparing: [],
      swapping: [],
      sorted: [],
      currentNode: -1,
      phase: 'sorting',
      description: '🔄 Starting Sorting Phase - Extract largest elements one by one',
      robotMessage: `Now we extract the max element and rebuild the heap each time!`,
      robotPosition: -1,
      action: 'extract',
      parentChild: null,
    });

    for (let i = n - 1; i > 0; i--) {
      // Extract max
      allSteps.push({
        array: [...workArray],
        heapSize: i + 1,
        comparing: [0, i],
        swapping: [],
        sorted: [],
        currentNode: 0,
        phase: 'sorting',
        description: `Extracting max element ${workArray[0]} to position ${i}`,
        robotMessage: `Taking ${workArray[0]} from root and moving it to the sorted section!`,
        robotPosition: 0,
        action: 'extract',
        parentChild: [0, i],
      });

      // Swap
      allSteps.push({
        array: [...workArray],
        heapSize: i + 1,
        comparing: [],
        swapping: [0, i],
        sorted: [],
        currentNode: 0,
        phase: 'sorting',
        description: `Swapping root ${workArray[0]} with last element ${workArray[i]}`,
        robotMessage: `Swapping ${workArray[0]} ↔ ${workArray[i]}!`,
        robotPosition: 0,
        action: 'swap',
        parentChild: [0, i],
      });

      [workArray[0], workArray[i]] = [workArray[i], workArray[0]];

      allSteps.push({
        array: [...workArray],
        heapSize: i,
        comparing: [],
        swapping: [],
        sorted: [i],
        currentNode: i,
        phase: 'sorting',
        description: `${workArray[i]} is now sorted! Heap size reduced to ${i}`,
        robotMessage: `${workArray[i]} is in its final position! Rebuilding heap...`,
        robotPosition: i,
        action: 'extract',
        parentChild: null,
      });

      // Heapify root
      if (i > 1) {
        allSteps.push({
          array: [...workArray],
          heapSize: i,
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: n - i }, (_, idx) => i + idx),
          currentNode: 0,
          phase: 'sorting',
          description: 'Restoring heap property from root...',
          robotMessage: `Fixing the heap after extraction...`,
          robotPosition: 0,
          action: 'heapify',
          parentChild: null,
        });

        heapify(workArray, i, 0);
      }

      // Mark as sorted
      const sortedIndices = Array.from({ length: n - i + 1 }, (_, idx) => i + idx);
      if (allSteps[allSteps.length - 1]) {
        allSteps[allSteps.length - 1].sorted = sortedIndices;
      }
    }

    // Complete
    allSteps.push({
      array: [...workArray],
      heapSize: 0,
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      currentNode: -1,
      phase: 'complete',
      description: '🎉 Heap Sort Complete! Array is fully sorted!',
      robotMessage: `Amazing! We sorted the entire array using a heap! All done! 🌟`,
      robotPosition: -1,
      action: 'complete',
      parentChild: null,
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

  // Helper to get tree position
  const getTreePosition = (index: number, totalNodes: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const posInLevel = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const maxWidth = 800;
    const spacing = maxWidth / (nodesInLevel + 1);
    
    return {
      x: spacing * (posInLevel + 1),
      y: level * 120 + 50,
      level,
    };
  };

  // Robot component
  const Robot = ({ message, position }: { message: string; position: number }) => {
    return (
      <div className="relative">
        <motion.div
          className="text-6xl absolute left-1/2 transform -translate-x-1/2"
          animate={{
            y: [-20, -30, -20],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🤖
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="mt-20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border-2 border-white/20 shadow-2xl relative max-w-2xl mx-auto"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-white/20"></div>
            <p className="text-white text-center text-lg">{message}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  // Tree visualization
  const TreeView = ({ state }: { state: HeapStep }) => {
    const visibleNodes = state.array.slice(0, state.heapSize);

    return (
      <div className="relative h-96 w-full">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* Draw edges */}
          {visibleNodes.map((_, idx) => {
            const leftChild = 2 * idx + 1;
            const rightChild = 2 * idx + 2;
            const parent = getTreePosition(idx, state.heapSize);

            const edges = [];

            // Left child edge
            if (leftChild < state.heapSize) {
              const child = getTreePosition(leftChild, state.heapSize);
              const isActive = state.parentChild && 
                ((state.parentChild[0] === idx && state.parentChild[1] === leftChild) ||
                 (state.parentChild[1] === idx && state.parentChild[0] === leftChild));

              edges.push(
                <motion.line
                  key={`left-${idx}`}
                  x1={parent.x}
                  y1={parent.y}
                  x2={child.x}
                  y2={child.y}
                  stroke={isActive ? '#22d3ee' : '#94a3b8'}
                  strokeWidth={isActive ? 4 : 2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isActive ? 1 : 0.3,
                    stroke: isActive ? '#22d3ee' : '#94a3b8',
                  }}
                  transition={{ duration: 0.5 }}
                />
              );
            }

            // Right child edge
            if (rightChild < state.heapSize) {
              const child = getTreePosition(rightChild, state.heapSize);
              const isActive = state.parentChild && 
                ((state.parentChild[0] === idx && state.parentChild[1] === rightChild) ||
                 (state.parentChild[1] === idx && state.parentChild[0] === rightChild));

              edges.push(
                <motion.line
                  key={`right-${idx}`}
                  x1={parent.x}
                  y1={parent.y}
                  x2={child.x}
                  y2={child.y}
                  stroke={isActive ? '#22d3ee' : '#94a3b8'}
                  strokeWidth={isActive ? 4 : 2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isActive ? 1 : 0.3,
                    stroke: isActive ? '#22d3ee' : '#94a3b8',
                  }}
                  transition={{ duration: 0.5 }}
                />
              );
            }

            return edges;
          })}
        </svg>

        {/* Draw nodes */}
        {visibleNodes.map((value, idx) => {
          const pos = getTreePosition(idx, state.heapSize);
          const isComparing = state.comparing.includes(idx);
          const isSwapping = state.swapping.includes(idx);
          const isCurrent = state.currentNode === idx;
          const isSorted = state.sorted.includes(idx);

          let colorClass = BLOCK_COLORS[value % BLOCK_COLORS.length];
          let glowClass = '';
          let scaleValue = 1;

          if (isSorted) {
            colorClass = 'from-emerald-400 to-green-500';
            glowClass = 'ring-4 ring-emerald-300/60';
            scaleValue = 0.95;
          } else if (isSwapping) {
            colorClass = 'from-yellow-400 to-amber-500';
            glowClass = 'ring-4 ring-yellow-300/80 shadow-2xl shadow-yellow-400/60';
            scaleValue = 1.15;
          } else if (isComparing) {
            glowClass = 'ring-4 ring-cyan-300/70 shadow-xl shadow-cyan-400/50';
            scaleValue = 1.1;
          } else if (isCurrent) {
            glowClass = 'ring-4 ring-violet-300/70';
            scaleValue = 1.05;
          }

          return (
            <motion.div
              key={`node-${idx}-${value}`}
              className={`absolute w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} ${glowClass} shadow-xl flex items-center justify-center`}
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
              animate={{
                scale: scaleValue,
                rotate: isSwapping ? [0, -5, 5, 0] : 0,
              }}
              transition={{
                duration: 0.4,
                rotate: { duration: 0.5 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="text-2xl text-white drop-shadow-lg">{value}</div>
                <div className="text-xs text-white/60 text-center">[{idx}]</div>
              </div>

              {/* Glow pulse for swapping */}
              {isSwapping && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-yellow-300/30"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Heap size indicator */}
        {state.heapSize < state.array.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <Badge className="bg-violet-500/30 border-violet-400 text-violet-100 text-sm">
              Heap Size: {state.heapSize}
            </Badge>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl text-white mb-2"
          >
            Heap Sort Interactive Teacher 🤖
          </motion.h1>
          <p className="text-white/70 text-lg">
            Learn how heap trees help us sort data efficiently!
          </p>
        </div>

        {/* Control Panel */}
        <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {steps.length === 0 && (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-lg px-6"
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
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
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
                    <option value={2400} className="bg-gray-800 text-white">Slow</option>
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
            {/* Progress Tracker */}
            <Card className="p-5 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">
                    {currentState.phase === 'initial' && '🎬 Starting'}
                    {currentState.phase === 'building' && '🔨 Building Max Heap'}
                    {currentState.phase === 'sorting' && '🔄 Sorting Phase'}
                    {currentState.phase === 'complete' && '✅ Complete'}
                  </span>
                  <div className="flex gap-2">
                    <Badge className={`${currentState.phase === 'building' || currentState.phase === 'initial' ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-white/10'}`}>
                      {currentState.phase === 'building' || currentState.phase === 'initial' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : null}
                      Build Heap
                    </Badge>
                    <Badge className={`${currentState.phase === 'sorting' || currentState.phase === 'complete' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-white/10'}`}>
                      {currentState.phase === 'complete' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : null}
                      Sort
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={(currentStep / steps.length) * 100}
                  className="h-3 bg-white/10"
                />
              </div>
            </Card>

            {/* Robot Teacher */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 min-h-32">
              <Robot message={currentState.robotMessage} position={currentState.robotPosition} />
            </Card>

            {/* Tree Visualization */}
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-xl mb-4 text-center">Binary Heap Tree Structure</h3>
              <TreeView state={currentState} />
            </Card>

            {/* Array Visualization */}
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-xl mb-6 text-center">Array Representation</h3>
              <div className="flex justify-center items-center gap-3 flex-wrap">
                {currentState.array.map((value, idx) => {
                  const isComparing = currentState.comparing.includes(idx);
                  const isSwapping = currentState.swapping.includes(idx);
                  const isSorted = currentState.sorted.includes(idx);
                  const inHeap = idx < currentState.heapSize;

                  let colorClass = BLOCK_COLORS[value % BLOCK_COLORS.length];
                  let glowClass = '';
                  let scaleValue = 1;
                  let opacity = 1;

                  if (isSorted) {
                    colorClass = 'from-emerald-400 to-green-500';
                    glowClass = 'ring-4 ring-emerald-300/60';
                  } else if (isSwapping) {
                    colorClass = 'from-yellow-400 to-amber-500';
                    glowClass = 'ring-4 ring-yellow-300/80 shadow-2xl shadow-yellow-400/60';
                    scaleValue = 1.1;
                  } else if (isComparing) {
                    glowClass = 'ring-4 ring-cyan-300/70 shadow-xl shadow-cyan-400/50';
                    scaleValue = 1.05;
                  }

                  if (!inHeap && !isSorted) {
                    opacity = 0.3;
                  }

                  return (
                    <motion.div
                      key={`array-${idx}`}
                      className={`w-20 h-24 rounded-2xl bg-gradient-to-br ${colorClass} ${glowClass} shadow-xl flex flex-col items-center justify-center relative overflow-hidden`}
                      animate={{ scale: scaleValue, opacity }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>
                      <div className="text-2xl text-white drop-shadow-lg z-10">{value}</div>
                      <div className="text-xs text-white/70 mt-1 z-10">[{idx}]</div>

                      {isSorted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-2 -right-2 z-20"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                        </motion.div>
                      )}
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
                <Badge variant="outline" className="border-white/30 text-white text-lg px-6 py-3 bg-white/5">
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  {currentState.description}
                </Badge>
              </motion.div>
            </Card>

            {/* Legend */}
            <Card className="p-5 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 ring-4 ring-cyan-300/70"></div>
                  <span className="text-white/80 text-sm">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 ring-4 ring-yellow-300/80"></div>
                  <span className="text-white/80 text-sm">Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 ring-4 ring-emerald-300/60"></div>
                  <span className="text-white/80 text-sm">Sorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-8 border-2 border-cyan-400"></div>
                  <span className="text-white/80 text-sm">Parent-Child Link</span>
                </div>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-xl mb-3">How Heap Sort Works:</h3>
              <div className="space-y-2 text-white/70">
                <p><strong>Phase 1 - Build Max Heap:</strong></p>
                <p className="ml-4">1. Start from the last non-leaf node and work backwards</p>
                <p className="ml-4">2. For each node, ensure it&apos;s larger than its children (heapify)</p>
                <p className="ml-4">3. Swap parent with largest child if needed, then recursively heapify</p>
                <p className="mt-3"><strong>Phase 2 - Sorting:</strong></p>
                <p className="ml-4">4. Swap root (max element) with last element in heap</p>
                <p className="ml-4">5. Reduce heap size and mark last element as sorted</p>
                <p className="ml-4">6. Heapify the root to maintain max heap property</p>
                <p className="ml-4">7. Repeat until heap is empty</p>
              </div>
              <div className="mt-4 p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                <p className="text-purple-200 text-sm">
                  <strong>Time Complexity:</strong> O(n log n) | <strong>Space Complexity:</strong> O(1) | <strong>Stable:</strong> No
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
            <h2 className="text-3xl text-white mb-4">Ready to Learn Heap Sort?</h2>
            <p className="text-white/70 text-lg mb-8">
              I&apos;ll show you how to build a heap tree and use it to sort data efficiently!
            </p>

            {/* Preview */}
            <div className="flex justify-center gap-3">
              {INITIAL_ARRAY.map((value, idx) => (
                <motion.div
                  key={idx}
                  className={`w-20 h-24 rounded-2xl bg-gradient-to-br ${
                    BLOCK_COLORS[value % BLOCK_COLORS.length]
                  } shadow-2xl flex items-center justify-center relative overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: idx * 0.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
                  <span className="text-2xl text-white z-10">{value}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
