//Init parallax
var banner = document.getElementById('banner');
var parallaxInstance = new Parallax(banner);

// Setup waypoints
var home = new Waypoint({
  element: document.getElementById('banner-name'),
  handler: function(direction) {
    clearSelections();
    $('#home-link').addClass('selected');
  }
})

var about = new Waypoint({
  element: document.getElementById('about'),
  handler: function(direction) {
    clearSelections();
    $('#about-link').addClass('selected');
  }
})

var footer = new Waypoint({
  element: document.getElementById('footer'),
  handler: function(direction) {
    clearSelections();
    $('#contact-link').addClass('selected');
  }
})

/**
 * Clears the '.selected' class on all links on the banner.
 */
function clearSelections() {
  $('.selected').removeClass('selected');
}


// Load footer
$(document).ready(function () {
  $('#footer-background').load('../img/footer.svg');
})
