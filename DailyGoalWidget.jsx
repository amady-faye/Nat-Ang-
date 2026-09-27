import { useState, useEffect } from 'react';
import { Target, CheckCircle2, ChevronRight, BookOpen, Clock, Brain, MessageSquare } from 'lucide-react';

export default function DailyGoalWidget() {
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? JSON.parse(saved) : null;
  });

  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('dailyProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      if (parsed.date === new Date().toDateString()) {
        return parsed.value;
      }
    }
    return 0;
  });

  const goalOptions = [
    { id: 'words', icon: BookOpen, label: 'Mots à lire', options: [100, 150, 200] },
    { id: 'answers', icon: MessageSquare, label: 'Bonnes réponses', options: [5, 10, 15] },
    { id: 'minutes', icon: Clock, label: 'Minutes de lecture', options: [5, 10, 15] },
    { id: 'vocabulary', icon: Brain, label: 'Nouveaux mots', options: [5, 7, 10] },
  ];

  const handleSelectGoal = (type, target) => {
    const newGoal = { type, target, date: new Date().toDateString() };
    setGoal(newGoal);
    localStorage.setItem('dailyGoal', JSON.stringify(newGoal));
    setProgress(0); // Reset progress for a new goal
  };

  useEffect(() => {
    // Si la date a changé, on réinitialise l'objectif
    if (goal && goal.date !== new Date().toDateString()) {
      setGoal(null);
      localStorage.removeItem('dailyGoal');
    }
  }, [goal]);

  if (!goal) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Objectif du jour</h3>
            <p className="text-sm text-slate-500">Choisissez votre défi pour débloquer l'entraînement !</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goalOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="border border-slate-100 p-4 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-slate-50">
                <div className="flex items-center gap-2 mb-3 text-slate-700">
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{option.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.options.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSelectGoal(option.id, val)}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Determine label based on chosen type
  const chosenOption = goalOptions.find(o => o.id === goal.type);
  const percentage = Math.min((progress / goal.target) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-md text-white mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Target className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          {percentage >= 100 ? (
            <CheckCircle2 className="w-8 h-8 text-green-300" />
          ) : (
            <div className="p-2 bg-white/20 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">
              {percentage >= 100 ? "Objectif Atteint ! 🎉" : "Objectif en cours"}
            </h3>
            <p className="text-blue-100 text-sm">
              {chosenOption?.label}: {progress} / {goal.target}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {percentage >= 100 && (
          <button className="mt-4 flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors text-sm shadow-sm">
            Débloquer l'entraînement <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
