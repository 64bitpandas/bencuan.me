// Check if in localhost. If not, set the base href
if (window.location.protocol === 'https:') //remote
  $('base').attr('href', '/bencuan.me/');

// Button click action to show content
$(document).ready(() => {
  $('launch-content-button').click(() => {
    console.log('hi');
  })
});
