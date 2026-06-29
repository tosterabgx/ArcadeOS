let startTime = new Date();

function updateClock() {
  let currentTime = new Date().toLocaleTimeString();
  document.querySelector("#clock").innerHTML = currentTime;
}

function updatePlayedTime() {
  let currentTime = new Date();
  let elapsedTime = Math.floor((currentTime - startTime) / 60000);
  elapsedTime += " minute" + (elapsedTime == 1 ? "" : "s");
  document.querySelector("#time-played").innerHTML = elapsedTime;
}

setInterval(updateClock, 1000);
setInterval(updatePlayedTime, 60000);


let biggestIndex = 1;
let topBar = document.querySelector("#topbar");

for (const element of document.querySelectorAll(".window")) {
  dragElement(element);

  element.addEventListener("mousedown", () => handleWindowTap(element));
  document.getElementById(element.id + "-close").addEventListener("click", () => closeWindow(element));
}

for (const icon of document.querySelectorAll(".icon")) {
  let element = document.getElementById(icon.id.replace("-icon", ""));
  icon.addEventListener("click", () => openWindow(element));
}

function dragElement(element) {
  let initialX = 0;
  let initialY = 0;
  let currentX = 0;
  let currentY = 0;

  if (document.getElementById(element.id + "-header")) {
    document.getElementById(element.id + "-header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();

    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();

    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function closeWindow(element) {
  element.classList.add("hidden");

  switch (element.id) {
    case "space-invaders":
      game.stop();
      break;
    case "snake":
      snakeStop()
      break;
  }
}

function openWindow(element) {
  if (element.classList.contains("hidden")) {
    element.classList.remove("hidden");
    handleWindowTap(element);

    switch (element.id) {
      case "space-invaders":
        game.init();
        break;
      case "snake":
        snakeInit()
        break;
    }
  }
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}
