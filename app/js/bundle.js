$(document).ready(function() {

  // Set sticker height + hover animation
  var setCardStyle = function(){

    var card = $('.card');
    var cardWidth = card.width();
    var cardHeight = cardWidth/2.5;

    // Set scale
    var cardContentScale = cardWidth/450;
    card.css('transform','translate3d(0,0,0) matrix3d(1,0,0.00,0.00,0.00,1,0.00,0,0,0,1,0,0,0,0,1)');
    $('.card h1').css('font-size', cardContentScale*40+'px');
    $('.card span').css('font-size', cardContentScale*16+'px');
    $('.card li a').css('font-size', cardContentScale*16+'px');

    // Set height
    //card.height(cardHeight);

    // Generate hover effect
    card
      .mouseover(function(){
        $(this).mousemove(function(e){
          // Find mouse X position in card
          mouseScreenPositionX = e.pageX;
          cardLeftPosition = $(this).offset().left;
          mousePosX = ((mouseScreenPositionX - cardLeftPosition)/cardWidth);
          // Calculate maxtrix3d X value
          matrix3dX = ((mousePosX/10000)*1.5)-0.0001;

          // Find mouse Y position in card
          mouseScreenPositionY = e.pageY;
          cardTopPosition = $(this).offset().top;
          mousePosY = ((mouseScreenPositionY-cardTopPosition)/cardHeight);
          // Calculate maxtrix3d Y value
          matrix3dY = ((mousePosY/10000)*1.65)-0.0001;

          // Set CSS
          $(this).css('transform', 'translate3d(0,-2px,0) matrix3d(.6,0,0.00,'+matrix3dX+',0.00,.6,0.00,'+matrix3dY+',0,0,.6,0,0,0,0,.6)');
        });
      })
      .mouseout(function(){
        // Unset CSS on mouseleave
        $(this).css('transform','translate3d(0,0,0) matrix3d(1,0,0.00,0.00,0.00,1,0.00,0,0,0,1,0,0,0,0,1)');
      });
  }

  // Execute function
  setCardStyle();
  $(window).on('resize', function(){
      setCardStyle();
  })
});

function contactButton(){
  $("html, body").animate({ scrollTop: $('.footer').offset().top }, 1000);
}

function arrowButton(){
  $("html, body").animate({ scrollTop: $('.about').offset().top - 50}, 1000);
}
