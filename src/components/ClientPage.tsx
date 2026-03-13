"use client";

import { useState } from 'react';
import Image from 'next/image';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { 
  createInspirationAction, 
  deleteInspirationAction, 
  toggleFavoriteAction 
} from '@/actions/inspirationActions';
import { logoutUserAction } from '@/actions/authActions';

interface CloudinaryResult {
  info: {
    public_id: string;
  };
}

interface Pin {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  userId: number;
  isFavorite?: boolean; 
}

const CATEGORIES = ['Alle', 'Gespeichert', 'Tattoo', 'Mode', 'Architektur', 'Natur', 'Kunst','Essen'];

export default function ClientPage({ initialPins, currentUserId }: { initialPins: Pin[], currentUserId: number | null }) {
  const [isAddPinOpen, setIsAddPinOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [filter, setFilter] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState(''); 
  const [newCategory, setNewCategory] = useState('Tattoo');

  const filteredPins = (initialPins || []).filter(pin => {
    const matchesSearch = (pin.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'Alle') return matchesSearch;
    if (filter === 'Gespeichert') return pin.isFavorite && matchesSearch;
    return pin.category === filter && matchesSearch;
  });

  const handleAddPin = async () => {
    if (!newTitle || !newUrl) return alert("Bitte Titel und Bild hinzufügen!");
    const res = await createInspirationAction({ title: newTitle, imageUrl: newUrl, category: newCategory });
    if (res.success) {
      setIsAddPinOpen(false);
      setNewTitle('');
      setNewUrl('');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] text-[#1C1E21] font-sans">
      
    
      <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-white/20 fixed h-full flex flex-col items-center p-8 z-50 shadow-sm">
     
        <div className="w-16 h-16 bg-gradient-to-tr from-[#ff0000] via-[#00ff00] to-[#0000ff] rounded-2xl flex items-center justify-center mb-12 shadow-lg rotate-3 hover:rotate-0 transition-all duration-700 cursor-pointer group animate-gradient-xy">
          <span className="text-white text-3xl font-black italic group-hover:scale-110 transition-transform drop-shadow-md">I</span>
        </div>
        
        <nav className="flex-1 w-full flex flex-col gap-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 px-4">Navigation</p>
          <button type="button" aria-label="Home" onClick={() => setFilter('Alle')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${filter === 'Alle' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:bg-white/50'}`}>
            <span className="text-xl">🏠</span> Home
          </button>
          <button type="button" aria-label="Sammlung" onClick={() => setFilter('Gespeichert')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${filter === 'Gespeichert' ? 'bg-white shadow-sm text-[#E60023]' : 'text-gray-500 hover:bg-white/50'}`}>
            <span className="text-xl">🔖</span> Sammlung
          </button>
          <button type="button" aria-label="Neuen Pin erstellen" onClick={() => setIsAddPinOpen(true)} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-gray-500 hover:bg-white/50 hover:translate-x-1 transition-all mt-4">
            <span className="text-xl">➕</span> Erstellen
          </button>
        </nav>

        <div className="mt-auto w-full pt-6 border-t border-gray-100">
          <div className="bg-white/50 p-4 rounded-[24px] flex items-center gap-3 mb-4 shadow-sm border border-white">
             <div className="w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-gray-100 relative">
                <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId || 'guest'}`} alt="Avatar" fill sizes="40px" unoptimized className="object-cover" />
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-xs">Mein Profil</span>
               <button type="button" onClick={() => logoutUserAction()} className="text-[10px] text-red-500 font-bold text-left hover:underline">Abmelden</button>
             </div>
          </div>
        </div>
      </aside>

    
      <main className="flex-1 ml-72 p-10">
        <header className="mb-12 bg-white/40 p-8 rounded-[40px] border border-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-8 gap-6">
            <h1 className="text-3xl font-black tracking-tight">{filter === 'Gespeichert' ? 'Meine Sammlung' : 'Entdecken'}</h1>
            <div className="relative flex-1 max-w-xl group text-black">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" aria-label="Inspiration suchen" placeholder="Inspiration suchen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-6 shadow-sm focus:ring-2 focus:ring-red-100 outline-none transition-all" />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat} type="button" onClick={() => setFilter(cat)} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${filter === cat ? 'bg-black border-black text-white shadow-md' : 'bg-white border-transparent text-gray-500 hover:border-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>

     
        <div className="columns-1 sm:columns-2 xl:columns-3 2xl:columns-4 gap-8">
          {filteredPins.map((pin, index) => (
            <div key={pin.id || `pin-${index}`} className="relative group mb-8 break-inside-avoid rounded-[32px] overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-white">
              <CldImage 
                width="600" height="900" src={pin.imageUrl} alt={pin.title} crop="fill" 
                onClick={() => setSelectedPin(pin)} 
                className="w-full h-auto object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-between text-white pointer-events-none">
                <div className="flex justify-between items-start gap-2 pointer-events-auto">
                  <div className="flex gap-2 w-full justify-end">
                    <button 
                      type="button"
                      aria-label={pin.isFavorite ? "Von Sammlung entfernen" : "In Sammlung speichern"}
                      onClick={async (e) => { 
                        e.preventDefault(); 
                        await toggleFavoriteAction(pin.id); 
                      }} 
                      className={`px-5 py-3 rounded-full font-bold transition-all shadow-lg transform hover:scale-105 active:scale-95 ${pin.isFavorite ? 'bg-black text-white' : 'bg-[#E60023] text-white hover:bg-[#ad001a]'}`}
                    >
                      {pin.isFavorite ? 'Gespeichert' : 'Merken'}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-[10px] px-2 py-1 rounded-md font-bold uppercase mb-1 inline-block bg-white/20 backdrop-blur-md">{pin.category}</span>
                        <h3 className="font-bold text-lg leading-tight">{pin.title}</h3>
                    </div>
                    {currentUserId === pin.userId && <button type="button" aria-label="Pin löschen" onClick={() => deleteInspirationAction(pin.id)} className="bg-white/10 hover:bg-red-500 p-2 rounded-xl transition-all pointer-events-auto">🗑️</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedPin && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col md:flex-row animate-in fade-in duration-300">
          
       
          <button 
            type="button"
            aria-label="Zurück zur Übersicht"
            onClick={() => setSelectedPin(null)} 
            className="fixed top-6 left-6 z-[210] bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-black p-3 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>
          
       
          <div className="flex-1 bg-[#F0F2F5] flex items-center justify-center p-4 md:p-12 overflow-hidden">
             <CldImage 
                width="1600" 
                height="2000"
                src={selectedPin.imageUrl} 
                alt={selectedPin.title} 
                className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl rounded-3xl"
              />
          </div>

         
          <div className="w-full md:w-[500px] h-full bg-white border-l flex flex-col overflow-hidden text-black">
            
           
            <div className="p-8 flex justify-between items-center border-b">
                <div className="flex gap-4">
                    <button type="button" aria-label="Optionen" className="text-gray-400 hover:text-black transition-colors text-xl">•••</button>
                    <a aria-label="Bild herunterladen" href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/fl_attachment/${selectedPin.imageUrl}`} download className="text-gray-400 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 11.25L12 15.75m0 0l4.5-4.5M12 15.75V3" /></svg>
                    </a>
                </div>
                <button 
                  type="button"
                  onClick={async () => { 
                    await toggleFavoriteAction(selectedPin.id);
                    setSelectedPin({...selectedPin, isFavorite: !selectedPin.isFavorite});
                  }} 
                  className={`px-8 py-3 rounded-full font-bold text-lg transition-all shadow-md active:scale-95 ${
                    selectedPin.isFavorite ? 'bg-black text-white' : 'bg-[#E60023] text-white hover:bg-[#ad001a]'
                  }`}
                >
                  {selectedPin.isFavorite ? "Gespeichert" : "Merken"}
                </button>
            </div>

          
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <span className="text-[#00C897] font-bold text-sm uppercase tracking-widest">{selectedPin.category}</span>
              <h2 className="text-4xl font-black mt-2 mb-8 leading-tight">{selectedPin.title}</h2>
              
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 border text-sm">U</div>
                 <span className="font-bold">User Inspiration</span>
              </div>

              
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-6 text-center">Ähnliche Inspirationen</h3>
                <div className="grid grid-cols-2 gap-4">
                  {initialPins
                    .filter(p => p.category === selectedPin.category && p.id !== selectedPin.id)
                    .map(similar => (
                    <div 
                      key={similar.id} 
                      onClick={() => setSelectedPin(similar)} 
                      className="cursor-pointer group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 transition-transform hover:scale-[1.02]"
                    >
                      <CldImage 
                        width="300" 
                        height="400" 
                        src={similar.imageUrl} 
                        alt={similar.title} 
                        className="object-cover w-full h-full group-hover:opacity-90 transition-opacity" 
                      />
                    </div>
                  ))}
                </div>
                {initialPins.filter(p => p.category === selectedPin.category && p.id !== selectedPin.id).length === 0 && (
                    <p className="text-gray-400 text-sm italic text-center">Keine weiteren Pins in dieser Kategorie.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddPinOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl relative text-black">
            <button type="button" aria-label="Schließen" onClick={() => setIsAddPinOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black p-2">✕</button>
            <h2 className="text-2xl font-black mb-6">Inspiration teilen</h2>
            <div className="flex flex-col gap-4">
              <input aria-label="Titel" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titel deiner Inspiration" className="p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-red-100" />
              <CldUploadWidget uploadPreset="my_preset_123" onSuccess={(result) => { const info = (result as CloudinaryResult).info; setNewUrl(info.public_id); }}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className={`p-6 border-2 border-dashed rounded-2xl font-bold transition-all flex flex-col items-center gap-2 ${newUrl ? 'bg-green-50 border-green-200 text-green-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                    <span>{newUrl ? "✅ Bild bereit" : "📸 Bild hochladen"}</span>
                  </button>
                )}
              </CldUploadWidget>
              <select aria-label="Kategorie auswählen" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="p-4 bg-gray-50 border rounded-2xl outline-none">
                {CATEGORIES.filter(c => !['Alle', 'Gespeichert'].includes(c)).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button type="button" onClick={handleAddPin} disabled={!newUrl || !newTitle} className="bg-[#E60023] text-white p-4 rounded-2xl font-bold hover:bg-[#ad001a] shadow-lg mt-2 disabled:opacity-50 transition-all">Pin jetzt veröffentlichen</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
}