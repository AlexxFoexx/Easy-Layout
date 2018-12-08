$(document).ready(function () {

    var headerSlider = new Swiper('.header-idx-slider', {
        speed: 400,
        spaceBetween: 0,
        effect: 'fade',
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + '<svg class="loading-dost"><circle r="6" cx="8" cy="8" fill="transparent" stroke="#5A5959" stroke-width="2"></circle></svg>' + '</span>';
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init: function () {
                $('.header-content.swiper-slide').each(function () {
                    if ($(this).hasClass('swiper-slide-active')) {
                        $(this).children().find('.slide-content-title').addClass('slide-content-title-is-active');
                    }
                });
            },
            slideChangeTransitionEnd: function () {
                $('.header-content .swiper-slide').each(function () {
                    if ($(this).hasClass('swiper-slide-active')) {
                        $(this).children().find('.slide-content-title').addClass('slide-content-title-is-active');
                    } else {
                        $(this).children().find('.slide-content-title').removeClass('slide-content-title-is-active');
                    }
                });
            }
        }

    });


    var reviewsSlider = new Swiper('.reviews-slider', {
        speed: 400,
        slidesPerView: 3,
        spaceBetween: 60,
        loop: true,
        centeredSlides: true,
        pagination: {
            el: '.reviews-pagination',
            clickable: true,
        },
        breakpoints: {
            1350: {
                slidesPerView: 2,
                spaceBetween: 80,
            },
            890: {
                slidesPerView: 1,
                spaceBetween: 30,
            }
        }
    });

    $('#modalClose').on('click', function () {
        $.fancybox.close()
    });

    $(function () {
        var line = $('#line'),
            leftPos,
            nav = $('.h-nav');

        nav.append('<span class="line" id="line"></span>');

        if($('.h-nav .h-nav-item').hasClass('h-nav-item--current')){
            line.width($('.h-nav-item--current').width())
            .css({
                'left': $('.h-nav-item--current').position().left + 'px'
            });

            $('#line').css({
                'width': $('.h-nav-item--current').width() + 'px',
                'left': $('.h-nav-item--current').position().left + 'px',
                'overflow': 'hidden'
            });

            $('.h-nav-item').hover(function () {
                var widthLink = $(this).width();
                leftPos = $(this).position().left;
                $('#line').css({
                    'width': widthLink + 'px',
                    'left': leftPos + 'px',
                    'overflow': 'hidden'
                });
            }, function () {
    
                $('#line').css({
                    'width': $('.h-nav-item--current').width() + 'px',
                    'left': $('.h-nav-item--current').position().left + 'px',
                    'overflow': 'hidden'
                });
            });
        }else {

            $('.h-nav-item').hover(function () {
                var widthLink = $(this).width();
                leftPos = $(this).position().left;
                $('#line').css({
                    'width': widthLink + 'px',
                    'left': leftPos + 'px',
                    'overflow': 'hidden',
                    'opacity': 1, 
                });
            }, function () {
    
                $('#line').css({
                    'opacity': 0, 
                });
            });
        }

        
    


    });


    $('.btn-m-menu').on('click', function () {
        $('.m-menu').toggleClass('m-menu--active');
        $('.m-menu-header__top').toggleClass('m-menu-header__top--active');
        $('.m-menu-nav').toggleClass('m-menu-nav--active');
        $('.m-menu-footer').toggleClass('m-menu-footer--active');
    });


    new Swiper('.person-slide',{
        speed: 400,
        spaceBetween: 0,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + '<svg class="loading-dost"><circle r="6" cx="8" cy="8" fill="transparent" stroke="#5A5959" stroke-width="2"></circle></svg>' + '</span>';
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    $('[data-fancybox]').fancybox({
        beforeLoad: function (o, e) {
            var person = e.opts.$orig.data("person");

            $('.modal-form-head__person').text(person);
            $("#person").val(person);

        }
    });

    $('.h-nav-item:nth-child(4) .h-nav__link').append('<span>' + 4 + '</span>');


});
