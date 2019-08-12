/* ---------------------------------------- */
/* Scripts for https://bencuan.me           */
/* © 2019 Ben Cuan - MIT License            */
/* Created Summer 2019                      */
/* ---------------------------------------- */

// JQuery element - Currently open content square
let currOpen = null;
let selectionMade = false;

// Check if in localhost. If not, set the base href
if (window.location.protocol === 'https:') //remote
  $('base').attr('href', '/bencuan.me/');

  $(document).ready(() => {

    // Init lightgallery
    $(".lightgallery").lightGallery({
      thumbnail: true
    });

    $('.expand-button').hover(function() {
      setTimeout(() => {
        // Check to make sure button is still hovered over before fully expanding
        if($('#' + $(this).attr('id') + ':hover').length > 0) {
          $('.expand-button-content', this).css('width', 'auto');
          $('.expand-button-content', this).fadeIn(500).removeClass('hidden').css('display', 'inline-block');
        }
      }, 100);
    }, function () {
      // Don't fade out if it isn't visible in the first place!
      if($('.expand-button-content', this).css('display') !== 'none') {
        $('.expand-button-content', this).css('width', '0%');
        $('.expand-button-content', this).fadeOut(10);
      }
    });

    $('#launch-button').hover(function() {
      setTimeout(() => {
        if($('#launch-button:hover').length > 0) {
          $('#launch-button').html(`<i class="fas fa-rocket"></i>`)
        }
      }, 100);
    }, function () {
      // Don't fade out if it isn't visible in the first place!
      setTimeout(() => {
        if ($(this).attr('class') !== 'center launch-button-activated') {
          if($('#launch-button').find('i').length > 0) {
            $('#launch-button').html(`Launch Site`);
          }
        }
      }, 100);
    });



  // Buttons to link to other sites
  $('#github-button').click (() => {openUrl('//github.com/64bitpandas');});
  $('#linkedin-button').click (() => {openUrl('//linkedin.com/in/bencuan');});
  $('#email-button').click (() => {openUrl('mailto:hello@bencuan.me');});
  $('#resume-button').click (() => {openUrl('OLD/assets/resume-bencuan.pdf');});
  $('#back-button').click(() => {
    $('#content').css('animation', 'hide-content 1.5s ease-in-out 0s 1 forwards');
    $('#back-button-container').css('opacity', 1);
  });


  // Skip theme selection
    $('#skip-button-container').click(() => { hideIntercept(); $('#logo').html(`<img src="img/profile.png">`);});

  // Theme selection
  $('#welcome-box-pixel').click(() => {
    if (!selectionMade) {
      selectionMade = true;
      $('#logo').html(`<img src="img/profile.png">`);
      $('.splash-image-pixel').addClass('splash-image-selected');
      $('#pixel-label').addClass('welcome-label-selected');
      makeSelection();
    }
  });
  $('#welcome-box-art').click(() => {
    if(!selectionMade) {
      selectionMade = true;
      $('.splash-image-art').addClass('splash-image-selected');
      $('#art-label').addClass('welcome-label-selected');
      makeSelection();
      changeStyle();
    }
  });

  // Switch style when logo clicked
  $('#logo').click(() => {
    console.log('hi');
    changeStyle();
  })

  $('#launch-button').click(() => {

    $('#launch-button').attr('class', 'center launch-button-activated');

    $('#content').css('animation', 'launch-content 2s ease-in-out 1.5s 1 forwards');
    $('#launch-button-rope').css('animation', 'launch-content-rope 1s ease-in-out 0s 1 forwards, launch-content-nobounce 2s ease-in-out 1.5s forwards, hide-rope 1s linear 5s forwards');
    $('#launch-button-container').css('animation', 'launch-content-nobounce 2s ease-in-out 1.5s 1 forwards');

    setTimeout(() => {
      $('#back-button-container').css('opacity', 1);
    }, 1000);

    // Reset button
    setTimeout(() => {
      $('#launch-button').attr('class', 'center');
      $('#launch-button').html(`Launch Site`);
      $('#launch-button-container').css('animation', '');
      $('#launch-button-rope').css('animation', '');
    }, 5000);
  });


  // Content squares
  $('.content-square').click(function() {
    openContent($(this));
  });

  $('#about-square').hover(() => {
    $('#about-img').attr('src', 'img/about-animation.gif');
  }, () => {
      $('#about-img').attr('src', 'img/panda.svg');
  })

  $('#art-square').hover(() => {
    $('#design-video').get(0).play();
  }, () => {
      $('#design-video').get(0).pause();
      $('#design-video').get(0).currentTime = 0;
  })

  $('#close-button-container').click(() => {
    currOpen.removeClass('content-square-activated').css('z-index', 9999);
    $('.content-square-splash',currOpen).css('display', '');
    $('.content-square-details', currOpen).css('display', 'none');
    $('#back-button-container').css('opacity', 1);
    $('#close-button-container').css('opacity', 0);

    setTimeout(() => {
      currOpen.css('z-index', '');
      currOpen = null;
    }, 500);
  })
});



function openUrl(url) {
  window.open(url, '_blank').focus();
}

function clone($element) {
  var el = $element,
    newone = el.clone(true);

  el.replaceWith(newone);
}

// Hides intercept screen, leads into landing page
function hideIntercept() {
  $('#welcome-page').css('animation', "none");
  $('#welcome-page').css('display', "none");
  flashWhite();
}

function flashWhite() {
  $('#white-overlay').css('opacity', 1);
  $('#white-overlay').css('animation', 'hide-after-delay 1s ease-in-out 0.25s 1 forwards');

  // Reset animation to be reused later
  setTimeout(() => {
    $('#white-overlay').css('animation', '').css('opacity', 0);
  }, 1250);
}

// Click a content square to open content
function openContent($element) {
  currOpen = $element;
  $element.addClass('content-square-activated').removeClass('col-6');
  $('.content-square-splash', currOpen).css('display', 'none');
  $('.content-square-details', currOpen).css('display', 'block');
  $('#back-button-container').css('opacity', 0);
  $('#close-button-container').css('opacity', 1);
}

// Selection intercept clicked
function makeSelection() {
  $('#int-text-5').removeClass('hidden');
  setTimeout(() => {
    $('#int-text-6').removeClass('hidden');
  }, 2000)
  setTimeout(() => {
    hideIntercept();
  }, 5000)
}

// Swaps between 'pixel' and 'art' styles.
// Default style on load is pixel.
function changeStyle() {
  let $landing = $('#landing');
  flashWhite();

  // Switch from pixel to art
  if(!$landing.hasClass('landing-art')) {
    $landing.addClass('landing-art');
    $('#logo').html(`<img src="img/profile-art.png">`);
  } else { // Switch from art to pixel
    $landing.removeClass('landing-art');
    $('#logo').html(`<img src="img/profile.png">`);
  }
}
