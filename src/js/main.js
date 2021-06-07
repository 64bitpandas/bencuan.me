/* ===================================
Scripts for bencuan.me - v3_2020
Created by Ben Cuan
====================================== */

/* -------------------
Clip path animations
---------------------- */

// Reveals the info panel for a specified button (github, linkedin...).
function showSplashInfo(name, width) {
  let btn = document.getElementById(name + "-btn");
  setFill(
    name + "-splash",
    width + "%",
    btn.parentElement.parentElement.offsetLeft +
      btn.offsetLeft +
      btn.clientWidth / 2 +
      "px ",
    btn.parentElement.parentElement.offsetTop + btn.clientHeight / 2 + "px"
  );
}

// Handles background fill changes on navlink hover.
function navFill(name, width, notHover = false) {
  link = document.getElementById("nav-" + name);
  // document.getElementById("nav-fill-" + name).style.zIndex =
  //   (!notHover && width == 0) ? 5 : 10;
  setFill(
    "nav-fill-" + name,
    width + "%",
    name == "resume" ? "100%" : "0px",
    link.parentElement.offsetTop + "px"
  );
  // console.log(document.getElementById("nav-fill-" + name).style.clipPath);
}

let splashButtons = ["github", "linkedin", "resume", "email", "itch"];
let navLinks = ["home", "about", "proj", "contact", "resume"];

for (let name of splashButtons) {
  showSplashInfo(name, 0);
  document.getElementById(name + "-btn").onmouseover = () => {
    showSplashInfo(name, 110);
  };
  document.getElementById(name + "-btn").onmouseleave = () => {
    showSplashInfo(name, 0);
  };
}

let clicking = false;
for (let link of navLinks) {
  navFill(link, 0);
  document.getElementById("nav-" + link).onmouseover = () => {
    navFill(link, 250);
  };
  document.getElementById("nav-" + link).onmouseleave = () => {
    navFill(link, 0);
  };
  document.getElementById("nav-" + link).onclick = () => {
    navClick(link);
  };
  document.getElementById("mobile-nav-" + link).onclick = () => {
    navClick(link);
    toggleBurger();
  };
}

function navClick(link) {
clicking = true;
setTimeout(() => {
  document.getElementById("nav-back").className =
    "nav-background " + link + "-color";
  document.getElementById("burger-menu").className =
    "mobile-only " + link + "-color";
  clicking = false;
}, 250);
}

// Opens the url in a new tab.
function openInNewTab(url) {
  console.log(url);
  var win = window.open(url, "_blank");
  win.focus();
}

// Used for all fill animations. Specify the ID of the fill element,
// what should trigger it, the eventual width, and coordinates of origin.
function setFill(fillId, width, posX, posY) {
  document.getElementById(fillId).style.clipPath =
    "circle(" + width + "at " + posX + " " + posY + ")";
}

/* -------------------
Project select
---------------------- */

let selections = ["all", "web", "game", "app", "other"];
let currSelected = "all";

// Add onclick to all buttons
for (let sel of selections) {
  let btn = document.getElementById("proj-" + sel);
  btn.onclick = () => {
    selectCategory(sel);
  };
}

function selectCategory(category) {
  for (let sel of selections) {
    let btn = document.getElementById("proj-" + sel);
    btn.className = "btn-proj"; // reset all buttons to default state
  }

  document.getElementById("proj-" + category).className += " btn-proj-selected";

  // document.getElementById("").style.disp
  for (let card of document.getElementsByClassName("proj-card-container")) {
    if (category == "all") {
      document.getElementById("more-proj-btn").style.display = "";
      card.style.display = "";
      if (moreProjects) toggleMoreProjects();
    } else {
      if (card.className.includes(category))
        card.style.display = "flex";
      else
        card.style.display = "none";
      document.getElementById("more-proj-btn").style.display = "none";
    }
  }
}

let moreProjects = false;
function toggleMoreProjects() {
  moreProjects = !moreProjects;
  let moreBtn = document.getElementById("more-proj-btn");
  moreBtn.className = "btn-proj";
  if (moreProjects) {
    moreBtn.className += " btn-proj-selected";
    moreBtn.innerHTML = `<div class="content">View Less</div>`;
    for (let card of document.getElementsByClassName("hide-when-truncated")) {
        card.style.display = "flex";
    }
  } else {
    moreBtn.innerHTML = `<div class="content">View More</div>`;
    for (let card of document.getElementsByClassName("hide-when-truncated")) {
        card.style.display = "none";
    }
  }
}

/* -------------------
Navbar waypoints
---------------------- */
makeWaypoint("landing-box", "home");
makeWaypoint("about", "about");
makeWaypoint("projects", "proj");
makeWaypoint("contact", "contact");

function makeWaypoint(element, fill) {
  return new Waypoint({
    element: document.getElementById(element),
    handler: () => {
      if (clicking) return;

      for (let nav of navLinks) {
        navFill(nav, 0);
      }
      navFill(fill, 250);
      document.getElementById("nav-back").className =
        "nav-background " + fill + "-color";
      document.getElementById("burger-menu").className =
        "mobile-only " + fill + "-color";
      document.getElementById("nav-resume").className =
        "resume-button " + fill + "-color-secondary";
      document.getElementById("nav-fill-resume").className =
        "nav-fill " + fill + "-color-secondary";
      setTimeout(() => {navFill(fill, 0);}, 500);
    },
  });
}

document.body.addEventListener('scroll', () => {Waypoint.refreshAll();});

/* -------------------
Burger menu
---------------------- */
let burgerOpen = false;
let burgerBtn = document.getElementById('burger-btn');
let burgerMenu = document.getElementById('burger-menu');
burgerBtn.onclick = () => {
  toggleBurger();
}

function toggleBurger() {
  burgerOpen = !burgerOpen;
  burgerBtn.className = "burger burger-rotate";
  if (burgerOpen) {
    burgerBtn.className += " open";
    burgerMenu.className += " open";
  } else {
    burgerMenu.className = burgerMenu.className.replace("open", "");
  }
}

