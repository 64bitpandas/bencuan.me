/* ---------------------------------------- */
/* Scripts for https://bencuan.me           */
/* © 2019 Ben Cuan - MIT License            */
/* Created Summer 2019                      */
/* ---------------------------------------- */

// Check if in localhost. If not, set the base href
if (window.location.protocol === 'https:') //remote
  $('base').attr('href', '/bencuan.me/');

  $(document).ready(() => {
  // Button click action to show content
  $('#launch-content-button').click(() => {

  })


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

  $('#launch-button').click(() => {

    $('#launch-button').attr('class', 'center launch-button-activated');

    $('#content').css('animation', 'launch-content 2s ease-in-out 1.5s 1 forwards');
    $('#launch-button-rope').css('animation', 'launch-content-rope 1s ease-in-out 0s 1 forwards, launch-content 2s ease-in-out 1.5s forwards');
    $('#launch-button-container').css('animation', 'launch-content 2s ease-in-out 1.5s 1 forwards');
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
