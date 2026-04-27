import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Trophy, Medal, Award, ArrowUpDown, BookOpen } from 'lucide-react';
import type { User, Screen } from '../App';

interface LeaderboardProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

interface StudentScore {
  id: string;
  name: string;
  score: number;
  examsTaken: number;
  averageScore: number;
  lastExamDate: string;
  rank?: number;
}

// Mock student data
const initialStudents: StudentScore[] = [
  { id: '1', name: 'Alice Johnson', score: 95, examsTaken: 15, averageScore: 92, lastExamDate: '2025-11-03' },
  { id: '2', name: 'Bob Smith', score: 88, examsTaken: 14, averageScore: 85, lastExamDate: '2025-11-02' },
  { id: '3', name: 'Charlie Brown', score: 92, examsTaken: 16, averageScore: 89, lastExamDate: '2025-11-04' },
  { id: '4', name: 'Diana Prince', score: 97, examsTaken: 18, averageScore: 94, lastExamDate: '2025-11-03' },
  { id: '5', name: 'Ethan Hunt', score: 85, examsTaken: 12, averageScore: 83, lastExamDate: '2025-11-01' },
  { id: '6', name: 'Fiona Green', score: 90, examsTaken: 15, averageScore: 87, lastExamDate: '2025-11-04' },
  { id: '7', name: 'George Wilson', score: 78, examsTaken: 13, averageScore: 76, lastExamDate: '2025-10-31' },
  { id: '8', name: 'Hannah Lee', score: 94, examsTaken: 17, averageScore: 91, lastExamDate: '2025-11-02' },
  { id: '9', name: 'Ian Malcolm', score: 82, examsTaken: 11, averageScore: 80, lastExamDate: '2025-11-01' },
  { id: '10', name: 'Julia Roberts', score: 89, examsTaken: 14, averageScore: 86, lastExamDate: '2025-11-03' },
];

type SortKey = 'score' | 'examsTaken' | 'averageScore';
type SortOrder = 'asc' | 'desc';

export function Leaderboard({ user, onNavigate }: LeaderboardProps) {
  const [students, setStudents] = useState<StudentScore[]>(initialStudents);
  const [sortKey, setSortKey] = useState<SortKey>('averageScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isSorted, setIsSorted] = useState(true);

  const sortStudents = () => {
    if (!isSorted) {
      // Show unsorted - just assign ranks based on original order
      const rankedStudents = initialStudents.map((student, index) => ({
        ...student,
        rank: index + 1,
      }));
      setStudents(rankedStudents);
      return;
    }

    const sorted = [...initialStudents].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      
      if (sortOrder === 'desc') {
        return valueB - valueA;
      }
      return valueA - valueB;
    });

    const rankedStudents = sorted.map((student, index) => ({
      ...student,
      rank: index + 1,
    }));

    setStudents(rankedStudents);
  };

  const handleSort = (key: SortKey) => {
    if (!isSorted) return; // Don't allow column sorting when in unsorted mode
    
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    sortStudents();
  }, [sortKey, sortOrder, isSorted]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-amber-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
    return <span className="text-white/60">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white">Leaderboard</h1>
                <p className="text-sm text-white/60">Top performing students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Rankings</CardTitle>
                <CardDescription className="text-white/60">Students ranked by performance</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsSorted(false)}
                  variant={!isSorted ? 'default' : 'outline'}
                  className={!isSorted ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}
                >
                  Unsorted
                </Button>
                <Button
                  onClick={() => setIsSorted(true)}
                  variant={isSorted ? 'default' : 'outline'}
                  className={isSorted ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}
                >
                  Sorted
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Column Headers */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 mb-2">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 text-center text-sm text-white/60">Rank</div>
                <div className="flex-1 text-sm text-white/60">Student</div>
              </div>
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('score')}
                  disabled={!isSorted}
                  className="text-sm text-white/60 hover:text-cyan-400 disabled:opacity-50"
                >
                  Latest Score
                  {isSorted && <ArrowUpDown className="w-3 h-3 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('averageScore')}
                  disabled={!isSorted}
                  className="text-sm text-white/60 hover:text-cyan-400 disabled:opacity-50"
                >
                  Average
                  {isSorted && <ArrowUpDown className="w-3 h-3 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('examsTaken')}
                  disabled={!isSorted}
                  className="text-sm text-white/60 hover:text-cyan-400 disabled:opacity-50"
                >
                  Exams
                  {isSorted && <ArrowUpDown className="w-3 h-3 ml-1" />}
                </Button>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-2">
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg border transition-all ${
                    student.id === user.id
                      ? 'border-cyan-400 bg-cyan-500/10 backdrop-blur-sm'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(student.rank || index + 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white">{student.name}</h3>
                          {student.id === user.id && (
                            <Badge className="bg-cyan-500 border-0 text-white">You</Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60">
                          Last exam: {student.lastExamDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right w-20">
                        <p className="text-xl text-white">{student.score}%</p>
                      </div>
                      <div className="text-right w-20">
                        <p className="text-xl text-white">{student.averageScore}%</p>
                      </div>
                      <div className="text-right w-20">
                        <p className="text-xl text-white">{student.examsTaken}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
