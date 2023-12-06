(function($) {

    "use strict";

    var searchPopup = function() {
      // open search box
      $(document).on('click', '.search-button', function(e) {
        $('.search-popup').toggleClass('is-visible');
      });

      $(document).on('keyup', '#search-form', function(e) {

        if($(this).val().length == 0){
          $('#searchSuggestions').html('');
          return;
        }

        $.ajax({
          url: '/artists/getArtistAndEventsByNameLike?name='+$(this).val(),
          method: 'GET',
          contentType: 'application/json',
          success: function(data){
            console.log(data);
            var html = '';
            $.each(data.response.artists, function(index, value){
              html += '<a class="list-group-item list-group-item-action list-group-item-search-primary" href="/artist/'+value._id+'">'+value.name+'</a></li>';

              $.each(value.events, function(i, v){
                if(i == value.events.length-1) {
                  html += '<a class="list-group-item list-group-item-action list-group-item-search-secondary-last" href="/event/'+v._id+'">'+v.title+ ' - '+v.city+ ' '+formatDate(v.date)+ '</a></li>';
                } else {
                  html += '<a class="list-group-item list-group-item-action list-group-item-search-secondary" href="/event/'+v._id+'">'+v.title+ ' - '+v.city+' '+formatDate(v.date)+'</a></li>';
                }
              });

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



$(() => {

  $('[type="password"]').togglepassword('btn');

});

function openModal(eventJSON) {
  const event = JSON.parse(eventJSON);
  var modalBox = document.getElementById('add-to-cart-modal');
  var modalTitle = $(modalBox).find('#add-to-cart-modal-title');
  var modalBody = $(modalBox).find('.modal-body');
  var modalArtistName = $(modalBox).find('#add-to-cart-modal-title-artist-name');
  var modalCity = $(modalBox).find('#add-to-cart-modal-city');
  var modalQuantity = $(modalBox).find('#add-to-cart-modal-quantity');
  var modalPrice = $(modalBox).find('#add-to-cart-modal-price');
  var modalRemainingSeats = $(modalBox).find('#add-to-cart-modal-remaining_seats');
  var modalDate = $(modalBox).find('#add-to-cart-modal-date');


  modalTitle.text(event.title);
  modalBody.find('#modal_img').attr('src', event.image_URL);
  modalBody.attr('data-event-id', event._id);
  modalArtistName.text(event.artist.name);
  modalCity.text(event.city + ' - ' + event.site);
  modalQuantity.text('Quantity: ' + event.seats);
  modalPrice.text('Price: ' + event.price_for_ticket + '€');
  modalRemainingSeats.text('Remaining site: ' + event.seats);
  modalDate.text(formatDateTime(event.date));


  var modal = new bootstrap.Modal(modalBox);
  modal.show();
}

function formatDateTime(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

$(document).on('click', '#add-to-cart-btn', function() {
  var quantity = parseInt($('#quantityInput').val());
  var event_id = $('#add-to-cart-modal .modal-body').attr('data-event-id');
  var data = {
    event_id: event_id,
    qty: quantity
  };

  $.ajax({
    type: 'POST',
    url: '/cart/add',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
      console.log(data);
      handleCart(data);

    },
    error: function(err) {
      console.log(err);
      var error = JSON.parse(err.responseText);
      $('#modal-error-message').text(error.message);
      $('#add-to-cart-modal').modal('hide');
      $('#errorModal').modal('show');
    }
  });
});

function handleCart(data) {

  if(data.new_item) {
    var total = 0;

    $(".empty-cart").remove()

    $('#list-cart').append(`
      <li class="list-group-item d-flex align-items-center" data-event-id="${data.cart[data.cart.length-1].event_id}">
          <div class="row">
            <div class="col-md-4 col-sm-4 col-4">
              <img src="${data.cart[data.cart.length-1].event_img}" class="img-thumbnail" style="width: 100%;" alt="Immagine evento">
            </div>
            <div class="col-md-8 col-sm-8 col-8">
              <h5 class="mb-0">${data.cart[data.cart.length -1].event_title}</h5>
              <p class="mb-0">${data.cart[data.cart.length -1].artist_name}</p>
              <p class="mb-0">${data.cart[data.cart.length -1].event_city} -  ${data.cart[data.cart.length -1].event_date}</p>
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 quantity"><strong>${data.cart[data.cart.length -1].event_price}€ X ${data.cart[data.cart.length -1].event_quantity}</strong></p>
                <button class="btn btn-link delete-item delete-item-cart" data-event-id="${data.cart[data.cart.length-1].event_id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
              </button>
              </div>
            </div>
          </div>
        </li>
    `);

    data.cart.forEach(function(item) {
      total += item.event_price * item.event_quantity;
    });

    $('#total-cart').text('Total:'+ total + '€');

  } else {
    var total = 0;

    data.cart.forEach(function(item) {
      total += item.event_price * item.event_quantity;
    });

    $('#total-cart').text('Total:'+ total + '€');

    var itemToUpdate = $(`#list-cart li[data-event-id="${data.updated_item.event_id}"]`);

    var quantityContainer = $(itemToUpdate).find('.quantity');
    quantityContainer.html(`<strong>${data.updated_item.event_price}€ X ${data.updated_item.event_quantity}</strong>`);
  }

  $('#add-to-cart-modal').modal('hide');
  $('#successModal').modal('show');
}

$(document).on('click', '.delete-item-cart', function() {

  var event_id = $(this).attr('data-event-id');

  $.ajax({
    type: 'DELETE',
    url: '/cart/delete?event_id=' + event_id,
    contentType: 'application/json',
    success: function(data) {
      $(`#list-cart li[data-event-id="${event_id}"]`).remove();

      var total = 0;
      data.cart.forEach(function(item) {
        total += item.event_price * item.event_quantity;
      });

      $('#total-cart').text('Total:'+ total + '€');
    },
    error: function(err) {
      console.log(err);
    }
  })

});