var info = window.innerWidth;
document.dispatchEvent(new CustomEvent("recieveWidth", {
    detail: info
}));
