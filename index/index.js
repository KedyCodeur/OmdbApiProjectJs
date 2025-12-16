const key_api="2393e532"
//L'ANİMATİON DE SLİDE 
let film_index=0;
let count_time=0

function update(){
    if(film_index>5){
        film_index=0
    }
    if(film_index<0){
        film_index=5
    }
    const div_tendances=document.querySelectorAll(".films-tendances")
    div_tendances.forEach((film)=>{film.style.display="none";})

    div_tendances[film_index].style.display="block"
    div_tendances[film_index].classList.add("effect_slide")
    setTimeout(()=>div_tendances[film_index].classList.remove("effect_slide"),1500)
}

function timer(){
    if(count_time<5){
        count_time++
    }
    else{
        count_time=0
    }
    if(count_time==5){
        count_time=0
        film_index++
        if(film_index>4){
            film_index=0
        }
        if(film_index<0){
            film_index=4
        }
        update()
    }
    
}
function next(){
    if(film_index>=4){
        film_index=0
        
    }
    else{
        film_index++
    }
    count_time=0
    update()
}

function prev(){
    if(film_index<=0){
        film_index=4
    }
    else{
        film_index--
    }
    count_time=0
    update()
}

update()
setInterval(timer,1000)

const left=document.body.querySelector(".left");
left.onclick=prev

const right=document.body.querySelector(".right");
right.onclick=next


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
//api films mise a jour 
async function api_demande_base(title,index,container,imgclass,resumeclass,yearclass,pointclass,name_demande,ajoute_hover_animation){
    let divs_slides=document.querySelectorAll(container)
    if(divs_slides[index].dataset.updated=="true"){
        return  
    }
    if(ajoute_hover_animation){;
        let div = divs_slides[index];
        let carte = div.querySelector(".film_infini_carte");

        if(!carte.dataset.listener){
            carte.addEventListener("click",()=>detail(carte));
            carte.dataset.listener="true"}
    }


    const link=`https://www.omdbapi.com/?apikey=${key_api}&t=${encodeURIComponent(title)}`

    try{
        const demande=await fetch(link);
        const data=await demande.json();

         if(data.Response==="False"){
            console.error(`La Communication Avec Api a échoué ${data.Error}`);
            return;
        }

        let img = divs_slides[index].querySelector(imgclass);

        let resume =  divs_slides[index].querySelector(resumeclass);
       

        let year = divs_slides[index].querySelector(yearclass);

        let point = divs_slides[index].querySelector(pointclass);

        if (name_demande==true){
            let name= divs_slides[index].querySelector(".film_infini_name")
            name.innerHTML=`<a href="/movie/movie.html" class="detecteur_film">${data.Title}</a>`
        }
        let explication = data.Plot && data.Plot!=="N/A" ? data.Plot : "Une erreur est survenue lors de la récupération des données."
        let poster = data.Poster && data.Poster!=="N/A" ? data.Poster : "/assets/img_not_found.png"
        let year_film = data.Year && data.Year !== "N/A" ? data.Year : "xxxx";
        let imbd = data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "x/10";

        if(name_demande==true){
            resume.innerHTML=explication
        }
        else{
            resume.innerHTML=`${explication}<a href="/movie/movie.html" class="detecteur_film">...Plus</a>`
        }
        img.src = `${poster}`;
        year.textContent=year_film;
        point.textContent=`${imbd}/10`
        divs_slides[index].dataset.updated="true"
        let bouttons = divs_slides[index].querySelectorAll(".detecteur_film");
        bouttons.forEach((btn)=>{
            btn.addEventListener("click",()=>its_me(data.Title))
        })
        

    }
    catch(error){
        console.log("le demande api a échoué",error)

        let explication = "Une erreur est survenue lors de la récupération des données."
        let poster =  "/assets/img_not_found.png"
        let year_film = "xxxx";
        let imbd = "x/10";
        
        if (name_demande==true){
            let name= divs_slides[index].querySelector(".film_infini_name")
            name.innerHTML=`inconnu`
        }
    }
}

// les demandes pour plusieurs parties 
function films_updates_tendance(){
    let titles = ["Spider-Man","Akira","Sword of the Stranger","One Piece Film: Red","Paprika"];
    titles.forEach((title,index) => {api_demande_base(title,index,".container",".img_replace",".resume",".year",".point",false,false)})
}

function films_updates_infini_base(){
    let titles = ["Spirited Away","Jujutsu Kaisen 0","Princess Mononoke","Weathering with You","Perfect Blue","Grave of the Fireflies","The Wind Rises","Summer Wars","The Boy and the Beast"];
    titles.forEach((title,index) => {api_demande_base(title,index,".container_infini",".img_replace_infini",".film_infini_resume",".film_infini_date",".film_infini_score",true,true)})
}



//charger plus 
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
async function charger_films(page){
    const link = `https://www.omdbapi.com/?apikey=${key_api}&s=love&page=${page}`;
    let promises =[]
    let check=false
    try{
        const annule = new AbortController()
        let intervalID = setTimeout(()=>{
            annule.abort()
        },1000)
        const demande = await fetch(link,{signal:annule.signal})
        const data = await demande.json()
        check=true
        if(check==true){
            clearTimeout(intervalID)
        }
        const fragment = document.createDocumentFragment();
        if(data.Response=="False"){
            console.error(data.Error);
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

        grid_infini.appendChild(fragment)
        await Promise.all(promises)
        if(data.Search.length<10){
        chargerPlus.style.color="red"
        chargerPlus.disabled = true;
        chargerPlus.style.cursor = "not-allowed";}
        page_count++
        error_count=0
        chargerPlus.textContent="Charger Plus"
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
        return charger_films(page_count)
    }

    

}

const chargerPlus=document.getElementById("button_charger")

chargerPlus.onclick = ()=>{
    charger_films(page_count)
    chargerPlus.textContent="En Cours"
};



films_updates_tendance()
films_updates_infini_base()

