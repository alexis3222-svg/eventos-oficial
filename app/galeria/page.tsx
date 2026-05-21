export default function GaleriaPage() {
    const eventos = [
        {
            titulo: "XV Años Luxury",
            descripcion:
                "Decoración premium, iluminación elegante y experiencia inolvidable.",
            imagen:
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Carpas Premium",
            descripcion:
                "Montajes modernos para celebraciones sociales y corporativas.",
            imagen: "/hero2.png",
        },
        {
            titulo: "Catering Exclusivo",
            descripcion:
                "Experiencias gastronómicas diseñadas para eventos memorables.",
            imagen:
                "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Hello Bris",
            descripcion:
                "Fresas con crema y mesas dulces para momentos especiales.",
            imagen:
                "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Decoración Elegante",
            descripcion:
                "Diseños exclusivos y ambientaciones premium.",
            imagen:
                "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1974&auto=format&fit=crop",
        },
        {
            titulo: "Cabina Vogue",
            descripcion:
                "Experiencia fotográfica moderna y divertida para invitados.",
            imagen:
                "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1974&auto=format&fit=crop",
        },
    ];

    return (
        <main className="min-h-screen bg-[#111] text-white">
            {/* HERO */}
            <section className="px-6 py-28 text-center">
                <p className="mb-5 text-sm uppercase tracking-[0.45em] text-[#d4a25a]">
                    Baruk Eventos
                </p>

                <h1 className="mx-auto mb-8 max-w-5xl text-5xl md:text-7xl">
                    Galería de eventos
                </h1>

                <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-gray-400">
                    Descubre algunos de nuestros montajes, celebraciones y experiencias
                    diseñadas para crear momentos inolvidables.
                </p>
            </section>

            {/* GRID */}
            <section className="px-6 pb-32">
                <div className="max-w-7xl mx-auto columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">

                    {eventos.map((evento, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-[2rem] group break-inside-avoid"
                        >
                            {/* IMAGEN */}
                            <img
                                src={evento.imagen}
                                alt={evento.titulo}
                                className="w-full object-cover group-hover:scale-105 transition duration-700"
                            />

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* CONTENIDO */}
                            <div className="absolute bottom-0 left-0 p-8">

                                <h2 className="text-3xl mb-4">
                                    {evento.titulo}
                                </h2>

                                <p className="text-gray-300 leading-relaxed">
                                    {evento.descripcion}
                                </p>

                            </div>
                        </div>
                    ))}

                </div>
            </section>
        </main>
    );
}