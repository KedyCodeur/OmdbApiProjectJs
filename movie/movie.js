
const key_api="2393e532"
let film_precedent=""
async function demande_movie_html(title){
    if(title==undefined){
        return
    }
    if(film_precedent==title){
        return
    }
    film_precedent=title
    const link =`https://www.omdbapi.com/?apikey=${key_api}&t=${title}&plot=full`
    try{
        const demande = await fetch(link)
        const data = await demande.json()

        if(data.Response==="False"){
            console.error(data.Error)
            return;
        }

        let affiche =document.querySelector(".affiche")
        let name =document.querySelector(".name")
        let point =document.querySelector(".point")
        let resume =document.querySelector(".resume")
        let date_de_sorti =document.querySelector(".date_de_sorti")
        let date_de_sorti_dvd =document.querySelector(".date_de_sorti_dvd")
        let genre =document.querySelector(".genre")
        let actors =document.querySelector(".actors")

        affiche.src = data.Poster && data.Poster !== "N/A" ? data.Poster : "/index/img_not_found.png";
        point.textContent = data.imdbRating && data.imdbRating !== "N/A" ? `${data.imdbRating}/10` : "Note indisponible";
        resume.innerHTML = data.Plot && data.Plot !== "N/A" ? `<strong>Résumé :</strong> ${data.Plot}` : "Résumé indisponible";
        date_de_sorti.innerHTML = data.Released && data.Released !== "N/A" ? `<strong>Date de sortie :</strong> ${data.Released}` : "Date de sortie indisponible";
        
        let date_dvd_sortie
        let dvdbase = data.DVD
        if(dvdbase && dvdbase !=="N/A"){
            let dvd_elements = dvdbase.split(" ")
            switch(dvd_elements[1]){
                    case "Jan": 
                        dvd_elements[1] = "01";
                        break;
                    case "Feb": 
                        dvd_elements[1] = "02";
                        break;
                    case "Mar":
                        dvd_elements[1] = "03"; 
                        break;
                    case "Apr":
                        dvd_elements[1] = "04";
                        break;
                    case "May":
                        dvd_elements[1] = "05";
                        break;
                    case "Jun":
                        dvd_elements[1] = "06";
                        break;
                    case "Jul":
                        dvd_elements[1] = "07";
                        break;
                    case "Aug":
                        dvd_elements[1] = "08";
                        break;
                    case "Sep":
                        dvd_elements[1] = "09";
                        break;
                    case "Oct":
                        dvd_elements[1] = "10";
                        break;
                    case "Nov":
                        dvd_elements[1] = "11";
                        break;
                    case "Dec":
                        dvd_elements[1] = "12";
                        break;
            }
            let date_dvd_francais = dvd_elements.join("/")
             date_dvd_sortie=`<strong>Date de sortie DVD :</strong>${date_dvd_francais}`
        }
        else{
             date_dvd_sortie="Date DVD indisponible"
        }
        
        date_de_sorti_dvd.innerHTML = date_dvd_sortie;
        genre.innerHTML = data.Genre && data.Genre !== "N/A" ? `<strong>Genre :</strong>  ${data.Genre}` : "Genre indisponible";
        actors.innerHTML = data.Actors && data.Actors !== "N/A" ? `<strong>Acteurs :</strong> ${data.Actors}` : "Acteurs indisponibles";
        name.innerHTML=title
        return
    }
    catch(error){
        console.error(error)
        return
    }
}
demande_movie_html(localStorage.getItem("film_chosi"))
