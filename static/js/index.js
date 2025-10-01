window.HELP_IMPROVE_VIDEOJS = false;

// Global error handler for carousel issues
window.addEventListener('error', function(e) {
    if (e.error && e.error.message && e.error.message.includes('offsetLeft')) {
        console.warn('Carousel offsetLeft error caught and handled:', e.error);
        e.preventDefault();
        return false;
    }
});

$(document).ready(function () {
    // Check for click events on the navbar burger icon

    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    }

    // Wait for images to load before initializing carousel
    function initializeCarousel() {
        try {
            // Initialize all div with carousel class
            var carousels = bulmaCarousel.attach('.carousel', options);
            
            // Add error handling for carousel events
            carousels.forEach(function(carousel) {
                if (carousel && carousel.element) {
                    carousel.element.addEventListener('error', function(e) {
                        console.warn('Carousel error caught:', e);
                    });
                }
            });
        } catch (error) {
            console.warn('Carousel initialization error:', error);
            // Retry after a short delay
            setTimeout(initializeCarousel, 1000);
        }
    }

    // Wait for all images in carousel to load
    var carouselImages = $('.carousel img');
    var imagesLoaded = 0;
    var totalImages = carouselImages.length;

    if (totalImages === 0) {
        // No images, initialize immediately
        initializeCarousel();
    } else {
        carouselImages.each(function() {
            var img = this;
            if (img.complete) {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    initializeCarousel();
                }
            } else {
                $(img).on('load error', function() {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        initializeCarousel();
                    }
                });
            }
        });
        
        // Fallback: initialize after 3 seconds regardless
        setTimeout(function() {
            if (imagesLoaded < totalImages) {
                console.warn('Some images still loading, initializing carousel anyway');
                initializeCarousel();
            }
        }, 3000);
    }

    try {
        bulmaSlider.attach();
    } catch (error) {
        console.warn('Slider initialization error:', error);
    }
})
