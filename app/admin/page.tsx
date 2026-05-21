"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Cotizacion = {
    id: number;
    nombre: string | null;
    telefono: string | null;
    fecha: string | null;
    tipo_evento: string | null;
    invitados: string | null;
    ubicacion: string | null;
    total: number | null;
    estado: string | null;
    created_at: string;
    productos: any[] | null;
    fecha_bloqueada: boolean | null;
};

export default function AdminPage() {
    const router = useRouter();

    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [cotizacionSeleccionada, setCotizacionSeleccionada] =
        useState<Cotizacion | null>(null);

    useEffect(() => {
        verificarSesion();
    }, []);

    const verificarSesion = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            router.push("/admin/login");
            return;
        }

        obtenerCotizaciones();
    };

    const obtenerCotizaciones = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("cotizaciones")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        setCotizaciones(data || []);
        setLoading(false);
    };

    const cerrarSesion = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const totalCotizaciones = cotizaciones.length;

    const pendientes = cotizaciones.filter(
        (item) => (item.estado || "Pendiente") === "Pendiente"
    ).length;

    const reservados = cotizaciones.filter(
        (item) => item.estado === "Reservado"
    ).length;

    const ingresos = cotizaciones.reduce(
        (acc, item) => acc + Number(item.total || 0),
        0
    );
    const cotizacionesFiltradas = cotizaciones.filter((item) => {
        const texto = `
    ${item.nombre || ""}
    ${item.tipo_evento || ""}
    ${item.telefono || ""}
    ${item.ubicacion || ""}
  `.toLowerCase();

        return texto.includes(busqueda.toLowerCase());
    });

    return (
        <main className="min-h-screen bg-[#f3efe8] p-6">
            {/* HEADER */}
            <div className="mb-14 flex items-start justify-between gap-6">
                <div>
                    <p className="uppercase tracking-[0.35em] text-sm text-[#d4a25a] mb-4">
                        Dashboard
                    </p>

                    <h1 className="text-5xl md:text-7xl text-[#1d1d1d]">
                        Panel Administrativo
                    </h1>
                </div>

                <div className="mt-3 flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-[260px] rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#111] outline-none focus:border-[#d4a25a] shadow-md"
                    />

                    <button
                        onClick={cerrarSesion}
                        className="rounded-2xl bg-[#111] px-8 py-4 text-white shadow-xl transition hover:bg-black"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* TABLA */}
            <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#111] text-white">
                            <tr>
                                <th className="text-left px-6 py-5 font-medium">Cliente</th>
                                <th className="text-left px-6 py-5 font-medium">Evento</th>
                                <th className="text-left px-6 py-5 font-medium">Fecha</th>
                                <th className="text-left px-6 py-5 font-medium">Invitados</th>
                                <th className="text-left px-6 py-5 font-medium">Total</th>
                                <th className="text-left px-6 py-5 font-medium">Estado</th>
                                <th className="text-left px-6 py-5 font-medium">Acción</th>                            </tr>
                        </thead>

                        <tbody className="text-[#1d1d1d]">
                            {loading ? (
                                <tr>
                                    <td className="px-6 py-8" colSpan={7}>
                                        Cargando...
                                    </td>
                                </tr>
                            ) : cotizaciones.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-8" colSpan={7}>
                                        No hay cotizaciones.
                                    </td>
                                </tr>
                            ) : (
                                cotizacionesFiltradas.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => setCotizacionSeleccionada(item)}
                                        className="cursor-pointer border-b border-black/5 hover:bg-[#faf7f2] transition"
                                    >
                                        <td className="px-6 py-5">
                                            {item.nombre || "Sin nombre"}
                                        </td>

                                        <td className="px-6 py-5">
                                            {item.tipo_evento || "Sin evento"}
                                        </td>

                                        <td className="px-6 py-5">
                                            {item.fecha || "Sin fecha"}
                                        </td>

                                        <td className="px-6 py-5">
                                            {item.invitados || "No especificado"}
                                        </td>

                                        <td className="px-6 py-5 text-[#d4a25a] font-semibold">
                                            ${Number(item.total || 0).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-5">
                                            <select
                                                value={item.estado || "Pendiente"}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={async (e) => {
                                                    const nuevoEstado = e.target.value;

                                                    const { error } = await supabase
                                                        .from("cotizaciones")
                                                        .update({
                                                            estado: nuevoEstado,
                                                            fecha_bloqueada:
                                                                nuevoEstado === "Reservado" || nuevoEstado === "Confirmado",
                                                        })
                                                        .eq("id", item.id);

                                                    if (error) {
                                                        console.error(error);
                                                        return;
                                                    }

                                                    obtenerCotizaciones();
                                                }}
                                                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[#111] outline-none"                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Reservado">Reservado</option>
                                                <option value="Confirmado">Confirmado</option>
                                                <option value="Finalizado">Finalizado</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();

                                                    const confirmar = confirm("¿Eliminar esta cotización?");
                                                    if (!confirmar) return;

                                                    const { error } = await supabase
                                                        .from("cotizaciones")
                                                        .delete()
                                                        .eq("id", item.id);

                                                    if (error) {
                                                        console.error(error);
                                                        alert("No se pudo eliminar.");
                                                        return;
                                                    }

                                                    setCotizaciones((prev) =>
                                                        prev.filter((cotizacion) => cotizacion.id !== item.id)
                                                    );
                                                }}
                                                className="rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-600 hover:bg-red-500/20"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {cotizacionSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
                    <div className="w-full max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl text-[#1d1d1d]">                        <div className="mb-8 flex items-start justify-between gap-6">
                        <div>
                            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d99232]">
                                Detalle de cotización
                            </p>

                            <h2 className="text-4xl text-[#1d1d1d]">
                                {cotizacionSeleccionada.nombre || "Sin nombre"}
                            </h2>
                        </div>

                        <button
                            onClick={() => setCotizacionSeleccionada(null)}
                            className="rounded-full bg-black px-4 py-2 text-white"
                        >
                            ×
                        </button>
                    </div>

                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-gray-600">Evento</p>
                                <p className="text-xl">{cotizacionSeleccionada.tipo_evento}</p>
                            </div>

                            <div>
                                <p className="text-gray-600">Fecha</p>
                                <p className="text-xl">{cotizacionSeleccionada.fecha}</p>
                            </div>

                            <div>
                                <p className="text-gray-600">Invitados</p>
                                <p className="text-xl">{cotizacionSeleccionada.invitados}</p>
                            </div>

                            <div>
                                <p className="text-gray-600">Ubicación</p>
                                <p className="text-xl">{cotizacionSeleccionada.ubicacion}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600">Teléfono</p>

                            <p className="text-xl">
                                {cotizacionSeleccionada.telefono || "No registrado"}
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="mb-5 text-2xl text-[#1d1d1d]">Productos</h3>

                            <div className="space-y-4">
                                {cotizacionSeleccionada.productos?.map((producto: any) => (
                                    <div
                                        key={producto.nombre}
                                        className="flex items-center justify-between border-b border-black/10 pb-4"
                                    >
                                        <div>
                                            <p className="text-lg">
                                                {producto.cantidad}x {producto.nombre}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                ${producto.precio} c/u
                                            </p>
                                        </div>

                                        <p className="text-xl font-semibold text-[#d99232]">
                                            ${(producto.precio * producto.cantidad).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-6">
                            <div>
                                <p className="text-gray-600">Total referencial</p>
                                <p className="text-4xl font-semibold text-[#d99232]">
                                    ${Number(cotizacionSeleccionada.total || 0).toFixed(2)}
                                </p>
                            </div>

                            <a
                                href={`https://wa.me/${cotizacionSeleccionada.telefono?.replace(/\D/g, "")}`}
                                target="_blank"
                                className="rounded-2xl bg-green-500 px-8 py-4 text-white shadow-xl"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}