$(document).ready(function() {

//slide-show in about me
if ($('body').hasClass('about')) { 
        const $headerH2 = $(".about header > h2");
        const $headerImg = $(".about .angel_main_picture");
        const $headerP = $(".about header .summary_box").first(); 

        const animationSpeed = 800;
        const initialDelay = 200;
        const staggerDelay = 300;

        //coming from the top
        $headerH2.css({
            position: 'relative',
            top: '-70px'
        });

        //coming from the left
        $headerImg.css({
            position: 'relative',
            left: '-100%'     
        });

        //coming from the right
        $headerP.css({
            position: 'relative',
            left: '100%'   
        });

        $headerH2.delay(initialDelay).animate({
            top: '0px', 
            opacity: 1
        }, 
        animationSpeed);

        $headerImg.delay(initialDelay + staggerDelay).animate({
            left: '0px', 
            opacity: 1
        },  
        animationSpeed);

        $headerP.delay(initialDelay + (staggerDelay * 2)).animate({
            left: '0px',
            opacity: 1
        }, 
        animationSpeed);
    } 

//element 1, carousel home page
    let currentSlide = 0;
    const $slides = $(".carousel-slide");
    const totalSlides = $slides.length;
    const slideInterval = 5000; //5 seconds
    let autoSlideTimer; 

    function showSlide(index) {
        $slides.removeClass("active").hide();
        $slides.eq(index).addClass("active").fadeIn(700);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides; 
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    $(".carousel-next").on("click", function() {
        nextSlide();
        resetAutoSlide();
    });

    $(".carousel-prev").on("click", function() {
        prevSlide();
        resetAutoSlide();
    });

    function startAutoSlide() {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(nextSlide, slideInterval);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    if (totalSlides > 0) {
        showSlide(currentSlide);
        startAutoSlide();
    }
    
    //pause when hover
    $("#imageCarousel").hover(
        function() { 
            clearInterval(autoSlideTimer);
        },
        function() {
            startAutoSlide();
        }
    );


//element 2, highlight pictures in ideas section
    $(".polaroid").hover(
        function() {
            $(this).css({
                'transform': 'scale(1.08)',
                'box-shadow': '0 8px 16px rgba(0,0,0,0.25)',
                'border-color': '#ffdd57', 
                'z-index': '5'
            });
        },
        function() {
            $(this).css({
                'transform': 'scale(1)',
                'box-shadow': '0 4px 8px rgba(0,0,0,0.1)',
                'border-color': 'transparent',
                'z-index': '1'
            });
        }
    );


//element 3, pictures scroll in pictures_home section
    const $scrollerWrapper = $('.pictures_home .horizontal-scroll-wrapper');
    const $scrollContainer = $scrollerWrapper.find('.scroll-container');
    const $scrollContent = $scrollerWrapper.find('.scroll-content');
    const $prevScrollBtn = $scrollerWrapper.find('.scroll-btn.prev-btn');
    const $nextScrollBtn = $scrollerWrapper.find('.scroll-btn.next-btn');

    function updateScrollButtonsState() {
        if (!$scrollContainer.length || !$scrollContent.length) {
            if ($prevScrollBtn.length) $prevScrollBtn.addClass('disabled');
            if ($nextScrollBtn.length) $nextScrollBtn.addClass('disabled');
            return;
        }

        const scrollLeftPosition = $scrollContainer.scrollLeft(); 
        const contentScrollWidth = $scrollContent[0].scrollWidth; 
        const containerVisibleWidth = $scrollContainer.innerWidth();
    }

    if ($scrollContainer.length > 0) {
        updateScrollButtonsState();

        $scrollContainer.on('scroll', function() {
            updateScrollButtonsState();
        });

        $nextScrollBtn.on('click', function() {
            if ($(this).hasClass('disabled')) return; 

            const scrollAmount = $scrollContainer.innerWidth() * 0.8;
            $scrollContainer.animate({
                scrollLeft: '+=' + scrollAmount
            }, 400, 'swing', function() {
                updateScrollButtonsState();
            });
        });

        $prevScrollBtn.on('click', function() {
            if ($(this).hasClass('disabled')) return; 

            const scrollAmount = $scrollContainer.innerWidth() * 0.8;
            $scrollContainer.animate({
                scrollLeft: '-=' + scrollAmount 
            }, 400, 'swing', function() { 
                updateScrollButtonsState(); 
            });
        });

        let resizeTimer;
        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                updateScrollButtonsState();
            }, 250);
        });
    } 

//element 4, scroll top button for all the pages
    const $scrollToTopButton = $('#scrollTop');
    const scrollThreshold = 200;
    const scrollSpeed = 600; 

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > scrollThreshold) {
            if (!$scrollToTopButton.is(':visible')) { 
                $scrollToTopButton.fadeIn();
            }
        } 
        else {

            if ($scrollToTopButton.is(':visible')) {
                $scrollToTopButton.fadeOut();
            }
        }
    });

    $scrollToTopButton.on('click', function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: 0 
        }, scrollSpeed);
    });

//element 5, accordion in plans page
    if ($('body').hasClass('plans')) {
        const $plansTable = $('#plansTable');

        $plansTable.find('.plan_toggle').on('click', function() {
            const $detailsRow = $(this).next('.plan_details');
            $detailsRow.slideToggle(0); 

            const $icon = $(this).find('.this_icon');
            if ($icon.text() === '+') {
                $icon.text('-');
            }
             else {
                $icon.text('+');
            }

            $(this).siblings('.plan_toggle').each(function() {
                const $otherDetailsRow = $(this).next('.plan_details');
                if ($otherDetailsRow.is(':visible') && $otherDetailsRow[0] !== $detailsRow[0]) {
                    $otherDetailsRow.slideUp(0); 
                    $(this).find('.this_icon').text('[+]'); 
                }
            });
        });
    }
});
