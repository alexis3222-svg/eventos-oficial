"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabase";

type VarianteProducto = {
    dimension: string;
    precio: number;
    stock: number;
};

type Producto = {
    id?: number;

    nombre: string;
    descripcion: string;

    precio: number;
    stock: number;

    imagen: string;
    imagenes?: string[];

    youtube?: string;

    categoria_id?: number;
    subcategoria_id?: number | null;

    orden?: number;

    variantes?: VarianteProducto[];

    categorias?: {
        nombre: string;
    };

    subcategorias?: {
        nombre: string;
    };
};

type Subcategoria = {
    id: number;
    nombre: string;
    categoria_id: number;
};

type ItemResumen = Producto & {
    cantidad: number;
};

export default function CotizarPage() {
    const [categoriaActiva, setCategoriaActiva] = useState("");
    const [categorias, setCategorias] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [subcategorias, setSubcategorias] = useState<any[]>([]);
    const [subcategoriaActiva, setSubcategoriaActiva] = useState("");
    const [resumen, setResumen] = useState<ItemResumen[]>([]);
    const [cantidades, setCantidades] = useState<Record<string, string>>({});
    const [reservasFecha, setReservasFecha] = useState<Record<string, number>>({});
    const [fechaCargada, setFechaCargada] = useState(false);
    const [fechaAltaDemanda, setFechaAltaDemanda] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
    const [cantidadModal, setCantidadModal] = useState(1);
    const [imagenActiva, setImagenActiva] = useState(0);
    const [varianteSeleccionada, setVarianteSeleccionada] = useState<any>(null);

    const [datosEvento, setDatosEvento] = useState({
        nombre: "",
        telefono: "",
        fecha: "",
        tipoEvento: "",
        invitados: "",
        ubicacion: "",
    });

    useEffect(() => {
        obtenerCategorias();
        obtenerSubcategorias();
        obtenerProductos();
    }, []);

    const obtenerCategorias = async () => {
        const { data, error } = await supabase
            .from("categorias")
            .select("*")
            .order("id");

        if (error) {
            console.error(error);
            return;
        }

        setCategorias(data || []);

        if (data && data.length > 0) {
            setCategoriaActiva(data[0].nombre);
        }
    };

    const obtenerSubcategorias = async () => {
        const { data, error } = await supabase
            .from("subcategorias")
            .select("*")
            .order("id");

        if (error) {
            console.error(error);
            return;
        }

        setSubcategorias(data || []);
    };

    const obtenerProductos = async () => {
        const { data, error } = await supabase
            .from("productos")
            .select(`
            *,
            categorias(nombre),
            subcategorias(nombre)
        `)
            .order("orden", { ascending: true })
            .order("id", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setProductos(data || []);
    };

    const cargarReservasPorFecha = async (fecha: string) => {
        if (!fecha) return;

        const { data, error } = await supabase
            .from("cotizaciones")
            .select("productos")
            .eq("fecha", fecha)
            .in("estado", ["Reservado", "Confirmado"]);

        if (error) {
            console.error(error);
            return;
        }

        const reservas: Record<string, number> = {};

        (data || []).forEach((cotizacion: any) => {
            cotizacion.productos?.forEach((producto: any) => {
                reservas[producto.nombre] =
                    (reservas[producto.nombre] || 0) + producto.cantidad;
            });
        });

        const totalReservas = Object.values(reservas).reduce(
            (acc, valor) => acc + valor,
            0
        );

        setFechaAltaDemanda(totalReservas >= 5);

        setReservasFecha(reservas);
        setFechaCargada(true);
    };

    const obtenerCantidad = (producto: Producto) => {
        const cantidad = Number(cantidades[producto.nombre]);
        return Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 1;
    };

    const agregarProducto = (producto: Producto, cantidadManual?: number) => {
        const cantidad =
            typeof cantidadManual === "number" && cantidadManual > 0
                ? cantidadManual
                : obtenerCantidad(producto);

        const existente = resumen.find((item) => item.nombre === producto.nombre);
        const cantidadActual = existente ? existente.cantidad : 0;
        const nuevaCantidadTotal = cantidadActual + cantidad;

        const disponibles = Math.max(
            0,
            Number(producto.stock || 0) -
            (reservasFecha[producto.nombre] || 0)
        );

        if (nuevaCantidadTotal > disponibles) {
            alert(`Solo quedan ${disponibles} disponible(s) de ${producto.nombre}.`);
            return;
        }

        setResumen((prev) => {
            const existe = prev.find((item) => item.nombre === producto.nombre);

            if (existe) {
                return prev.map((item) =>
                    item.nombre === producto.nombre
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            }

            return [...prev, { ...producto, cantidad }];
        });

        setCantidades((prev) => ({
            ...prev,
            [producto.nombre]: "",
        }));
    };

    const quitarProducto = (nombre: string) => {
        setResumen((prev) =>
            prev
                .map((item) =>
                    item.nombre === nombre
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                )
                .filter((item) => item.cantidad > 0)
        );
    };

    const aumentarProducto = (item: ItemResumen) => {
        agregarProducto(item, 1);
    };

    const eliminarProducto = (nombre: string) => {
        setResumen((prev) => prev.filter((item) => item.nombre !== nombre));
    };

    const total = resumen.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    const generarPDF = () => {
        const doc = new jsPDF();
        const dorado: [number, number, number] = [212, 162, 90];

        doc.setFontSize(24);
        doc.setTextColor(...dorado);
        doc.text("BARUK EVENTOS", 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Cotización Referencial", 14, 30);

        doc.setFontSize(11);
        doc.setTextColor(40);

        doc.text(`Cliente: ${datosEvento.nombre || "No especificado"}`, 14, 50);
        doc.text(`Teléfono: ${datosEvento.telefono || "No especificado"}`, 14, 58);
        doc.text(`Fecha del evento: ${datosEvento.fecha || "No especificada"}`, 14, 66);
        doc.text(`Tipo de evento: ${datosEvento.tipoEvento || "No especificado"}`, 14, 74);
        doc.text(`Invitados: ${datosEvento.invitados || "No especificado"}`, 14, 82);
        doc.text(`Ubicación: ${datosEvento.ubicacion || "No especificada"}`, 14, 90);

        autoTable(doc, {
            startY: 102,
            head: [["Cantidad", "Servicio", "Precio", "Subtotal"]],
            body: resumen.map((item) => [
                item.cantidad,
                item.nombre,
                `$${item.precio}`,
                `$${(item.precio * item.cantidad).toFixed(2)}`,
            ]),
            styles: {
                fontSize: 10,
            },
            headStyles: {
                fillColor: dorado,
            },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 15;

        doc.setFontSize(16);
        doc.setTextColor(...dorado);
        doc.text(`TOTAL REFERENCIAL: $${total.toFixed(2)}`, 14, finalY);

        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.text("Gracias por cotizar con Baruk Eventos", 14, finalY + 15);

        doc.save("cotizacion-baruk-eventos.pdf");
    };

    const guardarCotizacion = async () => {
        const { error } = await supabase.from("cotizaciones").insert({
            nombre: datosEvento.nombre,
            telefono: datosEvento.telefono,
            fecha: datosEvento.fecha,
            tipo_evento: datosEvento.tipoEvento,
            invitados: datosEvento.invitados,
            ubicacion: datosEvento.ubicacion,
            productos: resumen,
            total,
            estado: "Pendiente",
        });

        if (error) {
            alert("No se pudo guardar la cotización.");
            console.error(error);
            return false;
        }

        return true;
    };

    const solicitarDisponibilidad = async () => {
        if (enviando) return;
        if (!datosEvento.nombre.trim()) {
            alert("Ingresa el nombre del cliente.");
            return;
        }

        if (!datosEvento.telefono.trim()) {
            alert("Ingresa el número de WhatsApp o teléfono.");
            return;
        }

        if (!datosEvento.fecha) {
            alert("Selecciona la fecha del evento.");
            return;
        }

        if (!datosEvento.tipoEvento) {
            alert("Selecciona el tipo de evento.");
            return;
        }
        if (resumen.length === 0) {
            alert("Agrega al menos un producto o servicio.");
            return;
        }

        setEnviando(true);

        const guardado = await guardarCotizacion();

        if (!guardado) {
            setEnviando(false);
            return;
        }

        generarPDF();

        const mensaje = `
*BARUK EVENTOS - NUEVA COTIZACIÓN*

Nombre: ${datosEvento.nombre || "No especificado"}
Teléfono: ${datosEvento.telefono || "No especificado"}
Fecha: ${datosEvento.fecha || "No especificada"}
Evento: ${datosEvento.tipoEvento || "No especificado"}
Invitados: ${datosEvento.invitados || "No especificado"}
Ubicación: ${datosEvento.ubicacion || "No especificada"}
━━━━━━━━━━━━━━

${resumen
                .map(
                    (item) =>
                        `• ${item.cantidad}x ${item.nombre} - $${(
                            item.precio * item.cantidad
                        ).toFixed(2)}`
                )
                .join("\n")}
━━━━━━━━━━━━━━

*TOTAL REFERENCIAL*: $${total.toFixed(2)}
*Gracias por cotizar con Baruk Eventos*
`;

        const numero = "593980600237";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");
        setEnviando(false);
    };
    const categoriaSeleccionada = categorias.find(
        (categoria: any) => categoria.nombre === categoriaActiva
    );

    const subcategoriasFiltradas = subcategorias.filter(
        (subcategoria) =>
            subcategoria.categoria_id === categoriaSeleccionada?.id
    );

    const productosFiltrados = productos.filter((producto: any) => {
        const coincideCategoria =
            producto.categorias?.nombre === categoriaActiva;

        const coincideSubcategoria = subcategoriaActiva
            ? producto.subcategorias?.nombre === subcategoriaActiva
            : true;

        return coincideCategoria && coincideSubcategoria;
    });

    return (
        <main className="min-h-screen bg-[#f3efe8] text-[#222]">
            <section className="px-6 pt-28 pb-16 text-center">
                <p className="mb-5 text-sm uppercase tracking-[0.45em] text-[#ffa500]">
                    Cotización Inteligente
                </p>

                <h1 className="mx-auto mb-8 max-w-5xl text-5xl md:text-7xl text-[#1d1d1d]">
                    Diseña tu evento
                </h1>

                <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-[#666]">
                    Selecciona cada detalle de tu celebración y obtén una cotización
                    referencial de forma rápida y elegante.
                </p>
            </section>

            <section className="px-6 mb-16">
                <div className="max-w-7xl mx-auto bg-white rounded-[2rem] p-10 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={datosEvento.nombre}
                            onChange={(e) =>
                                setDatosEvento({ ...datosEvento, nombre: e.target.value })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                        />

                        <input
                            type="tel"
                            placeholder="WhatsApp / Teléfono"
                            value={datosEvento.telefono}
                            onChange={(e) =>
                                setDatosEvento({ ...datosEvento, telefono: e.target.value })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                        />

                        <div>
                            <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={datosEvento.fecha}
                                onChange={async (e) => {
                                    const fecha = e.target.value;

                                    setFechaCargada(false);

                                    setDatosEvento({
                                        ...datosEvento,
                                        fecha,
                                    });

                                    setResumen([]);
                                    setCantidades({});

                                    await cargarReservasPorFecha(fecha);
                                }}
                                className="w-full border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                            />

                            {fechaCargada && (
                                <div className="mt-3 rounded-xl bg-[#faf7f2] px-4 py-3 text-sm text-[#666] border border-black/5">
                                    La disponibilidad se actualizó para la fecha seleccionada.

                                    {fechaAltaDemanda && (
                                        <div className="mt-3 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700">
                                            Alta demanda para esta fecha. Algunos servicios tienen disponibilidad limitada.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <select
                            value={datosEvento.tipoEvento}
                            onChange={(e) =>
                                setDatosEvento({ ...datosEvento, tipoEvento: e.target.value })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                        >
                            <option value="">Tipo de evento</option>
                            <option value="XV años">XV años</option>
                            <option value="Boda">Boda</option>
                            <option value="Cumpleaños">Cumpleaños</option>
                            <option value="Corporativo">Corporativo</option>
                            <option value="Baby Shower">Baby Shower</option>
                            <option value="Otros">Otros</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Invitados"
                            value={datosEvento.invitados}
                            onChange={(e) =>
                                setDatosEvento({ ...datosEvento, invitados: e.target.value })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                        />

                        <input
                            type="text"
                            placeholder="Ubicación"
                            value={datosEvento.ubicacion}
                            onChange={(e) =>
                                setDatosEvento({ ...datosEvento, ubicacion: e.target.value })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                        />
                    </div>
                </div>
            </section>

            <section className="px-6 pb-32">

                {/* CATEGORÍAS */}
                <div className="sticky top-0 z-40 bg-[#f3efe8]/70 backdrop-blur-md py-4">
                    <div className="max-w-[1500px] mx-auto overflow-x-auto overflow-y-hidden pb-3">
                        <div className="flex gap-4 min-w-max">
                            {categorias.map((categoria) => (
                                <button
                                    key={categoria.id}
                                    onClick={() => {
                                        setCategoriaActiva(categoria.nombre);
                                        setSubcategoriaActiva("");
                                    }}
                                    className={`px-8 py-4 rounded-2xl font-semibold uppercase tracking-[0.20em] transition whitespace-nowrap ${categoriaActiva === categoria.nombre
                                        ? "bg-[#ffa500] text-white"
                                        : "bg-white text-[#111] hover:bg-[#ece7de]"
                                        }`}
                                >
                                    {categoria.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* SUBCATEGORÍAS */}
                {subcategoriasFiltradas.length > 0 && (
                    <div className="sticky top-[92px] z-30 bg-[#f3efe8]/70 backdrop-blur-md py-3">
                        <div className="max-w-[1500px] mx-auto overflow-x-auto overflow-y-hidden pb-3">
                            <div className="flex gap-3 min-w-max">

                                <button
                                    onClick={() => setSubcategoriaActiva("")}
                                    className={`px-6 py-3 rounded-xl text-sm font-medium transition whitespace-nowrap ${subcategoriaActiva === ""
                                        ? "bg-[#111] text-white"
                                        : "bg-white text-[#111] hover:bg-[#ece7de]"
                                        }`}
                                >
                                    Todos
                                </button>

                                {subcategoriasFiltradas.map((subcategoria) => {
                                    const esHelloBris =
                                        subcategoria.nombre?.toLowerCase().includes("hello bris");

                                    return (
                                        <button
                                            key={subcategoria.id}
                                            onClick={() => setSubcategoriaActiva(subcategoria.nombre)}
                                            className={`
                px-6 py-3 rounded-xl text-sm uppercase tracking-[0.10em]
                transition whitespace-nowrap flex items-center gap-3

                ${subcategoriaActiva === subcategoria.nombre
                                                    ? esHelloBris
                                                        ? "bg-white text-[#c4007a] border-2 border-[#d10087] shadow-lg"
                                                        : "bg-[#111] text-white"
                                                    : esHelloBris
                                                        ? "bg-white text-[#c4007a] border-2 border-[#d10087] hover:bg-[#fff0fa]"
                                                        : "bg-white text-[#111] hover:bg-[#ece7de]"
                                                }
            `}
                                        >
                                            {esHelloBris && (
                                                <img
                                                    src="/hellobris.png"
                                                    alt="Hello Bris"
                                                    className="h-7 w-7 object-contain"
                                                />
                                            )}

                                            {subcategoria.nombre}
                                        </button>
                                    );
                                })}

                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENIDO */}
                <div className="w-full max-w-[1500px] mx-auto">
                    <div className="mb-10">
                        <h2 className="text-4xl text-[#1d1d1d] mb-4">
                            {categoriaActiva || "Servicios"}
                        </h2>

                        <p className="text-[#666] text-lg">
                            Selecciona los productos y servicios que necesitas.
                        </p>
                    </div>

                    {/* PRODUCTOS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14 bg-white rounded-[2rem] p-8 shadow-lg">
                        {productosFiltrados.map((producto: any) => {
                            const disponibles = Math.max(
                                0,
                                producto.stock - (reservasFecha[producto.nombre] || 0)
                            );

                            return (
                                <div
                                    key={producto.id}
                                    className="grid grid-cols-[150px_1fr] gap-5 items-center"
                                >
                                    <img
                                        src={producto.imagen || "/hero2.png"}
                                        alt={producto.nombre}
                                        onClick={() => {
                                            setProductoSeleccionado(producto);
                                            setCantidadModal(1);
                                            setImagenActiva(0);
                                            setVarianteSeleccionada(producto.variantes?.[0] || null);
                                        }}
                                        className="w-[150px] h-[130px] object-cover rounded-2xl cursor-pointer transition hover:scale-105"
                                    />

                                    <div>
                                        <p className="text-lg font-bold text-[#111]">
                                            ${producto.precio}
                                        </p>

                                        <h3 className="text-xl font-bold uppercase tracking-[0.08em] text-[#111] mb-2">
                                            {producto.nombre}
                                        </h3>

                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                            {producto.descripcion}
                                        </p>

                                        <div className="mb-3 text-sm uppercase tracking-[0.08em]">
                                            <span className="text-gray-500">Disponible: </span>
                                            <span className="font-semibold text-[#111]">
                                                {disponibles}
                                            </span>

                                            {disponibles > 0 && disponibles <= 2 && (
                                                <span className="ml-2 font-semibold text-[#ffa500]">
                                                    Últimas
                                                </span>
                                            )}

                                            {disponibles <= 0 && (
                                                <span className="ml-2 font-semibold text-red-500">
                                                    Agotado
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            disabled={disponibles <= 0}
                                            onClick={() => {
                                                setProductoSeleccionado(producto);
                                                setCantidadModal(1);
                                                setImagenActiva(0);
                                            }}
                                            className={`rounded-full px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] transition ${disponibles <= 0
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-[#111] text-white hover:bg-black cursor-pointer"
                                                }`}
                                        >
                                            {disponibles <= 0 ? "Agotado" : "Agregar"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* MODAL PRODUCTO */}
            {productoSeleccionado &&
                (() => {
                    const imagenes =
                        productoSeleccionado.imagenes?.length > 0
                            ? productoSeleccionado.imagenes
                            : [productoSeleccionado.imagen || "/hero2.png"];

                    const productoActual = varianteSeleccionada || productoSeleccionado;

                    const nombreReserva = varianteSeleccionada
                        ? `${productoSeleccionado.nombre} ${varianteSeleccionada.dimension}`
                        : productoSeleccionado.nombre;

                    const disponibles = Math.max(
                        0,
                        Number(productoActual.stock || 0) -
                        (reservasFecha[nombreReserva] || 0)
                    );

                    const precioActual = Number(productoActual.precio || 0);

                    return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                            <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white text-[#111] shadow-2xl">
                                <button
                                    onClick={() => {
                                        setProductoSeleccionado(null);
                                        setVarianteSeleccionada(null);
                                    }}
                                    className="absolute right-5 top-5 z-20 text-5xl leading-none text-[#111] hover:text-black"
                                >
                                    ×
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="flex flex-col items-center justify-center bg-[#f7f7f7] p-8">
                                        <img
                                            src={imagenes[imagenActiva]}
                                            alt={productoSeleccionado.nombre}
                                            className="max-h-[500px] w-full rounded-2xl object-contain"
                                        />

                                        {imagenes.length > 1 && (
                                            <div className="mt-5 flex gap-3 overflow-x-auto">
                                                {imagenes.map(
                                                    (img: string, index: number) => (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                setImagenActiva(index)
                                                            }
                                                            className={`overflow-hidden rounded-xl border-2 transition ${imagenActiva === index
                                                                ? "border-[#ffa500]"
                                                                : "border-transparent"
                                                                }`}
                                                        >
                                                            <img
                                                                src={img}
                                                                alt=""
                                                                className="h-20 w-20 object-cover"
                                                            />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col p-8 md:p-12">
                                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#ffa500]">
                                            {productoSeleccionado.subcategorias?.nombre ||
                                                productoSeleccionado.categorias?.nombre}
                                        </p>

                                        <h2 className="mb-4 text-4xl font-bold uppercase tracking-[0.08em]">
                                            {productoSeleccionado.nombre}
                                        </h2>

                                        <p className="mb-6 text-4xl font-bold text-[#ffa500]">
                                            ${precioActual.toFixed(2)}
                                        </p>

                                        {productoSeleccionado.variantes?.length > 0 && (
                                            <div className="mb-6">
                                                <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-gray-500">
                                                    Selecciona dimensión
                                                </p>

                                                <div className="flex flex-wrap gap-3">
                                                    {productoSeleccionado.variantes.map((variante: any, index: number) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                setVarianteSeleccionada(variante);
                                                                setCantidadModal(1);
                                                            }}
                                                            className={`rounded-full border px-5 py-3 font-bold transition ${varianteSeleccionada?.dimension === variante.dimension
                                                                ? "border-[#ffa500] bg-[#ffa500] text-white"
                                                                : "border-black/10 bg-white text-[#111] hover:border-[#ffa500]"
                                                                }`}
                                                        >
                                                            {variante.dimension} - ${Number(variante.precio || 0).toFixed(2)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="max-h-[220px] overflow-y-auto pr-2">
                                            <p className="text-lg leading-relaxed text-gray-600">
                                                {productoSeleccionado.descripcion ||
                                                    "Sin descripción"}
                                            </p>
                                        </div>

                                        {productoSeleccionado.youtube && (
                                            <a
                                                href={productoSeleccionado.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-red-600 px-6 py-4 text-lg font-bold uppercase tracking-[0.08em] text-white shadow-lg transition hover:bg-red-700"
                                            >
                                                ▶ Ver trabajos en YouTube
                                            </a>
                                        )}

                                        <div className="mb-8 mt-8 rounded-2xl bg-[#f8f8f8] p-5">
                                            <p className="text-sm uppercase tracking-[0.15em] text-gray-500">
                                                Disponibilidad
                                            </p>

                                            <p className="mt-2 text-3xl font-bold">
                                                {disponibles}
                                            </p>

                                            {disponibles > 0 && disponibles <= 2 && (
                                                <p className="mt-2 font-semibold text-[#ffa500]">
                                                    Últimas unidades disponibles
                                                </p>
                                            )}

                                            {disponibles <= 0 && (
                                                <p className="mt-2 font-semibold text-red-500">
                                                    Producto agotado para esta fecha
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-8">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() =>
                                                        setCantidadModal((prev) =>
                                                            Math.max(1, prev - 1)
                                                        )
                                                    }
                                                    className="h-14 w-14 rounded-full border border-black/10 text-3xl transition hover:bg-gray-100"
                                                >
                                                    -
                                                </button>

                                                <span className="min-w-[40px] text-center text-3xl font-bold">
                                                    {cantidadModal}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        setCantidadModal((prev) =>
                                                            prev < disponibles
                                                                ? prev + 1
                                                                : prev
                                                        )
                                                    }
                                                    className="h-14 w-14 rounded-full border border-black/10 text-3xl transition hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                disabled={disponibles <= 0}
                                                onClick={() => {
                                                    agregarProducto(
                                                        {
                                                            ...productoSeleccionado,
                                                            nombre: varianteSeleccionada
                                                                ? `${productoSeleccionado.nombre} ${varianteSeleccionada.dimension}`
                                                                : productoSeleccionado.nombre,
                                                            precio: precioActual,
                                                            stock: disponibles,
                                                            variante: varianteSeleccionada?.dimension || null,
                                                        },
                                                        cantidadModal
                                                    );

                                                    setProductoSeleccionado(null);
                                                }}
                                                className={`rounded-full px-10 py-5 text-xl font-bold uppercase tracking-[0.08em] text-white shadow-xl transition ${disponibles <= 0
                                                    ? "cursor-not-allowed bg-gray-400"
                                                    : "bg-[#ffa500] hover:brightness-95"
                                                    }`}
                                            >
                                                {disponibles <= 0
                                                    ? "Agotado"
                                                    : `Agregar $${(
                                                        precioActual * cantidadModal
                                                    ).toFixed(2)}`}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()
            }

            {/* BOTÓN FLOTANTE CARRITO */}
            <button
                onClick={() => setCarritoAbierto(true)}
                className="fixed bottom-6 right-6 z-40 rounded-full bg-[#79b4b0] px-6 py-4 text-white shadow-2xl hover:bg-[#ffa500]"
            >
                Cotización ({resumen.length}) · ${total.toFixed(2)}
            </button>

            {/* MODAL CARRITO */}
            {
                carritoAbierto && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 md:items-center">
                        <div className="w-full max-w-2xl rounded-t-[2rem] bg-white p-8 text-[#111] shadow-2xl md:rounded-[2rem]">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-4xl">Resumen</h2>

                                <button
                                    onClick={() => setCarritoAbierto(false)}
                                    className="rounded-full bg-black px-4 py-2 text-white"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="max-h-[45vh] overflow-y-auto border-b border-black/10 pb-6">
                                {resumen.length === 0 ? (
                                    <p className="text-gray-500">
                                        No hay productos agregados.
                                    </p>
                                ) : (
                                    resumen.map((item) => (
                                        <div
                                            key={item.nombre}
                                            className="mb-5 flex items-center justify-between gap-4"
                                        >
                                            <div>
                                                <p className="text-lg font-semibold">
                                                    {item.cantidad}x {item.nombre}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    ${item.precio} c/u
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        quitarProducto(item.nombre)
                                                    }
                                                    className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200"
                                                >
                                                    -
                                                </button>

                                                <button
                                                    onClick={() => aumentarProducto(item)}
                                                    className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200"
                                                >
                                                    +
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        eliminarProducto(item.nombre)
                                                    }
                                                    className="h-9 w-9 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Total referencial
                                    </span>

                                    <span className="text-4xl font-semibold text-[#ffa500]">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={solicitarDisponibilidad}
                                    disabled={enviando}
                                    className={`w-full rounded-2xl py-5 text-lg font-semibold text-white shadow-xl transition ${enviando
                                        ? "cursor-not-allowed bg-gray-400"
                                        : "bg-[#ffa500] hover:brightness-95"
                                        }`}
                                >
                                    {enviando
                                        ? "Procesando..."
                                        : "Solicitar disponibilidad"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </main>
    );
}