let currentDictionary = 'words1.json'; // Varsayılan olarak Mahi Sözlük

async function searchWord() {
    const searchBox = document.getElementById('searchBox');
    const query = searchBox.value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    const relatedWordsDiv = document.querySelector('.related-words');
    
    resultDiv.innerHTML = ''; // Clear previous result
    relatedWordsDiv.innerHTML = ''; // Clear previous related words

    if (query === '') {
        resultDiv.innerHTML = '<h3 class="error">Önce bir söz girmeyi denesen?</h3>';
        return;
    }
    
    try {
        const response = await fetch(currentDictionary);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const words = await response.json();
        
        let wordDetails = words[query];
        let displayedQuery = query; // Default to the original query

        // Handle redirection if applicable
        while (wordDetails && wordDetails.redirect) {
            displayedQuery = wordDetails.redirect; // Update displayed query
            const redirectedQuery = wordDetails.redirect;
            wordDetails = words[redirectedQuery];
        }

        if (wordDetails) {
            const relatedWords = wordDetails.related ? wordDetails.related.map(word => `<a href="#" onclick="searchWordByName('${word}')">${word}</a>`).join(', ') : '';
            resultDiv.innerHTML = `
                <div class="word">
                    <h3>${displayedQuery}</h3>
                </div>
                <div class="details">
                    <p>${wordDetails.type}</p>
                </div>
                <p class="description">${wordDetails.description}</p>
            `;
            if (relatedWords) {
                relatedWordsDiv.innerHTML = relatedWords;
            }
        } else {
            resultDiv.innerHTML = '<h3 class="error">Sonuç bulunamadı.</h3>';
        }
    } catch (error) {
        console.error('Error fetching the words:', error);
        resultDiv.innerHTML = '<h3 class="error">Sonuç bulunamadı.</h3>';
    }
}

function searchWordByName(word) {
    document.getElementById('searchBox').value = word;
    searchWord();
}

function switchToDictionary(dictionary) {
    if (dictionary === 'green') {
        currentDictionary = 'words1.json';
        const container = document.querySelector('.container');
        container.classList.remove('orange-theme');
        container.classList.add('green-theme');
    } else if (dictionary === 'orange') {
        currentDictionary = 'words2.json';
        const container = document.querySelector('.container');
        container.classList.remove('green-theme');
        container.classList.add('orange-theme');
    }

    // Clear search box and results
    document.getElementById('searchBox').value = '';
    document.getElementById('result').innerHTML = '';
    document.querySelector('.related-words').innerHTML = '';
}

$(function(){
    $('#searchBox').keypress(function(e){
        var txt = String.fromCharCode(e.which);
        console.log(txt + ' : ' + e.which);
        if(!txt.match(/[a-zA-ZçÇğĞıİöÖşŞüÜ]/) || txt.match(/[jJxXqQwW]/))
        {
            return false;
        }
    });
});
