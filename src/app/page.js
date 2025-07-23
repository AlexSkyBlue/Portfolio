import Image from "next/image";
import Hyperspeed from '@/reactbits/Backgrounds/Hyperspeed/Hyperspeed';
import BlurText from "@/reactbits/TextAnimations/BlurText/BlurText";
import PageClient from "./pageClient";

export const metadata = {
  title: "AlexSkyBlue - Ingeniero Informático & Front End Developer",
  description: "Portafolio profesional de AlexSkyBlue, Ingeniero Informático y Front End Developer. Descubre mis proyectos, habilidades y cómo contactarme.",
  keywords: [
    "AlexSkyBlue",
    "Alex Parra",
    "Portafolio",
    "Ingeniero Informático",
    "Front End Developer",
    "React",
    "Next.js",
    "Desarrollador",
    "Portfolio",
  ],
  openGraph: {
    title: "AlexSkyBlue | Portafolio de Front End Developer",
    description:
      "¡Bienvenido al portafolio de AlexSkyBlue! Ingeniero Informático y Desarrollador Front End. Explora mis proyectos y habilidades.",
    url: "https://tusitioreal.cl", // Cambia por tu URL real
    siteName: "AlexSkyBlue Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/101909211?v=4",
        width: 400,
        height: 400,
        alt: "AlexSkyBlue Foto de Perfil",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
};

export default function Home() {
  return <PageClient />;
}
