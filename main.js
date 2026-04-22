// admin and data fetch
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ***************************************************************
// TODO: Add your Firebase project's configuration here
// Find this in your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCqacb7HxQX3Ij4HtYKmeYOwvDm6WfKqnA",
  authDomain: "seerveda-f2d42.firebaseapp.com",
  projectId: "seerveda-f2d42",
  storageBucket: "seerveda-f2d42.firebasestorage.app",
  messagingSenderId: "403504239464",
  appId: "1:403504239464:web:6d57480fdd60820fcc3cdd",
  measurementId: "G-JP26CC7Z45"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginSection = document.querySelector(".login-card");
const adminPanel = document.getElementById("admin-panel");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const contentSections = document.getElementById("content-sections");
const toast = document.getElementById("toast");
const overlayBackground = document.querySelector(".overlay");
const textareas = {
  management: document.getElementById("management-json"),
  products: document.getElementById("products-json"),
  oldEvents: document.getElementById("oldEvents-json"),
  newEvents: document.getElementById("newEvents-json"),
  footer: document.getElementById("Footer-json")
};

let unsubscribe; // To store the onSnapshot listener
let removeOverLay = () => {
  loginSection.classList.add("hidden");
  overlayBackground.classList.add("hidden");
  document.body.classList.remove("no-scroll");
};
//website versions
let webVersion = "user";
//to change the HTML element created to be for admin
let contType = "div";
let contType2 = "img";
let contType3 = "input";
// --- Authentication Logic ---
loginButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  loginError.textContent = ""; // Clear previous errors

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in successfully
      showToast("login sucessed, welcome sir", "sucess");
      webVersion = "admine";
    })
    .catch(error => {
      showToast("Login failed. Please check your password and email.", "error");
      console.error("Login error:", error);
    });
});

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // This forces the browser to refresh the current page so the admin see the changes
      window.location.reload();
    })
    .catch(error => {
      console.error("Logout error:", error);
      showToast("Logout failed.", "error");
    });
});

onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadAndDisplayData();
    removeOverLay();
    contType = "input";
    contType2 = "input";
  } else {
    // User is signed out
    //loginSection.classList.remove("hidden");
    adminPanel.classList.add("hidden");
    contType = "div";
    contType2 = "img";
    if (unsubscribe) {
      unsubscribe(); // Stop listening to data changes when logged out
    }
  }
});

let productsData = [];
let mangementData = [];
let eventData = [];
let newEventData = [];

let data;
function loadAndDisplayData() {
  const docRef = doc(db, "websiteContent", "main");

  // onSnapshot listens for real-time updates
  unsubscribe = onSnapshot(
    docRef,
    doc => {
      contentSections.classList.remove("hidden");

      if (doc.exists()) {
        data = doc.data();

        // Assign to comp.js arrays
        productsData = data.products || [];
        mangementData = data.management || [];
        eventData = data.oldEvents || [];
        newEventData = data.newEvents || [];

        // Populate footer textarea
        const footerTextarea = document.getElementById("Footer-json");
        if (footerTextarea) {
          footerTextarea.value = JSON.stringify(data.footer, null, 2);
        }

        // Render the comp.js UI
        renderProducts();
        renderManagement();
        renderEvents();
        renderNewEvents();

        return data;
      } else {
        console.log("No such document!");
        showToast("Could not load document.", "error");
      }
    },
    error => {
      console.error("Error fetching document:", error);
      showToast("Error loading data.", "error");
    }
  );
}
//logging out on refresh
window.addEventListener("DOMContentLoaded", user => {
  if (user) {
    signOut(auth);
  }
});
//
console.log(unsubscribe);
window.saveData = async sectionKey => {
  let dataToSave;
  if (sectionKey === "products") {
    dataToSave = productsData;
  } else if (sectionKey === "management") {
    dataToSave = mangementData;
  } else if (sectionKey === "oldEvents") {
    dataToSave = eventData;
  } else if (sectionKey === "newEvents") {
    dataToSave = newEventData;
  } else if (sectionKey === "footer") {
    const footerTextarea = document.getElementById("Footer-json");
    try {
      dataToSave = JSON.parse(footerTextarea.value);
    } catch (error) {
      console.error("Invalid JSON:", error);
      showToast(`Error: Invalid JSON format in footer.`, "error");
      return;
    }
  } else {
    showToast(`Unknown section: ${sectionKey}`, "error");
    return;
  }

  const docRef = doc(db, "websiteContent", "main");
  try {
    await updateDoc(docRef, {
      [sectionKey]: dataToSave
    });
    showToast(`${sectionKey} data saved successfully!`, "success");
  } catch (error) {
    console.error("Error saving document:", error);
    showToast(`Error saving ${sectionKey}.`, "error");
  }
};

// --- Comp.js merged code, for making the admin daahsboard more usable ---

let addProductForm = document.querySelector(".addProductForm");

//selecting the buttons for adding or changing the current conditions
const conditionsButton = document.querySelector(".submitConditionButton");
const conditionAddingForm = document.querySelector(".conditionAddingForm");
const formContainer = document.querySelector(".forms-container");

const closeForm = form => {
  if (!form) return;
  form.classList.add("hidden");
  formContainer.classList.add("hidden");
  if (typeof form.reset === "function") {
    form.reset();
  }
  if (form === addProductForm) {
    saveButton.classList.add("hidden");
    editSaveButton.classList.add("hidden");
  }
};

formContainer.addEventListener("click", event => {
  if (event.target.matches(".cancelFormButton")) {
    const form = event.target.closest("form");
    closeForm(form);
  }
});

const saveProductData = (saveType, editedProductId) => {
  console.log(saveType, editedProductId);
  let productTitle = document.querySelector(".productTitle").value;
  let productType = document.querySelector(".productType").value;
  let productImage = document.querySelector(".productImage").value;
  let productDesc = document.querySelector(".productDescription").value;
  let productLongDesc = document.querySelector(".productLongDescription").value;
  let productMainImage = document.querySelector(".productMainImage").value;
  let newProductFilter = document.querySelector(".newProduct").checked;
  if (saveType === "add") {
    let product = {
      title: productTitle,
      prodImage: productMainImage,
      longDesc: productLongDesc,
      des: productDesc,
      type: productType,
      new: newProductFilter,
      image: productImage,
      conditions: [],
      id: productsData.length + 1
    };
    productsData = [...productsData, product];
    renderProducts();
  } else if (saveType === "edit") {
    addProductForm.classList.add("hidden");
    productsData = productsData.map(product => {
      if (product.id == editedProductId) {
        return {
          ...product,
          title: productTitle || product.title,
          prodImage: productMainImage || product.image,
          longDesc: productLongDesc || product.longDesc,
          des: productDesc || product.des,
          type: productType || product.type,
          new: newProductFilter || product.new,
          image: productImage || product.image,
          conditions: product.conditions,
          id: product.id
        };
      }
      return product;
    });
    console.log(productsData);
    renderProducts();
  }
};

const saveButton = document.querySelector(".submitProductButton");
saveButton.addEventListener("click", () => {
  saveProductData("add");
  productAddingForm.classList.add("hidden");
  editSaveButton.classList.add("hidden");
  formContainer.classList.add("hidden");
});
//Adding a product
//selecting the existing buttons that adds a button, it is not ID based
const openFormButton = document.querySelector(".addProductButton");
const productAddingForm = document.querySelector(".addProductForm");
openFormButton.addEventListener("click", () => {
  productAddingForm.classList.remove("hidden");
  saveButton.classList.remove("hidden");
  formContainer.classList.remove("hidden");
});
const editSaveButton = document.querySelector(".editProductButton");
editSaveButton.addEventListener("click", () => {
  saveProductData("edit", editSaveButton.getAttribute("data-edit-id"));
  productAddingForm.classList.add("hidden");
  formContainer.classList.add("hidden");
});
const submitConditionButton = document.querySelector(".submitConditionButton");
submitConditionButton.addEventListener("click", () => {
  let condName = document.querySelector(".condName").value;
  let conditionDesc = document.querySelector(".conditionDesc").value;
  let conditionDate = document.querySelector(".date").value;
  let conditionImages = document.querySelectorAll(".conditionImage");
  let imagesArray = [];
  conditionImages.forEach(imageInput => {
    imageInput.value
      ? imagesArray.push(imageInput.value)
      : console.log("no image");
  });
  let productId = submitConditionButton.getAttribute("data-product-id");
  let product = productsData.find(p => p.id == productId);
  let newCondition = {
    condName: condName,
    conditionDesc: conditionDesc,
    date: conditionDate,
    images: imagesArray
  };
  product.conditions.push(newCondition);
  conditionAddingForm.classList.add("hidden");
  console.log(productsData);
  renderProducts();
});
const fullView = document.querySelector(".fullView");
const managementForm = document.querySelector(".addMangementMember");
const managementSection = document.createElement("div");
const managementTitle = document.createElement("h2");
const addMemberButton = document.createElement("button");
const managementList = document.createElement("ul");

managementSection.classList.add("management-section");
managementTitle.textContent = "Members";
addMemberButton.type = "button";
addMemberButton.textContent = "Add Member";
managementList.classList.add("management-list");

managementSection.appendChild(managementTitle);
managementSection.appendChild(addMemberButton);
managementSection.appendChild(managementList);
document.getElementById("members-page").appendChild(managementSection);

const renderManagement = () => {
  managementList.innerHTML = "";
  mangementData.forEach(member => {
    const memberItem = document.createElement("li");
    memberItem.textContent = member.name;
    const deleteMemberButton = document.createElement("button");
    deleteMemberButton.type = "button";
    deleteMemberButton.textContent = "Delete";
    deleteMemberButton.setAttribute("data-member-name", member.name);
    deleteMemberButton.addEventListener("click", () => {
      const memberName = deleteMemberButton.getAttribute("data-member-name");
      mangementData = mangementData.filter(m => m.name !== memberName);
      renderManagement();
    });
    memberItem.appendChild(deleteMemberButton);
    managementList.appendChild(memberItem);
  });
};

addMemberButton.addEventListener("click", () => {
  managementForm.classList.remove("hidden");
  formContainer.classList.remove("hidden");
});

const saveMemberButton = managementForm.querySelector(".saveMemberButton");
saveMemberButton.addEventListener("click", () => {
  const memberName = managementForm.querySelector(".memberName").value.trim();
  const memberEmail = managementForm.querySelector(".memberEmail").value.trim();
  const memberPhone = managementForm.querySelector(".memberPhone").value.trim();
  const memberTitle = managementForm.querySelector(".memberTitle").value.trim();
  const memberImage = managementForm.querySelector(".memberImage").value.trim();
  const memberText = managementForm.querySelector(".memberText").value.trim();

  if (!memberName) return;

  const newMember = {
    name: memberName,
    email: memberEmail,
    phone: memberPhone,
    title: memberTitle,
    image: memberImage,
    text: memberText
  };

  mangementData = [...mangementData, newMember];
  managementForm.classList.add("hidden");
  formContainer.classList.add("hidden");
  managementForm.reset();
  renderManagement();
});

renderManagement();

const eventForm = document.querySelector(".addEventForm");
const eventSection = document.createElement("div");
const eventTitle = document.createElement("h2");
const addEventButton = document.createElement("button");
const eventList = document.createElement("ul");

eventSection.classList.add("event-section");
eventTitle.textContent = "Events";
addEventButton.type = "button";
addEventButton.textContent = "Add Event";
eventList.classList.add("event-list");

eventSection.appendChild(eventTitle);
eventSection.appendChild(addEventButton);
eventSection.appendChild(eventList);
document.getElementById("events-page").appendChild(eventSection);

eventForm.innerHTML = `
  <label for="eventTitle">Title</label>
  <input type="text" id="eventTitle" class="eventTitle" placeholder="Event Title">
  <label for="eventDesc">Description</label>
  <textarea id="eventDesc" class="eventDesc" placeholder="Event Description"></textarea>
  <label for="eventDate">Date</label>
  <input type="text" id="eventDate" class="eventDate" placeholder="Event Date">
  <label for="eventShortDesc">Short Description</label>
  <input type="text" id="eventShortDesc" class="eventShortDesc" placeholder="Short Description">
  <label for="eventYear">Year</label>
  <input type="text" id="eventYear" class="eventYear" placeholder="Year">
  <label for="eventSpez">Specialization</label>
  <input type="text" id="eventSpez" class="eventSpez" placeholder="Specialization">
  <label for="eventLink">Link</label>
  <input type="text" id="eventLink" class="eventLink" placeholder="Link">
  <button type="button" class="saveEventButton">Save New Event</button>
  <button type="button" class="cancelFormButton">Back</button>
`;
eventForm.classList.add("hidden");

const renderEvents = () => {
  eventList.innerHTML = "";
  eventData.forEach(event => {
    const eventItem = document.createElement("li");
    eventItem.innerHTML = `<strong>${event.title}</strong> - ${event.desc} - ${event.date}`;
    const deleteEventButton = document.createElement("button");
    deleteEventButton.type = "button";
    deleteEventButton.textContent = "Delete";
    deleteEventButton.setAttribute("data-event-title", event.title);
    deleteEventButton.addEventListener("click", () => {
      const eventTitle = deleteEventButton.getAttribute("data-event-title");
      eventData = eventData.filter(e => e.title !== eventTitle);
      renderEvents();
    });
    eventItem.appendChild(deleteEventButton);
    eventList.appendChild(eventItem);
  });
};

addEventButton.addEventListener("click", () => {
  eventForm.classList.remove("hidden");
  formContainer.classList.remove("hidden");
});

const saveEventButton = eventForm.querySelector(".saveEventButton");
saveEventButton.addEventListener("click", () => {
  const eventTitle = eventForm.querySelector(".eventTitle").value.trim();
  const eventDesc = eventForm.querySelector(".eventDesc").value.trim();
  const eventDate = eventForm.querySelector(".eventDate").value.trim();
  const eventShortDesc = eventForm
    .querySelector(".eventShortDesc")
    .value.trim();
  const eventYear = eventForm.querySelector(".eventYear").value.trim();
  const eventSpez = eventForm.querySelector(".eventSpez").value.trim();
  const eventLink = eventForm.querySelector(".eventLink").value.trim();

  if (!eventTitle) return;

  const newEvent = {
    title: eventTitle,
    desc: eventDesc,
    date: eventDate,
    "short-desc": eventShortDesc,
    year: eventYear,
    spez: eventSpez,
    link: eventLink
  };

  eventData = [...eventData, newEvent];
  eventForm.classList.add("hidden");
  formContainer.classList.add("hidden");
  eventForm.reset();
  renderEvents();
});

renderEvents();

const newEventForm = document.querySelector(".addNewEventForm");
const newEventSection = document.createElement("div");
const newEventTitle = document.createElement("h2");
const addNewEventButton = document.createElement("button");
const newEventList = document.createElement("ul");

newEventSection.classList.add("new-event-section");
newEventTitle.textContent = "New Events";
addNewEventButton.type = "button";
addNewEventButton.textContent = "Add New Event";
newEventList.classList.add("new-event-list");

newEventSection.appendChild(newEventTitle);
newEventSection.appendChild(addNewEventButton);
newEventSection.appendChild(newEventList);
document.getElementById("new-events-page").appendChild(newEventSection);

newEventForm.innerHTML = `
  <label for="newEventImg1">Image 1 URL</label>
  <input type="text" id="newEventImg1" class="newEventImg1" placeholder="Image 1 URL">
  <label for="newEventImg2">Image 2 URL</label>
  <input type="text" id="newEventImg2" class="newEventImg2" placeholder="Image 2 URL">
  <button type="button" class="saveNewEventButton">Save New Event</button>
  <button type="button" class="cancelFormButton">Back</button>
`;
newEventForm.classList.add("hidden");

const renderNewEvents = () => {
  newEventList.innerHTML = "";
  newEventData.forEach((event, index) => {
    const eventItem = document.createElement("li");
    eventItem.innerHTML = `<img src="${event.img1}" alt="Img1" style="width:50px;"> <img src="${event.img2}" alt="Img2" style="width:50px;">`;
    const deleteNewEventButton = document.createElement("button");
    deleteNewEventButton.type = "button";
    deleteNewEventButton.textContent = "Delete";
    deleteNewEventButton.setAttribute("data-index", index);
    deleteNewEventButton.addEventListener("click", () => {
      const idx = parseInt(deleteNewEventButton.getAttribute("data-index"));
      newEventData = newEventData.filter((_, i) => i !== idx);
      renderNewEvents();
    });
    eventItem.appendChild(deleteNewEventButton);
    newEventList.appendChild(eventItem);
  });
};

addNewEventButton.addEventListener("click", () => {
  newEventForm.classList.remove("hidden");
  formContainer.classList.remove("hidden");
});

const saveNewEventButton = newEventForm.querySelector(".saveNewEventButton");
saveNewEventButton.addEventListener("click", () => {
  const img1 = newEventForm.querySelector(".newEventImg1").value.trim();
  const img2 = newEventForm.querySelector(".newEventImg2").value.trim();

  if (!img1 || !img2) return;

  const newEvent = {
    img1: img1,
    img2: img2
  };

  newEventData = [...newEventData, newEvent];
  newEventForm.classList.add("hidden");
  formContainer.classList.add("hidden");
  newEventForm.reset();
  renderNewEvents();
});

renderNewEvents();

// Navigation
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons and pages
    navButtons.forEach(btn => btn.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));

    // Add active class to clicked button and corresponding page
    button.classList.add("active");
    const pageId = button.getAttribute("data-page") + "-page";
    document.getElementById(pageId).classList.add("active");
  });
});

const renderProducts = () => {
  fullView.innerHTML = ""; // Clear existing content
  productsData.forEach(item => {
    const compCard = document.createElement("div");
    compCard.classList.add("compCard");

    const compTitle = document.createElement("h2");
    compTitle.textContent = item.title;
    const conditionsList = document.createElement("ul");
    conditionsList.style.display = "none"; // Hidden by default
    item.conditions.forEach(condition => {
      const conditionItem = document.createElement("li");
      conditionItem.textContent = condition.condName;
      const deleteConditionButton = document.createElement("button");
      deleteConditionButton.textContent = "Delete Condition";
      deleteConditionButton.setAttribute("data-cond-name", condition.condName);
      deleteConditionButton.setAttribute(
        "data-product-id",
        item.id ? item.id : 1
      );
      deleteConditionButton.addEventListener("click", () => {
        const condName = deleteConditionButton.getAttribute("data-cond-name");
        const productId = deleteConditionButton.getAttribute("data-product-id");
        const product = productsData.find(p => p.id == productId);
        if (product) {
          product.conditions = product.conditions.filter(
            c => c.condName !== condName
          );
          renderProducts();
        }
      });
      conditionItem.appendChild(deleteConditionButton);
      conditionsList.appendChild(conditionItem);
    });
    const showConditionsButton = document.createElement("button");
    showConditionsButton.textContent = "Show Conditions";
    showConditionsButton.addEventListener("click", () => {
      conditionsList.style.display =
        conditionsList.style.display === "none" ? "block" : "none";
    });
    const editProductButton = document.createElement("button");
    editProductButton.textContent = "Edit Product";
    editProductButton.id = item.id;
    editProductButton.addEventListener("click", () => {
      productAddingForm.classList.remove("hidden");
      editSaveButton.classList.remove("hidden");
      saveButton.classList.add("hidden");
      formContainer.classList.remove("hidden");
      editSaveButton.setAttribute("data-edit-id", editProductButton.id);
    });
    const deleteProductButton = document.createElement("button");
    deleteProductButton.textContent = "Delete Product";
    deleteProductButton.addEventListener("click", () => {
      productsData = productsData.filter(product => product.id != item.id);
      renderProducts();
    });
    const conditionsButton = document.createElement("button");
    conditionsButton.textContent = "add condition";
    conditionsButton.setAttribute("data-product-id", item.id);
    conditionsButton.addEventListener("click", () => {
      conditionAddingForm.classList.remove("hidden");
      formContainer.classList.remove("hidden");
      submitConditionButton.setAttribute("data-product-id", item.id);
    });
    compCard.appendChild(conditionsButton);
    compCard.appendChild(showConditionsButton);
    compCard.appendChild(deleteProductButton);
    compCard.appendChild(editProductButton);

    compCard.appendChild(conditionsList);
    compCard.appendChild(compTitle);
    fullView.appendChild(compCard);
  });
};

renderProducts();

// --- Utility Functions ---

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add(`${type === "error" ? "failure-toast" : "sucess-toast"}`);
  setTimeout(() => {
    toast.className = "hidden";
  }, 3000);
}
//
//
//
//end admine section
//fetching data from the database on entering
function loadAndDisplayDataForUser() {
  console.log("loading data for user...");
  const docRef = doc(db, "websiteContent", "main");

  let newdata = onSnapshot(
    docRef,
    doc => {
      if (doc.exists()) {
        data = doc.data();
        console.log(data);

        // start managment section

        async function generatemanagmentCardsDependsOnRespnse() {
          let response = data.management;

          console.log(response);
          let val;
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

        async function generateproductsCardsDependsOnRespnse(
          contType,
          contType2
        ) {
          let response = data.products;
          console.log(response);
          // start making the select options dynamic

          let typesArr = [];
          let val;
          let type;
          for (val of response) {
            if (val.type.includes(",")) {
              console.log(val.type);
              val.type.split(",").forEach(el => {
                if (!typesArr.includes(el)) {
                  typesArr.push(el);
                }
              });
            } else {
              if (!typesArr.includes(val.type)) {
                typesArr.push(val.type);
              }
            }
          }

          console.log(typesArr);
          function generateSelectOps() {
            typesArr.forEach(el => {
              let selectOption = document.createElement("option");

              selectOption.textContent = el;

              document
                .querySelector(".section-options ul select")
                .appendChild(selectOption);
            });
          }

          generateSelectOps();

          // Finish making the select options dynamic
          for (val of response) {
            let cardsConatiner = document.querySelector(".cards");

            let card = document.createElement("div");

            card.classList.add("product-card");

            card.classList.add("all");
            console.log(val);
            if (val.type.includes(",")) {
              val.type.split(",").forEach(el => {
                card.classList.add(el.trim());
              });
            } else {
              card.classList.add(val.type.trim());
            }
            // start product image

            let productImagecon = document.createElement("div");

            productImagecon.classList.add("product-image");

            card.appendChild(productImagecon);

            let productImage = document.createElement(contType2);

            productImage.setAttribute("src", val.image);

            productImagecon.appendChild(productImage);

            // start product name or title

            let productName = document.createElement("div");

            productName.classList.add("product-name");

            card.appendChild(productName);

            let productNameText = document.createElement(contType);

            productNameText.innerHTML = val.title;

            productName.appendChild(productNameText);

            // start product text

            let productDes = document.createElement(contType);

            productDes.classList.add("product-text");

            productDes.textContent = val.des;

            card.appendChild(productDes);

            // start product button

            let viewMoreButton = document.createElement("button");

            viewMoreButton.textContent = `VIEW MORE`;

            viewMoreButton.name = val.title;

            viewMoreButton.classList.add("moreButton");

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
        generateproductsCardsDependsOnRespnse(contType, contType2);

        // start working on products filtr depend on lis

        let productLis = document.querySelectorAll(".product ul li");

        let selectOps = document.querySelector(".product ul select");

        let productCardFilterButton = document.querySelector(
          ".product-card-filter"
        );

        productLis.forEach(li => {
          li.addEventListener("click", () => {
            productLis.forEach(el => {
              el.classList.remove("active");
            });
            li.classList.add("active");

            cards.forEach(card => {
              card.style.display = "none";
            });

            selectOps.selectedIndex = 0;

            selectOps.style.display = "none";

            document
              .querySelectorAll(li.dataset.cat)
              .forEach(e => (e.style.display = "block"));
          });
        });

        productCardFilterButton.addEventListener("click", () => {
          selectOps.style.display = "block";
        });

        selectOps.addEventListener("change", () => {
          let op = selectOps.value;
          console.log(op);
          productLis.forEach(el => {
            el.classList.remove("active");
          });

          productLis[2].classList.add("active");

          cards.forEach(card => {
            card.style.display = "none";
          });

          document.querySelectorAll(`.${op}`).forEach(e => {
            e.style.display = "block";
          });
        });
        //start the view more about products section
        //selecting elements
        const moreMainView = document.querySelector(".moreMainView");
        const moreProductName = document.querySelector(".moreProductName");
        const moreProductDesc = document.querySelector(".moreProductDesc p");
        const moreProductImage = document.querySelector(".moreProductDesc img");
        const outerCond = document.querySelector(".outerCond");
        const outerCondImages1 = document.querySelectorAll(
          ".outerCondImages1 img"
        );

        const outerCondImages2 = document.querySelectorAll(
          ".outerCondImages2 img"
        );
        const goBackButton = document.querySelector(".goBackButton");
        const allCondMainView = document.querySelector(".allConditionsSection");
        let outerCondGallery = document.querySelector(".outerCondGallery");
        let cond;
        let condImg;
        let val;

        let choosenProduct;
        const viewMoreButton = document.querySelectorAll(".moreButton");
        viewMoreButton.forEach(button => {
          button.addEventListener("click", () => {
            hideEveryThingElse([moreMainView]);
            bringProductData(button.name, button);
            moreMainView.classList.remove("hidden");
            moreMainView.style.left = "0";
            goBackButton.classList.remove("hidden");
            window.scrollTo({
              top: 0,
              behavior: "smooth" // optional
            });
          });
        });
        let hideEveryThingElse = arrayOfNonHidden => {
          //hiding everything
          let everyThing = document.body.children;
          Array.from(everyThing).forEach(el => {
            el.classList.contains("hidden") ? "" : el.classList.add("hidden");
          });
          //removing the hide of the selected elements
          arrayOfNonHidden.forEach(el => {
            el.classList.remove("hidden");
          });
          //removing the hidden from main elements
          document.querySelector("header").classList.remove("hidden");
          document.querySelector(".slide-nav").classList.remove("hidden");
          //
        };

        let bringProductData = (product, button) => {
          for (val of data.products) {
            if (val.title === product) {
              console.log("right");
              choosenProduct = val;
              moreProductName.innerText = choosenProduct.title;
              moreProductDesc.innerText = choosenProduct.longDesc;
              moreProductImage.src = choosenProduct.prodImage;

              if (choosenProduct.conditions.length >= 2) {
                for (let i = 0; i < 2; i++) {
                  let outerCond = document.createElement("div");
                  outerCond.classList.add("outerCond");
                  let outerCondName = document.createElement("div");
                  outerCondName.classList.add("outerCondName1");
                  outerCondName.innerText =
                    choosenProduct.conditions[i].condName;
                  outerCond.appendChild(outerCondName);
                  outerCondGallery.appendChild(outerCond);
                  let outerCondImages = document.createElement("div");
                  outerCondImages.classList.add("outerCondImages1");
                  for (val of choosenProduct.conditions[i].images) {
                    let image = document.createElement("img");
                    image.loading = "lazy";
                    image.alt = "condImage";
                    image.src = val;
                    outerCondImages.appendChild(image);
                  }
                  outerCond.appendChild(outerCondImages);
                  outerCondGallery.appendChild(outerCond);
                }

                //
                let viewAllCondButton = document.createElement("button");
                viewAllCondButton.classList.add("viewMoreCondButton");
                viewAllCondButton.textContent = "see more conditions";
                viewAllCondButton.type = "button";
                outerCondGallery.appendChild(viewAllCondButton);
                viewAllCondButton.addEventListener("click", () => {
                  for (val of data.products) {
                    if (val.title === choosenProduct.title) {
                      //filling the header of the all conditions section
                      let conditionsHeader = document.createElement("h1");
                      conditionsHeader.classList.add("conditions-header");
                      conditionsHeader.innerText = `All conditions of ${choosenProduct.title}`;
                      allCondMainView.appendChild(conditionsHeader);
                      for (cond of choosenProduct.conditions) {
                        console.log(cond);
                        let condHolder = document.createElement("div");
                        condHolder.classList.add("allCond");

                        // adding the condition Name
                        let condName = cond.condName;
                        let condNameDateHolder = document.createElement("div");
                        let condNameHolder = document.createElement("h2");
                        condNameHolder.classList.add("allCondName");
                        condNameHolder.innerText = condName;
                        // adding the condition date
                        condNameDateHolder.appendChild(condNameHolder);
                        let condDate = cond.date;
                        let condDateHolder = document.createElement("div");
                        condDateHolder.classList.add("allCondDate");
                        condDateHolder.innerText = condDate;
                        condNameDateHolder.appendChild(condDateHolder);
                        //appending
                        condHolder.appendChild(condNameDateHolder);
                        // adding the condition images
                        let condImages = cond.images;
                        let allCondImagesHolder = document.createElement("div");
                        allCondImagesHolder.classList.add("allCondImages");
                        for (condImg of condImages) {
                          let condImgHolder = document.createElement("img");
                          condImgHolder.src = condImg;
                          condImgHolder.loading = "lazy";
                          condImgHolder.alt = "condition Image";
                          allCondImagesHolder.appendChild(condImgHolder);
                        }
                        condHolder.appendChild(allCondImagesHolder);
                        // adding condition description
                        let condDesc = cond.conditionDesc;
                        let condDescHolder = document.createElement("p");
                        condDescHolder.classList.add("allCondDesc");
                        condDescHolder.innerText = condDesc;
                        condHolder.appendChild(condDescHolder);
                        allCondMainView.appendChild(condHolder);
                      }
                    }
                  }
                  allCondMainView.classList.remove("hidden");
                  moreMainView.classList.add("hidden");
                });
                button.classList.contains("hidden")
                  ? button.classList.remove("hidden")
                  : "";
              } else {
                outerCondImages1.forEach(el => {
                  el.classList.add("hidden");
                });
                outerCondImages2.forEach(el => {
                  el.classList.add("hidden");
                });
              }
            }
          }
        };
        //the all conditions section

        goBackButton.addEventListener("click", () => {
          let everyThing = document.body.children;
          //removing the hide from everything else
          Array.from(everyThing).forEach(el => {
            el.classList.contains("hidden")
              ? el.classList.remove("hidden")
              : "";
          });
          //returning the hidden to the essintal parts again
          overlayBackground.classList.add("hidden");
          loginSection.classList.add("hidden");
          adminPanel.classList.add("hidden");
          toast.classList.add("hidden");
          moreMainView.classList.add("hidden");
          allCondMainView.classList.contains("hidden")
            ? ""
            : allCondMainView.classList.add("hidden");
          allCondMainView.innerHTML =
            '<button type="button" class="goBackButton">go back</button>';
          goBackButton.classList.add("hidden");
          document.querySelector(".outerCondGallery").innerHTML = "";
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
          Array.from(card).forEach(ele => {
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
              Array.from(Allcards).forEach(ele => {
                ele.style.transform = usedStyle;
              });
            }

            let usedStyle = `translateY(${viewBort}%)`;
            Array.from(Allcards).forEach(ele => {
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
              Array.from(Allcards).forEach(ele => {
                ele.style.transform = usedStyle;
              });
            } else {
              viewBort += 320;
            }
            let usedStyle = `translateY(${viewBort}%)`;

            Array.from(Allcards).forEach(ele => {
              ele.style.transform = usedStyle;
            });
          });
        };
        /*control center end */
        /*card maker start */
        let makeCard = arr => {
          document.querySelector(".cards-container .small-cont").remove();
          let evenTcontDiv = document.createElement("div");
          evenTcontDiv.classList.add("small-cont");
          for (
            let eventCounter = 0;
            eventCounter < arr.length;
            eventCounter++
          ) {
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
            buttonAn.append(document.createTextNode("show more"));
            eventButton.append(buttonAn);
            /*button click function start*/
            eventButton.addEventListener("click", () => {
              resetClick();
              eventHeader.innerHTML = arr[eventCounter].title;
              eventParagraph.innerHTML = arr[eventCounter].desc;
              linkEvent.href = arr[eventCounter].link;
              dateDiv.classList.add("clicked");
              document.querySelector(".left-sid-cont #desc").scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
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
        let select = document.createElement("select");
        let select2 = document.createElement("select");
        let selectAndButtonMaker = arr => {
          select.name = "Speizelation";
          select.classList.add("select");
          select.setAttribute("id", "select1");
          let selectButton = document.createElement("button");
          selectButton.classList.add("selectButton");
          selectButton.innerText = "Filter Events";

          select2.name = "year";
          select2.classList.add("select2");
          select2.setAttribute("id", "select2");
          let selectCont = document.createElement("div");
          selectCont.append(select);
          selectCont.append(select2);
          selectCont.append(selectButton);
          selectCont.classList.add("selectCont");
          cardCont.prepend(selectCont);
        };
        /*select maker end */
        /*option maker */
        let spezOptionMaker = set => {
          let selectQuer = document.querySelector("select.select");
          for (let i = 0; i < set.size; i++) {
            let optionCont = document.createElement("option");
            optionCont.value = Array.from(set)[i];
            optionCont.appendChild(document.createTextNode(Array.from(set)[i]));
            selectQuer.append(optionCont);
          }
        };
        let yearOptionMaker = set => {
          let selectQuer = document.querySelector("select.select2");
          for (let i = 0; i < set.size; i++) {
            let optionCont = document.createElement("option");
            optionCont.value = Array.from(set)[i];
            optionCont.appendChild(document.createTextNode(Array.from(set)[i]));
            selectQuer.append(optionCont);
          }
        };
        /*spezilation start */
        let generatSpeiz = arr => {
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

        /*generate filterd option */
        let generateFilterd = arr => {
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
            console.log("no events");
          }
        };

        /*end of generate filterd option */
        /*make a popup */
        let makePopup = (typeCond, yearCond) => {
          let popCont = document.createElement("div");
          popCont.innerHTML = `Sorry their is'nt an event for (${typeCond}) in (${yearCond}) try use another filter`;
          document.querySelector(".cards-container").prepend(popCont);
          popCont.classList.add("popup");

          select.addEventListener("change", () => {
            document.querySelector(".cards-container").removeChild(popCont);
          });
          select2.addEventListener("change", () => {
            document.querySelector(".cards-container").removeChild(popCont);
          });
        };
        /*make a popup end */
        /*fetch json */
        async function oldEventsSection(data) {
          let arrFromRe = data.oldEvents;
          for (let i = 0; i < arrFromRe.length; i++) {
            smallEventArr.push(arrFromRe[i]);
            if (i === arrFromRe.length - 1) {
              controlCenter(0, smallEventArr);
              generatSpeiz(smallEventArr);
            }
          }
        }
        oldEventsSection(data);
        /*fetch json end */
        //end old events section
        //start new events section
        console.log(data);
        console.log(data.newEvents);
        let newEvents = document.querySelector(".event");
        let image = document.querySelectorAll(
          ".event-image-cont img:nth-child(2)"
        );
        let buttonCont = document.querySelector(".daysButton");
        async function newEventsSection(data) {
          let newE = data.newEvents;
          if (Array.from(newE).length > 0) {
            newEvents.classList.remove("dis");
          } else {
            console.log("no events");
          }
          buttonMakerCont(Array.from(newE).length, Array.from(newE));
        }

        let buttonMaker = (number, img) => {
          let button = document.createElement("button");
          button.append(document.createTextNode(`day ${number + 1}`));
          button.addEventListener("click", () => {
            image[0].src = img.img1;
            image[1].src = img.img2;
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
        newEventsSection(data);
        //end new event section
        // start footer section
        async function getFooterData() {
          let reponse = data.footer[0];

          let footerText = document.querySelector("footer .container .col-1 p");

          footerText.textContent = reponse.text;

          let footerLocation = document.querySelector(
            "footer .container .col-3 div:first-of-type span"
          );

          footerLocation.textContent = reponse.location;

          let footerTimeWork = document.querySelector(
            "footer .container .col-3 div:nth-of-type(2) span"
          );

          footerTimeWork.textContent = reponse.timeWork;

          let footerPhone = document.querySelector(
            "footer .container .col-3 div:nth-of-type(3) span"
          );

          footerPhone.textContent = reponse.phone;
        }
        getFooterData();
        // end footer section
      } else {
        console.log("No such document!");
      }
    },
    error => {
      console.error("Error fetching document:", error);
    }
  );
}
loadAndDisplayDataForUser();

//end fetching data from the database on entering

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

document.querySelectorAll("section").forEach(sec => {
  sec.addEventListener("click", () => {
    slideNav.style.left = "-1000px";

    header.classList.remove("hoverd");

    BurgerLinks.classList.remove("clicked");
  });
});

// end slide nav

// start image slider

let imagesArr = document.querySelectorAll(".landing-sec .image-container img");

let politsContainer = document.querySelector(".images-polits ul");

for (let i = 0; i < imagesArr.length; i++) {
  let liPolit = document.createElement("li");

  politsContainer.appendChild(liPolit);
}

let bulletsArr = document.querySelectorAll(".images-polits ul li");

let current = 0;

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
//admine popup
let admineButton = document.querySelector(".adminButton");
let adminClosingButton = document.querySelector(".login-closer");

admineButton.addEventListener("click", () => {
  loginSection.classList.remove("hidden");
  overlayBackground.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  BurgerLinks.classList.remove("clicked");
  slideNav.style.left = "-1000px";
});

adminClosingButton.addEventListener("click", () => {
  removeOverLay();
});

//admine version of the website
//this version will just apper for the admin to edit the website content easily
//it has repeatition of the main website code with textareas, inputs and save buttons
//do not delete the comments or try to minimize the code
//
//
//

//admin version products
