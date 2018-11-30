//NL-static-build-process 0.9.0

$(window).scroll(function() {
  //check all elements that should activate on scrolls
  /* example structure */
  //<section class="scroll-animation" data-scroll-depth="70" id="#"></section>
  $(".scroll-animation").each(function() {
    //if scrolled into view and not already activated
    if (
      isScrolledIntoView(this, $(this).attr("data-scroll-depth")) &&
      !$(this).hasClass("active")
    ) {
      //mark as activated
      $(this).addClass("active");
    }
  });

  //check all elements that should activate on scroll
  /* example structure */
  //<div class="chase" data-chase-speed="650" data-scroll-depth="80"><div class="chase-element" id="#"></div>
  $(".chase").each(function() {
    //if scrolled into view and not already activated
    if (
      isScrolledIntoView(this, $(this).attr("data-scroll-depth")) &&
      !$(this).hasClass("active")
    ) {
      //mark as activated
      $(this).addClass("active");
      chase(this, $(this).attr("data-chase-speed"));
    }
  });

  //SIMPLE RING MOVER
  $(".top-section").each(function() {
    //element position
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    //viewport showing
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    //find center marker
    var elementHeight = elementBottom - elementTop;
    var elementHalf = elementHeight / 2;
    var elementHalfMarker = elementTop + elementHalf;
    //if this elment is showing center
    if (elementHalfMarker < viewportBottom && elementHalfMarker > viewportTop) {
      var currentId = $(this).attr("id");
      var vOffset = -1 * (($(".rings").height() - elementHeight) / 2);
      if (!$(".rings").hasClass(currentId)) {
        $(".rings")
          .removeClass()
          .addClass("rings")
          .addClass(currentId);

        //half
        //$('.rings').css('top', (elementTop + vOffset));

        //top
        $(".rings").css("top", elementTop);
        $(".rings").on(
          "transitionend webkitTransitionEnd oTransitionEnd",
          function() {
            // your event handler
            //half
            //vOffset = -1 * ( ($('.rings').height() - elementHeight) / 2);
            //$('.rings').css('top', (elementTop + vOffset));

            //top
            $(".rings").css("top", elementTop);
          }
        );
      }
    }
  });
});

//chase
function chase(element, duration) {
  var inc = 0;

  $(element)
    .find(".chase-element")
    .each(function(index, element) {
      var chase_element = $(this);

      setTimeout(function() {
        chase_element.addClass("active");
      }, duration * inc);

      inc++;
    });
}

function isScrolledIntoView(elem, percent) {
  //viewport height
  var viewTop = $(window).scrollTop();
  var viewBottom = viewTop + $(window).height();

  //half of element is showing then return
  var elemHalf = $(elem).offset().top + $(elem).height() * (percent / 100);

  //console.log(elem);
  //console.log(elemHalf + "," + viewBottom);

  if (window.innerWidth < 768) {
    elemHalf = $(elem).offset().top + 1 * ($(elem).height() / 4);
  }

  return elemHalf <= viewBottom;
}

function infiniteRotator(_target, _initialFadeIn, _itemInterval, _fadeTime) {
  var target = "." + _target;

  //initial fade-in time (in milliseconds)
  var initialFadeIn = _initialFadeIn;

  //interval between items (in milliseconds)
  var itemInterval = _itemInterval;

  //cross-fade time (in milliseconds)
  var fadeTime = _fadeTime;

  //count number of items
  var numberOfItems = $(target).length;

  //set current item
  var currentItem = 0;

  //show first item
  $(target)
    .eq(currentItem)
    .addClass("in");

  //loop through the items
  var infiniteLoop = setInterval(function() {
    $(target).removeClass("out");
    $(target).removeClass("in");
    $(target)
      .eq(currentItem)
      .addClass("out");

    if (currentItem == numberOfItems - 1) {
      currentItem = 0;
    } else {
      currentItem++;
    }
    $(target)
      .eq(currentItem)
      .addClass("in");
  }, itemInterval);
}
