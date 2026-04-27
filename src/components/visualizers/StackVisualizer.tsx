import { useState, useEffect } from 'react';
import { Plus, Minus, Eye, Trash2, BookOpen, GraduationCap, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'motion/react';

export function StackVisualizer() {
  const [mode, setMode] = useState<'explain' | 'learn'>('explain');
  const [stack, setStack] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [explainStep, setExplainStep] = useState(0);
  const [robotAction, setRobotAction] = useState<'idle' | 'push' | 'pop' | 'peek'>('idle');

  // Default example for Explain mode
  const explainSteps = [
    { stack: [], message: 'Stack is empty. Let\'s start by adding elements!', action: 'idle' as const },
    { stack: ['Page 1'], message: '🤖 Pushed "Page 1" - This is like opening your first webpage', action: 'push' as const },
    { stack: ['Page 1', 'Page 2'], message: '🤖 Pushed "Page 2" - Navigated to a new page', action: 'push' as const },
    { stack: ['Page 1', 'Page 2', 'Page 3'], message: '🤖 Pushed "Page 3" - Another page opened', action: 'push' as const },
    { stack: ['Page 1', 'Page 2'], message: '🤖 Popped "Page 3" - Hit the back button!', action: 'pop' as const },
    { stack: ['Page 1'], message: '🤖 Popped "Page 2" - Going back again (LIFO - Last In, First Out)', action: 'pop' as const },
  ];

  useEffect(() => {
    if (mode === 'explain') {
      setExplainStep(0);
      setStack(explainSteps[0].stack);
      setMessage(explainSteps[0].message);
      setRobotAction(explainSteps[0].action);
    } else {
      setStack([]);
      setMessage('');
      setRobotAction('idle');
    }
  }, [mode]);

  const nextExplainStep = () => {
    const nextStep = (explainStep + 1) % explainSteps.length;
    setExplainStep(nextStep);
    setStack(explainSteps[nextStep].stack);
    setMessage(explainSteps[nextStep].message);
    setRobotAction(explainSteps[nextStep].action);
  };

  const push = () => {
    if (!inputValue.trim()) {
      setMessage('🤖 Please enter a value!');
      return;
    }
    setRobotAction('push');
    setStack([...stack, inputValue]);
    setMessage(`🤖 Pushed "${inputValue}" to the stack`);
    setInputValue('');
    setTimeout(() => setRobotAction('idle'), 1000);
  };

  const pop = () => {
    if (stack.length === 0) {
      setMessage('🤖 Stack is empty! Cannot pop.');
      return;
    }
    setRobotAction('pop');
    const popped = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setMessage(`🤖 Popped "${popped}" from the stack`);
    setTimeout(() => setRobotAction('idle'), 1000);
  };

  const peek = () => {
    if (stack.length === 0) {
      setMessage('🤖 Stack is empty! Nothing to peek.');
      return;
    }
    setRobotAction('peek');
    setMessage(`🤖 Top element: "${stack[stack.length - 1]}"`);
    setTimeout(() => setRobotAction('idle'), 1000);
  };

  const clear = () => {
    setStack([]);
    setMessage('🤖 Stack cleared');
    setRobotAction('idle');
  };

  const Robot = ({ action }: { action: string }) => {
    const getEmoji = () => {
      switch (action) {
        case 'push':
          return '🤖⬇️';
        case 'pop':
          return '🤖⬆️';
        case 'peek':
          return '🤖👀';
        default:
          return '🤖';
      }
    };

    return (
      <motion.div
        className="text-4xl absolute -left-16 top-0"
        animate={{
          y: action === 'push' ? [0, 10, 0] : action === 'pop' ? [0, -10, 0] : 0,
          scale: action === 'peek' ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: action !== 'idle' ? 2 : 0,
        }}
      >
        {getEmoji()}
      </motion.div>
    );
  };

  const renderStack = () => (
    <div className="min-h-[400px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col-reverse items-center justify-start gap-2 relative">
      <Robot action={robotAction} />
      {stack.length === 0 ? (
        <div className="text-white/60 text-center mt-32">
          {mode === 'explain' ? 'Stack is empty. Click "Next Step" to see how it works!' : 'Stack is empty. Push some elements to get started!'}
        </div>
      ) : (
        <>
          <AnimatePresence>
            {stack.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: index === stack.length - 1 ? 1.05 : 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`w-64 p-4 rounded-lg shadow-lg transition-all duration-300 ${
                  index === stack.length - 1
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{item}</span>
                  {index === stack.length - 1 && (
                    <Badge className="bg-white text-cyan-600 border-0">TOP</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="w-64 h-1 bg-white/40 mt-2" />
          <div className="text-sm text-white/60">Bottom</div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <div>
              <CardTitle className="text-white">Stack Visualization (LIFO)</CardTitle>
              <CardDescription className="text-white/60">
                Last In First Out - The last element added is the first one to be removed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'explain' | 'learn')}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="explain" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20">
                <BookOpen className="w-4 h-4" />
                Explain
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20">
                <GraduationCap className="w-4 h-4" />
                Learn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explain" className="space-y-4 mt-4">
              {/* Explain Mode Controls */}
              <div className="flex justify-center">
                <Button
                  onClick={nextExplainStep}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                >
                  Next Step ({explainStep + 1}/{explainSteps.length})
                </Button>
              </div>

              {/* Message */}
              {message && (
                <div className="p-4 bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-lg text-cyan-200">
                  {message}
                </div>
              )}

              {/* Stack Info */}
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="border-cyan-400 text-cyan-300 bg-cyan-500/10">
                  Size: {stack.length}
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-500/10">
                  Top: {stack.length > 0 ? stack[stack.length - 1] : 'Empty'}
                </Badge>
              </div>

              {/* Visual Stack */}
              {renderStack()}
            </TabsContent>

            <TabsContent value="learn" className="space-y-4 mt-4">
              {/* Learn Mode Controls */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && push()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Button
                  onClick={push}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Push
                </Button>
                <Button
                  onClick={pop}
                  className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Pop
                </Button>
                <Button onClick={peek} variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <Eye className="w-4 h-4 mr-2" />
                  Peek
                </Button>
                <Button onClick={clear} variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>

              {/* Message */}
              {message && (
                <div className="p-3 bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-lg text-cyan-200 text-sm">
                  {message}
                </div>
              )}

              {/* Stack Info */}
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="border-cyan-400 text-cyan-300 bg-cyan-500/10">
                  Size: {stack.length}
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-500/10">
                  Top: {stack.length > 0 ? stack[stack.length - 1] : 'Empty'}
                </Badge>
              </div>

              {/* Visual Stack */}
              {renderStack()}
            </TabsContent>
          </Tabs>

          {/* Explanation */}
          <Card className="bg-purple-500/10 backdrop-blur-sm border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">How Stack Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/80">
              <p>
                <strong className="text-cyan-300">Push:</strong> Adds an element to the top of the stack
              </p>
              <p>
                <strong className="text-cyan-300">Pop:</strong> Removes and returns the top element
              </p>
              <p>
                <strong className="text-cyan-300">Peek:</strong> Returns the top element without removing it
              </p>
              <p className="text-cyan-200">
                <strong>Real-world examples:</strong> Undo/Redo in editors, Browser back button,
                Function call stack
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
