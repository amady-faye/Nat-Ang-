import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, BrainCircuit } from 'lucide-react';

// Dictionnaire de secours au cas où l'apprenant n'a pas encore traduit assez de mots
const fallbackVocabulary = [
  { word: "Warehouse", translation: "Entrepôt" },
  { word: "Engine", translation: "Moteur" },
  { word: "Delivery", translation: "Livraison" },
  { word: "Forklift", translation: "Chariot élévateur" },
  { word: "Brakes", translation: "Freins" },
  { word: "Schedule", translation: "Emploi du temps" },
  { word: "Safety", translation: "Sécurité" },
  { word: "Inventory", translation: "Inventaire" }
];

export default function TrainingQuiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = () => {
    // 1. Récupérer le vocabulaire sauvegardé par l'élève pendant sa lecture
    const savedVocabStr = localStorage.getItem('savedVocabulary');
    let userVocab = savedVocabStr ? JSON.parse(savedVocabStr) : [];
    
    // 2. Fusionner avec le vocabulaire de secours pour avoir toujours assez de mots
    const combinedVocab = [...userVocab];
    fallbackVocabulary.forEach(fallback => {
      if (!combinedVocab.find(v => v.word.toLowerCase() === fallback.word.toLowerCase())) {
        combinedVocab.push(fallback);
      }
    });

    // 3. Sélectionner 5 mots au hasard pour le quiz
    const shuffled = [...combinedVocab].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 5);

    // 4. Créer les questions avec de fausses réponses (distracteurs)
    const quizQuestions = selectedWords.map(item => {
      // Prendre 3 autres traductions au hasard pour faire les mauvaises réponses
      const others = combinedVocab.filter(v => v.word !== item.word);
      const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 3).map(d => d.translation);
      
      const options = [item.translation, ...distractors].sort(() => 0.5 - Math.random());
      
      return {
        word: item.word,
        correctAnswer: item.translation,
        options: options
      };
    });

    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerClick = (option) => {
    if (selectedAnswer !== null) return; // Empêcher de cliquer 2 fois
    
    setSelectedAnswer(option);
    const correct = option === questions[currentIndex].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      // Mettre à jour l'objectif "Bonnes réponses" du jour
      const goalStr = localStorage.getItem('dailyGoal');
      if (goalStr) {
        const goal = JSON.parse(goalStr);
        if (goal.type === 'answers') {
          const progressStr = localStorage.getItem('dailyProgress');
          const progress = progressStr ? JSON.parse(progressStr) : { date: new Date().toDateString(), value: 0 };
          if (progress.date === new Date().toDateString()) {
            progress.value += 1;
            localStorage.setItem('dailyProgress', JSON.stringify(progress));
          }
        }
      }
    }

    // Passer à la question suivante après 1.5s
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (questions.length === 0) return null;

  if (showResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center fade-in">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Quiz Terminé !</h2>
          <p className="text-slate-600 mb-8">
            Vous avez obtenu un score de
          </p>
          <div className="text-5xl font-black text-primary-600 mb-8">
            {score} / {questions.length}
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={generateQuiz}
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Rejouer
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
          
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <BrainCircuit className="w-5 h-5 text-primary-600" />
            Entraînement
          </div>
          
          <div className="text-sm font-bold text-primary-600">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Barre de progression */}
        <div className="w-full bg-slate-200 h-2 rounded-full mb-12 overflow-hidden">
          <div 
            className="bg-primary-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8 fade-in">
          <h3 className="text-slate-500 text-center mb-4 uppercase tracking-wider font-semibold text-sm">Que signifie ce mot ?</h3>
          <div className="text-4xl sm:text-5xl font-black text-center text-slate-900 mb-12 break-words">
            "{question.word}"
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((option, idx) => {
              let btnClass = "p-4 text-lg font-semibold rounded-2xl border-2 transition-all transform hover:scale-[1.02] active:scale-95 text-left";
              let icon = null;

              if (selectedAnswer === null) {
                btnClass += " border-slate-200 bg-white hover:border-primary-400 hover:bg-blue-50 text-slate-700";
              } else if (option === question.correctAnswer) {
                btnClass += " border-green-500 bg-green-50 text-green-700";
                icon = <CheckCircle2 className="w-6 h-6 text-green-500 float-right" />;
              } else if (option === selectedAnswer) {
                btnClass += " border-red-500 bg-red-50 text-red-700";
                icon = <XCircle className="w-6 h-6 text-red-500 float-right" />;
              } else {
                btnClass += " border-slate-100 bg-slate-50 text-slate-400 opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(option)}
                  disabled={selectedAnswer !== null}
                  className={btnClass}
                >
                  {option}
                  {icon}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
