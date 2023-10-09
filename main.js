// start slide nav
let landingSec = document.querySelector(".landing-sec");
let BurgerLinks = document.querySelector(".burger-links");

BurgerLinks.addEventListener("click", () => {
  BurgerLinks.classList.toggle("clicked");
});
let header = document.querySelector("header");

let slideNav = document.querySelector(".slide-nav");

BurgerLinks.addEventListener("click", () => {
  if (BurgerLinks.classList.contains("clicked")) {
    slideNav.style.left = "0";
    header.classList.add("hoverd");
    landingSec.style.filter = " blur(7px) brightness(0.5)";
  } else {
    slideNav.style.left = "-1000px";
    header.classList.remove("hoverd");
    landingSec.style.filter = " blur(0px) brightness(1)";
  }
});

// end slide nav

// start image slider

let imagesArr = document.querySelectorAll(".landing-sec .image-container img");

let bulletsArr = document.querySelectorAll(".images-polits ul li");

let current = 0;

let nextbutton = document.querySelector(".navigation-angles i:first-child");

let prevbutton = document.querySelector(".navigation-angles i:last-child");

// ***********************************
let first;

function set() {
  first = setInterval(() => {
    current++;
    if (current === imagesArr.length) {
      current = 0;
    }
    removeAll();

    imagesArr[current].classList.add("active");
    bulletsArr[current].classList.add("active");
  }, 3000);
}

set();

nextbutton.onclick = function() {
  clearInterval(first);
  current++;
  if (current === imagesArr.length) {
    current = 0;
  }
  removeAll();

  imagesArr[current].classList.add("active");
  bulletsArr[current].classList.add("active");

  set();
};

prevbutton.onclick = function() {
  clearInterval(first);
  current--;
  if (current < 0) {
    current = 0;
  }
  removeAll();

  imagesArr[current].classList.add("active");
  bulletsArr[current].classList.add("active");

  set();
};
// ***********************************

function removeAll() {
  imagesArr.forEach(img => {
    img.classList.remove("active");
  });

  bulletsArr.forEach(p => {
    p.classList.remove("active");
  });
}

// end image slide
