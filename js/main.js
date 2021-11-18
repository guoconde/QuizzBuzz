const getThumbnails = document.querySelector('.thumbnails')

axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    .then(el => {
        getThumbnails.innerHTML = ''

        for (let i = 0; i < el.data.length; i++) {
            getThumbnails.innerHTML += `
                <div class="thumbnail" onclick="openQuizz(this)">
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
}

function createQuizz() {
    console.log('Quizz Criado')
}