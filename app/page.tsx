"use client";

import { useEffect, useState } from "react";
import { Tent, Armchair, UtensilsCrossed, Flower2 } from "lucide-react";
import { motion } from "framer-motion";

const botonLuxury =
  "rounded-md border border-[#7a4b16] bg-gradient-to-b from-[#f0ad4e] via-[#d99232] to-[#b96d1e] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_14px_28px_rgba(0,0,0,0.35)] active:scale-[0.98]";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#222]">
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <motion.img
          src="/hero2.png"
          alt="Carpa premium para eventos"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/25" />

        <header
          className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled
            ? "bg-black/70 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
            }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
            <a href="/">
              <img
                src="/baruk eventos-02.png"
                alt="Baruk Eventos"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </a>

            <nav className="hidden md:flex items-center gap-12 text-sm font-semibold tracking-widest text-white uppercase">
              <a href="/" className="hover:text-[#f0ad4e] transition">
                Inicio
              </a>
              <a href="/servicios" className="hover:text-[#f0ad4e] transition">
                Servicios
              </a>
              <a href="/galeria" className="hover:text-[#f0ad4e] transition">
                Galería
              </a>
              <a href="/cotizar" className="hover:text-[#f0ad4e] transition">
                Cotizar
              </a>
            </nav>
          </div>
        </header>

        <div className="absolute bottom-16 left-1/2 z-20 flex w-full max-w-2xl -translate-x-1/2 flex-col gap-5 px-8 md:flex-row md:justify-center">
          <a
            href="/cotizar"
            className={`${botonLuxury} px-12 py-5 text-center text-sm font-bold uppercase tracking-wider`}
          >
            Cotizar Evento
          </a>

          <a
            href="/servicios"
            className="rounded-md border-2 border-white px-12 py-5 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
          >
            Ver Servicios
          </a>
        </div>
      </section>

      {/* PRESENTACIÓN / SERVICIOS */}
      <motion.section
        id="servicios"
        className="relative bg-[#f8f4ec] py-28 px-6 overflow-hidden"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: false, amount: 0.1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.45em] text-[#d99232]">
              Elegancia · Exclusividad · Experiencias
            </p>

            <h2 className="mx-auto mb-10 max-w-5xl text-4xl md:text-6xl leading-tight text-[#1d1d1d]">
              Creamos experiencias inolvidables
            </h2>

            <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-[#666]">
              En Baruk Eventos diseñamos celebraciones únicas con estructuras
              premium, decoración elegante y atención personalizada para
              transformar cada evento en un momento memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            <div className="px-10 py-14 text-center border-b xl:border-b-0 xl:border-r border-black/10">
              <div className="flex justify-center mb-10 text-[#d99232]">
                <Tent size={70} strokeWidth={1.2} />
              </div>

              <h3 className="text-3xl mb-5 text-[#1d1d1d]">
                Carpas Premium
              </h3>

              <p className="text-[#666] leading-relaxed text-lg">
                Estructuras elegantes y versátiles para eventos exclusivos.
              </p>
            </div>

            <div className="px-10 py-14 text-center border-b xl:border-b-0 xl:border-r border-black/10">
              <div className="flex justify-center mb-10 text-[#d99232]">
                <Armchair size={70} strokeWidth={1.2} />
              </div>

              <h3 className="text-3xl mb-5 text-[#1d1d1d]">Equipamiento</h3>

              <p className="text-[#666] leading-relaxed text-lg">
                Mesas, sillas, mantelería e iluminación premium.
              </p>
            </div>

            <div className="px-10 py-14 text-center border-b xl:border-b-0 xl:border-r border-black/10">
              <div className="flex justify-center mb-10 text-[#d99232]">
                <UtensilsCrossed size={70} strokeWidth={1.2} />
              </div>

              <h3 className="text-3xl mb-5 text-[#1d1d1d]">Catering</h3>

              <p className="text-[#666] leading-relaxed text-lg">
                Experiencias gastronómicas para celebraciones memorables.
              </p>
            </div>

            <div className="px-10 py-14 text-center">
              <div className="flex justify-center mb-10 text-[#d99232]">
                <Flower2 size={70} strokeWidth={1.2} />
              </div>

              <h3 className="text-3xl mb-5 text-[#1d1d1d]">Decoración</h3>

              <p className="text-[#666] leading-relaxed text-lg">
                Ambientes exclusivos con armonía y estilo luxury.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* GALERÍA PREMIUM */}
      <motion.section
        id="galeria"
        className="bg-[#111] py-32 px-6"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: false, amount: 0.1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.45em] text-[#f0ad4e]">
              Eventos Premium
            </p>

            <h2 className="text-4xl md:text-6xl text-white mb-8">
              Experiencias que hablan por sí solas
            </h2>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
              Descubre algunos de nuestros montajes, celebraciones y espacios
              diseñados para crear momentos únicos e inolvidables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-[2rem] h-[650px] group">
              <img
                src="/8581cf0d-44eb-4a71-9346-1291647b0e06.png"
                alt="Evento premium"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-10 left-10">
                <h3 className="text-4xl text-white mb-4">Carpas Luxury</h3>

                <p className="text-gray-300 text-lg">
                  Espacios elegantes para eventos inolvidables.
                </p>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-8">
              <div className="relative overflow-hidden rounded-[2rem] group min-h-[310px]">
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1974&auto=format&fit=crop"
                  alt="Decoración"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl text-white mb-2">
                    Decoración Premium
                  </h3>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] group min-h-[310px]">
                <img
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1974&auto=format&fit=crop"
                  alt="Catering"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl text-white mb-2">
                    Catering Exclusivo
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <a
              href="/galeria"
              className="inline-block rounded-md border border-[#d99232] px-10 py-4 text-sm font-semibold uppercase tracking-widest text-[#f0ad4e] transition hover:bg-[#d99232] hover:text-white"
            >
              Ver galería completa
            </a>
          </div>
        </div>
      </motion.section>

      {/* CTA FINAL */}
      <section className="bg-[#f8f4ec] px-6 py-24 text-center">
        <p className="mb-5 text-sm uppercase tracking-[0.45em] text-[#d99232]">
          Cotización Personalizada
        </p>

        <h2 className="mx-auto mb-8 max-w-4xl text-4xl md:text-6xl text-[#1d1d1d]">
          Diseña tu evento a tu manera
        </h2>

        <p className="mx-auto mb-10 max-w-3xl text-lg md:text-xl leading-relaxed text-[#666]">
          Selecciona carpas, mobiliario, catering, decoración y servicios
          adicionales en nuestro cotizador inteligente.
        </p>

        <a
          href="/cotizar"
          className={`${botonLuxury} inline-block px-12 py-5 text-sm font-bold uppercase tracking-wider`}
        >
          Iniciar cotización
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img
              src="/baruk eventos-02.png"
              alt="Baruk Eventos"
              className="h-14 w-auto mb-5"
            />

            <p className="text-gray-400 leading-relaxed text-sm">
              Creamos experiencias inolvidables con elegancia, exclusividad y
              atención a cada detalle.
            </p>
          </div>

          <div>
            <h3 className="text-2xl mb-5">Servicios</h3>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Carpas Premium</li>
              <li>Catering</li>
              <li>Decoración</li>
              <li>Mobiliario</li>
              <li>Cabina Vogue</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl mb-5">Contacto</h3>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>+593 000 000 000</li>
              <li>barukeventos@gmail.com</li>
              <li>Ecuador</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl mb-5">Redes Sociales</h3>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>TikTok</li>
              <li>WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
          © 2026 Baruk Eventos. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}