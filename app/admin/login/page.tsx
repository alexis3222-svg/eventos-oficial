"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const iniciarSesion = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("ERROR LOGIN:", error.message);
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/admin");
    };

    return (
        <main className="min-h-screen bg-[#111] flex items-center justify-center px-6">

            <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-2xl">

                <div className="text-center mb-10">

                    <p className="uppercase tracking-[0.35em] text-sm text-[#d4a25a] mb-4">
                        Baruk Eventos
                    </p>

                    <h1 className="text-5xl text-[#1d1d1d]">
                        Admin Login
                    </h1>

                </div>

                <form
                    onSubmit={iniciarSesion}
                    className="space-y-6"
                >

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-black/10 rounded-xl px-5 py-4 outline-none focus:border-[#d4a25a]"
                    />

                    <input
                        type="text"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-black/10 rounded-xl px-5 py-4 outline-none focus:border-[#d4a25a]"
                    />

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#d4a25a] hover:bg-[#c89346] transition text-white py-5 rounded-2xl text-lg font-semibold shadow-xl"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>

                </form>
            </div>
        </main>
    );
}