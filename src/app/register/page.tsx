"use client";

import { useActionState } from "react";
import { registerUserAction } from "@/actions/authActions";

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUserAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-white to-rose-300 px-4 relative overflow-hidden">
      {/* Sanfter Hintergrund-Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(at_50%_20%,rgba(244,63,94,0.15),transparent)] pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-3xl border border-white/60 shadow-2xl p-12 rounded-3xl w-full max-w-md relative z-10">
        {/* Logo mit Glow */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px] shadow-red-500/50 transition-all hover:scale-110">
            <span className="text-white text-3xl font-black italic tracking-tighter">I</span>
          </div>
        </div>

        <h1 className="text-4xl font-black text-center text-zinc-900 mb-1 tracking-tighter">
          Registrieren
        </h1>
        <p className="text-zinc-500 text-center mb-10 text-[15px]">
          Werde Teil der Inspiration
        </p>

        <form action={formAction} className="flex flex-col gap-6">
          {/* Error Message */}
          {state?.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-3xl text-sm font-medium border border-red-100">
              {state.error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username */}
            <input
              name="username"
              type="text"
              placeholder="Nutzername"
              className="w-full px-6 py-5 bg-white border border-zinc-500 rounded-3xl outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all text-zinc-900 placeholder:text-zinc-600 text-[15px]"
              required
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="E-Mail-Adresse"
              className="w-full px-6 py-5 bg-white border border-zinc-500 rounded-3xl outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all text-zinc-900 placeholder:text-zinc-600 text-[15px]"
              required
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Passwort (min. 6 Zeichen)"
              className="w-full px-6 py-5 bg-white border border-zinc-500 rounded-3xl outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all text-zinc-900 placeholder:text-zinc-600 text-[15px]"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-red-800 to-rose-600 text-white font-semibold text-lg rounded-3xl hover:from-red-600 hover:to-rose-700 active:scale-[0.97] transition-all shadow-lg shadow-red-500/30 mt-2"
          >
            Konto erstellen
          </button>
        </form>

        {/* Link zum Login */}
        <p className="mt-9 text-center text-zinc-500 text-sm">
          Hast du schon ein Konto?{" "}
          <a
            href="/login"
            className="text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors"
          >
            Jetzt anmelden
          </a>
        </p>

        {/* Kleiner Footer-Hinweis */}
        <p className="text-[12px] text-center text-zinc-600 mt-8">
          Deine Daten sind bei uns sicher 🔒
        </p>
      </div>
    </div>
  );
}