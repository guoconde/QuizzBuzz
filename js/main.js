const getThumbnails = document.querySelector('.thumbnails')
let points = 0;
let numOfQuestions = 0;
let replied = 0;
let levels = [];
let scrollTo = 0;
let responseObject;
let data;
let createdQuizzes = [];

const main = document.querySelector('.main')
const screenOne = document.querySelector('.screen-one')
const screenTwo = document.querySelector('.screen-two')
const screenThree = document.querySelector('.screen-three')
const screenFour = document.querySelector('.screen-four')

let nQuestions = ''
let nLevel = ''

let newQuestions = {
    title: '',
    image: '',
    questions: [],
    levels: []
}
let questionsInfo = {
    title: "",
    color: "",
    answers: []
}
let answersInfo = {
    text: "",
    image: "",
    isCorrectAnswer: ""
}
let levelsInfo = {
    title: "",
    image: "",
    text: "",
    minValue: ""
}
axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    .then(loadQuizzes)
    .catch(getError)

function loadQuizzes(el) {
    let myQuizzes = localStorage.getItem("myQuizzes")
    myQuizzes = JSON.parse(myQuizzes);

    if (myQuizzes !== null) {
        createdQuizzes = myQuizzes;
        document.querySelector(".selected-quizz").classList.add("hide");
        const yourQuizz = document.querySelector(".your-quizz");
        yourQuizz.classList.remove("hide");
    }

    const yourThumbnail = document.querySelector(".your-quizz .your-thumbnails");
    yourThumbnail.innerHTML = ""
    getThumbnails.innerHTML = ''

    for (let i = 0; i < el.data.length; i++) {
        let control = false;
        if (myQuizzes !== null) {
            for (let j = 0; j < myQuizzes.length; j++) {
                const element = myQuizzes[j];
                if (el.data[i].id === element) {
                    yourThumbnail.innerHTML += `
                    <div class="thumbnail" onclick="openQuizz(${el.data[i].id})">
                        <img src="${el.data[i].image}">
                        <h2>${el.data[i].title}</h2>
                    </div>`
                    control = true;
                }
            }
        }
        if (control === true) {
            continue;
        }
        getThumbnails.innerHTML += `
                <div class="thumbnail" onclick="openQuizz(${el.data[i].id})">
                    <img src="${el.data[i].image}">
                    <h2>${el.data[i].title}</h2>
                </div>
            `
    }
}
function openQuizz(element) {
    const hideMain = document.querySelector('.main')
    const showQuizz = document.querySelector('.opened-quizz')

    if (hideMain != null) {
        hideMain.classList.add('hide')
    }

    showQuizz.classList.remove('hide')
    const screenFour = document.querySelector(".screen-four");
    if (!screenFour.classList.contains("hide")){
        screenFour.classList.add("hide")
    }
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
    nQuestions = ''
    nLevel = ''
    newQuestions.title = ''
    newQuestions.image = ''
    newQuestions.questions = []
    newQuestions.levels = []

    window.scroll(0, 0)
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promise.then(loadQuizzes)
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
function createQuizz() {
    main.classList.add('hide')
    screenOne.classList.remove('hide')
}
function verificationInfo() {
    let quizzTitle = document.querySelector('.screen-one .form input:first-child').value
    let quizzImage = document.querySelector('.screen-one .form input:nth-child(2)').value
    nQuestions = document.querySelector('.screen-one .form input:nth-child(3)').value
    nLevel = document.querySelector('.screen-one .form input:nth-child(4)').value

    const isValid = isValidHttpUrl(quizzImage);

    if (quizzTitle.length < 20 || quizzTitle.length > 65 || isValid === false || nQuestions < 3 || nLevel < 2) {
        alert(`Os dados inseridos devem seguir este padrão:
Título deve conter mais de 20 e menos de 65 caracteres.
A URL das imagens devem serguir o padrão: http://...
A quantidade de perguntas devem ser no mínimo 3.
A quantidade de níveis devem ser no mínimo 2`)
        return;
    }

    newQuestions.title = quizzTitle;
    newQuestions.image = quizzImage;
    createAnswers()
}
function createAnswers() {
    screenOne.classList.add('hide')
    screenTwo.classList.remove('hide')

    for (let i = 1; i <= nQuestions; i++) {
        screenTwo.innerHTML +=
            `
            <div class="minimized" onclick ="openForm(this)">
                <h1>Pergunta ${i}</h1>
                <ion-icon name="create-outline" ></ion-icon>
            </div>
            <div class="form-Field hide">
                <div class="form">
                    <h1>Pergunta ${i}</h1>
                    <input class='mandatory title' type="text" placeholder="Texto da pergunta">
                    <input class='mandatory color' type="text" placeholder="Cor de fundo da pergunta">
                    <br>
                    <h1>Resposta correta</h1>
                    <input class='mandatory correct-answer ' type="text" placeholder="Resposta correta">
                    <input class='mandatory url-correct-answer' type="text" placeholder="URL da imagem">
                    <br>
                    <h1>Respostas incorretas</h1>
                    <input class='mandatory wrong-answer' type="text" placeholder="Resposta incorreta 1">
                    <input class='mandatory url-wrong-answer' type="text" placeholder="URL da imagem 1">
                    <br>
                    <input class='no-mandatory wrong-answer' type="text" placeholder="Resposta incorreta 2">
                    <input class='no-mandatory url-wrong-answer' type="text" placeholder="URL da imagem 2">
                    <br>
                    <input class='no-mandatory wrong-answer' type="text" placeholder="Resposta incorreta 3">
                    <input class='no-mandatory url-wrong-answer' type="text" placeholder="URL da imagem 3">
                </div>
            </div>`
    }

    screenTwo.innerHTML += `<button class="btn" onclick="verificationQuestions ()">Prosseguir para criar níveis</button>`
}
function verificationQuestions() {
    const item = document.querySelectorAll('.screen-two .form-Field');
    const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/

    for (let i = 0; i < item.length; i++) {
        let currentItem = item[i];

        let inputTitle = currentItem.querySelector(".form .mandatory.title").value;
        let inputColor = currentItem.querySelector(".form .mandatory.color").value;
        let inputCorrectAnswer = currentItem.querySelector(".form .mandatory.correct-answer").value;
        let inputImageCa = currentItem.querySelector(".form .mandatory.url-correct-answer").value;
        let inputWrongAnswer = currentItem.querySelector(".form .mandatory.wrong-answer").value;
        let inputImageWa = currentItem.querySelector(".form .mandatory.url-wrong-answer").value;

        let isValidca = isValidHttpUrl(inputImageCa);
        let isvalidwa = isValidHttpUrl(inputImageWa);

        if (inputTitle.length < 20 || inputCorrectAnswer.length < 20 || inputWrongAnswer.length < 20 || !regex.test(inputColor)) {
            alert(`Os dados inseridos devem seguir este padrão:
Título deve conter mais de 20 caracteres.
As respostas devem conter mais de 20 caracteres.
A URL das imagens devem serguir o padrão: http://...
A cor de fundo deve seguir o padrão Hexadecimal, conforme o modelo: #FFFFFF`)
            return;
        }
        if (isValidca === false || isvalidwa === false) {
            alert(`Os dados inseridos devem seguir este padrão:
Título deve conter mais de 20 caracteres.
As respostas devem conter mais de 20 caracteres.
A URL das imagens devem serguir o padrão: http://...
A cor de fundo deve seguir o padrão Hexadecimal, conforme o modelo: #FFFFFF`)
            return;
        }


        questionsInfo.title = inputTitle;
        questionsInfo.color = inputColor;

        answersInfo.text = inputCorrectAnswer;
        answersInfo.image = inputImageCa;
        answersInfo.isCorrectAnswer = true;
        questionsInfo.answers.push(answersInfo);

        answersInfo = {
            text: "",
            image: "",
            isCorrectAnswer: ""
        }

        answersInfo.text = inputWrongAnswer;
        answersInfo.image = inputImageWa;
        answersInfo.isCorrectAnswer = false;
        questionsInfo.answers.push(answersInfo);

        newQuestions.questions.push(questionsInfo);
        answersInfo = {
            text: "",
            image: "",
            isCorrectAnswer: ""
        }

        for (let j = 0; j < 2; j++) {
            let noMandatoryAnswer = currentItem.querySelectorAll(".form .no-mandatory.wrong-answer");
            let noMandatoryUrl = currentItem.querySelectorAll(".no-mandatory.url-wrong-answer");

            let itemAnswer = noMandatoryAnswer[j].value;
            let itemUrl = noMandatoryUrl[j].value;
            if (itemAnswer !== "" || itemUrl !== "") {
                let isvalidUrl = isValidHttpUrl(itemUrl);
                if (itemAnswer.length < 20 || isvalidUrl === false) {
                    alert("Verifique os dados digitados !")
                    return;
                }
                answersInfo.isCorrectAnswer = false;
                answersInfo.text = itemAnswer;
                answersInfo.image = itemUrl;

                questionsInfo.answers.push(answersInfo);

                answersInfo = {
                    text: "",
                    image: "",
                    isCorrectAnswer: ""
                }
            }
        }

        questionsInfo = {
            title: "",
            color: "",
            answers: []
        }
    }
    createLevel()
    screenTwo.innerHTML = ""
}

function createLevel() {
    window.scroll(0, 0)
    screenTwo.classList.add('hide')
    screenThree.classList.remove('hide')

    for (let i = 1; i <= nLevel; i++) {
        screenThree.innerHTML += `
            <div class="minimized" onclick = "openForm(this)">
                <h1>Nível ${i}</h1>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class = "form-Field hide">
                <div class="form hide">
                    <h1>Nível ${i}</h1>
                    <input class= "title" type="text" placeholder="Título do nível">
                    <input class = "min-value" type="text" placeholder="% de acerto mínima">
                    <input class = "url-image" type="text" placeholder="URL da imagem do nível">
                    <input class = "description" type="text" placeholder="Descrição do nível">
                </div>
            </div>
        `
    }

    screenThree.innerHTML += `<button class="btn" onclick="VerificationLevels()">Finalizar Quizz</button>`
}

function VerificationLevels() {
    const item = document.querySelectorAll('.screen-three .form-Field');
    const minValueLevels = []
    for (let i = 0; i < item.length; i++) {
        const element = item[i];
        let title = element.querySelector(".form .title").value;
        let minValue = parseInt(element.querySelector(".form .min-value").value);
        let urlImage = element.querySelector(".form .url-image").value;
        let description = element.querySelector(".form .description").value;

        let isValid = isValidHttpUrl(urlImage);

        if (title.length < 10 || isValid === false || description.length < 30) {
            alert(`Os dados inseridos devem seguir este padrão:
Título deve conter mais de 10 caracteres.
A % de acerto mínima deve estar entre 0 e 100.
A URL da imagen devem serguir o padrão: http://...
A descrição do nível deve ser maior do que 30 caracteres.`)
            return;
        }
        if (minValue === NaN || minValue > 100 || minValue < 0) {
            alert(`Os dados inseridos devem seguir este padrão:
Título deve conter mais de 10 caracteres.
A % de acerto mínima deve estar entre 0 e 100.
A URL da imagen devem serguir o padrão: http://...
A descrição do nível deve ser maior do que 30 caracteres.`)
            return;
        }
        minValueLevels.push(minValue);

        levelsInfo.title = title;
        levelsInfo.image = urlImage;
        levelsInfo.text = description;
        levelsInfo.minValue = minValue;
        newQuestions.levels.push(levelsInfo);
        levelsInfo = {
            title: "",
            image: "",
            text: "",
            minValue: ""
        }
    }

    for (let i = 0; i < minValueLevels.length; i++) {
        const element = minValueLevels[i];
        if (element === 0) {
            finishQuizz();
            screenThree.innerHTML = ""
            return;
        }
    }
    alert("Verifique os dados digitados!")
}

function finishQuizz() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', newQuestions)
    promise.then((response) => {
        console.log(response)
        screenThree.classList.add('hide')
        screenFour.classList.remove('hide')

        screenFour.innerHTML = `
            <h1>Seu quizz está pronto!</h1>
            <div class="thumbnail quizz-done">
                <img src="${response.data.image}">
                <h2>${response.data.title}</h2>
            </div>
            <button class="btn" onclick="openQuizz(${response.data.id})">Acessar Quizz</button>
            <button class="btn-comeback" onclick="comeback()">Voltar pra home</button>
        `
        storeMyQuizz(response.data.id)
    })

    promise.catch((er) => {
        console.log(er)
    });
}
function storeMyQuizz(id) {
    createdQuizzes.push(id)
    const createdQuizzesSerial = JSON.stringify(createdQuizzes)
    localStorage.setItem("myQuizzes", createdQuizzesSerial);
}
function getError(er) {
    console.log(er)
}
function openForm(item) {
    const nextElement = item.nextElementSibling;
    const previousElement = item.previousElementSibling;

    if (previousElement !== null) {
        if (!previousElement.classList.contains("hide")) {
            previousElement.classList.add("hide")
        }
    }

    nextElement.classList.toggle("hide")

}