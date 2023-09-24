let burgerIcon = document.querySelector(".container .burger");
window.onclick = function (e) {
  if (e.target === burgerIcon) {
    burgerIcon.style.setProperty("--after-content", "'\\58'");
    
  } else {
    burgerIcon.style.setProperty("--after-content", "'\\f0c9'");
  }
};
