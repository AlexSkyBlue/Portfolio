$(function () {
    // Inicializar en modo claro
    $('body').addClass('light-mode-bg');
    $('.scroll-container').addClass('light-shadow');
    // Alternar el modo oscuro
    $('.dark-mode, .white-mode').on('click', toggleMode);
    // Alternar el modo oscuro - Funciones
    function toggleMode() {
        $('body').toggleClass('dark-mode-bg light-mode-bg');
        $('.dark-mode').toggleClass('hide');
        $('.white-mode').toggleClass('hide');
        $('.scroll-container').toggleClass('dark-shadow light-shadow');
    }

    //Efecto Máquina de Escribir
    setTimeout(type, 500); // Pausa inicial antes de empezar a escribir

    //Efecto Máquina de Escribir - Funciones
    const phrases = [
        { text: 'Hola, soy ', span: 'Alex Parra', spanClass: 'bold-blue', colorClass: 'celeste' },
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

    // Manejar hover para mostrar el pop-up y agregar drop-shadow
    $('.icono').hover(function() {
        var dataName = $(this).data('name');
        var popup = $(this).siblings('.pop-up');
        popup.text(dataName); // Actualiza el texto del pop-up

        // Agregar drop-shadow en hover
        var dropShadowColor;
        switch (dataName) {
            case 'Angular':
                dropShadowColor = 'rgba(221, 44, 0, 0.7)';
                break;
            case 'TypeScript':
                dropShadowColor = 'rgba(0, 122, 204, 0.7)';
                break;
            case 'C Sharp (C#)':
                dropShadowColor = 'rgba(79, 114, 201, 0.7)';
                break;
            case '.NET':
                dropShadowColor = 'rgba(51, 51, 51, 0.7)';
                break;
            case 'HTML5':
                dropShadowColor = 'rgba(227, 79, 38, 0.7)';
                break;
            case 'CSS3':
                dropShadowColor = 'rgba(21, 114, 182, 0.7)';
                break;
            case 'Bootstrap 5':
                dropShadowColor = 'rgba(86, 61, 124, 0.7)';
                break;
            case 'Tailwind CSS':
                dropShadowColor = 'rgba(56, 189, 248, 0.7)';
                break;
            case 'JavaScript':
                dropShadowColor = 'rgba(247, 223, 30, 0.7)';
                break;
            case 'jQuery':
                dropShadowColor = 'rgba(0, 71, 126, 0.7)';
                break;
            case 'Postman':
                dropShadowColor = 'rgba(255, 119, 0, 0.7)';
                break;
            case 'SQL Server':
                dropShadowColor = 'rgba(100, 143, 255, 0.7)';
                break;
            case 'Git':
                dropShadowColor = 'rgba(240, 80, 51, 0.7)';
                break;
            default:
                dropShadowColor = 'rgba(0, 0, 0, 0.2)'; // Default color
        }
        $(this).css('filter', `grayscale(0) drop-shadow(0 0 10px ${dropShadowColor})`);

        // Mostrar el pop-up
        popup.css({
            'opacity': 1
        });
    }, function() {
        var popup = $(this).siblings('.pop-up');
        popup.css({
            'opacity': 0,
        });

        // Quitar drop-shadow al quitar hover
        $(this).css('filter', 'grayscale(1)');
    });
});