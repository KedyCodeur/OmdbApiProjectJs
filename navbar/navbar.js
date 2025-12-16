//theme button
const theme_buttons=document.querySelectorAll(".theme_change");
const theme_liste_clairs = document.querySelectorAll(".theme_liste_clair")

//les elements qui va changer la couleur

//navbar
let header_main_theme=document.querySelector("header")
let liens_header_theme = header_main_theme.querySelectorAll("a");
let header_burger_theme = document.querySelector(".header_burger").querySelector("ul");
let liens_header_burger_theme=header_burger_theme.querySelectorAll("a");
//index
let indexcontainer_theme = document.querySelectorAll(".container")
let titres_theme= document.querySelectorAll(".titre_index")

//search+index
let movies_container_theme = document.querySelectorAll(".film_infini_carte")
//footer
let footer_theme = document.querySelector("footer")
//contact 
let carte_contact = document.querySelector(".carte_contact")

let body_theme=document.querySelector("body")

//movie

let infosmovie = document.querySelectorAll(".pmovie");



let count_theme=0
function button_change(){
    
    theme_buttons.forEach(theme_button => {theme_button.classList.toggle("theme_button_clair");})
    theme_buttons.forEach(theme_button => {theme_button.classList.toggle("theme_button_sombre");})
    theme_liste_clairs.forEach(theme_liste_clair => {theme_liste_clair.classList.toggle("theme_liste_clair");})
    theme_liste_clairs.forEach(theme_liste_clair => {theme_liste_clair.classList.toggle("theme_liste_sombre");})

    function theme_chenge(){
        header_main_theme.classList.toggle("darkheader");

        liens_header_theme.forEach(lien=>{
            lien.classList.toggle("darklien")
        })

        header_burger_theme.classList.toggle("header_burger_dark");
        liens_header_burger_theme.forEach(lien=>{
            lien.classList.toggle("darklien")
        })

    
        indexcontainer_theme.forEach(container=>{
            container.classList.toggle("darkcontainer")
        })

        body_theme.classList.toggle("darkbody")
        
        titres_theme.forEach(titre=>{
            titre.classList.toggle("titre_dark")
        })

        footer_theme.classList.toggle("footer_dark")

        movies_container_theme.forEach(movie=>{
            movie.classList.toggle("movies_container_dark")
        })
        try{
            carte_contact.classList.toggle("contact_carte_dark")
        }
        catch{}

        infosmovie.forEach(info=>{
            if(info.id=="info_dark_theme"){
                info.id=""
            }
            else{
                info.id="info_dark_theme"
            }
        })
    }
    theme_chenge()
    if(count_theme%2==0){
        localStorage.setItem("track_theme_global","true")
    }
    else{
        localStorage.setItem("track_theme_global","false")
    }
    count_theme++   
}

let theme_existant=""
function control_theme(theme){
    console.log(theme)
    if(theme == theme_existant){
        return
    }
    if(theme=="true"){
        button_change()
    }
    theme_existant=theme
}


theme_buttons.forEach(theme_button =>theme_button.onclick=button_change)

const button_menu_burger = document.getElementById("button_menu_burger");
const header_burger = document.querySelector(".header_burger_hide");

//burger menu  responsive
button_menu_burger.onclick=(clickstop)=>{
    clickstop.stopPropagation()
    header_burger.classList.toggle("header_burger_hide");
    header_burger.classList.toggle("header_burger_show");
}

header_burger.addEventListener("click",(clickstop)=>clickstop.stopPropagation())
addEventListener("click",()=>{
        header_burger.classList.remove("header_burger_show");
        header_burger.classList.add("header_burger_hide")
        

    })


control_theme(localStorage.getItem("track_theme_global"))
