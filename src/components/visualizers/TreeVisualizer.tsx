import { useState, useEffect } from 'react';
import { Plus, Trash2, GitBranch, BookOpen, GraduationCap, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'motion/react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function TreeVisualizer() {
  const [mode, setMode] = useState<'explain' | 'learn'>('explain');
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [traversalResult, setTraversalResult] = useState('');
  const [explainStep, setExplainStep] = useState(0);
  const [robotAction, setRobotAction] = useState<'idle' | 'insert' | 'traverse'>('idle');

  // Default example for Explain mode
  const explainSteps = [
    { 
      values: [],
      message: 'Binary Search Tree is empty. Let\'s build one!',
      action: 'idle' as const
    },
    { 
      values: [50],
      message: '🤖 Inserted 50 as root node',
      action: 'insert' as const
    },
    { 
      values: [50, 30],
      message: '🤖 Inserted 30 - Goes left because 30 < 50',
      action: 'insert' as const
    },
    { 
      values: [50, 30, 70],
      message: '🤖 Inserted 70 - Goes right because 70 > 50',
      action: 'insert' as const
    },
    { 
      values: [50, 30, 70, 20],
      message: '🤖 Inserted 20 - Goes left of 30 (20 < 30 < 50)',
      action: 'insert' as const
    },
    { 
      values: [50, 30, 70, 20, 40],
      message: '🤖 Inserted 40 - Goes right of 30 (30 < 40 < 50)',
      action: 'insert' as const
    },
  ];

  useEffect(() => {
    if (mode === 'explain') {
      setExplainStep(0);
      buildTreeFromArray(explainSteps[0].values);
      setMessage(explainSteps[0].message);
      setRobotAction(explainSteps[0].action);
      setTraversalResult('');
    } else {
      setRoot(null);
      setMessage('');
      setRobotAction('idle');
      setTraversalResult('');
    }
  }, [mode]);

  const buildTreeFromArray = (values: number[]) => {
    let newRoot: TreeNode | null = null;
    for (const value of values) {
      newRoot = insertNode(newRoot, value);
    }
    setRoot(newRoot);
  };

  const nextExplainStep = () => {
    const nextStep = (explainStep + 1) % explainSteps.length;
    setExplainStep(nextStep);
    buildTreeFromArray(explainSteps[nextStep].values);
    setMessage(explainSteps[nextStep].message);
    setRobotAction(explainSteps[nextStep].action);
    setTraversalResult('');
  };

  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (node === null) {
      return { value, left: null, right: null };
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    }

    return node;
  };

  const insert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('🤖 Please enter a valid number!');
      return;
    }
    setRobotAction('insert');
    const newRoot = insertNode(root, value);
    setRoot(newRoot);
    setMessage(`🤖 Inserted ${value} into the tree`);
    setInputValue('');
    setTimeout(() => setRobotAction('idle'), 1000);
  };

  const clear = () => {
    setRoot(null);
    setTraversalResult('');
    setMessage('🤖 Tree cleared');
    setRobotAction('idle');
  };

  const inorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      inorderTraversal(node.left, result);
      result.push(node.value);
      inorderTraversal(node.right, result);
    }
    return result;
  };

  const preorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      result.push(node.value);
      preorderTraversal(node.left, result);
      preorderTraversal(node.right, result);
    }
    return result;
  };

  const postorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      postorderTraversal(node.left, result);
      postorderTraversal(node.right, result);
      result.push(node.value);
    }
    return result;
  };

  const traverse = (type: 'inorder' | 'preorder' | 'postorder') => {
    setRobotAction('traverse');
    let result: number[] = [];
    if (type === 'inorder') result = inorderTraversal(root);
    else if (type === 'preorder') result = preorderTraversal(root);
    else if (type === 'postorder') result = postorderTraversal(root);
    
    setTraversalResult(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${result.join(' → ')}`);
    setTimeout(() => setRobotAction('idle'), 1500);
  };

  const Robot = () => {
    const getEmoji = () => {
      switch (robotAction) {
        case 'insert':
          return '🤖⬇️';
        case 'traverse':
          return '🤖👣';
        default:
          return '🤖';
      }
    };

    return (
      <motion.div
        className="text-4xl absolute top-4 right-4 z-10"
        animate={{
          rotate: robotAction === 'traverse' ? [0, -10, 10, 0] : 0,
          scale: robotAction === 'insert' ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: robotAction !== 'idle' ? 2 : 0,
        }}
      >
        {getEmoji()}
      </motion.div>
    );
  };

  const renderTree = (node: TreeNode | null, x: number, y: number, offset: number): JSX.Element[] => {
    if (node === null) return [];

    const elements: JSX.Element[] = [];
    const nodeSize = 40;

    // Draw lines to children
    if (node.left) {
      const childX = x - offset;
      const childY = y + 80;
      elements.push(
        <line
          key={`line-left-${node.value}-${x}-${y}`}
          x1={x}
          y1={y + nodeSize / 2}
          x2={childX}
          y2={childY - nodeSize / 2}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.left, childX, childY, offset / 2));
    }

    if (node.right) {
      const childX = x + offset;
      const childY = y + 80;
      elements.push(
        <line
          key={`line-right-${node.value}-${x}-${y}`}
          x1={x}
          y1={y + nodeSize / 2}
          x2={childX}
          y2={childY - nodeSize / 2}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.right, childX, childY, offset / 2));
    }

    // Draw node
    elements.push(
      <g key={`node-${node.value}-${x}-${y}`}>
        <circle
          cx={x}
          cy={y}
          r={nodeSize / 2}
          fill="url(#gradient)"
          stroke="rgba(139, 92, 246, 0.8)"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          className="select-none"
        >
          {node.value}
        </text>
      </g>
    );

    return elements;
  };

  const renderTreeView = () => (
    <div className="min-h-[400px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-auto relative">
      <Robot />
      {!root ? (
        <div className="text-white/60 text-center py-20">
          {mode === 'explain' ? 'Tree is empty. Click "Next Step" to see how it builds!' : 'Tree is empty. Insert some numbers to build the tree!'}
        </div>
      ) : (
        <svg width="100%" height="400" className="overflow-visible">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <g transform="translate(400, 40)">
            {renderTree(root, 0, 0, 100)}
          </g>
        </svg>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <div>
              <CardTitle className="text-white">Binary Search Tree Visualization</CardTitle>
              <CardDescription className="text-white/60">
                A hierarchical data structure where left child {'<'} parent {'<'} right child
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'explain' | 'learn')}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="explain" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                <BookOpen className="w-4 h-4" />
                Explain
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                <GraduationCap className="w-4 h-4" />
                Learn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explain" className="space-y-4 mt-4">
              {/* Explain Mode Controls */}
              <div className="flex justify-center">
                <Button
                  onClick={nextExplainStep}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
                >
                  Next Step ({explainStep + 1}/{explainSteps.length})
                </Button>
              </div>

              {/* Message */}
              {message && (
                <div className="p-4 bg-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-lg text-purple-200">
                  {message}
                </div>
              )}

              {/* Traversal Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => traverse('inorder')}
                  variant="outline"
                  size="sm"
                  disabled={!root}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Inorder
                </Button>
                <Button
                  onClick={() => traverse('preorder')}
                  variant="outline"
                  size="sm"
                  disabled={!root}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Preorder
                </Button>
                <Button
                  onClick={() => traverse('postorder')}
                  variant="outline"
                  size="sm"
                  disabled={!root}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Postorder
                </Button>
              </div>

              {/* Traversal Result */}
              {traversalResult && (
                <Badge variant="outline" className="border-emerald-400 text-emerald-300 py-2 px-4 bg-emerald-500/10">
                  {traversalResult}
                </Badge>
              )}

              {/* Visual Tree */}
              {renderTreeView()}
            </TabsContent>

            <TabsContent value="learn" className="space-y-4 mt-4">
              {/* Learn Mode Controls */}
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter a number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && insert()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Button
                  onClick={insert}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Insert
                </Button>
                <Button onClick={clear} variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>

              {/* Message */}
              {message && (
                <div className="p-3 bg-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-lg text-purple-200 text-sm">
                  {message}
                </div>
              )}

              {/* Traversal Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => traverse('inorder')}
                  variant="outline"
                  size="sm"
                  disabled={!root}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Inorder
                </Button>
                <Button
                  onClick={() => traverse('preorder')}
                  variant="outline"
                  size="sm"
                  disabled={!root}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Preorder
                </Button>
                <Button
                  onClick={() => traverse('postorder')}
                  variant="outline"
                  size="sm"
                  disabled={!root}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Postorder
                </Button>
              </div>

              {/* Traversal Result */}
              {traversalResult && (
                <Badge variant="outline" className="border-purple-400 text-purple-300 py-2 px-4 bg-purple-500/10">
                  {traversalResult}
                </Badge>
              )}

              {/* Visual Tree */}
              {renderTreeView()}
            </TabsContent>
          </Tabs>

          {/* Explanation */}
          <Card className="bg-purple-500/10 backdrop-blur-sm border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">How Binary Search Tree Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/80">
              <p>
                <strong className="text-purple-300">Insert:</strong> Add a new node maintaining BST property (left {'<'} parent {'<'} right)
              </p>
              <p>
                <strong className="text-purple-300">Inorder Traversal:</strong> Left → Root → Right (gives sorted order)
              </p>
              <p>
                <strong className="text-purple-300">Preorder Traversal:</strong> Root → Left → Right (useful for copying tree)
              </p>
              <p>
                <strong className="text-purple-300">Postorder Traversal:</strong> Left → Right → Root (useful for deleting tree)
              </p>
              <p className="text-purple-200">
                <strong>Real-world examples:</strong> File systems, Database indexing, Expression
                trees
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
