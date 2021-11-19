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

let newQuestions = {
    id: '',
    title: '',
    image: '',
    nQuestions: '',
    nLevel: '',
    questions: [],
    levels: [
        {
            title: '',
            image: '',
            text: '',
            nimValue: ''
        },
    ]
}

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
                <p class="title">${score}% de acerto: ${group.title}</p>
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

    document.querySelector('.screen-one .form input:first-child').value = ''
    document.querySelector('.screen-one .form input:nth-child(2)').value = ''
    document.querySelector('.screen-one .form input:nth-child(3)').value = ''
    document.querySelector('.screen-one .form input:nth-child(4)').value = ''
    newQuestions.title = ''
    newQuestions.image = ''
    newQuestions.nQuestions = ''
    newQuestions.nLevel = ''
    newQuestions.questions = []
    newQuestions.levels = []
}


function createQuizz() {
    main.classList.add('hide')
    screenOne.classList.remove('hide')
}

function createAnswers() {
    newQuestions.title = document.querySelector('.screen-one .form input:first-child').value
    newQuestions.image = document.querySelector('.screen-one .form input:nth-child(2)').value
    newQuestions.nQuestions = document.querySelector('.screen-one .form input:nth-child(3)').value
    newQuestions.nLevel = document.querySelector('.screen-one .form input:nth-child(4)').value

    screenTwo.innerHTML = `
        <h1>Crie suas perguntas</h1>
        <div class="minimized hide">
            <h1>Pergunta 1</h1>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="form">
            <h1>Pergunta 1</h1>
            <input class='mandatory' type="text" placeholder="Texto da pergunta">
            <input class='mandatory' type="text" placeholder="Cor de fundo da pergunta">
            <br>
            <h1>Resposta correta</h1>
            <input class='mandatory' type="text" placeholder="Resposta correta">
            <input class='mandatory' type="text" placeholder="URL da imagem">
            <br>
            <h1>Respostas incorretas</h1>
            <input class='mandatory't' type="text" placeholder="Resposta incorreta 1">
            <input class='mandatory't' type="text" placeholder="URL da imagem 1">
            <br>
            <input class='no-mandatory' type="text" placeholder="Resposta incorreta 2">
            <input class='no-mandatory' type="text" placeholder="URL da imagem 2">
            <br>
            <input class='no-mandatory' type="text" placeholder="Resposta incorreta 3">
            <input class='no-mandatory' type="text" placeholder="URL da imagem 3">
        </div>
    `

    if (newQuestions.title === '' && newQuestions.image === '' && newQuestions.nQuestions === '' && newQuestions.nLevel === '') {
        alert('Preencha Todos os Campos')
    } else {
        screenOne.classList.add('hide')
        screenTwo.classList.remove('hide')
    }

    for (let i = 2; i <= newQuestions.nQuestions; i++) {
        screenTwo.innerHTML +=
            `<div class="minimized">
                <h1>Pergunta ${i}</h1>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="form hide">
                <h1>Pergunta ${i}</h1>
                <input class='mandatory' type="text" placeholder="Texto da pergunta">
                <input class='mandatory' type="text" placeholder="Cor de fundo da pergunta">
                <br>
                <h1>Resposta correta</h1>
                <input class='mandatory' type="text" placeholder="Resposta correta">
                <input class='mandatory' type="text" placeholder="URL da imagem">
                <br>
                <h1>Respostas incorretas</h1>
                <input class='mandatory' type="text" placeholder="Resposta incorreta 1">
                <input class='mandatory' type="text" placeholder="URL da imagem 1">
                <br>
                <input class='no-mandatory' type="text" placeholder="Resposta incorreta 2">
                <input class='no-mandatory' type="text" placeholder="URL da imagem 2">
                <br>
                <input class='no-mandatory' type="text" placeholder="Resposta incorreta 3">
                <input class='no-mandatory' type="text" placeholder="URL da imagem 3">
            </div>`
    }

    screenTwo.innerHTML += `<button class="btn" onclick="createLevel()">Prosseguir para criar níveis</button>`
}

function createLevel() {
    const ifNotValue = []
    const inputValueTeste = document.querySelectorAll('.screen-two .form input.mandatory')
    const inputValue = document.querySelectorAll('.screen-two .form input')

    for (let i = 0; i < newQuestions.nQuestions; i++) {
        // for (let j = 0; j < inputValue.length; j++) {
        newQuestions.questions[i] = {
            title: inputValue[0].value,
            color: inputValue[1].value,
            answers: [],
        }
        newQuestions.questions[i].answers[0] = {
            text: inputValue[2].value,
            image: inputValue[3].value,
            isCorrectAnswer: true,
        }
        newQuestions.questions[i].answers[1] = {
            text: inputValue[4].value,
            image: inputValue[5].value,
            isCorrectAnswer: false,
        }
        if (inputValue[6].value !== '') {
            newQuestions.questions[i].answers[2] = {
                text: inputValue[6].value,
                image: inputValue[7].value,
                isCorrectAnswer: false,
            }
        }
        if (inputValue[8].value !== '')
            newQuestions.questions[i].answers[3] = {
                text: inputValue[8].value,
                image: inputValue[9].value,
                isCorrectAnswer: false,
            }
        // }
    }

    screenThree.innerHTML = `
        <h1>Agora, decida os níveis</h1>
        <div class="minimized hide">
            <h1>Nível 1</h1>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="form">
            <h1>Nível 1</h1>
            <input type="text" placeholder="Título do nível">
            <input type="text" placeholder="% de acerto mínima">
            <input type="text" placeholder="URL da imagem do nível">
            <input type="text" placeholder="Descrição do nível">
        </div>
    `


    if (newQuestions.title === '' && newQuestions.image === '' && newQuestions.nQuestions === '' && newQuestions.nLevel === '') {
        alert('Preencha Todos os Campos')
    } else {
        screenOne.classList.add('hide')
        screenTwo.classList.remove('hide')
    }

    for (let i = 2; i <= newQuestions.nLevel; i++) {
        screenThree.innerHTML += `
            <div class="minimized">
                <h1>Nível ${i}</h1>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="form hide">
                <h1>Nível ${i}</h1>
                <input type="text" placeholder="Título do nível">
                <input type="text" placeholder="% de acerto mínima">
                <input type="text" placeholder="URL da imagem do nível">
                <input type="text" placeholder="Descrição do nível">
            </div>
        `
    }

    screenThree.innerHTML += `<button class="btn" onclick="finishQuizz()">Finalizar Quizz</button>`

    for (let i = 0; i < inputValueTeste.length; i++) {
        ifNotValue.push(inputValueTeste[i].value)
    }
    if (ifNotValue.includes('')) {
        alert('Preencha Todos os Campos')
    } else {
        screenTwo.classList.add('hide')
        screenThree.classList.remove('hide')
    }

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
