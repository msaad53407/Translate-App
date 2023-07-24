//API requests

//Get Request
const getUrl = 'https://text-translator2.p.rapidapi.com/getLanguages';
const getOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'a4910c7f61mshe898b6cf3dfcdc2p1713c5jsn2daf82a89b91',
        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
    }
};

//Post Request
const getTranslatedData = async (baseCode, translateCode, message) => {
    const url = 'https://text-translator2.p.rapidapi.com/translate';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'a4910c7f61mshe898b6cf3dfcdc2p1713c5jsn2daf82a89b91',
            'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        body: new URLSearchParams({
            source_language: `${baseCode}`,
            target_language: `${translateCode}`,
            text: `${message}`
        })
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result)
        translateText.innerHTML = `${await typeWriterEffect(result.data.translatedText)}`
    } catch (error) {
        console.log(error);
    }
}

//  TypeWriter Animation
function typeWriterEffect(text) {
    return new Promise(() => {
        translateText.textContent = "";
        const characters = text.split("");
        let i = 0;
        const intervalId = setInterval(function () {
            if (i < characters.length) {
                translateText.textContent += characters[i];
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, 100);
    })
}

// Getting Language code to place in POST request
const getLanguageCode = async (base, translate) => {
    try {
        const response = await fetch(getUrl, getOptions);
        const result = await response.json();
        const languagesArr = result.data.languages.map((item) => {
            return item.name
        })
        const codeArr = result.data.languages.map((item) => {
            return item.code
        })
        // console.log(await languagesArr);
        for (let i = 0; i < languagesArr.length; i++) {
            if (base === languagesArr[i]) {
                for (let j = 0; j < languagesArr.length; j++) {
                    if (translate === languagesArr[j]) {
                        return [bCode, tCode] = [codeArr[i], codeArr[j]]
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// Using IIFE to display Languages in options
(async () => {
    try {
        const response = await fetch(getUrl, getOptions);
        const result = await response.json();
        const languagesArr = result.data.languages.map((item) => {
            return item.name
        })
        for (let i = 0; i < languagesArr.length; i++) {
            baseLanguage.insertAdjacentHTML('beforeend', `<option value="${languagesArr[i]}">${languagesArr[i]}</option>`)
            translatedLanguage.insertAdjacentHTML('beforeend', `<option value="${languagesArr[i]}">${languagesArr[i]}</option>`)
        }
    } catch (error) {
        console.log(error)
    }
})()

//  Main Logic triggered on pressing Translate Button
document.getElementById('submitBtn').addEventListener('click', async () => {
    translateText.innerHTML = `Translating...`
    const base = baseLanguage.value
    const translate = translatedLanguage.value
    const codes = await getLanguageCode(base, translate)
    const [baseCode, translateCode] = [codes[0], codes[1]]
    const message = document.getElementById('baseText').value
    // console.log(message)
    // console.log(baseCode,translateCode)
    getTranslatedData(baseCode, translateCode, message)
})
