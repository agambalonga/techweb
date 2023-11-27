(function($) {

    "use strict";

    var searchPopup = function() {
      // open search box
      $(document).on('click', '.search-button', function(e) {
        $('.search-popup').toggleClass('is-visible');
      });

      $(document).on('keyup', '#search-form', function(e) {

        /*
        if($(this).val().length == 0){
          $('#searchSuggestions').html('');
          return;
        }
        
        if($(this).val().length < 3){
          return;
        } 
        */

        $.ajax({
          url: '/artists/getArtistByNameLike?name='+$(this).val(),
          method: 'GET',
          contentType: 'application/json',
          success: function(data){
            console.log(data);
            var html = '';
            $.each(data.artists, function(index, value){
              html += '<a class="list-group-item list-group-item-action list-group-item-search" href="/artist/'+value._id+'">'+value.artist_name+'</a></li>';
            });
            $('#searchSuggestions').html(html);
          }
        });
        });

      $('#header-nav').on('click', '.btn-close-search', function(e) {
        $('.search-popup').toggleClass('is-visible');
      });
      
      $(".search-popup-trigger").on("click", function(b) {
          b.preventDefault();
          $(".search-popup").addClass("is-visible"),
          setTimeout(function() {
              $(".search-popup").find("#search-popup").focus()
          }, 350)
      }),
      $(".search-popup").on("click", function(b) {
          ($(b.target).is(".search-popup-close") || $(b.target).is(".search-popup-close svg") || $(b.target).is(".search-popup-close path") || $(b.target).is(".search-popup")) && (b.preventDefault(),
          $(this).removeClass("is-visible"))
      }),
      $(document).keyup(function(b) {
          "27" === b.which && $(".search-popup").removeClass("is-visible")
      })
    }

    var initProductQty = function(){

      $('.product-qty').each(function(){

        var $el_product = $(this);
        var quantity = 0;

        $el_product.find('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            $el_product.find('#quantity').val(quantity + 1);
        });

        $el_product.find('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            if(quantity>0){
              $el_product.find('#quantity').val(quantity - 1);
            }
        });

      });

    }

    $(document).ready(function() {

      searchPopup();
      initProductQty();

      var swiper = new Swiper(".main-swiper", {
        speed: 500,
        navigation: {
          nextEl: ".swiper-arrow-next",
          prevEl: ".swiper-arrow-prev",
        },
      });         

      var swiper = new Swiper(".event-swiper", {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
          el: "#next-events .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        },
      });      

      var swiper = new Swiper(".artist-swiper", {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
          el: "#top-artists .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        },
      }); 

      var swiper = new Swiper(".testimonial-swiper", {
        loop: true,
        navigation: {
          nextEl: ".swiper-arrow-next",
          prevEl: ".swiper-arrow-prev",
        },
      }); 

    }); // End of a document ready

})(jQuery);