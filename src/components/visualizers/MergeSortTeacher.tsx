import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Play, SkipForward, RotateCcw, Pause, ChevronRight } from 'lucide-react';

interface MergeStep {
  type: 'divide' | 'merge' | 'complete';
  array: number[];
  low: number;
  high: number;
  mid?: number;
  leftArray?: number[];
  rightArray?: number[];
  comparing?: [number, number];
  merged?: number[];
  robotMessage: string;
  robotAction: 'point-mid' | 'split' | 'compare' | 'merge' | 'celebrate';
  level: number;
  treeNode?: {
    id: string;
    range: [number, number];
    level: number;
    state: 'dividing' | 'divided' | 'merging' | 'merged';
  };
}

interface RecursiveTreeNode {
  id: string;
  range: [number, number];
  array: number[];
  level: number;
  state: 'dividing' | 'divided' | 'merging' | 'merged';
  left?: RecursiveTreeNode;
  right?: RecursiveTreeNode;
}

export function MergeSortTeacher() {
  const [inputArray, setInputArray] = useState<number[]>([38, 27, 43, 3, 9, 82, 10]);
  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [recursiveTree, setRecursiveTree] = useState<RecursiveTreeNode | null>(null);

  const generateSteps = (arr: number[]): MergeStep[] => {
    const allSteps: MergeStep[] = [];
    const workArray = [...arr];
    let nodeIdCounter = 0;
    const treeNodes: RecursiveTreeNode[] = [];

    const createTreeNode = (range: [number, number], array: number[], level: number): RecursiveTreeNode => {
      return {
        id: `node-${nodeIdCounter++}`,
        range,
        array: [...array],
        level,
        state: 'dividing',
      };
    };

    const mergeSortRecursive = (low: number, high: number, level: number): RecursiveTreeNode => {
      const currentArray = workArray.slice(low, high + 1);
      const node = createTreeNode([low, high], currentArray, level);

      if (low >= high) {
        node.state = 'merged';
        allSteps.push({
          type: 'divide',
          array: [...workArray],
          low,
          high,
          robotMessage: `Base case reached! Array [${workArray[low]}] has only 1 element — already sorted.`,
          robotAction: 'point-mid',
          level,
          treeNode: {
            id: node.id,
            range: [low, high],
            level,
            state: 'merged',
          },
        });
        return node;
      }

      const mid = Math.floor((low + high) / 2);

      // Show midpoint calculation
      allSteps.push({
        type: 'divide',
        array: [...workArray],
        low,
        high,
        mid,
        robotMessage: `Let's find the middle! mid = (${low} + ${high}) / 2 = ${mid}`,
        robotAction: 'point-mid',
        level,
        treeNode: {
          id: node.id,
          range: [low, high],
          level,
          state: 'dividing',
        },
      });

      // Show splitting
      const leftArray = workArray.slice(low, mid + 1);
      const rightArray = workArray.slice(mid + 1, high + 1);

      allSteps.push({
        type: 'divide',
        array: [...workArray],
        low,
        high,
        mid,
        leftArray,
        rightArray,
        robotMessage: `Splitting at index ${mid}! Left: [${leftArray.join(', ')}] | Right: [${rightArray.join(', ')}]`,
        robotAction: 'split',
        level,
        treeNode: {
          id: node.id,
          range: [low, high],
          level,
          state: 'divided',
        },
      });

      // Recurse left and right
      node.left = mergeSortRecursive(low, mid, level + 1);
      node.right = mergeSortRecursive(mid + 1, high, level + 1);
      node.state = 'divided';

      // Merge phase
      const leftArr = workArray.slice(low, mid + 1);
      const rightArr = workArray.slice(mid + 1, high + 1);

      allSteps.push({
        type: 'merge',
        array: [...workArray],
        low,
        high,
        mid,
        leftArray: leftArr,
        rightArray: rightArr,
        robotMessage: `Now merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]...`,
        robotAction: 'merge',
        level,
        treeNode: {
          id: node.id,
          range: [low, high],
          level,
          state: 'merging',
        },
      });

      let i = 0, j = 0, k = low;
      const merged: number[] = [];

      while (i < leftArr.length && j < rightArr.length) {
        allSteps.push({
          type: 'merge',
          array: [...workArray],
          low,
          high,
          mid,
          leftArray: [...leftArr],
          rightArray: [...rightArr],
          comparing: [i, j],
          merged: [...merged],
          robotMessage: `Comparing ${leftArr[i]} vs ${rightArr[j]}... ${leftArr[i] <= rightArr[j] ? leftArr[i] : rightArr[j]} is smaller!`,
          robotAction: 'compare',
          level,
          treeNode: {
            id: node.id,
            range: [low, high],
            level,
            state: 'merging',
          },
        });

        if (leftArr[i] <= rightArr[j]) {
          workArray[k] = leftArr[i];
          merged.push(leftArr[i]);
          i++;
        } else {
          workArray[k] = rightArr[j];
          merged.push(rightArr[j]);
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        workArray[k] = leftArr[i];
        merged.push(leftArr[i]);
        i++;
        k++;
      }

      while (j < rightArr.length) {
        workArray[k] = rightArr[j];
        merged.push(rightArr[j]);
        j++;
        k++;
      }

      node.state = 'merged';
      node.array = [...merged];

      allSteps.push({
        type: 'merge',
        array: [...workArray],
        low,
        high,
        merged: [...merged],
        robotMessage: `Merged! Result: [${merged.join(', ')}]`,
        robotAction: 'merge',
        level,
        treeNode: {
          id: node.id,
          range: [low, high],
          level,
          state: 'merged',
        },
      });

      return node;
    };

    const rootNode = mergeSortRecursive(0, arr.length - 1, 0);

    allSteps.push({
      type: 'complete',
      array: [...workArray],
      low: 0,
      high: arr.length - 1,
      robotMessage: `🎉 All merged! The array is completely sorted: [${workArray.join(', ')}]`,
      robotAction: 'celebrate',
      level: 0,
    });

    return allSteps;
  };

  const handleStart = () => {
    const newSteps = generateSteps(inputArray);
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

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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

  // Robot component with animations
  const Robot = ({ action, message }: { action: string; message: string }) => {
    return (
      <div className="flex flex-col items-center gap-2">
        <motion.div
          className="text-6xl"
          animate={{
            scale: action === 'celebrate' ? [1, 1.2, 1] : 1,
            rotate: action === 'split' ? [-10, 10, -10, 0] : 0,
            y: action === 'point-mid' ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: action === 'celebrate' ? 0.5 : 1,
            repeat: action === 'celebrate' ? Infinity : 0,
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
            className="max-w-md p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 relative"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white/20"></div>
            <p className="text-sm text-white/90 text-center">{message}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl text-white mb-2">Merge Sort: Divide & Conquer</h1>
          <p className="text-white/70">Learn how arrays split and merge using mid = (low + high) / 2</p>
        </div>

        {/* Controls */}
        <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              disabled={steps.length > 0 && currentStep > 0}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Merge Sort
            </Button>
            
            {steps.length > 0 && (
              <>
                <Button
                  onClick={togglePlay}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Auto Play'}
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
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-white/70 text-sm">Speed:</span>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white text-sm"
                  >
                    <option value={2500} className="bg-gray-800 text-white">Slow</option>
                    <option value={1500} className="bg-gray-800 text-white">Normal</option>
                    <option value={800} className="bg-gray-800 text-white">Fast</option>
                  </select>
                </div>

                <Badge variant="outline" className="border-white/30 text-white">
                  Step {currentStep + 1} / {steps.length}
                </Badge>
              </>
            )}
          </div>
        </Card>

        {/* Main Content */}
        {currentState && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Visualization Area - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Robot Teacher */}
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <Robot action={currentState.robotAction} message={currentState.robotMessage} />
              </Card>

              {/* Array Visualization */}
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                {/* Variables Display */}
                <div className="flex justify-center gap-6 mb-4">
                  {currentState.low !== undefined && (
                    <Badge className="bg-blue-500/20 border-blue-400/50 text-blue-200">
                      low = {currentState.low}
                    </Badge>
                  )}
                  {currentState.mid !== undefined && (
                    <Badge className="bg-yellow-500/20 border-yellow-400/50 text-yellow-200">
                      mid = {currentState.mid}
                    </Badge>
                  )}
                  {currentState.high !== undefined && (
                    <Badge className="bg-green-500/20 border-green-400/50 text-green-200">
                      high = {currentState.high}
                    </Badge>
                  )}
                </div>

                {/* Formula Display */}
                {currentState.mid !== undefined && currentState.robotAction === 'point-mid' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg"
                  >
                    <div className="text-center text-yellow-200">
                      <span className="text-sm">Formula: </span>
                      <span className="font-mono">
                        mid = ({currentState.low} + {currentState.high}) / 2 = <span className="text-yellow-400">{currentState.mid}</span>
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Main Array */}
                <div className="mb-6">
                  <div className="text-xs text-white/60 mb-2 text-center">Main Array</div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {currentState.array.map((value, idx) => {
                      let colorClass = 'from-slate-400 to-slate-500';
                      let ringClass = '';
                      
                      if (currentState.low !== undefined && currentState.high !== undefined) {
                        if (currentState.mid !== undefined) {
                          if (idx <= currentState.mid && idx >= currentState.low) {
                            colorClass = 'from-blue-400 to-blue-500';
                          } else if (idx > currentState.mid && idx <= currentState.high) {
                            colorClass = 'from-green-400 to-green-500';
                          }
                        }
                        
                        if (idx === currentState.mid) {
                          ringClass = 'ring-4 ring-yellow-400/60';
                        }
                      }

                      if (currentState.type === 'complete') {
                        colorClass = 'from-emerald-400 to-teal-500';
                      }

                      return (
                        <motion.div
                          key={idx}
                          className="relative"
                          animate={{
                            scale: idx === currentState.mid ? 1.1 : 1,
                          }}
                        >
                          <div className={`flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${colorClass} text-white shadow-lg ${ringClass}`}>
                            {value}
                          </div>
                          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-white/50">
                            [{idx}]
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Dividing Line */}
                {currentState.mid !== undefined && currentState.robotAction === 'split' && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="h-12 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600"></div>
                  </motion.div>
                )}

                {/* Split Subarrays */}
                {currentState.leftArray && currentState.rightArray && (
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: currentState.robotAction === 'split' ? -20 : 0, opacity: 1 }}
                      className="p-3 bg-blue-500/10 rounded-lg border border-blue-400/30"
                    >
                      <div className="text-xs text-blue-300 mb-2 flex items-center gap-2">
                        <span>Left Half</span>
                        <Badge className="bg-blue-500/20 border-blue-400/50 text-blue-200 text-xs">
                          {currentState.leftArray.length} elements
                        </Badge>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-center">
                        {currentState.leftArray.map((value, idx) => (
                          <motion.div
                            key={`left-${idx}`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md ${
                              currentState.comparing?.[0] === idx ? 'ring-2 ring-amber-400' : ''
                            }`}
                          >
                            {value}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: currentState.robotAction === 'split' ? 20 : 0, opacity: 1 }}
                      className="p-3 bg-green-500/10 rounded-lg border border-green-400/30"
                    >
                      <div className="text-xs text-green-300 mb-2 flex items-center gap-2">
                        <span>Right Half</span>
                        <Badge className="bg-green-500/20 border-green-400/50 text-green-200 text-xs">
                          {currentState.rightArray.length} elements
                        </Badge>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-center">
                        {currentState.rightArray.map((value, idx) => (
                          <motion.div
                            key={`right-${idx}`}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md ${
                              currentState.comparing?.[1] === idx ? 'ring-2 ring-amber-400' : ''
                            }`}
                          >
                            {value}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Merged Result */}
                {currentState.merged && currentState.merged.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-400/30"
                  >
                    <div className="text-xs text-purple-300 mb-2 flex items-center gap-2">
                      <span>✓ Merged Result</span>
                      <Badge className="bg-purple-500/20 border-purple-400/50 text-purple-200 text-xs">
                        {currentState.merged.length} elements
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {currentState.merged.map((value, idx) => (
                        <motion.div
                          key={`merged-${idx}`}
                          initial={{ scale: 0, y: -20 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-md"
                        >
                          {value}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </div>

            {/* Recursive Tree Diagram - Takes 1 column */}
            <div className="lg:col-span-1">
              <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <h3 className="text-white mb-4 text-center">Recursion Tree</h3>
                <div className="text-xs text-white/60 text-center mb-4">
                  Shows how the array divides and merges
                </div>
                
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {currentState.treeNode && (
                    <TreeVisualization currentNode={currentState.treeNode} level={currentState.level} />
                  )}
                  
                  {/* Legend */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-xs text-white/70 mb-2">Legend:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-violet-500"></div>
                        <span className="text-white/60">Dividing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span className="text-white/60">Divided</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500"></div>
                        <span className="text-white/60">Merging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500"></div>
                        <span className="text-white/60">Merged</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!currentState && (
          <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl text-white mb-4">Ready to Learn Merge Sort?</h2>
            <p className="text-white/70 mb-6">
              Click "Start Merge Sort" to see how we divide the array using the midpoint formula and merge it back together!
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {inputArray.map((value, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-lg"
                >
                  {value}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// Tree Visualization Component
function TreeVisualization({ currentNode, level }: { currentNode: any; level: number }) {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'dividing':
        return 'from-violet-500 to-purple-600';
      case 'divided':
        return 'from-blue-500 to-cyan-600';
      case 'merging':
        return 'from-amber-500 to-orange-600';
      case 'merged':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col items-center"
      style={{ paddingLeft: `${level * 12}px` }}
    >
      <div className={`p-2 rounded-lg bg-gradient-to-br ${getStateColor(currentNode.state)} text-white text-xs text-center min-w-[120px] shadow-lg border-2 border-white/20`}>
        <div className="font-mono">
          [{currentNode.range[0]}...{currentNode.range[1]}]
        </div>
        <div className="text-[10px] text-white/80 mt-1">
          Level {currentNode.level}
        </div>
      </div>
    </motion.div>
  );
}
