const getThumbnails = document.querySelector('.thumbnails')
let points = 0;
let numOfQuestions = 0;
let replied = 0;
let levels = [];
let scrollTo = 0;
let responseObject;
let data;

const main = document.querySelector('.main')
const screenOne = document.querySelector('.screen-one')
const screenTwo = document.querySelector('.screen-two')
const screenThree = document.querySelector('.screen-three')
const screenFour = document.querySelector('.screen-four')

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
    .catch(getError)

function openQuizz(element) {
    const hideMain = document.querySelector('.main')
    const showQuizz = document.querySelector('.opened-quizz')

    if (hideMain != null) {
        hideMain.classList.add('hide')
    }

    showQuizz.classList.remove('hide')

    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${element}`)
        .then(renderQuiz)
        .catch(getError)
}

const quizz = document.querySelector(".opened-quizz");

function renderQuiz(response) {
    responseObject = response;
    data = responseObject.data
    numOfQuestions = data.questions.length;

    quizz.innerHTML = ''
    quizz.innerHTML += `<div class="picture"></div>`

    const mainImage = data.image;
    const title = data.title;

    const showImage = document.querySelector(".picture");
    showImage.innerHTML = `
        <p class="title">${title}</p>
        <img src="${mainImage}">
    `

    let answerObject = [];

    for (let i = 0; i < data.questions.length; i++) {
        if (data.levels[i] !== undefined) {
            levels.push(data.levels[i])
        }
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


    setTimeout(() => {
        const content = document.querySelectorAll('.opened-quizz .content')
        content[scrollTo].scrollIntoView();
        scrollTo++
    }, 2000)
}

function pickOption(element, isCorrect) {
    // const content = document.querySelectorAll('.opened-quizz .content')

    setTimeout(() => {
        const content = document.querySelectorAll('.opened-quizz .content')
        content[scrollTo].scrollIntoView();
        scrollTo++
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

    if (replied === numOfQuestions) {
        let score = (points / numOfQuestions) * 100;
        score = Math.floor(score);
        let group;
        for (let i = 0; i < levels.length; i++) {
            let value = levels[i];

            if (score >= value.minValue) {
                group = value;
            }
        }
        quizz.innerHTML += `
            <div class="output">
                <p class="title">${score}% de acerto: ${ group.title}</p>
                <div class="info">
                    <img src="${group.image}" >
                    <p class="text">${group.text}</p>
                 </div>
            </div>
            `

        setTimeout(() => {
            const output = document.querySelector('.output .info')
            output.scrollIntoView();
            quizz.innerHTML += `
                <button class="btn" onclick="restart()"> Reiniciar Quizz</button>
                <button class="btn-comeback"onclick= "comeback()">Voltar pra home</button>
            `
        }, 2000)
    }
}

function restart() {
    window.scroll(0, 0)
    const selected = document.querySelectorAll('.opened-quizz .selected')
    const notSelected = document.querySelectorAll('.opened-quizz .not-selected')

    for (let i = 0; i < selected.length; i++) {
        const element = selected[i];
        element.classList.remove("selected")
    }
    for (let i = 0; i < notSelected.length; i++) {
        const element = notSelected[i];
        element.classList.remove("not-selected")
    }
    scrollTo = 0;
    points = 0;
    replied = 0;
    levels = [];
    renderQuiz(responseObject)
}

function comeback() {
    document.querySelector(".main").classList.remove("hide")
    document.querySelector(".main").classList.remove("show")
    document.querySelector(".opened-quizz").classList.remove("show")
    document.querySelector(".opened-quizz").classList.add("hide")
    screenFour.classList.add('hide')

    points = 0;
    numOfQuestions = 0;
    replied = 0;
    levels = [];
    scrollTo = 0;
}

function createQuizz() {
    main.classList.add('hide')
    screenOne.classList.remove('hide')
}

function createAnswers() {


    screenOne.classList.add('hide')
    screenTwo.classList.remove('hide')
}

function createLevel() {
    screenTwo.classList.add('hide')
    screenThree.classList.remove('hide')

    window.scroll(0, 0)
}

function finishQuizz() {
    screenThree.classList.add('hide')
    screenFour.classList.remove('hide')
}

function goToQuizz() {
    console.log('proximo')
}

function getError(er) {
    console.log(er)
}