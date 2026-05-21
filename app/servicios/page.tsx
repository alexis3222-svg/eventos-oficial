export default function ServiciosPage() {
    const servicios = [
        {
            titulo: "Carpas Premium",
            descripcion:
                "Estructuras elegantes y modernas para eventos sociales y corporativos.",
            imagen: "/hero2.png",
        },
        {
            titulo: "Catering",
            descripcion:
                "Menús personalizados para bodas, XV años y celebraciones premium.",
            imagen:
                "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Hello Bris",
            descripcion:
                "Fresas con crema, mesas dulces y postres para eventos memorables.",
            imagen:
                "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Decoración",
            descripcion:
                "Diseño elegante y ambientación exclusiva para cada celebración.",
            imagen:
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Mobiliario",
            descripcion:
                "Mesas, sillas, mantelería e iluminación premium.",
            imagen:
                "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Cabina Vogue",
            descripcion:
                "Experiencia fotográfica elegante y moderna para tus invitados.",
            imagen:
                "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1974&auto=format&fit=crop",
        },
    ];

    return (
        <main className="min-h-screen bg-[#f8f4ec] text-[#222]">
            {/* HERO */}
            <section className="px-6 py-28 text-center">
                <p className="mb-5 text-sm uppercase tracking-[0.45em] text-[#d4a25a]">
                    Baruk Eventos
                </p>

                <h1 className="mx-auto mb-8 max-w-5xl text-5xl md:text-7xl text-[#1d1d1d]">
                    Servicios premium para eventos inolvidables
                </h1>

                <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-[#666]">
                    Descubre nuestros servicios exclusivos diseñados para crear
                    celebraciones elegantes y memorables.
                </p>
            </section>

            {/* GRID */}
            <section className="px-6 pb-32">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">

                    {servicios.map((servicio, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-2 transition duration-500"
                        >
                            {/* IMAGEN */}
                            <div className="overflow-hidden">
                                <img
                                    src={servicio.imagen}
                                    alt={servicio.titulo}
                                    className="w-full h-72 object-cover hover:scale-105 transition duration-700"
                                />
                            </div>

                            {/* CONTENIDO */}
                            <div className="p-8">

                                <h2 className="text-3xl text-[#1d1d1d] mb-4">
                                    {servicio.titulo}
                                </h2>

                                <p className="text-[#666] leading-relaxed mb-8">
                                    {servicio.descripcion}
                                </p>

                                <a
                                    href="/cotizar"
                                    className="inline-block bg-[#111] hover:bg-black transition text-white px-8 py-4 rounded-xl uppercase tracking-wider text-sm font-semibold"
                                >
                                    Cotizar servicio
                                </a>

                            </div>
                        </div>
                    ))}

                </div>
            </section>
        </main>
    );
}