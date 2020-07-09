
// Reveals the info panel for a specified button (github, linkedin...).
function showSplashInfo(name, width) {
  let btn = document.getElementById(name + '-btn');
  document.getElementById(name + '-splash').style.clipPath = "circle(" + width + "% at " +
  (btn.parentElement.parentElement.offsetLeft + btn.offsetLeft + btn.clientWidth/2) + "px "
  + (btn.parentElement.parentElement.offsetTop + btn.clientHeight/2) + "px)";
}

let splashButtons = ['github', 'linkedin', 'resume', 'email', 'itch'];

for(let name of splashButtons) {
  showSplashInfo(name, 0);
  document.getElementById(name + '-btn').onmouseover = () => {showSplashInfo(name, 110)};
  document.getElementById(name + '-btn').onmouseleave = () => {showSplashInfo(name, 0)};
}


// Opens the url in a new tab.
function openInNewTab(url) {
  console.log(url);
  var win = window.open(url, '_blank');
  win.focus();
}
