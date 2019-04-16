
    $(function () {
        var swiper1 = new Swiper('#swiper1', {
            loop:true,
            autoplay:3000,
            slidesPerView: 3,
            spaceBetween: 0,
            paginationClickable: ".swiper-pagination",
            grabCursor: true,
            nextButton: '.swiper-button-next.on1',
            prevButton: '.swiper-button-prve.on1',
            autoplayDisableOnInteraction: false
        });
        var swiper2 = new Swiper('#swiper2', {
            nextButton: '.swiper-button-next.on2',
            prevButton: '.swiper-button-prev.on2',
            slidesPerView: 3,
            spaceBetween: 0,
            loop:true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false
        });


    })
