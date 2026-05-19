import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useProgress, isUnlocked } from './hooks/useProgress';
import MenuPage from './pages/MenuPage';
import GamePage from './pages/GamePage';

export default function App() {
  const { progress, completeChapter, resetProgress } = useProgress();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MenuPage
              progress={progress}
              isUnlocked={isUnlocked}
              onReset={resetProgress}
            />
          }
        />
        <Route
          path="/chapter/docker"
          element={
            <GamePage
              chapter="docker"
              onComplete={(xp, lives) => completeChapter('docker', xp, lives)}
              isChapterUnlocked={isUnlocked('docker', progress)}
            />
          }
        />
        <Route
          path="/chapter/k8s"
          element={
            <GamePage
              chapter="k8s"
              onComplete={(xp, lives) => completeChapter('k8s', xp, lives)}
              isChapterUnlocked={isUnlocked('k8s', progress)}
            />
          }
        />
        <Route
          path="/chapter/ci-cd"
          element={
            <GamePage
              chapter="ci-cd"
              onComplete={(xp, lives) => completeChapter('ci-cd', xp, lives)}
              isChapterUnlocked={isUnlocked('ci-cd', progress)}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
