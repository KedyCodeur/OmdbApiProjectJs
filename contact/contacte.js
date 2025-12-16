const question_divs = document.querySelectorAll(".question_bar");
const reponses = document.querySelectorAll(".response_bar");

question_divs.forEach((div, index) => {
    let reponse = reponses[index];

    div.onclick = () => {
        reponse.classList.toggle("grandir");
        reponse.classList.toggle("base");
    };
});