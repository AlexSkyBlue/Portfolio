$(function () {
    const phrases = [
        { text: 'Hola soy ', span: 'Alex Parra', spanClass: 'bold-blue', colorClass: 'celeste' },
        { text: 'Desarrollador ', span: 'Full Stack', spanClass: 'bold-pink', colorClass: 'pink' }
    ];
    let currentPhraseIndex = 0;
    let isDeleting = false;
    let textIndex = 0;
    let spanIndex = 0;
    let delay = 2000;
    let currentText = '';
    let currentSpan = '';

    function type() {
        const fullText = phrases[currentPhraseIndex].text;
        const fullSpan = phrases[currentPhraseIndex].span;
        const spanClass = phrases[currentPhraseIndex].spanClass;
        const colorClass = phrases[currentPhraseIndex].colorClass;

        if (!isDeleting) {
            if (textIndex < fullText.length) {
                currentText = fullText.substring(0, textIndex + 1);
                textIndex++;
                $('.typewriter').html(currentText);
            } else if (spanIndex < fullSpan.length) {
                if (spanIndex === 0) {
                    $('.typewriter').append(`<span class="${spanClass}"></span>`);
                    $('.typewriter').addClass(colorClass);
                }
                currentSpan = fullSpan.substring(0, spanIndex + 1);
                $('.typewriter span').text(currentSpan);
                spanIndex++;
            }
        } else {
            if (spanIndex > 0) {
                currentSpan = fullSpan.substring(0, spanIndex - 1);
                $('.typewriter span').text(currentSpan);
                spanIndex--;
            } else if (spanIndex === 0 && $('.typewriter').hasClass(colorClass)) {
                $('.typewriter').removeClass(colorClass);
            } else if (textIndex > 0) {
                currentText = fullText.substring(0, textIndex - 1);
                $('.typewriter').html(currentText);
                textIndex--;
            }
        }

        if (!isDeleting && textIndex === fullText.length && spanIndex === fullSpan.length) {
            isDeleting = true;
            setTimeout(type, delay); // Pausa al final de la frase completa
        } else if (isDeleting && textIndex === 0 && spanIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            setTimeout(type, 500); // Pausa antes de empezar a escribir la siguiente frase
        } else {
            const typingSpeed = isDeleting ? 100 : 200;
            setTimeout(type, typingSpeed);
        }
    }

    setTimeout(type, 500); // Pausa inicial antes de empezar a escribir
});