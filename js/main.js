
// Reveals the info panel for a specified button (github, linkedin...).
function showSplashInfo(name, width) {
  btn = document.getElementById(name + '-btn');
  setFill(
    name + '-splash',
    width + "%",
    (btn.parentElement.parentElement.offsetLeft + btn.offsetLeft + btn.clientWidth / 2) + "px ",
    (btn.parentElement.parentElement.offsetTop + btn.clientHeight / 2) + "px"
  );
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


// Used for all fill animations. Specify the ID of the fill element,
// what should trigger it, the eventual width, and coordinates of origin.
function setFill(fillId, width, posX, posY) {
  document.getElementById(fillId).style.clipPath = "circle(" + width + "at " +
    posX + " " + posY + ")";
}
