let BurgerLinks = document.querySelector(".burger-links")

BurgerLinks.addEventListener("click" , () =>{
  BurgerLinks.classList.toggle("clicked")
})
let header = document.querySelector("header")

let slideNav = document.querySelector(".slide-nav")

BurgerLinks.addEventListener("click" , () =>{
  if(BurgerLinks.classList.contains("clicked")){
    slideNav.style.left = "5px" ;
    header.classList.add("hoverd")
  }
  else{
    slideNav.style.left = "-500px" 
    header.classList.remove("hoverd")
  }
})

