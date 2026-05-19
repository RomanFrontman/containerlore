import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-950 text-stone-200">
      <h1 className="text-4xl font-bold text-amber-300 mb-4">ContainerLore</h1>
      <p className="text-stone-400 mb-8">Choose your chapter</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 border border-amber-700 rounded text-amber-400 hover:bg-amber-950 transition-colors"
      >
        Chapter I — Docker Forge
      </button>
    </div>
  );
}
