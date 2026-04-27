import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ExamInterface } from './components/ExamInterface';
import { ExamSelection } from './components/ExamSelection';
import { LearnConcepts } from './components/LearnConcepts';
import { DSAProgressQueue } from './components/DSAProgressQueue';
import { Leaderboard } from './components/Leaderboard';

export type Screen = 'login' | 'dashboard' | 'examSelection' | 'exam' | 'learnConcepts' | 'progress' | 'leaderboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student';
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleSelectExam = (concept: string, difficulty: string) => {
    setSelectedConcept(concept);
    setSelectedDifficulty(difficulty);
    setCurrentScreen('exam');
  };

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'login' && <Login onLogin={handleLogin} />}
      {currentScreen === 'dashboard' && user && (
        <Dashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} />
      )}
      {currentScreen === 'examSelection' && user && (
        <ExamSelection user={user} onNavigate={navigateTo} onSelectExam={handleSelectExam} />
      )}
      {currentScreen === 'exam' && user && selectedConcept && selectedDifficulty && (
        <ExamInterface concept={selectedConcept} difficulty={selectedDifficulty} user={user} onNavigate={navigateTo} />
      )}
      {currentScreen === 'learnConcepts' && user && (
        <LearnConcepts user={user} onNavigate={navigateTo} />
      )}
      {currentScreen === 'progress' && user && (
        <DSAProgressQueue user={user} onNavigate={navigateTo} />
      )}
      {currentScreen === 'leaderboard' && user && (
        <Leaderboard user={user} onNavigate={navigateTo} />
      )}
    </div>
  );
}

export default App;
