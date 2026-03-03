import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/store';
import { adminAPI, authAPI, documentsAPI } from '../services/api';
import { 
  ArrowLeft, Users, BookOpen, Clock, Plus, Upload, 
  Loader2, Code, FileText, FilePlus
} from 'lucide-react';

export default function AdminPanel() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Formulaires
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showUploadDoc, setShowUploadDoc] = useState(false);
  const [newClass, setNewClass] = useState({ code: '', nom_classe: '', specialite: 'logistique' });
  const [newDoc, setNewDoc] = useState({ titre: '', categorie: 'logistique', contenu: '' });

  useEffect(() => {
    if (user?.role !== 'formateur') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, classesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getStudents(),
        adminAPI.getClasses(),
      ]);
      
      setStats(statsRes.data);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
    setLoading(false);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await authAPI.createClasseCode(newClass);
      setShowCreateClass(false);
      setNewClass({ code: '', nom_classe: '', specialite: 'logistique' });
      loadData();
      alert('Code de classe créé avec succès !');
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.upload(newDoc);
      setShowUploadDoc(false);
      setNewDoc({ titre: '', categorie: 'logistique', contenu: '' });
      alert('Document ajouté avec succès !');
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de l\'ajout');
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            
            <h1 className="text-xl font-display font-bold text-slate-900">
              Administration
            </h1>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats?.total_eleves || 0}</div>
                <div className="text-sm text-slate-600">Élèves</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats?.total_documents || 0}</div>
                <div className="text-sm text-slate-600">Documents</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats?.eleves_actifs_semaine || 0}</div>
                <div className="text-sm text-slate-600">Actifs (7j)</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {Math.floor((stats?.temps_lecture_total || 0) / 3600)}h
                </div>
                <div className="text-sm text-slate-600">Temps lecture</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setShowCreateClass(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Créer un code de classe
          </button>
          
          <button
            onClick={() => setShowUploadDoc(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <FilePlus className="w-4 h-4" />
            Ajouter un document
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Classes
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'students'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Élèves
          </button>
        </div>

        {/* Contenu selon l'onglet */}
        {activeTab === 'overview' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Codes de classe</h3>
            {classes.length === 0 ? (
              <p className="text-slate-600 text-center py-8">Aucun code de classe créé</p>
            ) : (
              <div className="space-y-3">
                {classes.map((classe) => (
                  <div key={classe.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono font-semibold text-lg text-primary-600">
                          {classe.code}
                        </div>
                        <div className="text-sm text-slate-600">{classe.nom_classe}</div>
                        <div className="text-xs text-slate-500 capitalize mt-1">
                          {classe.specialite} • {classe.nombre_eleves} élèves
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        classe.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {classe.is_active ? 'Actif' : 'Inactif'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Liste des élèves</h3>
            {students.length === 0 ? (
              <p className="text-slate-600 text-center py-8">Aucun élève inscrit</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Nom</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Classe</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Docs lus</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Temps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.user_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          {student.prenom} {student.nom}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{student.email}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm">{student.code_classe}</span>
                        </td>
                        <td className="py-3 px-4">{student.documents_lus}</td>
                        <td className="py-3 px-4">
                          {Math.floor(student.temps_total / 60)} min
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Créer classe */}
      {showCreateClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Créer un code de classe</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code (ex: CFA2026LOG)</label>
                <input
                  type="text"
                  value={newClass.code}
                  onChange={(e) => setNewClass({ ...newClass, code: e.target.value.toUpperCase() })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nom de la classe</label>
                <input
                  type="text"
                  value={newClass.nom_classe}
                  onChange={(e) => setNewClass({ ...newClass, nom_classe: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Spécialité</label>
                <select
                  value={newClass.specialite}
                  onChange={(e) => setNewClass({ ...newClass, specialite: e.target.value })}
                  className="input-field"
                >
                  <option value="logistique">Logistique</option>
                  <option value="transport">Transport routier</option>
                  <option value="mecanique">Mécanique</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateClass(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Upload document */}
      {showUploadDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-xl font-bold mb-4">Ajouter un document</h3>
            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={newDoc.titre}
                  onChange={(e) => setNewDoc({ ...newDoc, titre: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  value={newDoc.categorie}
                  onChange={(e) => setNewDoc({ ...newDoc, categorie: e.target.value })}
                  className="input-field"
                >
                  <option value="logistique">Logistique</option>
                  <option value="transport">Transport routier</option>
                  <option value="mecanique">Mécanique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contenu (texte en anglais)</label>
                <textarea
                  value={newDoc.contenu}
                  onChange={(e) => setNewDoc({ ...newDoc, contenu: e.target.value })}
                  className="input-field"
                  rows={12}
                  placeholder="Collez ici le texte en anglais..."
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadDoc(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
