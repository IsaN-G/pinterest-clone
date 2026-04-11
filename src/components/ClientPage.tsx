"use client";

import { useState, useEffect, useMemo } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  createInspirationAction, 
  toggleFavoriteAction,
  deleteInspirationAction   // ← schon vorhanden
} from '@/actions/inspirationActions';
import { logoutUserAction } from '@/actions/authActions';

interface Pin {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  userId: number;
  isFavorite?: boolean; 
}

const CATEGORIES = ['Alle', 'Gespeichert', 'Entdecken', 'Tattoo', 'Mode','Kosmetik', 'Sport', 'Natur', 'Kunst', 'Essen', 'Reisen', 'Andere'] as const;
type Category = (typeof CATEGORIES)[number];

export default function ClientPage({ initialPins, currentUserId }: { initialPins: Pin[], currentUserId: number | null }) {
  const [isAddPinOpen, setIsAddPinOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [filter, setFilter] = useState<Category>('Alle');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState(''); 
  const [newCategory, setNewCategory] = useState<Category>('Andere');

  // DEINE ORIGINAL LOGIK: SCROLL LOCK
  useEffect(() => {
    if (selectedPin || isAddPinOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedPin, isAddPinOpen]);

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${path}`;
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.mov', '.webm', '.ogg'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes('/video/upload/');
  };

  const handleDownload = async (e: React.MouseEvent, url: string, title: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '_')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, pin: Pin) => {
    e.stopPropagation();
    await toggleFavoriteAction(pin.id);
    if (selectedPin && selectedPin.id === pin.id) {
      setSelectedPin({ ...selectedPin, isFavorite: !selectedPin.isFavorite });
    }
  };

  const filteredPins = (initialPins || []).filter(pin => {
    const matchesSearch = (pin.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'Alle') return matchesSearch;
    if (filter === 'Gespeichert') return pin.isFavorite && matchesSearch;
    if (filter === 'Entdecken') return matchesSearch;
    return pin.category === filter && matchesSearch;
  });

  const relatedPins = useMemo(() => {
    if (!selectedPin) return [];
    return (initialPins || []).filter(p => p.category === selectedPin.category && p.id !== selectedPin.id);
  }, [selectedPin, initialPins]);

  const handleAddPin = async () => {
    if (!newTitle || !newUrl) return;
    const res = await createInspirationAction({ title: newTitle, imageUrl: newUrl, category: newCategory });
    if (res.success) {
      setIsAddPinOpen(false);
      setNewTitle('');
      setNewUrl('');
      setNewCategory('Andere');
    }
  };

  return (
    // Hintergrund: Hellgrau mit weichem Verlauf für den Glaseffekt
    <div className="flex min-h-screen bg-[#f8fafc] text-black font-sans transition-all duration-500">
      
      {/* SIDEBAR - Heller Glassmorphism + DICKER SCHWARZER TRENNSTRICH + FARBIGE ICONS */}
      <aside className="w-20 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-2xl border-r-4 border-black shadow-[4px_0_16px_-4px_rgba(0,0,0,0.12)] fixed h-full flex flex-col items-center py-8 z-[250]">
        
        {/* Logo bleibt genau so (sky-400) */}
        <div className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center mb-10 cursor-pointer hover:scale-110 transition-all shadow-md" onClick={() => setFilter('Alle')}>
          <span className="text-white text-xl font-black italic">I</span>
        </div>
        
        <nav className="flex flex-col gap-6 flex-1 items-center text-gray-400">
          
          {/* 1. HOME ICON → Gelb/Orange (amber-400) */}
          <div className="relative group">
            <button 
              onClick={() => setFilter('Alle')} 
              className={`p-3 rounded-2xl transition-all ${filter === 'Alle' ? 'bg-white/60 shadow-sm' : 'hover:bg-white/40'}`}
            >
              <div className="w-9 h-9 bg-amber-400 rounded-2xl flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </div>
            </button>
          </div>

          {/* 2. ENTDECKEN ICON → Grün (emerald-400) */}
          <div className="relative group">
            <button 
              onClick={() => setFilter('Entdecken')} 
              className={`p-3 rounded-2xl transition-all ${filter === 'Entdecken' ? 'bg-white/60 shadow-sm' : 'hover:bg-white/40'}`}
            >
              <div className="w-9 h-9 bg-emerald-400 rounded-2xl flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l3-6 3 6-3-6z" />
                </svg>
              </div>
            </button>
          </div>

          {/* 3. ADD ICON → Lila (violet-400) */}
          <div className="relative group">
            <button 
              onClick={() => setIsAddPinOpen(true)} 
              className="p-3 hover:bg-white/40 rounded-2xl transition-all"
            >
              <div className="w-9 h-9 bg-violet-400 rounded-2xl flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
          
        </nav>

        {/* Logout bleibt unverändert */}
        <div className="flex flex-col gap-4 mb-4 text-gray-400">
          <div className="relative group">
            <button onClick={() => logoutUserAction()} className="p-3 hover:bg-black/5 rounded-2xl transition-all hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-20 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-md px-10 py-6 w-full border-b border-white/40">
          <div className="relative mb-6 w-full max-w-4xl">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" placeholder="Suchen" 
              className="w-full bg-white/50 border border-white/60 rounded-full py-3.5 pl-14 pr-8 outline-none focus:bg-white focus:ring-2 ring-blue-100 transition-all text-lg"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all border ${filter === cat ? 'bg-black text-white border-black' : 'bg-white/40 text-black border-white/60 hover:bg-white/80'}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        <main className="px-10 py-4 w-full">
          {filter === 'Entdecken' ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-400 font-bold mb-2">Portfolio Showcase</p>
              <h1 className="text-4xl font-black mb-12">Helle Inspiration</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1600px]">
                {filteredPins.slice(0, 9).map((pin) => (
                  <div key={pin.id} onClick={() => setSelectedPin(pin)} className="relative h-[450px] rounded-[40px] overflow-hidden cursor-pointer group shadow-xl border border-white/40">
                    {isVideo(pin.imageUrl) ? (
                      <video src={getImageUrl(pin.imageUrl)} muted loop playsInline autoPlay className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <img src={getImageUrl(pin.imageUrl)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity">
                       <h3 className="text-white text-3xl font-black">{pin.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
              {filteredPins.map((pin) => (
                <div key={pin.id} className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden bg-white/40 border border-white/60 hover:shadow-lg transition-all">
                  {isVideo(pin.imageUrl) ? (
                    <video src={getImageUrl(pin.imageUrl)} className="w-full h-auto rounded-2xl" muted loop autoPlay onClick={() => setSelectedPin(pin)} />
                  ) : (
                    <img src={getImageUrl(pin.imageUrl)} alt={pin.title} className="w-full h-auto rounded-2xl group-hover:scale-[1.02] transition-transform duration-300" onClick={() => setSelectedPin(pin)} />
                  )}
                  {/* Hover Buttons */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-end pointer-events-auto">
                      <button 
                        onClick={(e) => handleToggleFavorite(e, pin)}
                        className={`px-5 py-2 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 border ${pin.isFavorite ? 'bg-black text-white' : 'bg-white/80 text-black border-white hover:bg-white'}`}
                      >
                        {pin.isFavorite ? 'Gemerkt' : 'Merken'}
                      </button>
                    </div>
                    <div className="flex justify-end pointer-events-auto">
                      <button onClick={(e) => handleDownload(e, getImageUrl(pin.imageUrl), pin.title)} className="p-2 bg-white/80 backdrop-blur-md rounded-full border border-white hover:bg-white text-black transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DETAIL MODAL - mit neuem Löschen-Button */}
      {selectedPin && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[300] overflow-y-auto" onClick={() => setSelectedPin(null)}>
          <div className="max-w-[1400px] mx-auto px-6 py-12 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedPin(null)} className="fixed top-6 left-6 z-[310] bg-white/80 backdrop-blur-md p-3 rounded-full shadow-md border border-white/60 hover:bg-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            </button>
            
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-[2] flex flex-col">
                <div className="bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white flex flex-col md:flex-row min-h-[600px]">
                  <div className="flex-1 bg-black/5 flex items-center justify-center p-4">
                     {isVideo(selectedPin.imageUrl) ? (
                        <video src={getImageUrl(selectedPin.imageUrl)} controls autoPlay className="max-w-full max-h-[80vh] rounded-[2rem]" />
                      ) : (
                        <img src={getImageUrl(selectedPin.imageUrl)} className="max-w-full max-h-[80vh] object-contain rounded-[2rem] shadow-xl" />
                      )}
                  </div>
                  <div className="w-full md:w-[400px] p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-end items-center gap-3 mb-10">
                        <button onClick={(e) => handleDownload(e, getImageUrl(selectedPin.imageUrl), selectedPin.title)} className="p-3 bg-white/40 border border-white/60 rounded-full hover:bg-white transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" /></svg>
                        </button>
                        <button 
                          onClick={(e) => handleToggleFavorite(e, selectedPin)}
                          className={`px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-md active:scale-95 border ${selectedPin.isFavorite ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'}`}
                        >
                          {selectedPin.isFavorite ? "Gemerkt" : "Merken"}
                        </button>

                        {/* === NEUER LÖSCHEN-BUTTON (nur bei eigenen Pins) === */}
                        {currentUserId && selectedPin.userId === currentUserId && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm("Pin wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) return;
                              
                              const res = await deleteInspirationAction(selectedPin.id);
                              if (res.success) {
                                setSelectedPin(null);
                              } else {
                                alert("Fehler beim Löschen des Pins.");
                              }
                            }}
                            className="px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-md active:scale-95 border border-red-400 bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Löschen
                          </button>
                        )}
                      </div>
                      <h2 className="text-5xl font-black mb-4 leading-tight tracking-tight">{selectedPin.title}</h2>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Kategorie: {selectedPin.category}</p>
                    </div>
                    <div className="p-8 bg-white/40 rounded-[2.5rem] flex items-center gap-4 border border-white/60 mt-12">
                      <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold italic shadow-sm text-xl">I</div>
                      <div>
                        <p className="font-black text-black text-sm">Community Pin</p>
                        <p className="text-gray-400 text-xs">Bereich: {selectedPin.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Pins */}
              <div className="flex-1 lg:max-w-[420px]">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 px-2">
                   <span className="w-1.5 h-6 bg-black rounded-full"></span>
                   Ähnliche Ideen
                </h3>
                <div className="columns-2 gap-4 space-y-4">
                  {relatedPins.slice(0, 12).map((p) => (
                    <div key={p.id} onClick={() => { setSelectedPin(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-all border border-white/60">
                      <img src={getImageUrl(p.imageUrl)} alt={p.title} className="w-full h-auto bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL - Heller Glass Look */}
      {isAddPinOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
           <div className="bg-white/70 backdrop-blur-2xl rounded-[40px] p-10 max-w-2xl w-full shadow-2xl relative border border-white flex flex-col md:flex-row gap-10">
            <button onClick={() => setIsAddPinOpen(false)} className="absolute top-8 right-8 text-gray-400 text-2xl hover:text-black transition-colors">✕</button>
            <div className="flex-1 flex flex-col gap-6">
                <h2 className="text-3xl font-black">Neuer Pin</h2>
                <CldUploadWidget uploadPreset="my_preset_123" options={{ resourceType: 'auto' }} onSuccess={(result: any) => setNewUrl(result.info.secure_url)}>
                    {({ open }) => (
                        <div onClick={() => open()} className={`h-72 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all ${newUrl ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white/50 border-white text-gray-400 hover:bg-white/80 hover:border-black/10'}`}>
                            <span className="text-4xl mb-3">{newUrl ? "✅" : "📁"}</span>
                            <span className="font-bold text-xs uppercase tracking-widest">{newUrl ? "Bereit" : "Datei wählen"}</span>
                        </div>
                    )}
                </CldUploadWidget>
            </div>
            <div className="flex-1 flex flex-col gap-5 pt-14">
                <input placeholder="Titel..." className="p-5 bg-white/50 border border-white rounded-2xl outline-none font-bold text-lg focus:bg-white" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)} className="p-5 bg-white/50 border border-white rounded-2xl outline-none font-bold text-gray-500">
                    {CATEGORIES.filter(c => !['Alle', 'Gespeichert', 'Entdecken'].includes(c)).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button onClick={handleAddPin} disabled={!newTitle || !newUrl} className="bg-black text-white p-5 rounded-full font-black mt-10 hover:bg-gray-800 disabled:opacity-10 shadow-lg active:scale-95 transition-all">Erstellen</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}