import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://barukeventos.com",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: "https://barukeventos.com/galeria",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: "https://barukeventos.com/servicios",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: "https://barukeventos.com/productos",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: "https://barukeventos.com/contacto",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://barukeventos.com/cotizar",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];
}