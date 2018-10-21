//Init parallax
var banner = document.getElementById('banner');
var parallaxInstance = new Parallax(banner);

// Setup waypoints
var home = new Waypoint({
  element: document.getElementById('banner'),
  handler: function(direction) {
    console.log('hi');
  }
})

var about = new Waypoint({
  element: document.getElementById('about'),
  handler: function(direction) {
    console.log('about');
  }
})


// Load footer
$(document).ready(function () {
  $('#footer-background').load('../img/footer.svg');
})
