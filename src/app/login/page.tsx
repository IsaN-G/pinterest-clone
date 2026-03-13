import { loginUserAction } from "@/actions/authActions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-black mb-8 text-center text-red-600">Inspired Login</h1>
        <form action={loginUserAction} className="flex flex-col gap-6">
          <input name="email" type="email" placeholder="E-Mail" className="p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500" required />
          <input name="password" type="password" placeholder="Passwort" className="p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500" required />
          <button type="submit" className="bg-black text-white p-4 rounded-2xl font-bold hover:bg-gray-800 transition-all">Anmelden</button>
        </form>
        <p className="mt-6 text-center text-gray-400">Noch kein Konto? <a href="/register" className="text-red-600 font-bold">Registrieren</a></p>
      </div>
    </div>
  );
}