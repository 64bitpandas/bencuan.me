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
  document.getElementById("nav-fill-" + name).style.zIndex =
    (!notHover && width == 0) ? 5 : 10;
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

for (let link of navLinks) {
  navFill(link, 0);
  document.getElementById("nav-" + link).onmouseover = () => {
    navFill(link, 200);
  };
  document.getElementById("nav-" + link).onmouseleave = () => {
    navFill(link, 0);
  };
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
}

let moreProjects = false;
function toggleMoreProjects() {
  moreProjects = !moreProjects;
  let moreBtn = document.getElementById("more-proj-btn");
  moreBtn.className = "btn-proj";
  if (moreProjects) {
    moreBtn.className += " btn-proj-selected";
    moreBtn.innerHTML = `<div class="content">View Less</div>`;
    document.getElementById("proj-cards").className = "";
  } else {
    moreBtn.innerHTML = `<div class="content">View More</div>`;
    document.getElementById("proj-cards").className = "truncated";
  }
}
