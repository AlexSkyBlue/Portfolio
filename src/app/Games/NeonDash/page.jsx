import NeonDash from "./NeonDash";

export const metadata = {
    title: "NeonDash | Mini-Juego de AlexSkyBlue",
    description: "Pon a prueba tus reflejos en NeonDash, un juego de carrera infinita con estética neón desarrollado por Alex Parra.",
    keywords: [
        "NeonDash",
        "Juego de Navegador",
        "React Game",
        "AlexSkyBlue Proyectos",
        "Next.js Game",
        "Juego Arcade Neón",
        "Desarrollo Front End",
    ],
    openGraph: {
        title: "Juega NeonDash - AlexSkyBlue",
        description:
            "Esquiva obstáculos y rompe récords en este juego de estilo arcade. ¿Qué tan lejos puedes llegar?",
        url: "https://tusitioreal.cl/Games/NeonDash", // Actualiza con tu URL final
        siteName: "AlexSkyBlue Portfolio - Games",
        images: [
            {
                url: "https://avatars.githubusercontent.com/u/101909211?v=4", // Podrías cambiar esto por una captura del juego
                width: 800,
                height: 600,
                alt: "NeonDash Gameplay Preview",
            },
        ],
        locale: "es_CL",
        type: "website",
    },
};

export default function NeonDashPage() {
    return <NeonDash />;
}