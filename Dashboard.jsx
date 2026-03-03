import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useDocumentStore } from '../contexts/store';
import { documentsAPI } from '../services/api';
import { BookOpen, LogOut, Plus, Truck, Wrench, Package, Loader2 } from 'lucide-react';

const categoriesConfig = {
  logistique: { icon: Package, color: 'bg-blue-100 text-blue-700', label: 'Logistique' },
  transport: { icon: Truck, color: 'bg-green-100 text-green-700', label: 'Transport' },
  mecanique: { icon: Wrench, color: 'bg-orange-100 text-orange-700', label: 'Mécanique' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { documents, setDocuments, setCurrentDocument } = useDocumentStore();
  
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, [selectedCategory]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentsAPI.list(selectedCategory);
      setDocuments(response.data);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    }
    setLoading(false);
  };

  const handleDocumentClick = (document) => {
    setCurrentDocument(document);
    navigate(`/read/${document.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-slate-900">NAT_ANG</h1>
                <p className="text-xs text-slate-500">Anglais naturel</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              
              {user?.role === 'formateur' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Administration
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenue */}
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
            Bienvenue, {user?.prenom} ! 👋
          </h2>
          <p className="text-slate-600">
            Sélectionnez un document pour commencer votre apprentissage
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === null
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Tous les documents
          </button>
          
          {Object.entries(categoriesConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === key
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Liste des documents */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Aucun document disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const config = categoriesConfig[doc.categorie];
              const Icon = config?.icon || BookOpen;
              
              return (
                <button
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc)}
                  className="card text-left hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${config?.color || 'bg-slate-100 text-slate-700'} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {doc.titre}
                      </h3>
                      <p className="text-sm text-slate-500 capitalize">
                        {config?.label || doc.categorie}
                      </p>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          {Math.ceil(doc.contenu.split(' ').length / 200)} min de lecture
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
