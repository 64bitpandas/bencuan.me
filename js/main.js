//Init parallax
var banner = document.getElementById('banner');
var parallaxInstance = new Parallax(banner);

// Setup waypoints
var home = new Waypoint({
  element: document.getElementById('banner-name'),
  handler: function(diretion) {waypointHandler('home-link')}
})

var about = new Waypoint({
  element: document.getElementById('about'),
  handler: function (diretion) { waypointHandler('about-link') }
})
var experience = new Waypoint({
  element: document.getElementById('experience'),
  handler: function (diretion) { waypointHandler('experience-link') }
})
var projects = new Waypoint({
  element: document.getElementById('projects'),
  handler: function (diretion) { waypointHandler('projects-link') }
})

var contact = new Waypoint({
  element: document.getElementById('contact'),
  handler: function (diretion) { waypointHandler('contact-link') }
})

/**
 * Clears the '.selected' class on all links on the banner.
 */
function clearSelections() {
  $('.selected').removeClass('selected');
}

/**
 * Runs as the handler for the Waypoint system to highlight a header link when on the correct section.
 * @param {string} elementId The ID of the element to highlight. Do not include the prefix #
 */
function waypointHandler(elementId) {
  clearSelections();
  $('#' + elementId).addClass('selected');
  return this;
}
// Load footer
$(document).ready(function () {
  $('#footer-background').load('../img/footer.svg');
})
