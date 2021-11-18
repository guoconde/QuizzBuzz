const getThumbnails = document.querySelector('.thumbnails')

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
function renderQuiz(response) {
    const data = response.data;
    const mainImage = data.image;
    const title = data.title;

    const showImage = document.querySelector(".picture");
    const Quizz = document.querySelector(".opened-quizz")

    showImage.innerHTML = `
        <p class="title">${title}</p>
        <img src="${mainImage}">
    `
    let answerObject = [];
    for (let i = 0; i < data.questions.length; i++){
        let texto = `
        <div class="content">
            <p class="title" style="background-color: ${data.questions[i].color};">${data.questions[i].title} </p>
            <div class="answers"> `
        for (let j = 0; j < data.questions[i].answers.length; j++){
            const answer = data.questions[i].answers[j];
            answerObject.push (answer);
        }
        answerObject.sort(()=> {
            return Math.random() - 0.5;
        })
        for (let k = 0; k < answerObject.length; k++ ){
            console.log("passei aqyi")
            texto += `
                <div class="option">
                    <img src="${answerObject[k].image}" >
                    <p>${answerObject[k].text}</p>
                 </div>
           `
        }
        texto += `
        </div>
            </div>`
        quizz.innerHTML += texto;
        answerObject = [];
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