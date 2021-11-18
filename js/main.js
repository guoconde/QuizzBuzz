const getThumbnails = document.querySelector('.thumbnails')
let points = 0;
let numOfQuestions = 0;
let replied = 0;
let levels = [];
let scrollTo = 0;


axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    .then(el => {
        getThumbnails.innerHTML = ''

        for (let i = 0; i < el.data.length; i++) {
            getThumbnails.innerHTML += `
                <div class="thumbnail" onclick="openQuizz(${el.data[i].id})">
                    <img src="${el.data[i].image}">
                    <h2>${el.data[i].title}</h2>
                </div>
            `
        }
    })
    .catch(() => {
        console.log('deu erro no get1')
    })

function openQuizz(element) {
    const hideMain = document.querySelector('.main')
    const showQuizz = document.querySelector('.opened-quizz')

    console.log(hideMain)
    console.dir(hideMain)

    if (hideMain != null) {
        hideMain.classList.remove('show')
        hideMain.classList.add('hide')
    }

    showQuizz.classList.remove('hide')
    showQuizz.classList.add('show')

    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${element}`)
    promise.then(renderQuiz)
}
const quizz = document.querySelector(".opened-quizz");
function renderQuiz(response) {
    const data = response.data;
    numOfQuestions = data.questions.length;
    const mainImage = data.image;
    const title = data.title;
    const showImage = document.querySelector(".picture");

    showImage.innerHTML = `
        <p class="title">${title}</p>
        <img src="${mainImage}">
    `
    let answerObject = [];
    for (let i = 0; i < data.questions.length; i++) {
        levels.push(data.levels[i])
        let text = `
        <div class="content">
            <p class="title" style="background-color: ${data.questions[i].color};">${data.questions[i].title} </p>
            <div class="answers"> `
        for (let j = 0; j < data.questions[i].answers.length; j++) {
            const answer = data.questions[i].answers[j];

            answerObject.push(answer);
        }
        answerObject.sort(() => {
            return Math.random() - 0.5;
        })
        for (let k = 0; k < answerObject.length; k++) {

            text += `
                <div class="option" onclick = "pickOption(this, ${answerObject[k].isCorrectAnswer})">
                    <img src="${answerObject[k].image}" >
                    <p id = "${answerObject[k].isCorrectAnswer}">${answerObject[k].text}</p>
                 </div>
           `
        }
        text += `
        </div>
            </div>`
        quizz.innerHTML += text;
        answerObject = [];
    }

}
function pickOption(element, isCorrect) {
    const content = document.querySelectorAll('.opened-quizz .content')
    setTimeout (()=>{
        const content = document.querySelectorAll('.opened-quizz .content')
        scrollTo++
        return content[scrollTo].scrollIntoView();
    }, 2000)
    const parent = element.parentElement;
    const children = parent.children;

    if (element.classList.contains("selected") || element.classList.contains("not-selected")) {
        return;
    }
    replied++
    element.classList.add("selected")

    for (let i = 0; i < children.length; i++) {
        if (children[i] !== element) {
            children[i].classList.add("not-selected")
        }
    }
    if (isCorrect === true) {
        points++
    }
    if (replied  === numOfQuestions) {
        let score = (points/ numOfQuestions) * 100;
        score = Math.floor(score);
        for (let i = 0; i < levels.length; i++) {
            const item = levels[i]
            
            if (item === undefined){
                let title = levels[i-1].title;
                const text = levels[i-1].text;
                const image = levels[i-1].image;
                quizz.innerHTML += `
                <div class="output">
                    <p class="title">${score}% de acerto: ${title}</p>
                    <div class="info">
                        <img src="${image}" >
                        <p class="text">${text}</p>
                     </div>
                </div>
                `
                break;
            }
            const value = item.minValue
            if (score <= value ){
                let title = levels[i].title;
                const text = levels[i].text;
                const image = levels[i].image;
                quizz.innerHTML += `
                <div class="output">
                    <p class="title">${score}% de acerto: ${title}</p>
                    <div class="info">
                        <img src="${image}" >
                        <p class="text">${text}</p>
                     </div>
                </div>
                `
                break;
            }
            
        }

        setTimeout(()=> {
            const output = document.querySelector('.output .info')
            output.scrollIntoView();
        }, 2000)
    }
}

function createQuizz() {
    const main = document.querySelector('.main')
    const creatingQuizz = document.querySelector('.creating-quizz')

    main.classList.add('hide')
    creatingQuizz.classList.remove('hide')
}

function next() {
    console.log('proximo')
}
