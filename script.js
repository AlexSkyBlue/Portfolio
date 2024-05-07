
anime.timeline({ loop: false })
.add({
    targets: '#nombreContainer .navbar',
    translateY: [-100, 0],
    // scale: [0.5, 1],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 1500
})
.add({
    targets: '#animationLetters .letter',
    translateY: [-100, -10],
    scale: [0.5, 1],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 1500,
    delay: anime.stagger(250)
})
.add({
    targets: '#animationLetters',
    opacity: 0.5,
    scale: [1, 0.75],
    duration: 900,
    easing: "easeOutExpo"
});
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const letters = document.querySelectorAll('#animationFrontEndDev .letter');


        var beforeLetters = []; // Almacena las letras que ya han caído

        letters.forEach((letter, index) => {
            // Retraso inicial basado en el índice para asegurar que las letras caen una tras otra
            const initialDelay = index * 250;
            letter.style.display = 'inline-block'; // Asumiendo que quieres que sean en línea

            // Animación de caída para cada letra
            anime({
                targets: letter,
                translateY: [-100, 0],
                scale: [0.5, 1],
                opacity: [0, 1],
                easing: "easeOutExpo",
                duration: 900,
                delay: initialDelay,
                complete: function() {
                    // Añade la letra actual al arreglo de letras antes de sacudirlas
                    beforeLetters.push(letter);

                    // Activar una sacudida del contenedor entero al completar cada letra
                    anime({
                        targets: beforeLetters,
                        easing: 'easeInOutSine' // Define un easing suave para la sacudida
                    });

                    // Añadir la clase 'dev' a la letra para aplicar cualquier estilo adicional
                    letter.classList.add('dev');
                }
            });
        });
    }, 4500); // Espera 4500 ms antes de iniciar la secuencia de animaciones
});

