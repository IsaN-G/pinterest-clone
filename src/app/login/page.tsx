"use client";

import { loginUserAction } from "@/actions/authActions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-white px-4">
      {/* Die Glass-Box */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl w-full max-w-md">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
           <span className="text-white text-2xl font-black italic">I</span>
        </div>
        <h1 className="text-3xl font-black mb-2 text-center">Willkommen zurück</h1>
        <p className="text-zinc-400 text-center mb-10 text-sm">Logge dich ein, um deine Inspiration zu verwalten.</p>
        
        <form action={loginUserAction} className="flex flex-col gap-5">
          <div className="space-y-4">
            <input 
              name="email" type="email" placeholder="E-Mail" 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-white/30 transition-all placeholder:text-zinc-600" 
              required 
            />
            <input 
              name="password" type="password" placeholder="Passwort" 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-white/30 transition-all placeholder:text-zinc-600" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-white text-black p-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
          >
            Anmelden
          </button>
        </form>
        
        <p className="mt-8 text-center text-zinc-500 text-sm">
          Neu hier? <a href="/register" className="text-white font-bold hover:underline">Account erstellen</a>
        </p>
      </div>
    </div>
  );
}