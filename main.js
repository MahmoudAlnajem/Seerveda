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

for (i = 0; i < imagesArr.length; i++) {
  let liPolit = document.createElement("li");
  politsContainer.appendChild(liPolit);
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

async function generatemanagmentCardsDependsOnRespnse() {
  let response = await fetch("jsonFiles/all.json")
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
generatemanagmentCardsDependsOnRespnse();

// start product section
let cards = [];

async function generateproductsCardsDependsOnRespnse() {
  let response = await fetch("jsonFiles/all.json")
    .then((r) => {
      let res = r.json();
      return res;
    })
    .then((r) => {
      return r["products"];
    });
  for (val of response) {
    let cardsConatiner = document.querySelector(".cards");

    let card = document.createElement("div");

    card.classList.add("product-card");

    card.classList.add("all");

    card.classList.add(val.type);

    // start product image

    let productImagecon = document.createElement("div");

    productImagecon.classList.add("product-image");

    card.appendChild(productImagecon);

    let productImage = document.createElement("img");

    productImage.setAttribute("src", val.image);

    productImagecon.appendChild(productImage);

    // start product name or title

    let productName = document.createElement("div");

    productName.classList.add("product-name");

    card.appendChild(productName);

    let productNameText = document.createElement("h3");

    productNameText.innerHTML = val.title;

    productName.appendChild(productNameText);

    // start product text

    let productDes = document.createElement("div");

    productDes.classList.add("product-text");

    productDes.textContent = val.des;

    card.appendChild(productDes);

    // start product button

    let viewMoreButton = document.createElement("button");

    viewMoreButton.textContent = `VIEW MORE`;

    card.appendChild(viewMoreButton);

    // start new span

    if (val.new === true) {
      let newSpan = document.createElement("span");

      newSpan.classList.add("new");

      newSpan.style.padding = "7px";

      newSpan.textContent = `NEW`;

      card.appendChild(newSpan);

      card.classList.add("new");
    }

    // append card to cards container
    cardsConatiner.appendChild(card);

    cards.push(card);
  }
}
generateproductsCardsDependsOnRespnse();

// start working on products filtr depend on lis

let productLis = document.querySelectorAll(".product ul li");

let selectOps = document.querySelector(".product ul select");

let productCardFilterButton = document.querySelector(".product-card-filter")

productLis.forEach((li) => {
  li.addEventListener("click", () => {
    productLis.forEach((el) => {
      el.classList.remove("active");
    });
    li.classList.add("active");

    cards.forEach((card) => {
      card.style.display = "none";
    });

    selectOps.selectedIndex = 0;

    selectOps.style.display = 'none'

    document
      .querySelectorAll(li.dataset.cat)
      .forEach((e) => (e.style.display = "block"));
  });
});

productCardFilterButton.addEventListener("click",() => {
  selectOps.style.display = 'block'
})


selectOps.addEventListener("change", () => {
  let op = selectOps.value;
  
  productLis.forEach((el) => {
    el.classList.remove("active");
  });

  productLis[2].classList.add("active")

  cards.forEach((card) => {
    card.style.display = "none";
  });

  document.querySelectorAll(`.${op}`).forEach((e) => {
    e.style.display ="block"
  })

});

// end product section
//start old events section
/*selecting */
let eventCard = document.querySelectorAll(".eventCard");
let eventHeader = document.querySelector(".left-sid-cont h1");
let eventParagraph = document.querySelector(".left-sid-cont p");
let linkEvent = document.querySelector(".left-sid-cont button a");
let cardCont = document.querySelector(".cards-container");
let evenTdotsCont = document.querySelector(".cards-container .spans");
let smallEventArr = [];
let beforButton = document.querySelector(".spans #befor");
let afterbutton = document.querySelector(".spans #after");
let eventMainCont = document.querySelector(".Events-cont");
let addAncherTobutton = document.querySelectorAll(
  ".eventCard div:nth-child(2) button"
);

/*functions */
let resetClick = () => {
  let card = document.querySelectorAll(".cards-container .eventCard");
  Array.from(card).forEach((ele) => {
    ele.children[0].classList.contains("clicked")
      ? ele.children[0].classList.remove("clicked")
      : ele;
  });
};
/*control center:function make the controles (< / >) and generate the card function */
let controlCenter = (num, arr) => {
  let viewBort = 0;
  if (num === 0) {
    makeCard(arr);
  }
  afterbutton.addEventListener("click", () => {
    let Allcards = document.querySelector(
      ".cards-container .small-cont"
    ).children;
    viewBort -= 320;
    if (viewBort === -320 * Math.floor(arr.length / 3.1) - 320) {
      viewBort = 0;
      let usedStyle = `translateY(${viewBort}%)`;
      Array.from(Allcards).forEach((ele) => {
        ele.style.transform = usedStyle;
      });
    }

    let usedStyle = `translateY(${viewBort}%)`;
    Array.from(Allcards).forEach((ele) => {
      ele.style.transform = usedStyle;
    });
  });
  beforButton.addEventListener("click", () => {
    let Allcards = document.querySelector(
      ".cards-container .small-cont"
    ).children;
    if (viewBort === 0) {
      viewBort = -320 * Math.floor(arr.length / 3.1);
      let usedStyle = `translateY(${viewBort}%)`;
      Array.from(Allcards).forEach((ele) => {
        ele.style.transform = usedStyle;
      });
    } else {
      viewBort += 320;
    }
    let usedStyle = `translateY(${viewBort}%)`;

    Array.from(Allcards).forEach((ele) => {
      ele.style.transform = usedStyle;
    });
  });
};
/*control center end */
/*card maker start */
let makeCard = (arr) => {
  document.querySelector(".cards-container .small-cont").remove();
  let evenTcontDiv = document.createElement("div");
  evenTcontDiv.classList.add("small-cont");
  for (let eventCounter = 0; eventCounter < arr.length; eventCounter++) {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("eventCard");
    cardDiv.dataset.num = eventCounter;
    /*start old-date html*/
    let date = arr[eventCounter].date.split(" ");
    let dateDiv = document.createElement("div");
    dateDiv.classList.add("old-date");
    let day = document.createElement("h1");
    day.classList.add("day");
    day.appendChild(document.createTextNode(date[0]));
    let mounth = document.createElement("p");
    mounth.appendChild(document.createTextNode(date[1]));
    mounth.classList.add("mounth");
    dateDiv.appendChild(day);
    dateDiv.appendChild(mounth);
    cardDiv.appendChild(dateDiv);
    /*end old-date html*/
    /*start info html*/
    let secondDiv = document.createElement("div");
    let title = document.createElement("h1");
    title.classList.add("title");
    title.append(document.createTextNode(arr[eventCounter].title));
    let eventText = document.createElement("P");
    eventText.classList.add("event-text");
    eventText.appendChild(
      document.createTextNode(arr[eventCounter]["short-desc"])
    );
    let eventButton = document.createElement("button");

    let buttonAn = document.createElement("a");
    buttonAn.href = "#desc";
    buttonAn.append(document.createTextNode("show more"));
    eventButton.append(buttonAn);
    /*button click function start*/
    eventButton.addEventListener("click", () => {
      resetClick();
      eventHeader.innerHTML = arr[eventCounter].title;
      eventParagraph.innerHTML = arr[eventCounter].desc;
      linkEvent.href = arr[eventCounter].link;
      dateDiv.classList.add("clicked");
    });

    /*button click function end */
    secondDiv.appendChild(title);
    secondDiv.appendChild(eventText);
    secondDiv.appendChild(eventButton);
    cardDiv.appendChild(secondDiv);
    /*end info html*/
    evenTcontDiv.append(cardDiv);
    cardCont.append(evenTcontDiv);
    if (eventCounter === 0) {
      eventButton.click();
    }
  }
};
/*card maker end */

/*select maker start */
let selectAndButtonMaker = (arr) => {
  let select = document.createElement("select");
  select.name = "Speizelation";
  select.classList.add("select");
  let selectButton = document.createElement("button");
  selectButton.classList.add("selectButton");
  selectButton.innerText = "Filter Events";
  let select2 = document.createElement("select");
  select2.name = "year";
  select2.classList.add("select2");
  let selectCont = document.createElement("div");
  selectCont.append(select);
  selectCont.append(select2);
  selectCont.append(selectButton);
  selectCont.classList.add("selectCont");
  cardCont.prepend(selectCont);
};
/*select maker end */
/*option maker */
let spezOptionMaker = (set) => {
  let selectQuer = document.querySelector("select.select");
  for (let i = 0; i < set.size; i++) {
    let optionCont = document.createElement("option");
    optionCont.value = Array.from(set)[i];
    optionCont.appendChild(document.createTextNode(Array.from(set)[i]));
    selectQuer.append(optionCont);
  }
};
let yearOptionMaker = (set) => {
  let selectQuer = document.querySelector("select.select2");
  for (let i = 0; i < set.size; i++) {
    let optionCont = document.createElement("option");
    optionCont.value = Array.from(set)[i];
    optionCont.appendChild(document.createTextNode(Array.from(set)[i]));
    selectQuer.append(optionCont);
  }
};
/*spezilation start */
let generatSpeiz = (arr) => {
  selectAndButtonMaker(arr);
  let arrOfYear = ["all"];
  let arrOfSpez = ["all"];
  for (let i = 0; i < arr.length; i++) {
    let spez = arr[i].spez;
    arrOfSpez.push(spez);
    let year = arr[i].year;
    arrOfYear.push(year);
  }
  let setOfSpez = new Set(arrOfSpez);
  let setOfYear = new Set(arrOfYear);
  spezOptionMaker(setOfSpez);
  yearOptionMaker(setOfYear);
  let filterButton = document.querySelector(".selectButton");
  filterButton.addEventListener("click", () => {
    generateFilterd(arr);
  });
};
/*spezlation end */
/*start click filter */

/*end click filter */
/*generate filterd option */
let generateFilterd = (arr) => {
  let typeCond = document.querySelector(".select").value;
  let yearCond = document.querySelector(".select2").value;
  let filterdArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (typeCond !== "all" && yearCond !== "all") {
      if (arr[i].spez === typeCond && arr[i].year === yearCond) {
        filterdArr.push(arr[i]);
      }
    } else if (typeCond === "all" && yearCond !== "all") {
      if (arr[i].year === yearCond) {
        filterdArr.push(arr[i]);
      }
    } else if (typeCond !== "all" && yearCond === "all") {
      if (arr[i].spez === typeCond) {
        filterdArr.push(arr[i]);
      }
    } else if (typeCond === "all" && yearCond === "all") {
      filterdArr.push(arr[i]);
    }
  }
  if (filterdArr.length > 0) {
    controlCenter(0, filterdArr);
  } else {
    makePopup(typeCond, yearCond);
  }
};

/*end of generate filterd option */
/*make a popup */
let makePopup = (typeCond, yearCond) => {
  let popCont = document.createElement("div");
  popCont.classList.add("popup");
  popCont.innerHTML = `Sorry their is'nt an event for (${typeCond}) in (${yearCond}) try use another filter`;
  document.body.append(popCont);
  document.body.classList.add("blur");
  eventMainCont.classList.add("blur");

  setTimeout(() => {
    document.body.removeChild(popCont);
    eventMainCont.classList.remove("blur");
    document.body.classList.remove("blur");
  }, 5000);
};
/*make a popup end */
/*fetch json */
window.onload = () => {
  fetch("/jsonFiles/all.json")
    .then((re) => {
      let rejson = re.json();
      return rejson;
    })
    .then((re) => {
      let arrFromRe = Array.from(Object.values(re.oldEvents));
      for (let i = 0; i < arrFromRe.length; i++) {
        smallEventArr.push(arrFromRe[i]);
        if (i === arrFromRe.length - 1) {
          controlCenter(0, smallEventArr);
          generatSpeiz(smallEventArr);
        }
      }
    });
};
/*fetch json end */
//end old events section
//start new events section
let newEvents = document.querySelector(".event");
let image = document.querySelectorAll(".event-image-cont img:nth-child(2)");
let buttonCont = document.querySelector(".daysButton");
fetch("/jsonFiles/all.json")
  .then((re) => {
    return re.json();
  })
  .then((re) => {
    if (Array.from(Object.values(re["newEvents"])).length > 0) {
      newEvents.classList.remove("dis");
    } else {
      console.log("no events");
    }
    buttonMakerCont(
      Array.from(Object.values(re["newEvents"])).length,
      Array.from(Object.values(re["newEvents"]))
    );
  });
let buttonMaker = (number, img) => {
  let button = document.createElement("button");
  button.append(document.createTextNode(`day ${number + 1}`));
  button.addEventListener("click", () => {
    image[0].src = img[0];
    image[1].src = img[1];
  });
  if (number === 0) {
    button.click();
  }
  buttonCont.append(button);
};
let buttonMakerCont = (num, imgLinks) => {
  for (let i = 0; i < num; i++) {
    buttonMaker(i, imgLinks[i]);
  }
};
//end new event section
