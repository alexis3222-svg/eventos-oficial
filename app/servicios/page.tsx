export default function ServiciosPage() {
    const servicios = [
        {
            titulo: "Carpas Premium",
            descripcion:
                "Estructuras elegantes y modernas para eventos sociales y corporativos.",
            imagen: "45e663efa0d809a42a182ca6fdd63951.jpg",
            categoria: "Espacios y Estructuras",
        },
        {
            titulo: "Catering",
            descripcion:
                "Menús personalizados para bodas, XV años y celebraciones premium.",
            imagen: "7c4f686498678662f53ab52b350a0f0d.jpg",
            categoria: "Catering",
        },
        {
            titulo: "Hello Bris",
            descripcion:
                "Fresas con crema, mesas dulces y postres para eventos memorables.",
            imagen: "mostrador.jpeg",
            categoria: "Catering",
        },
        {
            titulo: "Decoración",
            descripcion:
                "Diseño elegante y ambientación exclusiva para cada celebración.",
            imagen: "254ada82329cf65d25f8c40dad7995d0.jpg",
            categoria: "Decoración",
        },
        {
            titulo: "Mobiliario",
            descripcion:
                "Mesas, sillas, mantelería e iluminación premium.",
            imagen: "dbe193cb099a7efbaf33aaae72d51c4a.jpg",
            categoria: "Mobiliario",
        },
        {
            titulo: "Cabina Vogue",
            descripcion:
                "Experiencia fotográfica elegante y moderna para tus invitados.",
            imagen: "6fe224d70417261d72242e89340d64c2.jpg",
            categoria: "Mobiliario",
        },
    ];

    return (
        <main className="min-h-screen bg-[#f8f4ec] text-[#222]">
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

            <section className="px-6 pb-32">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {servicios.map((servicio, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-2 transition duration-500"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={`/${servicio.imagen}`}
                                    alt={servicio.titulo}
                                    className="w-full h-72 object-cover hover:scale-105 transition duration-700"
                                />
                            </div>

                            <div className="p-8">
                                <h2 className="text-3xl text-[#1d1d1d] mb-4">
                                    {servicio.titulo}
                                </h2>

                                <p className="text-[#666] leading-relaxed mb-8">
                                    {servicio.descripcion}
                                </p>

                                <a
                                    href={`/cotizar?categoria=${encodeURIComponent(
                                        servicio.categoria
                                    )}`}
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