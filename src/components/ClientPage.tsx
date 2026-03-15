"use client";

import { useState, useEffect, useMemo } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  createInspirationAction, 
  toggleFavoriteAction 
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

const CATEGORIES = ['Alle', 'Gespeichert', 'Entdecken', 'Tattoo', 'Mode', 'Sport', 'Natur', 'Kunst', 'Essen', 'Reisen', 'Andere'] as const;
type Category = (typeof CATEGORIES)[number];

export default function ClientPage({ initialPins, currentUserId }: { initialPins: Pin[], currentUserId: number | null }) {
  const [isAddPinOpen, setIsAddPinOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [filter, setFilter] = useState<Category>('Alle');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState(''); 
  const [newCategory, setNewCategory] = useState<Category>('Andere');

  // SCROLL LOCK
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
    <div className="flex min-h-screen bg-white text-black font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-20 bg-white border-r fixed h-full flex flex-col items-center py-8 z-[250]">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mb-10 cursor-pointer hover:scale-110 transition-all shadow-sm" onClick={() => setFilter('Alle')}>
          <span className="text-white text-xl font-black italic">I</span>
        </div>
        
        <nav className="flex flex-col gap-6 flex-1 items-center text-gray-400">
          {/* Home */}
          <div className="relative group">
            <button onClick={() => setFilter('Alle')} className={`p-3 rounded-2xl transition-all ${filter === 'Alle' ? 'text-black bg-gray-50' : 'hover:bg-gray-100 hover:text-black'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" /></svg>
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[300]">Home</span>
          </div>
          
          {/* Entdecken (Kompass) */}
          <div className="relative group">
            <button onClick={() => setFilter('Entdecken')} className={`p-3 rounded-2xl transition-all ${filter === 'Entdecken' ? 'text-black bg-gray-50' : 'hover:bg-gray-100 hover:text-black'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75l-4.5 4.5m0-4.5l4.5 4.5" className="opacity-0" /> {/* Hidden cross part */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l3-6 3 6-3-6z" />
              </svg>
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[300]">Entdecken</span>
          </div>

          {/* Erstellen */}
          <div className="relative group">
            <button onClick={() => setIsAddPinOpen(true)} className="p-3 hover:bg-gray-100 hover:text-black rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[300]">Erstellen</span>
          </div>
        </nav>

        {/* BOTTOM NAV */}
        <div className="flex flex-col gap-4 mb-4 text-gray-400">
          {/* Einstellungen (Zahnrad) */}
          <div className="relative group">
            <button className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[300]">Einstellungen</span>
          </div>

          {/* Logout */}
          <div className="relative group">
            <button onClick={() => logoutUserAction()} className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[300]">Abmelden</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-20 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-10 py-6 w-full">
          <div className="relative mb-6 w-full">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Suchen" 
              className="w-full bg-[#f1f1f1] border-none rounded-full py-3.5 pl-14 pr-8 outline-none focus:ring-2 ring-gray-200 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar justify-start">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${filter === cat ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        <main className="px-10 py-4 w-full">
          {filter === 'Entdecken' ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-500 font-bold mb-2">15. März 2026</p>
              <h1 className="text-4xl font-black mb-12">Bleib inspiriert</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1600px]">
                {filteredPins.slice(0, 9).map((pin) => (
                  <div key={pin.id} onClick={() => setSelectedPin(pin)} className="relative h-[450px] rounded-[40px] overflow-hidden cursor-pointer group shadow-xl">
                    {isVideo(pin.imageUrl) ? (
                      <video src={getImageUrl(pin.imageUrl)} muted loop playsInline autoPlay className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]" />
                    ) : (
                      <img src={getImageUrl(pin.imageUrl)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                       <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em] mb-2">Empfehlung</p>
                       <h3 className="text-white text-3xl font-black leading-tight">{pin.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
              {filteredPins.map((pin) => (
                <div key={pin.id} className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden bg-gray-100">
                  {isVideo(pin.imageUrl) ? (
                    <video src={getImageUrl(pin.imageUrl)} className="w-full h-auto rounded-2xl" muted loop autoPlay onClick={() => setSelectedPin(pin)} />
                  ) : (
                    <img src={getImageUrl(pin.imageUrl)} alt={pin.title} className="w-full h-auto rounded-2xl group-hover:brightness-90 transition-all duration-300" onClick={() => setSelectedPin(pin)} />
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-end pointer-events-auto">
                      <button 
                        onClick={(e) => handleToggleFavorite(e, pin)}
                        className={`px-5 py-2 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ${pin.isFavorite ? 'bg-black text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                      >
                        {pin.isFavorite ? 'Gemerkt' : 'Merken'}
                      </button>
                    </div>
                    <div className="flex justify-end pointer-events-auto">
                      <button 
                        onClick={(e) => handleDownload(e, getImageUrl(pin.imageUrl), pin.title)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors"
                      >
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

      {/* DETAIL MODAL */}
      {selectedPin && (
        <div className="fixed inset-0 bg-white z-[300] overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-12 relative">
            <button onClick={() => setSelectedPin(null)} className="fixed top-6 left-6 z-[310] bg-white p-3 rounded-full shadow-md border hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            </button>
            
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-[2] flex flex-col">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
                  <div className="flex-1 bg-[#f8f8f8] flex items-center justify-center p-4">
                     {isVideo(selectedPin.imageUrl) ? (
                        <video src={getImageUrl(selectedPin.imageUrl)} controls autoPlay className="max-w-full max-h-[80vh] rounded-[2rem]" />
                      ) : (
                        <img src={getImageUrl(selectedPin.imageUrl)} alt={selectedPin.title} className="max-w-full max-h-[80vh] object-contain rounded-[2rem]" />
                      )}
                  </div>
                  <div className="w-full md:w-[400px] p-10 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex justify-end items-center gap-3 mb-10">
                        <button onClick={(e) => handleDownload(e, getImageUrl(selectedPin.imageUrl), selectedPin.title)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" /></svg>
                        </button>
                        <button 
                          onClick={(e) => handleToggleFavorite(e, selectedPin)}
                          className={`px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-md active:scale-95 ${selectedPin.isFavorite ? 'bg-black text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                        >
                          {selectedPin.isFavorite ? "Gemerkt" : "Merken"}
                        </button>
                      </div>
                      <h2 className="text-5xl font-black mb-4 leading-tight tracking-tight">{selectedPin.title}</h2>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Kategorie: {selectedPin.category}</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] flex items-center gap-4 border border-gray-100 mt-12">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-gray-300 italic shadow-sm text-xl">I</div>
                      <div>
                        <p className="font-black text-black text-sm">Inspiration-User</p>
                        <p className="text-gray-400 text-xs">Gepostet unter {selectedPin.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 lg:max-w-[420px]">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 px-2">
                   <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                   Mehr davon
                </h3>
                <div className="columns-2 gap-4 space-y-4">
                  {relatedPins.slice(0, 12).map((p) => (
                    <div key={p.id} onClick={() => { setSelectedPin(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-all shadow-sm">
                      <img src={getImageUrl(p.imageUrl)} alt={p.title} className="w-full h-auto bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {isAddPinOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl relative flex flex-col md:flex-row gap-10">
            <button onClick={() => setIsAddPinOpen(false)} className="absolute top-8 right-8 text-gray-400 text-2xl">✕</button>
            <div className="flex-1 flex flex-col gap-6">
                <h2 className="text-3xl font-black">Neuer Pin</h2>
                <CldUploadWidget uploadPreset="my_preset_123" options={{ resourceType: 'auto' }} onSuccess={(result: any) => setNewUrl(result.info.secure_url)}>
                    {({ open }) => (
                        <div onClick={() => open()} className={`h-72 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer ${newUrl ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-100'}`}>
                            <span className="text-4xl mb-3">{newUrl ? "✅" : "📁"}</span>
                            <span className="font-black text-sm text-gray-500">{newUrl ? "Bereit" : "Datei wählen"}</span>
                        </div>
                    )}
                </CldUploadWidget>
            </div>
            <div className="flex-1 flex flex-col gap-5 pt-14">
                <input placeholder="Titel..." className="p-5 bg-gray-50 rounded-2xl outline-none font-black text-lg" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)} className="p-5 bg-gray-50 rounded-2xl outline-none font-bold">
                    {CATEGORIES.filter(c => c !== 'Alle' && c !== 'Gespeichert' && c !== 'Entdecken').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button onClick={handleAddPin} disabled={!newTitle || !newUrl} className="bg-red-600 text-white p-5 rounded-full font-black mt-10 hover:bg-red-700 disabled:opacity-20 shadow-lg active:scale-95 transition-transform">Erstellen</button>
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