function preRender(){
    let countVisibleCards = getCountVisibleCards();
    updateResults(countVisibleCards);
}

function getCountVisibleCards(){
    return Array.from(document.getElementsByClassName("card")).filter((card) => !card.getElementsByClassName.display || card.getElementsByClassName.display !=="none").length;
}

function updateResults(count) {
    document.getElementById("count_result").textContent = count;
}

function filter() {
    let {search, operation, languages} = getFilterProperties();
    let interval = setInterval((_) => {
        let[containerElement] = document.getElementsByClassName("container");
        let changedText = search !== getSearchValue();
        if(!changedText) clearInterval(interval);
        if(containerElement && containerElement.children && !changedText) {
            let visibleCards = updateVisibleCards(containerElement,search,operation, languages);
            updateResults(visibleCards);
        }
    }, 800);
}

function getFilterProperties() {
    let search = getSearchValue();
    let[radio] = getSelectedRadio();
    let operation = radio.id == "1" ? "AND" : "OR";
    let languages = Array.from(getSelectedLanguages()).map((lang) => lang.name);
    return {
        search,
        operation,
        languages,
    }
}

function getSearchValue(){
    let inputSearchElement = document.getElementById("nameSearch");
    return inputSearchElement.value;
}

function getSelectedRadio(){
    return Array.from(document.querySelectorAll('header input[type="radio"]:checked'));
}

function getSelectedLanguages(){
    return Array.from(document.querySelectorAll('header input[type="checkbox"]:checked'));
}

function updateVisibleCards(containerElement, search, operation, selectedLanguages){
    let visibleCards = 0;
    Array.from(containerElement.children).forEach((cardElement) => {
        let [titleElement] = cardElement.getElementsByClassName("card-title");
        let cardLanguages = Array.from(cardElement.getElementsByClassName("iconLanguage")).map((image) => image.name);
        if(titleElement) {
            let isMatchName = isMatchByName(titleElement.textContent, search);
            if(!isMatchName && operation == "AND"){
                hideCard(cardElement);
            } else if(isMatchName && operation == "OR") {
                showCard(cardElement);
                visibleCards++;
            } else if(isMatchName && operation == "AND"){
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage) {
                    showCard(cardElement);
                    visibleCards++;
                } else{
                    hideCard(cardElement);
                }
            } else if (!isMatchName && operation == "OR") {
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage){
                    showCard(cardElement);
                    visibleCards++;
                } else {
                    hideCard(cardElement);
                }
            }
        }
    });
    return visibleCards;
}

function isMatchByName(textCard, textInput) {
    return textCard.toLowerCase().includes(textInput.toLowerCase());
}

function isMatchByLanguage(cardLanguages, selectedLanguages){
    return cardLanguages.some(cardLang => selectedLanguages.includes(cardLang));
}

function hideCard(card) {
    card.style.display = "none";
};

function showCard(card) {
    card.style.display = "flex";
}
