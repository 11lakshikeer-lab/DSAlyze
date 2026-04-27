import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Eye, Trash2, BookOpen, GraduationCap, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'motion/react';

export function QueueVisualizer() {
  const [mode, setMode] = useState<'explain' | 'learn'>('explain');
  const [queue, setQueue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [explainStep, setExplainStep] = useState(0);
  const [robotAction, setRobotAction] = useState<'idle' | 'enqueue' | 'dequeue' | 'peek'>('idle');

  // Default example for Explain mode
  const explainSteps = [
    { queue: [], message: 'Queue is empty. Let\'s simulate a customer service line!', action: 'idle' as const },
    { queue: ['Customer 1'], message: '🤖 Customer 1 joins the queue (Enqueue)', action: 'enqueue' as const },
    { queue: ['Customer 1', 'Customer 2'], message: '🤖 Customer 2 joins at the rear', action: 'enqueue' as const },
    { queue: ['Customer 1', 'Customer 2', 'Customer 3'], message: '🤖 Customer 3 also joins the queue', action: 'enqueue' as const },
    { queue: ['Customer 2', 'Customer 3'], message: '🤖 Customer 1 gets served and leaves (Dequeue) - FIFO!', action: 'dequeue' as const },
    { queue: ['Customer 3'], message: '🤖 Customer 2 is served next - First In, First Out', action: 'dequeue' as const },
  ];

  useEffect(() => {
    if (mode === 'explain') {
      setExplainStep(0);
      setQueue(explainSteps[0].queue);
      setMessage(explainSteps[0].message);
      setRobotAction(explainSteps[0].action);
    } else {
      setQueue([]);
      setMessage('');
      setRobotAction('idle');
    }
  }, [mode]);

  const nextExplainStep = () => {
    const nextStep = (explainStep + 1) % explainSteps.length;
    setExplainStep(nextStep);
    setQueue(explainSteps[nextStep].queue);
    setMessage(explainSteps[nextStep].message);
    setRobotAction(explainSteps[nextStep].action);
  };

  const enqueue = () => {
    if (!inputValue.trim()) {
      setMessage('🤖 Please enter a value!');
      return;
    }
    setRobotAction('enqueue');
    setQueue([...queue, inputValue]);
    setMessage(`🤖 Enqueued "${inputValue}" to the queue`);
    setInputValue('');
    setTimeout(() => setRobotAction('idle'), 1000);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setMessage('🤖 Queue is empty! Cannot dequeue.');
      return;
    }
    setRobotAction('dequeue');
    const dequeued = queue[0];
    setQueue(queue.slice(1));
    setMessage(`🤖 Dequeued "${dequeued}" from the queue`);
    setTimeout(() => setRobotAction('idle'), 1000);
  };

  const peek = () => {
    if (queue.length === 0) {
      setMessage('🤖 Queue is empty! Nothing to peek.');
      return;
    }
    setRobotAction('peek');
    setMessage(`🤖 Front element: "${queue[0]}"`);
    setTimeout(() => setRobotAction('idle'), 1000);
  };

  const clear = () => {
    setQueue([]);
    setMessage('🤖 Queue cleared');
    setRobotAction('idle');
  };

  const Robot = ({ action, position }: { action: string; position: 'front' | 'rear' }) => {
    const getEmoji = () => {
      switch (action) {
        case 'enqueue':
          return '🤖➡️';
        case 'dequeue':
          return '🤖⬅️';
        case 'peek':
          return '🤖👀';
        default:
          return '🤖';
      }
    };

    return (
      <motion.div
        className="text-4xl absolute top-0"
        style={{
          left: position === 'front' ? '0' : 'auto',
          right: position === 'rear' ? '0' : 'auto',
        }}
        animate={{
          x: action === 'enqueue' ? [0, 10, 0] : action === 'dequeue' ? [0, -10, 0] : 0,
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

  const renderQueue = () => (
    <div className="min-h-[300px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 relative">
      {robotAction === 'dequeue' && <Robot action={robotAction} position="front" />}
      {robotAction === 'enqueue' && <Robot action={robotAction} position="rear" />}
      {robotAction === 'peek' && <Robot action={robotAction} position="front" />}
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-white/60">Front (Dequeue) ←</div>
        <div className="text-sm text-white/60">→ Rear (Enqueue)</div>
      </div>
      
      {queue.length === 0 ? (
        <div className="text-white/60 text-center py-20">
          {mode === 'explain' ? 'Queue is empty. Click "Next Step" to see how it works!' : 'Queue is empty. Enqueue some elements to get started!'}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          <AnimatePresence>
            {queue.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: index === 0 ? 1.05 : 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`min-w-[120px] p-4 rounded-lg shadow-lg transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs mb-1 opacity-70">
                    {index === 0 ? 'FRONT' : index === queue.length - 1 ? 'REAR' : `Pos ${index}`}
                  </div>
                  <div className="truncate">{item}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
              <CardTitle className="text-white">Queue Visualization (FIFO)</CardTitle>
              <CardDescription className="text-white/60">
                First In First Out - The first element added is the first one to be removed
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

              {/* Queue Info */}
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="border-cyan-400 text-cyan-300 bg-cyan-500/10">
                  Size: {queue.length}
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-300 bg-blue-500/10">
                  Front: {queue.length > 0 ? queue[0] : 'Empty'}
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-500/10">
                  Rear: {queue.length > 0 ? queue[queue.length - 1] : 'Empty'}
                </Badge>
              </div>

              {/* Visual Queue */}
              {renderQueue()}
            </TabsContent>

            <TabsContent value="learn" className="space-y-4 mt-4">
              {/* Learn Mode Controls */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enqueue()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Button
                  onClick={enqueue}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Enqueue
                </Button>
                <Button
                  onClick={dequeue}
                  className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dequeue
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

              {/* Queue Info */}
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="border-cyan-400 text-cyan-300 bg-cyan-500/10">
                  Size: {queue.length}
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-300 bg-blue-500/10">
                  Front: {queue.length > 0 ? queue[0] : 'Empty'}
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-500/10">
                  Rear: {queue.length > 0 ? queue[queue.length - 1] : 'Empty'}
                </Badge>
              </div>

              {/* Visual Queue */}
              {renderQueue()}
            </TabsContent>
          </Tabs>

          {/* Explanation */}
          <Card className="bg-purple-500/10 backdrop-blur-sm border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">How Queue Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/80">
              <p>
                <strong className="text-cyan-300">Enqueue:</strong> Adds an element to the rear (end) of the queue
              </p>
              <p>
                <strong className="text-cyan-300">Dequeue:</strong> Removes and returns the front (first) element
              </p>
              <p>
                <strong className="text-cyan-300">Peek:</strong> Returns the front element without removing it
              </p>
              <p className="text-cyan-200">
                <strong>Real-world examples:</strong> Print job scheduling, Customer service lines,
                Task scheduling in operating systems
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
