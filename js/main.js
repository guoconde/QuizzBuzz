const getThumbnails = document.querySelector('.thumbnails')
let points = 0;
let numOfQuestions = 0;
let replied = 0;
let levels = [];
let scrollTo = 0;
let responseObject;
let data;
let createdQuizzes = [];
let confirmed = '';


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
    .then(verifyMyQuizzes)
    .catch(getError)

function verifyMyQuizzes(el) {
    let myQuizzes = localStorage.getItem("myQuizzes")
    console.log(myQuizzes)
    if (myQuizzes !== null && myQuizzes !== ""){

        myQuizzes = JSON.parse(myQuizzes);
        createdQuizzes = myQuizzes;
        
        const allQuizzes = []
    
        for (let i = 0; i < createdQuizzes.length; i++) {
            const item = myQuizzes[i].id;
    
            for (let j = 0; j < el.data.length; j++) {
                const element = el.data[j].id;
                if (element === item) {
                    console.log(item)
                    allQuizzes.push(myQuizzes[i])
                }
            }
        }
        
        createdQuizzes = allQuizzes;
    }

    loadQuizzes(el, createdQuizzes);
}

function loadQuizzes(el, myQuizzes) {
    console.log(myQuizzes[0])
    if (myQuizzes[0] !== undefined) {
        document.querySelector(".selected-quizz").classList.add("hide");
        document.querySelector(".your-quizz").classList.remove("hide");
    }

    const yourThumbnail = document.querySelector(".your-quizz .your-thumbnails");
    yourThumbnail.innerHTML = ""
    getThumbnails.innerHTML = ''

    for (let i = 0; i < el.data.length; i++) {
        let control = false;
        if (myQuizzes[0] !== undefined) {
            for (let j = 0; j < myQuizzes.length; j++) {
                let element = myQuizzes[j].id;
                if (el.data[i].id === element) {
                    yourThumbnail.innerHTML += `
                    <div class="thumbnail" onclick="openQuizz(${el.data[i].id})">
                        <nav class = "sidebar"> 
                            <ion-icon name="create-outline" id="edit"></ion-icon>
                            <ion-icon name="trash" id='delete'></ion-icon>
                        </nav>
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
    const createOutline = document.querySelectorAll(".sidebar #edit")
    createOutline.forEach(c => c.addEventListener("click", ev => {
        editQuizz(ev)
        ev.stopPropagation()
    }))

    const trash = document.querySelectorAll(".sidebar #delete")
    trash.forEach(t => t.addEventListener("click", ev => {
        deleteQuizz(ev)
        ev.stopPropagation()
    }))

}

function openQuizz(element) {
    const hideMain = document.querySelector('.main')
    const showQuizz = document.querySelector('.opened-quizz')

    if (hideMain != null) {
        hideMain.classList.add('hide')
    }

    showQuizz.classList.remove('hide')
    const screenFour = document.querySelector(".screen-four");
    if (!screenFour.classList.contains("hide")) {
        screenFour.classList.add("hide")
    }
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${element}`)
        .then(renderQuiz)
        .catch(getError)

    return element
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
        let levelGroup;
        for (let i = 0; i < levels.length; i++) {
            let value = levels[i];

            if (score >= value.minValue) {
                levelGroup = value;
            }
        }
        quizz.innerHTML += `
            <div class="output">
                <p class="title">${score}% de acerto: ${levelGroup.title}</p>
                <div class="info">
                    <img src="${levelGroup.image}" >
                    <p class="text">${levelGroup.text}</p>
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

    const inputScreenOne = document.querySelectorAll('.screen-one .form input')
    inputScreenOne.forEach((i) => i.value = '');

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
    let quizzTitle = document.querySelector('.screen-one .form input:first-child')
    let quizzImage = document.querySelector('.screen-one .form input:nth-child(3)')
    nQuestions = document.querySelector('.screen-one .form input:nth-child(5)')
    nLevel = document.querySelector('.screen-one .form input:nth-child(7)')

    const allInputs = document.querySelectorAll(".screen-one input")
    allInputs.forEach(a => {
        a.setAttribute("style", "background-color:#FFFFF;")
        a.nextElementSibling.innerHTML = ""
    })

    const isValid = isValidHttpUrl(quizzImage.value);
    let control = true;

    if (quizzTitle.value.length < 20 || quizzTitle.value.length > 65) {
        quizzTitle.nextElementSibling.innerHTML = "O título deve ter entre 20 e 65 caracteres";
        quizzTitle.setAttribute("style", "background-color:#FFE9E9;")
        control = false
    }
    if (isValid === false) {
        quizzImage.nextElementSibling.innerHTML = "A URL não é válida";
        quizzImage.setAttribute("style", "background-color:#FFE9E9;")
        control = false
    }
    if (nQuestions.value < 3) {
        nQuestions.nextElementSibling.innerHTML = "O quizz deve ter pelo menos 3 perguntas";
        nQuestions.setAttribute("style", "background-color:#FFE9E9;")
        control = false
    }
    if (nLevel.value < 2) {
        nLevel.nextElementSibling.innerHTML = "O quizz deve ter pelo menos 2 níveis";
        nLevel.setAttribute("style", "background-color:#FFE9E9;")
        control = false
    }
    if (control === true) {
        newQuestions.title = quizzTitle.value;
        newQuestions.image = quizzImage.value;
        createAnswers()
    }

    return;
}
function createAnswers() {
    screenOne.classList.add('hide')
    screenTwo.classList.remove('hide')


    for (let i = 1; i <= nQuestions.value; i++) {
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
                    <p class = 'error title'> </p>
                    <input class='mandatory color' type="text" placeholder="Cor de fundo da pergunta">
                    <p class = 'error color'> </p>
                    <br>
                    <h1>Resposta correta</h1>
                    <input class='mandatory correct-answer ' type="text" placeholder="Resposta correta">
                    <p class = 'error correct-answer'> </p>
                    <input class='mandatory url-correct-answer' type="text" placeholder="URL da imagem">
                    <p class = 'error image-correct'> </p>
                    <br>
                    <h1>Respostas incorretas</h1>
                    <input class='mandatory wrong-answer' type="text" placeholder="Resposta incorreta 1">
                    <p class = 'error wrong-answer'> </p>
                    <input class='mandatory url-wrong-answer' type="text" placeholder="URL da imagem 1">
                    <p class = 'error image-wrong'> </p>
                    <br>
                    <input class='no-mandatory wrong-answer' type="text" placeholder="Resposta incorreta 2">
                    <p class = 'error wrong-answer'> </p>
                    <input class='no-mandatory url-wrong-answer' type="text" placeholder="URL da imagem 2">
                    <p class = 'error image-wrong'> </p>
                    <br>
                    <input class='no-mandatory wrong-answer' type="text" placeholder="Resposta incorreta 3">
                    <p class = 'error wrong-answer'> </p>
                    <input class='no-mandatory url-wrong-answer' type="text" placeholder="URL da imagem 3">
                    <p class = 'error image-wrong'> </p>
                </div>
            </div>`
    }

    screenTwo.innerHTML += `<button class="btn" onclick="verificationQuestions ()">Prosseguir para criar níveis</button>`
}
function verificationQuestions() {
    const item = document.querySelectorAll('.screen-two .form-Field');
    const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/

    const allInputs = document.querySelectorAll(".screen-two input")
    allInputs.forEach((item) => {
        item.setAttribute("style", "background-color:#FFFFF;")
        item.nextElementSibling.innerHTML = ""
    })
    let control = true;
    for (let i = 0; i < item.length; i++) {
        let currentItem = item[i];

        let inputTitle = currentItem.querySelector(".form .mandatory.title");
        let inputColor = currentItem.querySelector(".form .mandatory.color");
        let inputCorrectAnswer = currentItem.querySelector(".form .mandatory.correct-answer");
        let inputImageCa = currentItem.querySelector(".form .mandatory.url-correct-answer");
        let inputWrongAnswer = currentItem.querySelector(".form .mandatory.wrong-answer");
        let inputImageWa = currentItem.querySelector(".form .mandatory.url-wrong-answer");

        let isValidca = isValidHttpUrl(inputImageCa.value);
        let isvalidwa = isValidHttpUrl(inputImageWa.value);

        if (inputTitle.value.length < 20) {
            inputTitle.nextElementSibling.innerHTML = "O título deve ter no mínimo 20 caracteres"
            inputTitle.setAttribute("style", "background-color:#FFE9E9;")
            control = false;
        }
        if (inputCorrectAnswer.value === "") {
            inputCorrectAnswer.nextElementSibling.innerHTML = 'A resposta não pode estar vazia.'
            inputCorrectAnswer.setAttribute("style", "background-color:#FFE9E9;")
            control = false;
        }
        if (inputWrongAnswer.value === "") {
            inputWrongAnswer.nextElementSibling.innerHTML = 'A resposta não pode estar vazia.'
            inputWrongAnswer.setAttribute("style", "background-color:#FFE9E9;")
            control = false;
        }
        if (!regex.test(inputColor.value)) {
            inputColor.nextElementSibling.innerHTML = "A cor deve ter formato hexadecimal #000000"
            inputColor.setAttribute("style", "background-color:#FFE9E9;")
            control = false;
        }
        if (isValidca === false) {
            inputImageCa.nextElementSibling.innerHTML = "A URL não é válida"
            inputImageCa.setAttribute("style", "background-color:#FFE9E9;")
            control = false;
        }
        if (isvalidwa === false) {
            inputImageWa.nextElementSibling.innerHTML = "A URL não é válida"
            inputImageWa.setAttribute("style", "background-color:#FFE9E9;")
            control = false;
        }
        for (let j = 0; j < 2; j++) {
            let noMandatoryAnswer = currentItem.querySelectorAll(".form .no-mandatory.wrong-answer");
            let noMandatoryUrl = currentItem.querySelectorAll(".no-mandatory.url-wrong-answer");

            let itemAnswer = noMandatoryAnswer[j];
            let itemUrl = noMandatoryUrl[j];
            if (itemAnswer.value !== "" || itemUrl.value !== "") {
                let isvalidUrl = isValidHttpUrl(itemUrl.value);

                if (isvalidUrl === false) {
                    itemUrl.nextElementSibling.innerHTML = "A URL é inválida"
                    itemUrl.setAttribute("style", "background-color: #FFE9E9")
                    control = false;
                }
            }
        }
    }
    if (control === false) {
        return;
    }

    item.forEach((element) => {

        let inputTitle = element.querySelector(".form .mandatory.title");
        let inputColor = element.querySelector(".form .mandatory.color");
        let inputCorrectAnswer = element.querySelector(".form .mandatory.correct-answer");
        let inputImageCa = element.querySelector(".form .mandatory.url-correct-answer");
        let inputWrongAnswer = element.querySelector(".form .mandatory.wrong-answer");
        let inputImageWa = element.querySelector(".form .mandatory.url-wrong-answer");

        questionsInfo.title = inputTitle.value;
        questionsInfo.color = inputColor.value;

        answersInfo.text = inputCorrectAnswer.value;
        answersInfo.image = inputImageCa.value;
        answersInfo.isCorrectAnswer = true;
        questionsInfo.answers.push(answersInfo);

        answersInfo = {
            text: "",
            image: "",
            isCorrectAnswer: ""
        }

        answersInfo.text = inputWrongAnswer.value;
        answersInfo.image = inputImageWa.value;
        answersInfo.isCorrectAnswer = false;
        questionsInfo.answers.push(answersInfo);

        newQuestions.questions.push(questionsInfo);
        answersInfo = {
            text: "",
            image: "",
            isCorrectAnswer: ""
        }
        for (let j = 0; j < 2; j++) {
            let noMandatoryAnswer = element.querySelectorAll(".form .no-mandatory.wrong-answer");
            let noMandatoryUrl = element.querySelectorAll(".no-mandatory.url-wrong-answer");

            let itemAnswer = noMandatoryAnswer[j].value;
            let itemUrl = noMandatoryUrl[j].value;
            if (itemAnswer !== "" || itemUrl !== "") {
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
    })

    createLevel()
    screenTwo.innerHTML = ""
}

function createLevel() {
    window.scroll(0, 0)
    screenTwo.classList.add('hide')
    screenThree.classList.remove('hide')

    for (let i = 1; i <= nLevel.value; i++) {
        screenThree.innerHTML += `
            <div class="minimized" onclick = "openForm(this)">
                <h1>Nível ${i}</h1>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class = "form-Field hide">
                <div class="form hide">
                    <h1>Nível ${i}</h1>
                    <input class= "title" type="text" placeholder="Título do nível">
                    <p class ='error title'> </p>
                    <input class = "min-value" type="number" placeholder="% de acerto mínima">
                    <p class ='error min-value'> </p>
                    <input class = "url-image" type="text" placeholder="URL da imagem do nível">
                    <p class ='error image'> </p>
                    <input class = "description" type="text" placeholder="Descrição do nível">
                    <p class ='error description'> </p>
                </div>
            </div>
        `
    }

    screenThree.innerHTML += `<button class="btn" onclick="VerificationLevels()">Finalizar Quizz</button>`
}

function VerificationLevels() {
    const item = document.querySelectorAll('.screen-three .form-Field');
    const minValueLevels = []
    const allInputs = document.querySelectorAll(".screen-three input")
    allInputs.forEach((item) => {
        item.setAttribute("style", "background-color:#FFFFF;")
        item.nextElementSibling.innerHTML = ""
    })
    let control = true;
    item.forEach((element) => {
        let title = element.querySelector(".form .title");
        let inputMinValue = element.querySelector(".form .min-value")
        let minValue = inputMinValue.value;
        let urlImage = element.querySelector(".form .url-image")
        let description = element.querySelector(".form .description");

        let isValid = isValidHttpUrl(urlImage.value);

        if (title.value.length < 10) {
            title.nextElementSibling.innerHTML = "O título deve ter no mínimo 10 caracteres"
            title.setAttribute("style", "background-color: #FFE9E9")
            control = false;
        }
        if (isValid === false) {
            urlImage.nextElementSibling.innerHTML = "A URL não é válida"
            urlImage.setAttribute("style", "background-color: #FFE9E9")
            control = false;
        }
        if (description.value.length < 30) {
            description.nextElementSibling.innerHTML = "A descrição deve ter no mínimo 30 caracteres"
            description.setAttribute("style", "background-color:#FFE9E9")
            control = false;
        }

        if (minValue == NaN || minValue > 100 || minValue < 0 || minValue === "") {
            inputMinValue.nextElementSibling.innerHTML = "Digite um número entre 0 e 100"
            inputMinValue.setAttribute("style", "background-color:#FFE9E9");
            control = false;
        }
    })
    if (control === false) {
        return;
    }

    item.forEach((element) => {
        let title = element.querySelector(".form .title");
        let inputMinValue = element.querySelector(".form .min-value");
        let minValue = parseInt(inputMinValue.value);
        let urlImage = element.querySelector(".form .url-image")
        let description = element.querySelector(".form .description");
        minValueLevels.push(minValue);

        levelsInfo.title = title.value;
        levelsInfo.image = urlImage.value;
        levelsInfo.text = description.value;
        levelsInfo.minValue = minValue;
        newQuestions.levels.push(levelsInfo);
        levelsInfo = {
            title: "",
            image: "",
            text: "",
            minValue: ""
        }

    })

    for (let i = 0; i < minValueLevels.length; i++) {
        const element = minValueLevels[i];
        if (element === 0) {
            finishQuizz();
            screenThree.innerHTML = ""
            return;
        }
    }
    alert("Deve existir um nível com minValue = 0 !")
}

function finishQuizz() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', newQuestions)
    promise.then((response) => {
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
        storeMyQuizz(response.data)
    })

    promise.catch((er) => {
        alert("Algo não funcionou :( Tente novamente!")
    });
}
function storeMyQuizz(data) {
    createdQuizzes.push(data)
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
function deleteQuizz(ev) {
    console.log('ta no delete')
    console.dir(parseInt(ev.target.parentNode.parentNode.attributes[1].value.replace('openQuizz(', '').replace(')', '')))
    console.log(createdQuizzes[0].id)
    console.log(createdQuizzes[0].key)

    // axios.delete(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${createdQuizzes[0].id}`, { headers: { 'Secret-Key': createdQuizzes[0].key } })
    //     .then(() => {
    //         createdQuizzes.pop()
    //         const deleteQuizzesSerial = JSON.stringify(createdQuizzes)
    //         localStorage.setItem("myQuizzes", deleteQuizzesSerial);
    //         console.log('antes da funcao')



    //     })
    // const trash = document.querySelector(".sidebar #delete")
    // trash.addEventListener("click", ev => {
    //     console.log(ev.parentNode)
    //     console.log('to aqui')
    // })
}

function teste(ev) {

    console.log(createdQuizzes[0].id)


    if (createdQuizzes.length <= 0) {
        // console.log('entrou no if')
        // localStorage.removeItem("myQuizzes")
        // document.querySelector(".selected-quizz").classList.remove("hide");
        // document.querySelector(".your-quizz").classList.add("hide");


    }
}
function editQuizz(ev) {
    const ObjectId = parseInt(ev.target.parentNode.parentNode.attributes[1].value.replace('openQuizz(', '').replace(')', ''))
    console.log(ObjectId)
    console.log(createdQuizzes)
}