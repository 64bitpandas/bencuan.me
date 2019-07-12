// Check if in localhost. If not, set the base href
if (window.location.protocol === 'https:') //remote
  $('base').attr('href', '/bencuan.me/');

  $(document).ready(() => {
  // Button click action to show content
  $('#launch-content-button').click(() => {
    $('#content').css('animation', 'launch-content 1.5s ease-in 0s 1 forwards');
  })


    $('.expand-button').hover(function() {
      $('.expand-button-content', this).delay(300).fadeIn(200).removeClass('hidden');
    }, function () {
        $('.expand-button-content', this).fadeOut(10);
    });



  // Buttons to link to other sites
  $('#github-button').click (() => {openUrl('//github.com/64bitpandas');});
  $('#linkedin-button').click (() => {openUrl('//linkedin.com/in/bencuan');});
  $('#email-button').click (() => {openUrl('mailto:hello@bencuan.me');});
});



function openUrl(url) {
  window.open(url, '_blank').focus();
}
