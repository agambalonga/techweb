$('#cart').on('click', '.delete_item_cart', function(){
  debugger;
  var event_id = $(this).closest("li").attr("data-id");
  var old_qty = parseInt($(this).closest("li").find(".cart-item__info p:nth-child(2)").html().replace("x", ""), 10);

  $.ajax({
    type: 'DELETE',
    contentType: 'application/json',
    url: '/cart/remove/' + event_id,
    success: function(data) {
      if(data.success) {
        $(".cart-indicator").html(parseInt($(".cart-indicator").html(), 10) - old_qty);
        $("li[data-id="+event_id+"]").remove();
        if($(".li_cart").length == 0){
          $(".empty-cart").show();
        }
      }
      console.log(JSON.stringify(data));
    },
    error: function(data) {
      console.log(JSON.stringify(data));
    }
  });

});

$(document).ready(function() {
    var $btn = $('#span_cart');
    var $indicator = $('#cart-indicator');
    var $cartSection = $('#cartSection');
    var $overlay = $('#overlay');

    if($(".li_cart").length == 0){
      $(".empty-cart").show();
    }
   
    // Quando il pulsante viene cliccato, mostra la sezione del carrello con l'effetto di transizione
    $btn.on('click', function(event) {
      event.stopPropagation();
      $cartSection.css('display', 'block');
      $overlay.fadeIn(); // Mostra l'overlay
      $cartSection.animate({ 'right': 0 }, 300); // Mostra la sezione del carrello con un'animazione
    });
    $indicator.on('click', function(event) {
      event.stopPropagation();
      $cartSection.css('display', 'block');
      $overlay.fadeIn(); // Mostra l'overlay
      $cartSection.animate({ 'right': 0 }, 300); // Mostra la sezione del carrello con un'animazione
    });
   
    // Chiudi la sezione del carrello quando si clicca sul simbolo "x" o sullo sfondo
    $cartSection.on('click', function(event) {
      if ($(event.target).hasClass('close')) {
        $overlay.fadeOut(); // Nascondi l'overlay
        $cartSection.animate({ 'right': '-100%' }, 300, function() {
          $cartSection.css('display', 'none');
        });
      }
      // Impedisci la chiusura se viene cliccato all'interno del cart-section
      event.stopPropagation();
    });
   
    // Chiudi la sezione del carrello quando si clicca al di fuori di essa

    $(document).on('click', function(event) {
      if (!$cartSection.is(event.target) && $cartSection.has(event.target).length === 0 && event.target !== $btn[0]) {
        $overlay.fadeOut(); // Nascondi l'overlay
        $cartSection.animate({ 'right': '-100%' }, 300, function() {
          $cartSection.css('display', 'none');
        });
      }
    });

    $('#addToCartBtn').click(function(){
        debugger;
        var json = {};
        json.event_id = $("#eventDetails").attr("data-event-id");
        json.qty = parseInt($("#ticketQuantity").val(), 10);
        console.log(json)
    
        $.ajax({
          type: 'POST',
          data: JSON.stringify(json),
          contentType: 'application/json',
          url: '/cart/add',
          success: function(data) {
            debugger;
            
            if(data.success) {
              $(".empty-cart").hide();
              $(".cart-indicator").html(parseInt($(".cart-indicator").html(), 10) + data.qty_added);
              if(data.new_item){
                $(".menu__cart").append(`
                  <li class="li_cart" data-id="${data.cart[data.cart.length -1].event_id}">
                    <div class="cart-item">
                      <img src="${data.cart[data.cart.length - 1].event_img}" alt="img event" class="cart-item__image">
                      <div class="cart-item__info">
                        <p>${data.cart[data.cart.length - 1].title}</p>
                        <p>x${data.cart[data.cart.length - 1].quantity}</p>
                        <p>${data.cart[data.cart.length - 1].price}€</p>
                      </div>
                      <div class="delete_item_cart">
                        <i class="fa-solid fa-trash-can"></i>
                      </div>
                    </div>
                  </li>
                `);
    
              } else {
                $.each( data.cart, function( index, event ) {
                var event_obj = JSON.parse(JSON.stringify(event));
                if(event_obj.event_id === json.event_id) {
                    var el = $("li[data-id="+json.event_id+"] .cart-item__info p:nth-child(2)").html("x" + event_obj.quantity );
                  }
                });
              }
            }
            showSuccessAnimation(data.cart[data.cart.length - 1].title + " added to cart successfully!");
            console.log(JSON.stringify(data));
          },
          error: function(data) {
            var error = data.responseJSON;
            if(error.code === 'EB001') {
              showErrorModal(data.responseJSON.message);
            }
          }
        });
    
        $("#eventModal").hide();
      });
    });
    