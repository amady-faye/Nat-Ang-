import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsAPI, readingAPI } from './apiClient.js';
import { ArrowLeft, Loader2, Languages, MessageCircle, Volume2 } from 'lucide-react';

export default function ReadingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationPosition, setTranslationPosition] = useState({ x: 0, y: 0 });
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  
  const contentRef = useRef(null);
  const timerRef = useRef(null);
  
  const paragraphs = document?.contenu ? document.contenu.split('\n\n').filter(p => p.trim() !== '') : [];

  const updateGoalProgress = (type, amount) => {
    const goalStr = localStorage.getItem('dailyGoal');
    if (!goalStr) return;
    const goal = JSON.parse(goalStr);
    
    // Si l'objectif du jour ne correspond pas à l'action en cours, on ignore
    if (goal.type !== type) return;

    const progressStr = localStorage.getItem('dailyProgress');
    const currentProgress = progressStr ? JSON.parse(progressStr) : { date: new Date().toDateString(), value: 0 };
    
    if (currentProgress.date === new Date().toDateString()) {
      currentProgress.value += amount;
      localStorage.setItem('dailyProgress', JSON.stringify(currentProgress));
    } else {
      localStorage.setItem('dailyProgress', JSON.stringify({ date: new Date().toDateString(), value: amount }));
    }
  };

  const handleNextParagraph = () => {
    if (currentParagraphIndex < paragraphs.length - 1) {
      // Compter les mots lus
      const wordCount = paragraphs[currentParagraphIndex].split(/\s+/).length;
      updateGoalProgress('words', wordCount);
      
      setCurrentParagraphIndex(prev => prev + 1);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleFinishReading = () => {
    // Compter les mots du dernier paragraphe
    const wordCount = paragraphs[currentParagraphIndex].split(/\s+/).length;
    updateGoalProgress('words', wordCount);
    
    // Ajouter les minutes passées
    const minutes = Math.max(1, Math.floor(readingTime / 60));
    updateGoalProgress('minutes', minutes);
    
    navigate('/dashboard');
  };

  useEffect(() => {
    loadDocument();
    
    // Timer de lecture
    timerRef.current = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      // Sauvegarder la progression à la fermeture
      saveProgress();
    };
  }, [id]);

  const loadDocument = async () => {
    try {
      const response = await documentsAPI.get(id);
      setDocument(response.data);
    } catch (error) {
      console.error('Erreur chargement document:', error);
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const saveProgress = async () => {
    if (!document) return;
    
    try {
      await readingAPI.updateProgress({
        document_id: parseInt(id),
        paragraphe_actuel: 0,
        pourcentage_complete: 50, // TODO: Calculer le vrai pourcentage
        temps_lecture: readingTime
      });
    } catch (error) {
      console.error('Erreur sauvegarde progression:', error);
    }
  };

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && text.length > 0) {
      setSelectedText(text);
      setLoadingTranslation(true);
      setShowTranslation(true);
      
      // Position du popup
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTranslationPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });

      // Traduire
      try {
        const response = await readingAPI.translate({
          text: text,
          source_lang: 'en',
          target_lang: 'fr'
        });
        setTranslation(response.data.translated);
        
        // Ajouter +1 au compteur de mots si l'objectif est le vocabulaire
        // Pour éviter le spam, on ne compte que les mots courts (pas les phrases entières)
        if (text.split(' ').length <= 3) {
           updateGoalProgress('vocabulary', 1);
        }
        
      } catch (error) {
        console.error('Erreur traduction:', error);
        setTranslation('Erreur de traduction');
      }
      
      setLoadingTranslation(false);
    } else {
      setShowTranslation(false);
    }
  };

  const handleExplain = async () => {
    if (!selectedText) return;
    
    try {
      const response = await readingAPI.explain({
        text: selectedText,
        type: 'grammar'
      });
      
      alert(response.data.explanation); // TODO: Meilleur UI pour les explications
    } catch (error) {
      console.error('Erreur explication:', error);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header fixe */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            
            <div className="text-center flex-1">
              <h1 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-1">
                {document?.titre}
              </h1>
            </div>
            
            <div className="text-sm text-slate-500">
              {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu du document */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          ref={contentRef}
          className="reading-text prose prose-lg max-w-none"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
        >
          {paragraphs.slice(0, currentParagraphIndex + 1).map((paragraph, index) => (
            <div key={index} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm leading-relaxed text-slate-800 text-lg fade-in">
              {paragraph}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {currentParagraphIndex < paragraphs.length - 1 ? (
            <button
              onClick={handleNextParagraph}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary-700 hover:shadow-lg transition-all transform hover:scale-105"
            >
              Paragraphe suivant
            </button>
          ) : (
            <button
              onClick={handleFinishReading}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-green-600 hover:shadow-lg transition-all transform hover:scale-105"
            >
              Terminer la lecture
            </button>
          )}
        </div>

        {/* Instructions de lecture */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Languages className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Comment utiliser</h3>
              <p className="text-sm text-blue-700">
                Sélectionnez un mot ou une phrase pour voir sa traduction instantanée. 
                Cliquez sur les icônes pour obtenir une explication grammaticale ou écouter la prononciation.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Popup de traduction */}
      {showTranslation && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowTranslation(false)}
          />
          
          {/* Popup */}
          <div
            className="fixed z-50 bg-slate-900 text-white rounded-xl shadow-2xl max-w-sm"
            style={{
              left: `${translationPosition.x}px`,
              top: `${translationPosition.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="p-4">
              {/* Texte sélectionné */}
              <div className="text-xs text-slate-400 mb-2">Sélection :</div>
              <div className="text-sm font-medium mb-3">{selectedText}</div>
              
              {/* Traduction */}
              <div className="text-xs text-slate-400 mb-2">Traduction :</div>
              {loadingTranslation ? (
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traduction en cours...
                </div>
              ) : (
                <div className="text-sm text-blue-300 font-medium mb-4">
                  {translation}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-700">
                <button
                  onClick={handleExplain}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Expliquer
                </button>
                
                <button
                  onClick={() => speakText(selectedText)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  Écouter
                </button>
              </div>
            </div>
            
            {/* Flèche pointant vers le texte */}
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-slate-900" />
          </div>
        </>
      )}
    </div>
  );
}
