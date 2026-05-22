"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Categoria = {
    id: number;
    nombre: string;
};

type Subcategoria = {
    id: number;
    nombre: string;
    categoria_id: number;
};

type VarianteProducto = {
    dimension: string;
    precio: number;
    stock: number;
};

type Producto = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
    categoria_id: number;
    subcategoria_id: number | null;
    orden: number;

    variantes?: VarianteProducto[];

    categorias?: {
        nombre: string;
    };

    subcategorias?: {
        nombre: string;
    };
};

export default function ProductosAdminPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);

    const [nombreCategoria, setNombreCategoria] = useState("");

    const [nuevaSubcategoria, setNuevaSubcategoria] = useState({
        nombre: "",
        categoria_id: "",
    });

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen: "",
        categoria_id: "",
        subcategoria_id: "",
        orden: "",

        variantes: [] as VarianteProducto[],
    });

    const [nuevaVariante, setNuevaVariante] = useState({
        dimension: "",
        precio: "",
        stock: "",
    });

    const [busquedaProducto, setBusquedaProducto] = useState("");

    useEffect(() => {
        obtenerCategorias();
        obtenerSubcategorias();
        obtenerProductos();
    }, []);

    const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

    const [modalEditar, setModalEditar] = useState(false);

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

    const crearCategoria = async () => {
        if (!nombreCategoria.trim()) {
            alert("Ingresa el nombre de la categoría.");
            return;
        }

        const { error } = await supabase.from("categorias").insert({
            nombre: nombreCategoria,
        });

        if (error) {
            console.error(error);
            alert("No se pudo crear la categoría.");
            return;
        }

        setNombreCategoria("");
        obtenerCategorias();
    };

    const crearSubcategoria = async () => {
        if (!nuevaSubcategoria.nombre.trim()) {
            alert("Ingresa el nombre de la subcategoría.");
            return;
        }

        if (!nuevaSubcategoria.categoria_id) {
            alert("Selecciona una categoría para la subcategoría.");
            return;
        }

        const { error } = await supabase.from("subcategorias").insert({
            nombre: nuevaSubcategoria.nombre,
            categoria_id: Number(nuevaSubcategoria.categoria_id),
        });

        if (error) {
            console.error(error);
            alert("No se pudo crear la subcategoría.");
            return;
        }

        setNuevaSubcategoria({
            nombre: "",
            categoria_id: "",
        });

        obtenerSubcategorias();
    };

    const agregarVariante = () => {
        if (!nuevaVariante.dimension.trim()) return;

        setNuevoProducto((prev: any) => ({
            ...prev,
            variantes: [
                ...prev.variantes,
                {
                    dimension: nuevaVariante.dimension,
                    precio: Number(nuevaVariante.precio || 0),
                    stock: Number(nuevaVariante.stock || 0),
                },
            ],
        }));

        setNuevaVariante({
            dimension: "",
            precio: "",
            stock: "",
        });
    };

    const crearProducto = async () => {
        if (!nuevoProducto.nombre.trim()) {
            alert("Ingresa el nombre del producto.");
            return;
        }

        if (!nuevoProducto.categoria_id) {
            alert("Selecciona una categoría.");
            return;
        }

        const { error } = await supabase.from("productos").insert({
            nombre: nuevoProducto.nombre,
            descripcion: nuevoProducto.descripcion,
            precio: Number(nuevoProducto.precio || 0),
            stock: Number(nuevoProducto.stock || 0),
            imagen: nuevoProducto.imagen,
            categoria_id: Number(nuevoProducto.categoria_id),
            subcategoria_id: nuevoProducto.subcategoria_id
                ? Number(nuevoProducto.subcategoria_id)
                : null,
            orden: Number(nuevoProducto.orden || 999),
            variantes: nuevoProducto.variantes,
        });
        if (error) {
            console.error(error);
            alert("No se pudo crear el producto.");
            return;
        }

        setNuevoProducto({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            imagen: "",
            categoria_id: "",
            subcategoria_id: "",
            orden: "",
            variantes: [],
        });

        obtenerProductos();
    };

    const eliminarProducto = async (id: number) => {
        const confirmar = confirm("¿Eliminar este producto?");
        if (!confirmar) return;

        const { error } = await supabase.from("productos").delete().eq("id", id);

        if (error) {
            console.error(error);
            alert("No se pudo eliminar el producto.");
            return;
        }

        obtenerProductos();
    };

    const guardarCambiosProducto = async () => {
        if (!productoEditando) return;

        const { error } = await supabase
            .from("productos")
            .update({
                nombre: productoEditando.nombre,
                descripcion: productoEditando.descripcion,
                precio: Number(productoEditando.precio || 0),
                stock: Number(productoEditando.stock || 0),
                imagen: productoEditando.imagen,
                orden: Number(productoEditando.orden || 0),
                variantes: productoEditando.variantes || [],
            })
            .eq("id", productoEditando.id);

        if (error) {
            console.error(error);
            alert("No se pudo actualizar el producto.");
            return;
        }

        alert("Producto actualizado.");

        setModalEditar(false);
        setProductoEditando(null);

        obtenerProductos();
    };

    const subcategoriasFiltradas = subcategorias.filter(
        (subcategoria) =>
            String(subcategoria.categoria_id) === nuevoProducto.categoria_id
    );

    const productosFiltrados = productos.filter((producto) => {
        const texto = busquedaProducto.toLowerCase();

        return (
            producto.nombre?.toLowerCase().includes(texto) ||
            producto.categorias?.nombre?.toLowerCase().includes(texto) ||
            producto.subcategorias?.nombre?.toLowerCase().includes(texto)
        );
    });

    return (
        <main className="min-h-screen bg-[#f3efe8] p-8 text-[#1d1d1d]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl mb-12 text-[#1d1d1d]">
                    Gestión de Productos
                </h1>

                {/* CREAR CATEGORÍA */}
                <div className="bg-white rounded-[2rem] p-8 shadow-lg mb-10">
                    <h2 className="text-3xl mb-6 text-[#1d1d1d]">
                        Nueva Categoría
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Nombre categoría"
                            value={nombreCategoria}
                            onChange={(e) => setNombreCategoria(e.target.value)}
                            className="flex-1 border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <button
                            onClick={crearCategoria}
                            className="bg-black text-white px-8 py-4 rounded-xl transition hover:bg-[#222]"
                        >
                            Crear categoría
                        </button>
                    </div>
                </div>

                {/* CREAR SUBCATEGORÍA */}
                <div className="bg-white rounded-[2rem] p-8 shadow-lg mb-10">
                    <h2 className="text-3xl mb-6 text-[#1d1d1d]">
                        Nueva Subcategoría
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Nombre subcategoría"
                            value={nuevaSubcategoria.nombre}
                            onChange={(e) =>
                                setNuevaSubcategoria({
                                    ...nuevaSubcategoria,
                                    nombre: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <select
                            value={nuevaSubcategoria.categoria_id}
                            onChange={(e) =>
                                setNuevaSubcategoria({
                                    ...nuevaSubcategoria,
                                    categoria_id: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                        >
                            <option value="">Seleccionar categoría</option>

                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={crearSubcategoria}
                            className="bg-black text-white px-8 py-4 rounded-xl transition hover:bg-[#222]"
                        >
                            Crear subcategoría
                        </button>
                    </div>
                </div>

                {/* CREAR PRODUCTO */}
                <div className="bg-white rounded-[2rem] p-8 shadow-lg mb-10">
                    <h2 className="text-3xl mb-8 text-[#1d1d1d]">
                        Nuevo Producto
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoProducto.nombre}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    nombre: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <input
                            type="text"
                            placeholder="Descripción"
                            value={nuevoProducto.descripcion}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    descripcion: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <input
                            type="number"
                            placeholder="Precio"
                            value={nuevoProducto.precio}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    precio: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <input
                            type="number"
                            placeholder="Stock"
                            value={nuevoProducto.stock}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    stock: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <input
                            type="number"
                            placeholder="Orden"
                            value={nuevoProducto.orden}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    orden: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <input
                            type="text"
                            placeholder="URL imagen"
                            value={nuevoProducto.imagen}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    imagen: e.target.value,
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                        />

                        <select
                            value={nuevoProducto.categoria_id}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    categoria_id: e.target.value,
                                    subcategoria_id: "",
                                })
                            }
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a]"
                        >
                            <option value="">Seleccionar categoría</option>

                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>

                        <select
                            value={nuevoProducto.subcategoria_id}
                            onChange={(e) =>
                                setNuevoProducto({
                                    ...nuevoProducto,
                                    subcategoria_id: e.target.value,
                                })
                            }
                            disabled={!nuevoProducto.categoria_id}
                            className="border border-black/10 rounded-xl px-5 py-4 text-[#111] outline-none focus:border-[#d4a25a] disabled:bg-gray-100"
                        >
                            <option value="">Seleccionar subcategoría</option>

                            {subcategoriasFiltradas.map((subcategoria) => (
                                <option
                                    key={subcategoria.id}
                                    value={subcategoria.id}
                                >
                                    {subcategoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2 xl:col-span-3 border border-black/10 rounded-2xl p-5">
                        <h3 className="text-xl mb-4 font-bold">
                            Variantes del producto
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Dimensión"
                                value={nuevaVariante.dimension}
                                onChange={(e) =>
                                    setNuevaVariante({
                                        ...nuevaVariante,
                                        dimension: e.target.value,
                                    })
                                }
                                className="border border-black/10 rounded-xl px-5 py-4"
                            />

                            <input
                                type="number"
                                placeholder="Precio"
                                value={nuevaVariante.precio}
                                onChange={(e) =>
                                    setNuevaVariante({
                                        ...nuevaVariante,
                                        precio: e.target.value,
                                    })
                                }
                                className="border border-black/10 rounded-xl px-5 py-4"
                            />

                            <input
                                type="number"
                                placeholder="Stock"
                                value={nuevaVariante.stock}
                                onChange={(e) =>
                                    setNuevaVariante({
                                        ...nuevaVariante,
                                        stock: e.target.value,
                                    })
                                }
                                className="border border-black/10 rounded-xl px-5 py-4"
                            />

                            <button
                                type="button"
                                onClick={agregarVariante}
                                className="bg-black text-white rounded-xl px-5 py-4"
                            >
                                Agregar variante
                            </button>
                        </div>

                        {nuevoProducto.variantes?.length > 0 && (
                            <div className="mt-5 space-y-3">
                                {nuevoProducto.variantes?.map(
                                    (variante, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-xl bg-[#f5f5f5] px-5 py-4"
                                        >
                                            <p>
                                                {variante.dimension} · $
                                                {variante.precio} ·
                                                Stock: {variante.stock}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={crearProducto}
                        className="mt-8 bg-[#d4a25a] text-white px-8 py-4 rounded-xl transition hover:bg-[#c89346]"
                    >
                        Crear producto
                    </button>
                </div>

                {/* BUSCAR PRODUCTO PARA EDITAR */}
                <div className="bg-white rounded-[2rem] p-8 shadow-lg mb-10">
                    <h2 className="text-3xl mb-6 text-[#1d1d1d]">
                        Buscar producto para editar
                    </h2>

                    <input
                        type="text"
                        placeholder="Buscar por producto, categoría o subcategoría..."
                        value={busquedaProducto}
                        onChange={(e) => setBusquedaProducto(e.target.value)}
                        className="w-full border border-black/10 rounded-xl px-5 py-4 text-[#111] placeholder:text-gray-400 outline-none focus:border-[#d4a25a]"
                    />
                </div>

                {/* PRODUCTOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {busquedaProducto.trim() &&
                        productosFiltrados.map((producto) => (
                            <div
                                key={producto.id}
                                className="bg-white rounded-[2rem] p-6 shadow-lg text-[#1d1d1d]"
                            >
                                <img
                                    src={producto.imagen || "/hero2.png"}
                                    alt={producto.nombre}
                                    className="w-full h-56 object-cover rounded-2xl mb-5"
                                />

                                <p className="text-sm text-[#d4a25a] mb-2">
                                    {producto.categorias?.nombre || "Sin categoría"}
                                    {producto.subcategorias?.nombre
                                        ? ` · ${producto.subcategorias.nombre}`
                                        : ""}
                                </p>

                                <h3 className="text-3xl mb-3 text-[#1d1d1d]">
                                    {producto.nombre}
                                </h3>

                                <p className="text-gray-600 mb-5">
                                    {producto.descripcion || "Sin descripción"}
                                </p>

                                <div className="space-y-2 mb-6 text-[#1d1d1d]">
                                    <p>
                                        Precio: $
                                        {Number(producto.precio || 0).toFixed(2)}
                                    </p>
                                    <p>Stock: {producto.stock}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setProductoEditando(producto);
                                            setModalEditar(true);
                                        }}
                                        className="flex-1 bg-black text-white py-3 rounded-xl transition hover:bg-[#222]"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => eliminarProducto(producto.id)}
                                        className="flex-1 bg-red-500 text-white py-3 rounded-xl transition hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                {/* MODAL EDITAR PRODUCTO */}
                {modalEditar && productoEditando && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="w-full max-w-3xl rounded-[2rem] bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl">Editar Producto</h2>

                                <button
                                    onClick={() => {
                                        setModalEditar(false);
                                        setProductoEditando(null);
                                    }}
                                    className="text-4xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold uppercase text-[#ffa500]">
                                        Nombre del producto
                                    </label>
                                    <input
                                        type="text"
                                        value={productoEditando.nombre}
                                        onChange={(e) =>
                                            setProductoEditando({
                                                ...productoEditando,
                                                nombre: e.target.value,
                                            })
                                        }
                                        className="w-full border border-black/10 rounded-xl px-5 py-4"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold uppercase text-[#ffa500]">
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        value={productoEditando.precio}
                                        onChange={(e) =>
                                            setProductoEditando({
                                                ...productoEditando,
                                                precio: Number(e.target.value),
                                            })
                                        }
                                        className="w-full border border-black/10 rounded-xl px-5 py-4"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold uppercase text-[#ffa500]">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={productoEditando.stock}
                                        onChange={(e) =>
                                            setProductoEditando({
                                                ...productoEditando,
                                                stock: Number(e.target.value),
                                            })
                                        }
                                        className="w-full border border-black/10 rounded-xl px-5 py-4"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold uppercase text-[#ffa500]">
                                        Orden en cotizador
                                    </label>
                                    <input
                                        type="number"
                                        value={productoEditando.orden || 0}
                                        onChange={(e) =>
                                            setProductoEditando({
                                                ...productoEditando,
                                                orden: Number(e.target.value),
                                            })
                                        }
                                        className="w-full border border-black/10 rounded-xl px-5 py-4"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-bold uppercase text-[#ffa500]">
                                        URL / nombre de imagen
                                    </label>
                                    <input
                                        type="text"
                                        value={productoEditando.imagen}
                                        onChange={(e) =>
                                            setProductoEditando({
                                                ...productoEditando,
                                                imagen: e.target.value,
                                            })
                                        }
                                        className="w-full border border-black/10 rounded-xl px-5 py-4"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-bold uppercase text-[#ffa500]">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={productoEditando.descripcion}
                                        onChange={(e) =>
                                            setProductoEditando({
                                                ...productoEditando,
                                                descripcion: e.target.value,
                                            })
                                        }
                                        className="w-full border border-black/10 rounded-xl px-5 py-4 min-h-[120px]"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-4 block text-sm font-bold uppercase text-[#ffa500]">
                                    Variantes
                                </label>

                                <div className="space-y-4">
                                    {(productoEditando.variantes || []).map((variante, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold uppercase text-[#ffa500]">
                                                    Dimensión
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: 5 metros"
                                                    value={variante.dimension}
                                                    onChange={(e) => {
                                                        const nuevasVariantes = [...(productoEditando.variantes || [])];
                                                        nuevasVariantes[index].dimension = e.target.value;

                                                        setProductoEditando({
                                                            ...productoEditando,
                                                            variantes: nuevasVariantes,
                                                        });
                                                    }}
                                                    className="w-full border border-black/10 rounded-xl px-5 py-4"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-xs font-bold uppercase text-[#ffa500]">
                                                    Precio
                                                </label>
                                                <input
                                                    type="number"
                                                    value={variante.precio}
                                                    onChange={(e) => {
                                                        const nuevasVariantes = [...(productoEditando.variantes || [])];
                                                        nuevasVariantes[index].precio = Number(e.target.value);

                                                        setProductoEditando({
                                                            ...productoEditando,
                                                            variantes: nuevasVariantes,
                                                        });
                                                    }}
                                                    className="w-full border border-black/10 rounded-xl px-5 py-4"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-xs font-bold uppercase text-[#ffa500]">
                                                    Stock
                                                </label>
                                                <input
                                                    type="number"
                                                    value={variante.stock}
                                                    onChange={(e) => {
                                                        const nuevasVariantes = [...(productoEditando.variantes || [])];
                                                        nuevasVariantes[index].stock = Number(e.target.value);

                                                        setProductoEditando({
                                                            ...productoEditando,
                                                            variantes: nuevasVariantes,
                                                        });
                                                    }}
                                                    className="w-full border border-black/10 rounded-xl px-5 py-4"
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const nuevasVariantes = (productoEditando.variantes || []).filter(
                                                            (_, i) => i !== index
                                                        );

                                                        setProductoEditando({
                                                            ...productoEditando,
                                                            variantes: nuevasVariantes,
                                                        });
                                                    }}
                                                    className="w-full rounded-xl bg-red-500 px-5 py-4 text-white"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setProductoEditando({
                                            ...productoEditando,
                                            variantes: [
                                                ...(productoEditando.variantes || []),
                                                {
                                                    dimension: "",
                                                    precio: Number(productoEditando.precio || 0),
                                                    stock: Number(productoEditando.stock || 0),
                                                },
                                            ],
                                        });
                                    }}
                                    className="mt-4 rounded-xl bg-black px-6 py-4 text-white"
                                >
                                    Agregar variante
                                </button>
                            </div>

                            <button
                                onClick={guardarCambiosProducto}
                                className="mt-8 w-full bg-[#ffa500] text-white py-4 rounded-xl font-bold"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}