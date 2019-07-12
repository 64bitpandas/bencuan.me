// Check if in localhost. If not, set the base href
if (window.location.protocol === 'https:') //remote
  $('base').attr('href', '/bencuan.me/');

  $(document).ready(() => {
  // Button click action to show content
  $('#launch-content-button').click(() => {
    $('#content').css('animation', 'launch-content 1s ease-in-out 0s 1 forwards');
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



  // Buttons to link to other sites
  $('#github-button').click (() => {openUrl('//github.com/64bitpandas');});
  $('#linkedin-button').click (() => {openUrl('//linkedin.com/in/bencuan');});
  $('#email-button').click (() => {openUrl('mailto:hello@bencuan.me');});
});



function openUrl(url) {
  window.open(url, '_blank').focus();
}
