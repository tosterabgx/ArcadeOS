function updateTime() {
    let currentTime = new Date().toLocaleTimeString();
    let timeText = document.querySelector("#time");
    timeText.innerHTML = currentTime;
}

setInterval(updateTime, 1000);