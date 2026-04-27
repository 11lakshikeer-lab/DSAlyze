import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';

import { motion } from 'motion/react';

type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'heap';

interface SortStep {
  array: number[];
  comparing: number[];
  sorted: number[];
  swapped?: boolean;
  robotPosition?: number;
  robotAction?: 'idle' | 'grab' | 'compare' | 'swap' | 'celebrate' | 'merge' | 'divide' | 'extract';
  activeRange?: number[];
  merging?: boolean;
  heapifying?: number[];
  heapSize?: number;
  // Merge sort specific
  divisionTree?: Array<{ start: number; end: number; level: number; isMerging?: boolean }>;
  leftSubarray?: number[];
  rightSubarray?: number[];
  mergeTarget?: { start: number; end: number };
}

export function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [sorting, setSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [speed, setSpeed] = useState(500);
  const [arraySize, setArraySize] = useState(10);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  useEffect(() => {
    generateArray();
  }, []);

  useEffect(() => {
    if (true) {
      generateArray();
    }
  }, [arraySize]);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setSwaps(0);
    setSorting(false);
  };

  const bubbleSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const n = arr.length;
    const workArray = [...arr];
    const sorted: number[] = [];
    let compCount = 0;
    let swapCount = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        compCount++;
        steps.push({
          array: [...workArray],
          comparing: [j, j + 1],
          sorted: [...sorted],
          swapped: false,
          robotPosition: j,
          robotAction: 'compare',
        });

        if (workArray[j] > workArray[j + 1]) {
          [workArray[j], workArray[j + 1]] = [workArray[j + 1], workArray[j]];
          swapCount++;
          steps.push({
            array: [...workArray],
            comparing: [j, j + 1],
            sorted: [...sorted],
            swapped: true,
            robotPosition: j,
            robotAction: 'swap',
          });
        }
      }
      sorted.unshift(n - i - 1);
    }
    sorted.unshift(0);

    steps.push({
      array: [...workArray],
      comparing: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      robotPosition: n / 2,
      robotAction: 'celebrate',
    });

    setComparisons(compCount);
    setSwaps(swapCount);
    return steps;
  };

  const selectionSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const n = arr.length;
    const workArray = [...arr];
    const sorted: number[] = [];
    let compCount = 0;
    let swapCount = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        compCount++;
        steps.push({
          array: [...workArray],
          comparing: [minIdx, j],
          sorted: [...sorted],
          robotPosition: j,
          robotAction: 'compare',
        });

        if (workArray[j] < workArray[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        swapCount++;
        [workArray[i], workArray[minIdx]] = [workArray[minIdx], workArray[i]];
        steps.push({
          array: [...workArray],
          comparing: [i, minIdx],
          sorted: [...sorted],
          swapped: true,
          robotPosition: i,
          robotAction: 'swap',
        });
      }
      sorted.push(i);
    }
    sorted.push(n - 1);

    steps.push({
      array: [...workArray],
      comparing: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      robotPosition: n / 2,
      robotAction: 'celebrate',
    });

    setComparisons(compCount);
    setSwaps(swapCount);
    return steps;
  };

  const insertionSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const n = arr.length;
    const workArray = [...arr];
    const sorted: number[] = [0];
    let compCount = 0;
    let swapCount = 0;

    for (let i = 1; i < n; i++) {
      const key = workArray[i];
      let j = i - 1;

      steps.push({
        array: [...workArray],
        comparing: [i],
        sorted: [...sorted],
        robotPosition: i,
        robotAction: 'grab',
      });

      while (j >= 0 && workArray[j] > key) {
        compCount++;
        swapCount++;
        workArray[j + 1] = workArray[j];
        steps.push({
          array: [...workArray],
          comparing: [j, j + 1],
          sorted: [...sorted],
          swapped: true,
          robotPosition: j,
          robotAction: 'swap',
        });
        j--;
      }
      if (j >= 0) compCount++;

      workArray[j + 1] = key;
      sorted.push(i);
      steps.push({
        array: [...workArray],
        comparing: [j + 1],
        sorted: [...sorted],
        robotPosition: j + 1,
        robotAction: 'idle',
      });
    }

    steps.push({
      array: [...workArray],
      comparing: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      robotPosition: n / 2,
      robotAction: 'celebrate',
    });

    setComparisons(compCount);
    setSwaps(swapCount);
    return steps;
  };

  const mergeSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const workArray = [...arr];
    let compCount = 0;
    let swapCount = 0;
    const divisionTree: Array<{ start: number; end: number; level: number }> = [];

    const buildDivisionTree = (left: number, right: number, level: number) => {
      divisionTree.push({ start: left, end: right, level });
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        buildDivisionTree(left, mid, level + 1);
        buildDivisionTree(mid + 1, right, level + 1);
      }
    };

    buildDivisionTree(0, arr.length - 1, 0);

    const merge = (left: number, mid: number, right: number, level: number) => {
      const leftArr = workArray.slice(left, mid + 1);
      const rightArr = workArray.slice(mid + 1, right + 1);

      // Show the two subarrays being merged
      steps.push({
        array: [...workArray],
        comparing: [],
        sorted: [],
        leftSubarray: leftArr,
        rightSubarray: rightArr,
        mergeTarget: { start: left, end: right },
        activeRange: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        robotPosition: mid,
        robotAction: 'divide',
        divisionTree: divisionTree.map(d => ({
          ...d,
          isMerging: d.start === left && d.end === right
        })),
      });

      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        compCount++;
        
        // Highlight which elements we're comparing from left and right subarrays
        steps.push({
          array: [...workArray],
          comparing: [k],
          sorted: [],
          leftSubarray: leftArr,
          rightSubarray: rightArr,
          mergeTarget: { start: left, end: right },
          activeRange: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          robotPosition: k,
          robotAction: 'compare',
          divisionTree: divisionTree.map(d => ({
            ...d,
            isMerging: d.start === left && d.end === right
          })),
        });

        if (leftArr[i] <= rightArr[j]) {
          workArray[k] = leftArr[i];
          i++;
        } else {
          workArray[k] = rightArr[j];
          j++;
          swapCount++;
        }
        
        // Show the merge happening
        steps.push({
          array: [...workArray],
          comparing: [k],
          sorted: [],
          leftSubarray: leftArr.slice(i),
          rightSubarray: rightArr.slice(j),
          mergeTarget: { start: left, end: right },
          activeRange: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          robotPosition: k,
          robotAction: 'merge',
          divisionTree: divisionTree.map(d => ({
            ...d,
            isMerging: d.start === left && d.end === right
          })),
        });
        k++;
      }

      // Copy remaining elements from left subarray
      while (i < leftArr.length) {
        workArray[k] = leftArr[i];
        steps.push({
          array: [...workArray],
          comparing: [k],
          sorted: [],
          leftSubarray: leftArr.slice(i),
          rightSubarray: [],
          mergeTarget: { start: left, end: right },
          activeRange: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          robotPosition: k,
          robotAction: 'merge',
          divisionTree: divisionTree.map(d => ({
            ...d,
            isMerging: d.start === left && d.end === right
          })),
        });
        i++;
        k++;
      }

      // Copy remaining elements from right subarray
      while (j < rightArr.length) {
        workArray[k] = rightArr[j];
        steps.push({
          array: [...workArray],
          comparing: [k],
          sorted: [],
          leftSubarray: [],
          rightSubarray: rightArr.slice(j),
          mergeTarget: { start: left, end: right },
          activeRange: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          robotPosition: k,
          robotAction: 'merge',
          divisionTree: divisionTree.map(d => ({
            ...d,
            isMerging: d.start === left && d.end === right
          })),
        });
        j++;
        k++;
      }

      // Show completed merge for this range
      steps.push({
        array: [...workArray],
        comparing: [],
        sorted: [],
        leftSubarray: [],
        rightSubarray: [],
        mergeTarget: { start: left, end: right },
        activeRange: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        robotPosition: (left + right) / 2,
        robotAction: 'idle',
        divisionTree: divisionTree.map(d => ({
          ...d,
          isMerging: false
        })),
      });
    };

    const mergeSortHelper = (left: number, right: number, level: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Show dividing step
        steps.push({
          array: [...workArray],
          comparing: [],
          sorted: [],
          activeRange: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          robotPosition: mid,
          robotAction: 'divide',
          divisionTree: divisionTree.map(d => ({
            ...d,
            isMerging: d.start === left && d.end === right
          })),
        });
        
        mergeSortHelper(left, mid, level + 1);
        mergeSortHelper(mid + 1, right, level + 1);
        merge(left, mid, right, level);
      }
    };

    mergeSortHelper(0, arr.length - 1, 0);

    steps.push({
      array: [...workArray],
      comparing: [],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      robotPosition: arr.length / 2,
      robotAction: 'celebrate',
      divisionTree: [],
    });

    setComparisons(compCount);
    setSwaps(swapCount);
    return steps;
  };

  const heapSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const workArray = [...arr];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;

    const heapify = (size: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      // Show the heap structure being checked (parent and children)
      const heapNodes = [i];
      if (left < size) heapNodes.push(left);
      if (right < size) heapNodes.push(right);

      steps.push({
        array: [...workArray],
        comparing: [],
        sorted: [],
        heapifying: heapNodes,
        heapSize: size,
        robotPosition: i,
        robotAction: 'compare',
      });

      if (left < size) {
        compCount++;
        steps.push({
          array: [...workArray],
          comparing: [largest, left],
          sorted: [],
          heapifying: heapNodes,
          heapSize: size,
          robotPosition: left,
          robotAction: 'compare',
        });
        if (workArray[left] > workArray[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        compCount++;
        steps.push({
          array: [...workArray],
          comparing: [largest, right],
          sorted: [],
          heapifying: heapNodes,
          heapSize: size,
          robotPosition: right,
          robotAction: 'compare',
        });
        if (workArray[right] > workArray[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        swapCount++;
        [workArray[i], workArray[largest]] = [workArray[largest], workArray[i]];
        steps.push({
          array: [...workArray],
          comparing: [i, largest],
          sorted: [],
          swapped: true,
          heapifying: heapNodes,
          heapSize: size,
          robotPosition: i,
          robotAction: 'swap',
        });
        heapify(size, largest);
      }
    };

    // Build max heap - Phase 1
    steps.push({
      array: [...workArray],
      comparing: [],
      sorted: [],
      heapSize: n,
      robotPosition: Math.floor(n / 2) - 1,
      robotAction: 'idle',
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Show heap construction complete
    steps.push({
      array: [...workArray],
      comparing: [],
      sorted: [],
      heapSize: n,
      robotPosition: 0,
      robotAction: 'idle',
    });

    // Extract elements from heap - Phase 2
    const sorted: number[] = [];
    for (let i = n - 1; i > 0; i--) {
      swapCount++;
      // Show extraction step
      steps.push({
        array: [...workArray],
        comparing: [0, i],
        sorted: [...sorted],
        heapSize: i + 1,
        robotPosition: 0,
        robotAction: 'extract',
      });
      
      [workArray[0], workArray[i]] = [workArray[i], workArray[0]];
      steps.push({
        array: [...workArray],
        comparing: [0, i],
        sorted: [...sorted],
        swapped: true,
        heapSize: i,
        robotPosition: 0,
        robotAction: 'swap',
      });
      sorted.unshift(i);
      
      // Show the newly sorted element
      steps.push({
        array: [...workArray],
        comparing: [],
        sorted: [...sorted, i],
        heapSize: i,
        robotPosition: i,
        robotAction: 'idle',
      });
      
      heapify(i, 0);
    }
    sorted.unshift(0);

    steps.push({
      array: [...workArray],
      comparing: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      heapSize: 0,
      robotPosition: n / 2,
      robotAction: 'celebrate',
    });

    setComparisons(compCount);
    setSwaps(swapCount);
    return steps;
  };

  const startSort = () => {
    let sortSteps: SortStep[] = [];
    
    if (algorithm === 'bubble') {
      sortSteps = bubbleSort(array);
    } else if (algorithm === 'selection') {
      sortSteps = selectionSort(array);
    } else if (algorithm === 'insertion') {
      sortSteps = insertionSort(array);
    } else if (algorithm === 'merge') {
      sortSteps = mergeSort(array);
    } else if (algorithm === 'heap') {
      sortSteps = heapSort(array);
    }

    setSteps(sortSteps);
    setCurrentStep(0);
    setSorting(true);
  };

  useEffect(() => {
    if (sorting && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setSorting(false);
    }
  }, [sorting, currentStep, steps, speed]);

  const reset = () => {
    setCurrentStep(0);
    setSorting(false);
    setSteps([]);
    setComparisons(0);
    setSwaps(0);
  };

  const currentState = steps[currentStep] || {
    array: array,
    comparing: [],
    sorted: [],
    robotPosition: 0,
    robotAction: 'idle' as const,
  };

  const maxValue = Math.max(...array, 100);

  const algorithmInfo = {
    bubble: {
      name: 'Bubble Sort',
      description: 'Repeatedly swaps adjacent elements if they are in wrong order',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
    },
    selection: {
      name: 'Selection Sort',
      description: 'Finds minimum element and places it at the beginning',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
    },
    insertion: {
      name: 'Insertion Sort',
      description: 'Builds sorted array one item at a time by inserting elements',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
    },
    merge: {
      name: 'Merge Sort',
      description: 'Divides array into halves, sorts them and merges back',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
    },
    heap: {
      name: 'Heap Sort',
      description: 'Builds a max heap and extracts elements one by one',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
    },
  };

  // Robot component
  const Robot = ({ action, position }: { action: string; position: number }) => {
    const getEmoji = () => {
      switch (action) {
        case 'grab':
          return '🤖✋';
        case 'compare':
          return '🤖🔍';
        case 'swap':
          return '🤖🔄';
        case 'merge':
          return '🤖🔗';
        case 'divide':
          return '🤖✂️';
        case 'extract':
          return '🤖⬆️';
        case 'celebrate':
          return '🤖🎉';
        default:
          return '🤖';
      }
    };

    return (
      <motion.div
        className="absolute -top-12 text-2xl"
        animate={{
          left: `${(position / currentState.array.length) * 100}%`,
          rotate: action === 'swap' ? [0, -10, 10, 0] : action === 'divide' ? [0, 10, -10, 0] : 0,
          scale: action === 'celebrate' ? [1, 1.2, 1] : action === 'merge' || action === 'extract' ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.3,
          rotate: { repeat: action === 'swap' || action === 'divide' ? 2 : 0 },
          scale: { repeat: action === 'celebrate' ? Infinity : action === 'merge' || action === 'extract' ? 1 : 0, duration: 0.5 },
        }}
      >
        {getEmoji()}
      </motion.div>
    );
  };

  // Helper to calculate tree node positions
  const getTreeNodePosition = (index: number, totalLevels: number, level: number, positionInLevel: number, heapSize: number) => {
    // Calculate base spacing that scales with number of nodes at deepest level
    const nodesAtLevel = 2 ** level;
    const maxNodesAtBottom = 2 ** (totalLevels - 1);
    
    // Use percentage-based positioning with better spacing
    const spacing = 90; // Use 90% of available width
    const offset = (100 - spacing) / 2; // Center offset
    
    // Calculate horizontal position
    const x = offset + (spacing / nodesAtLevel) * (positionInLevel + 0.5);
    
    // Calculate vertical position with dynamic spacing based on tree depth
    const verticalSpacing = Math.min(70, 300 / totalLevels); // Adaptive vertical spacing
    const y = 40 + level * verticalSpacing;
    
    return { x, y };
  };

  // Render tree visualization for heap sort
  const renderTreeVisualization = () => {
    const heapSize = currentState.heapSize !== undefined ? currentState.heapSize : currentState.array.length;
    const totalLevels = Math.ceil(Math.log2(heapSize + 1));
    const isBuilding = currentState.sorted.length === 0; // Building phase if nothing sorted yet
    
    // Calculate positions for each node
    const nodes: Array<{ index: number; value: number; level: number; posInLevel: number; x: number; y: number }> = [];
    const edges: Array<{ from: number; to: number }> = [];
    
    for (let i = 0; i < heapSize; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (2 ** level - 1);
      const { x, y } = getTreeNodePosition(i, totalLevels, level, posInLevel, heapSize);
      
      nodes.push({
        index: i,
        value: currentState.array[i],
        level,
        posInLevel,
        x,
        y
      });
      
      // Add edges to children
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;
      if (leftChild < heapSize) edges.push({ from: i, to: leftChild });
      if (rightChild < heapSize) edges.push({ from: i, to: rightChild });
    }

    const isComparing = (idx: number) => currentState.comparing.includes(idx);
    const isSorted = (idx: number) => currentState.sorted.includes(idx);
    const isHeapifying = (idx: number) => currentState.heapifying?.includes(idx) || false;

    const getNodeColor = (idx: number) => {
      if (isSorted(idx)) return 'from-emerald-400 to-teal-500';
      if (isComparing(idx)) {
        return currentState.swapped ? 'from-red-400 to-orange-500' : 'from-amber-400 to-yellow-500';
      }
      if (isHeapifying(idx)) return 'from-fuchsia-400 to-purple-500';
      return 'from-cyan-400 to-blue-500';
    };

    // Calculate dynamic height based on tree depth
    const treeHeight = Math.max(300, Math.min(500, 40 + totalLevels * Math.min(70, 300 / totalLevels) + 60));

    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 relative">
        {/* Phase indicator */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <Badge className={isBuilding ? "bg-violet-500/20 border-violet-400/50 text-violet-200" : "bg-cyan-500/20 border-cyan-400/50 text-cyan-200"}>
            {isBuilding ? '🔨 Phase 1: Building Max Heap' : '⬆️ Phase 2: Extracting & Sorting'}
          </Badge>
          {heapSize > 0 && (
            <Badge variant="outline" className="border-white/30 text-white/70">
              Heap Size: {heapSize}
            </Badge>
          )}
        </div>

        {/* Tree visualization */}
        <div className="relative mb-4" style={{ height: `${treeHeight}px` }}>
          <svg className="absolute inset-0 w-full h-full">
            {/* Draw edges */}
            {edges.map(({ from, to }, idx) => {
              const fromNode = nodes[from];
              const toNode = nodes[to];
              const isActive = isHeapifying(from) || isHeapifying(to);
              
              return (
                <motion.line
                  key={`edge-${idx}`}
                  x1={`${fromNode.x}%`}
                  y1={fromNode.y}
                  x2={`${toNode.x}%`}
                  y2={toNode.y}
                  stroke={isActive ? '#c084fc' : '#60a5fa'}
                  strokeWidth={isActive ? '3' : '2'}
                  opacity={isActive ? 0.8 : 0.3}
                  animate={{
                    opacity: isActive ? [0.3, 0.8, 0.3] : 0.3,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isActive ? Infinity : 0,
                  }}
                />
              );
            })}
          </svg>

          {/* Draw nodes */}
          {nodes.map((node) => {
            const nodeSize = totalLevels <= 3 ? 48 : totalLevels <= 4 ? 40 : 36;
            const fontSize = totalLevels <= 3 ? 'text-base' : totalLevels <= 4 ? 'text-sm' : 'text-xs';
            
            return (
              <motion.div
                key={`node-${node.index}`}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: `${nodeSize}px`,
                  height: `${nodeSize}px`,
                }}
                animate={{
                  scale: isComparing(node.index) || isHeapifying(node.index) ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br ${getNodeColor(node.index)} shadow-lg ${
                    isHeapifying(node.index) ? 'ring-2 ring-fuchsia-300/60' : ''
                  }`}
                >
                  <span className={`text-white z-10 ${fontSize}`}>{node.value}</span>
                </div>
                {totalLevels <= 4 && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-white/40">
                    {node.index}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Sorted array visualization */}
        {currentState.sorted.length > 0 && (
          <div className="mt-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-400/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-emerald-300">✓ Sorted Array:</span>
              <Badge variant="outline" className="border-emerald-400/50 text-emerald-300 bg-emerald-500/10">
                {currentState.sorted.length} elements
              </Badge>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {currentState.array.map((value, idx) => 
                currentState.sorted.includes(idx) ? (
                  <motion.div
                    key={`sorted-${idx}`}
                    className="flex items-center justify-center min-w-[36px] h-9 px-2 rounded bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value}
                  </motion.div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Robot action message */}
        {steps.length > 0 && (
          <div className="mt-3 text-center">
            <Badge className="bg-purple-500/20 border-purple-400/50 text-purple-200">
              {currentState.robotAction === 'compare' && '🤖 Checking heap property...'}
              {currentState.robotAction === 'swap' && '🤖 Swapping to maintain heap!'}
              {currentState.robotAction === 'extract' && '🤖 Extracting max element...'}
              {currentState.robotAction === 'celebrate' && '🤖 Heap sort complete! 🎉'}
              {currentState.robotAction === 'idle' && (isBuilding ? '🤖 Building max heap...' : '🤖 Ready to extract...')}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const renderBarVisualization = () => (
    <div className="min-h-[350px] bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative">
      {/* Robot mascot */}
      {steps.length > 0 && (
        <Robot action={currentState.robotAction || 'idle'} position={currentState.robotPosition || 0} />
      )}
      
      <div className="flex items-end justify-center gap-1 h-64 relative">
        {currentState.array.map((value, idx) => {
          const isComparing = currentState.comparing.includes(idx);
          const isSorted = currentState.sorted.includes(idx);
          const isInActiveRange = currentState.activeRange?.includes(idx) || false;
          const isHeapifying = currentState.heapifying?.includes(idx) || false;
          const isMerging = currentState.merging || false;
          const height = (value / maxValue) * 100;

          // Determine color based on state
          let colorClass = 'bg-gradient-to-t from-cyan-400 to-blue-500';
          if (isSorted) {
            colorClass = 'bg-gradient-to-t from-emerald-400 to-teal-500';
          } else if (isComparing) {
            colorClass = currentState.swapped
              ? 'bg-gradient-to-t from-red-400 to-orange-500'
              : 'bg-gradient-to-t from-amber-400 to-yellow-500';
          } else if (isInActiveRange && isMerging) {
            colorClass = 'bg-gradient-to-t from-purple-400 to-pink-500';
          } else if (isInActiveRange && !isMerging) {
            colorClass = 'bg-gradient-to-t from-violet-400 to-purple-500';
          } else if (isHeapifying) {
            colorClass = 'bg-gradient-to-t from-fuchsia-400 to-purple-500';
          }

          return (
            <motion.div
              key={idx}
              className="flex flex-col items-center gap-1 flex-1"
              style={{ maxWidth: '60px' }}
              animate={{
                scale: isComparing || isHeapifying ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`w-full rounded-t transition-all duration-300 ${colorClass} ${
                  isInActiveRange ? 'ring-2 ring-white/40' : ''
                } ${isHeapifying ? 'ring-2 ring-fuchsia-300/60' : ''}`}
                style={{
                  height: `${height}%`,
                  minHeight: '20px',
                }}
                animate={{
                  height: `${height}%`,
                }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-xs text-white/80">{value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Robot action message */}
      {steps.length > 0 && (
        <div className="mt-4 text-center">
          <Badge className="bg-purple-500/20 border-purple-400/50 text-purple-200">
            {currentState.robotAction === 'compare' && '🤖 Comparing elements...'}
            {currentState.robotAction === 'swap' && '🤖 Swapping elements!'}
            {currentState.robotAction === 'grab' && '🤖 Grabbing element...'}
            {currentState.robotAction === 'merge' && '🤖 Merging subarrays...'}
            {currentState.robotAction === 'divide' && '🤖 Dividing array...'}
            {currentState.robotAction === 'celebrate' && '🤖 Sorting complete! 🎉'}
            {currentState.robotAction === 'idle' && '🤖 Ready to sort!'}
          </Badge>
        </div>
      )}
    </div>
  );

  // Render divide and conquer visualization for merge sort
  const renderMergeSortVisualization = () => {
    const hasSubarrays = currentState.leftSubarray || currentState.rightSubarray;

    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 relative">
        {/* Current operation indicator */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <Badge className={currentState.robotAction === 'divide' ? "bg-violet-500/20 border-violet-400/50 text-violet-200" : "bg-pink-500/20 border-pink-400/50 text-pink-200"}>
            {currentState.robotAction === 'divide' && '✂️ Dividing Array'}
            {currentState.robotAction === 'merge' && '🔗 Merging Subarrays'}
            {currentState.robotAction === 'compare' && '🔍 Comparing Elements'}
            {currentState.robotAction === 'idle' && '✓ Merge Complete'}
            {currentState.robotAction === 'celebrate' && '🎉 Sort Complete'}
          </Badge>
        </div>

        {/* Subarrays visualization */}
        {hasSubarrays && (
          <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-400/30">
            <div className="grid grid-cols-2 gap-4">
              {/* Left subarray */}
              <div>
                <div className="text-xs text-violet-300 mb-2 flex items-center gap-1">
                  <span>Left Subarray</span>
                  {currentState.leftSubarray && currentState.leftSubarray.length > 0 && (
                    <Badge variant="outline" className="border-violet-400/50 text-violet-300 bg-violet-500/10 text-xs">
                      {currentState.leftSubarray.length} elements
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap min-h-[40px] p-2 bg-violet-500/10 rounded border border-violet-400/20">
                  {currentState.leftSubarray?.map((value, idx) => (
                    <motion.div
                      key={`left-${idx}`}
                      className="flex items-center justify-center min-w-[36px] h-9 px-2 rounded bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-md"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                  {(!currentState.leftSubarray || currentState.leftSubarray.length === 0) && (
                    <span className="text-white/40 text-xs">Empty</span>
                  )}
                </div>
              </div>

              {/* Right subarray */}
              <div>
                <div className="text-xs text-pink-300 mb-2 flex items-center gap-1">
                  <span>Right Subarray</span>
                  {currentState.rightSubarray && currentState.rightSubarray.length > 0 && (
                    <Badge variant="outline" className="border-pink-400/50 text-pink-300 bg-pink-500/10 text-xs">
                      {currentState.rightSubarray.length} elements
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap min-h-[40px] p-2 bg-pink-500/10 rounded border border-pink-400/20">
                  {currentState.rightSubarray?.map((value, idx) => (
                    <motion.div
                      key={`right-${idx}`}
                      className="flex items-center justify-center min-w-[36px] h-9 px-2 rounded bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-md"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                  {(!currentState.rightSubarray || currentState.rightSubarray.length === 0) && (
                    <span className="text-white/40 text-xs">Empty</span>
                  )}
                </div>
              </div>
            </div>

            {/* Merge arrow */}
            <div className="flex justify-center my-2">
              <motion.div
                className="text-cyan-400 text-2xl"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⬇️
              </motion.div>
            </div>
          </div>
        )}

        {/* Main array visualization */}
        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
          <div className="text-xs text-cyan-300 mb-2">
            {currentState.mergeTarget ? 
              `Merging into positions [${currentState.mergeTarget.start}...${currentState.mergeTarget.end}]` : 
              'Complete Array'
            }
          </div>
          <div className="flex items-end justify-center gap-1 h-48">
            {currentState.array.map((value, idx) => {
              const isComparing = currentState.comparing.includes(idx);
              const isSorted = currentState.sorted.includes(idx);
              const isInActiveRange = currentState.activeRange?.includes(idx) || false;
              const height = (value / maxValue) * 100;

              let colorClass = 'bg-gradient-to-t from-slate-400 to-slate-500';
              if (isSorted) {
                colorClass = 'bg-gradient-to-t from-emerald-400 to-teal-500';
              } else if (isComparing) {
                colorClass = 'bg-gradient-to-t from-amber-400 to-yellow-500';
              } else if (isInActiveRange) {
                colorClass = 'bg-gradient-to-t from-cyan-400 to-blue-500';
              }

              return (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center gap-1 flex-1"
                  style={{ maxWidth: '60px' }}
                  animate={{
                    scale: isComparing ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`w-full rounded-t transition-all duration-300 ${colorClass} ${
                      isInActiveRange ? 'ring-2 ring-cyan-300/60' : ''
                    }`}
                    style={{
                      height: `${height}%`,
                      minHeight: '20px',
                    }}
                    animate={{
                      height: `${height}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="text-xs text-white/80">{value}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Robot action message */}
        {steps.length > 0 && (
          <div className="mt-3 text-center">
            <Badge className="bg-purple-500/20 border-purple-400/50 text-purple-200">
              {currentState.robotAction === 'compare' && '🤖 Comparing elements from subarrays...'}
              {currentState.robotAction === 'merge' && '🤖 Placing element in sorted position...'}
              {currentState.robotAction === 'divide' && '🤖 Dividing array into halves...'}
              {currentState.robotAction === 'idle' && '🤖 Merge complete for this range!'}
              {currentState.robotAction === 'celebrate' && '🤖 Merge sort complete! 🎉'}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const renderVisualization = () => {
    // Use tree visualization for heap sort, divide-conquer for merge sort, bar visualization for others
    if (algorithm === 'heap') {
      return renderTreeVisualization();
    }
    if (algorithm === 'merge') {
      return renderMergeSortVisualization();
    }
    return renderBarVisualization();
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <div>
              <CardTitle className="text-white">Sorting Algorithm Visualization</CardTitle>
              <CardDescription className="text-white/60">
                Watch how different sorting algorithms organize data step by step with help from our robot assistant!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Algorithm</label>
              <Select
                value={algorithm}
                onValueChange={(value: SortAlgorithm) => {
                  setAlgorithm(value);
                  reset();
                }}
                disabled={sorting}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                  <SelectItem value="heap">Heap Sort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80">Array Size: {arraySize}</label>
              <Slider
                value={[arraySize]}
                onValueChange={(value) => setArraySize(value[0])}
                min={5}
                max={15}
                step={1}
                disabled={sorting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Speed: {speed}ms</label>
            <Slider
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              min={100}
              max={1000}
              step={100}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={sorting ? () => setSorting(false) : startSort}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              disabled={steps.length > 0 && currentStep >= steps.length - 1}
            >
              {sorting ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={reset} variant="outline" disabled={sorting} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={generateArray} variant="outline" disabled={sorting} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              <Shuffle className="w-4 h-4 mr-2" />
              New Array
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            <Badge variant="outline" className="border-cyan-400 text-cyan-300 bg-cyan-500/10">
              Comparisons: {comparisons}
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-500/10">
              Swaps: {swaps}
            </Badge>
            <Badge variant="outline" className="border-emerald-400 text-emerald-300 bg-emerald-500/10">
              Step: {currentStep + 1} / {steps.length || 1}
            </Badge>
          </div>

          {/* Visualization */}
          {renderVisualization()}

          {/* Algorithm Info */}
          <Card className="bg-purple-500/10 backdrop-blur-sm border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">{algorithmInfo[algorithm].name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/80">
              <p>{algorithmInfo[algorithm].description}</p>
              <div className="flex gap-4 pt-2">
                <Badge variant="outline" className="border-cyan-400 text-cyan-300 bg-cyan-500/10">
                  Time: {algorithmInfo[algorithm].timeComplexity}
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-500/10">
                  Space: {algorithmInfo[algorithm].spaceComplexity}
                </Badge>
              </div>
              <div className="pt-2 space-y-1">
                <p className="text-cyan-300">
                  <strong>{algorithm === 'heap' ? 'Tree node colors:' : 'Color coding:'}</strong>
                </p>
                <div className="flex gap-3 text-xs flex-wrap">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-t from-cyan-400 to-blue-500 rounded" />
                    {algorithm === 'heap' ? 'In Heap' : 'Unsorted'}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-t from-amber-400 to-yellow-500 rounded" />
                    Comparing
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-t from-red-400 to-orange-500 rounded" />
                    Swapping
                  </span>
                  {algorithm === 'merge' && (
                    <>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gradient-to-t from-purple-400 to-pink-500 rounded ring-1 ring-white/40" />
                        Merging
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gradient-to-t from-violet-400 to-purple-500 rounded ring-1 ring-white/40" />
                        Active Range
                      </span>
                    </>
                  )}
                  {algorithm === 'heap' && (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gradient-to-t from-fuchsia-400 to-purple-500 rounded ring-2 ring-fuchsia-300/60" />
                      Heapifying
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-t from-emerald-400 to-teal-500 rounded" />
                    Sorted
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
