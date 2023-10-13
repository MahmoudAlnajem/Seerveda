// start slide nav

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
  } else {
    slideNav.style.left = "-1000px";
    header.classList.remove("hoverd");
  }
});

// end slide nav

// start image slider

let imagesArr = document.querySelectorAll(".landing-sec .image-container img");


let politsContainer = document.querySelector(".images-polits ul");

for(i=0; i<imagesArr.length;i++){
  let liPolit = document.createElement("li")
  politsContainer.appendChild(liPolit)
}

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

nextbutton.onclick = function () {
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

prevbutton.onclick = function () {
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
  imagesArr.forEach((img) => {
    img.classList.remove("active");
  });

  bulletsArr.forEach((p) => {
    p.classList.remove("active");
  });
}

// end image slide

// start managment section

async function generateCardsDependsOnRespnse() {
  let response = await fetch("jsonFiles/managment.json")
    .then((r) => {
      let answer = r.json();
      return answer;
    })
    .then((r) => r["management"]);

  for (val of response) {
    let swiperWrapper = document.querySelector(".swiper-wrapper");
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("swiper-slide");

    swiperWrapper.appendChild(card);

    // start to the card body

    // start card image

    let cardImage = document.createElement("div");

    cardImage.classList.add("card__image");

    let cardImageImg = document.createElement("img");

    cardImageImg.setAttribute("src", val.image);

    cardImage.appendChild(cardImageImg);

    card.appendChild(cardImage);

    // start card content

    let cardContent = document.createElement("div");

    cardContent.classList.add("card__content");

    // start card title

    let cardTitle = document.createElement("span");

    cardTitle.classList.add("card__title");

    cardTitle.innerHTML = val.title;

    cardContent.appendChild(cardTitle);

    // start card name

    let cardName = document.createElement("span");

    cardName.classList.add("card__name");

    cardName.innerHTML = val.name;

    cardContent.appendChild(cardName);

    // start card text

    let cardText = document.createElement("p");

    cardText.classList.add("card__text");

    cardText.innerHTML = val.text;

    cardContent.appendChild(cardText);

    // start card phone

    let cardPhone = document.createElement("p");

    cardPhone.classList.add("card__phone");

    cardPhone.innerHTML = `Phone: ${val.phone}`;

    cardContent.appendChild(cardPhone);

    // start card email

    let cardEmail = document.createElement("p");

    cardEmail.classList.add("card__email");

    cardEmail.innerHTML = `Email: ${val.email}`;

    cardContent.appendChild(cardEmail);

    // start button

    let cardButton = document.createElement("button");

    cardButton.classList.add("card__btn");

    cardButton.innerHTML = `VIEW MORE`;

    cardContent.appendChild(cardButton);

    card.appendChild(cardContent);
  }
}
generateCardsDependsOnRespnse();
