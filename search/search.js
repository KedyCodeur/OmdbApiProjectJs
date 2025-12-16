const key_api="2393e532"

// function  animation  hover 

function detail(carte){
    let img = carte.querySelector(".img_replace_infini");
    let title=carte.querySelector(".film_infini_name");
    let resume = carte.querySelector(".film_infini_resume");
    let date = carte.querySelector(".film_infini_date");
    let point = carte.querySelector(".film_infini_score");
    let button = carte.querySelector(".abutton");

        if(carte.dataset.running ==="true"){
            return;
        }
        
        let count = parseInt(carte.dataset.count)
        count= isNaN(count) ? 0:count
        carte.dataset.count = count + 1
        carte.dataset.running="true"
         
        function arriere(callback){
                img.style.display="none"
                title.style.display="none"
                date.style.display="none"
                point.style.display="none"
                resume.style.display="block"
                button.style.display="flex"

                callback()
                
        }

        function devant(callback){
                img.style.display="block"
                title.style.display="block"
                date.style.display="block"
                point.style.display="block"
                resume.style.display="none"
                button.style.display="none"

                callback()
        }
        function part2(){
            carte.classList.remove("spin_animationv2")
            carte.classList.add("spin_animationv2")
            carte.addEventListener("animationend",remove_all,{once:true})
        }
        function remove_all(){
            carte.classList.remove("spin_animationv1")
            carte.classList.remove("spin_animationv2")
            carte.style.transform = "rotateY(0deg)";
            carte.dataset.running="false";     
        }
        
        carte.classList.add("spin_animationv1")
        carte.addEventListener("animationend",count%2 == 0 ? ()=> arriere(part2): ()=>devant(part2),{once:true})
    
}   
//fonctionne pour tirer  determiner quel film a été clické

function its_me(title){
    localStorage.setItem("film_chosi",title)
}
//rechercher

async function get_info(film,container){
    const link = `https://www.omdbapi.com/?apikey=${key_api}&t=${encodeURIComponent(film)}`;
     try {
        const demande = await fetch(link);
        const data = await demande.json();

        if (data.Response === "False") {
            console.error(data.Error);
            return;
        }


        let explication = data.Plot && data.Plot!=="N/A" ? data.Plot : "Une erreur est survenue lors de la récupération des données.";
        let poster = data.Poster && data.Poster!=="N/A" ? data.Poster : "/assets/img_not_found.png";
        let year_film = data.Year && data.Year !== "N/A" ? data.Year : "xxxx";
        let imbd = data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "x/10";
        let title = film

        let img = container.querySelector(".img_replace_infini");

        let resume =  container.querySelector(".film_infini_resume");
       

        let year = container.querySelector(".film_infini_date");

        let point = container.querySelector(".film_infini_score");

        let name= container.querySelector(".film_infini_name")
            
        name.querySelector(".detecteur_film").textContent=title
        resume.innerHTML=explication
        img.src = `${poster}`
        year.textContent=year_film
        point.textContent=`${imbd}/10`
        
        img.onerror = () => {
        img.src = "/assets/img_not_found.png";           
        };
    } catch (error) {
        console.error(error);
    }
}

let error_count=0
let page_count=1
async function charger_films(page,input){
    if(input.length<4){
        chargerPlus.textContent="Charger Plus"
        return
    }
    if(input=="non"){
        chargerPlus.textContent="Charger Plus"
        return
    }
    chargerPlus.textContent="En Cours";
    const link = `https://www.omdbapi.com/?apikey=${key_api}&s=${input}&page=${page}`;
    let promises =[]
    try{
        const demande = await fetch(link)
        const data = await demande.json()

        const fragment = document.createDocumentFragment();
        if(data.Response=="False"){
            console.error(data.Error);
            chargerPlus.textContent="Charger Plus"
            return;
        }
        let grid_infini = document.querySelector(".grid_infini")
        data.Search.forEach((film)=>{
            const container = document.createElement("div")
            container.classList.add("container_infini")

            container.innerHTML=`<div class="film_infini_carte">
                            <img src="/assets/img_not_found.png" alt="l'afiche du film${film.Title}" class="img_replace_infini" loading="lazy">
                            <p class="film_infini_name"><a href="/movie/movie.html" class="detecteur_film">Inconnu</a></p>
                            <p class="film_infini_date">xxxx</p>
                            <p class="film_infini_score">x/10</p>
                            <p class="film_infini_resume"><a href="/movie/movie.html" class="detecteur_film">Une erreur est survenue lors de la récupération des données.</a></p>
                            <a href="/movie/movie.html" class="abutton detecteur_film">...Plus</a>
                        </div>`
            
            let carte = container.querySelector(".film_infini_carte")
            carte.addEventListener("click",()=>detail(carte))
            let bouttons = carte.querySelectorAll(".detecteur_film")
            bouttons.forEach((btn)=>{
                btn.addEventListener("click",()=>its_me(film.Title))
                console.log()
            })
            fragment.appendChild(container);
            let title = film.Title   
            promises.push(get_info(title,container))
        })
        chargerPlus.textContent="Charger Plus"
        grid_infini.appendChild(fragment)
        await Promise.all(promises)
        page_count++
        if(data.Search.length==10){
            chargerPlus.style.color="black"
            chargerPlus.disabled = false;
            chargerPlus.style.cursor = "pointer";
        }
        if(data.Search.length<10){
            chargerPlus.style.color="red"
            chargerPlus.disabled = true;
            chargerPlus.style.cursor = "not-allowed";}
            error_count=0
        }
        
    catch(error){
        console.error(error)
        error_count++
        if(error_count==6){
            alert("La connexion Internet est lente, veuillez réessayer plus tard.");
            error_count=0
            chargerPlus.textContent="Charger Plus"
            return
        }
        return charger_films(page, input) 
    }

    

}

const chargerPlus=document.getElementById("button_charger")

const input_film =  document.querySelector("input");

let control_changement=""
let film_recherche="non"
function search(input){
    if(input.length<4){
        chargerPlus.textContent="Charger Plus"
        return
    }
    if(control_changement==input){
        return
    }
    control_changement=input
    page_count=1
    let grid_infini = document.querySelector(".grid_infini")
    grid_infini.innerHTML=""
    charger_films(page_count,input)
}   

input_film.addEventListener("input",()=>{
    film_recherche= input_film.value;
    search(film_recherche)
})

chargerPlus.onclick = ()=> {
    charger_films(page_count,film_recherche);
}


