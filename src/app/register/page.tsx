"use client";

import { useActionState } from "react";
import { registerUserAction } from "@/actions/authActions";

export default function RegisterPage() {
  
  const [state, formAction] = useActionState(registerUserAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-black mb-2 text-center text-red-600">Registrieren</h1>
        <p className="text-center text-gray-400 mb-8 font-medium">Werde Teil der Inspiration</p>
        
        <form action={formAction} className="flex flex-col gap-5">
          {state?.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
              {state.error}
            </div>
          )}
          
          <input name="username" type="text" placeholder="Nutzername" className="p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500" required />
          <input name="email" type="email" placeholder="E-Mail" className="p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500" required />
          <input name="password" type="password" placeholder="Passwort (min. 6 Zeichen)" className="p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500" required />
          
          <button type="submit" className="bg-black text-white p-4 rounded-2xl font-bold hover:bg-gray-800 transition-all mt-2">
            Konto erstellen
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-400">
          Hast du schon ein Konto? <a href="/login" className="text-red-600 font-bold">Login</a>
        </p>
      </div>
    </div>
  );
}