const dropzones = document.querySelectorAll('.dropzone');
const colors={
    todo: '#42A5F5', progress: '#43A047', done: '#AB47BC', notes: '#FFD54F',
};

document.addEventListener('click', el=>{
    e=el.target;
    if(e.classList.contains('delete')) deleteCard(e);
});

document.addEventListener('submit', el=>{
    el.preventDefault();
    e=el.target;
    let txt=e.querySelector('input').value;
    txt=Array.prototype.every.call(txt,letra => letra==' ');
    if(e.querySelector('input').value.length>0 && !txt){
        createElement(e);
        e.querySelector('input').value='';
    }
});

createCardDrag();
function createCardDrag() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('dragstart', dragstart);
        card.addEventListener('dragend', dragend);
    });
}

function dragstart() {
    dropzones.forEach( dropzone => dropzone.classList.add('highlight'));
    this.classList.add('is-dragging');
}

function dragend() {
    dropzones.forEach( dropzone => dropzone.classList.remove('highlight'));
    this.classList.remove('is-dragging');
}

dropzones.forEach( dropzone => {
    dropzone.addEventListener('dragover', dragover);
    dropzone.addEventListener('dragleave', dragleave);
    dropzone.addEventListener('drop', drop);
});

function dragover() {
    this.classList.add('over');
    const child = recreateCard();
    let target = event.target;
    if(child && target != this) {
        this.insertBefore(child, target)
    } else if(child) {
        this.appendChild(child);
    }
    event.dataTransfer.dropEffect = "move";
    event.preventDefault();
    saveCards();
}

function recreateCard() {
    const card=document.querySelector('.is-dragging');
    const status=card.querySelector(".status");
    const color=card.parentElement.classList[1];
    card.style.borderBottom='3px solid '+ colors[color];
    status.style.background=colors[color];
    return card;
}

function dragleave() {
    this.classList.remove('over');
    saveCards();
}

function drop() {
    this.classList.remove('over');
}

function createElement(form) {
    const board    = form.parentNode.parentNode.parentNode;
    const dropzone = board.querySelector('.dropzone');
    const input    = form.querySelector('input').value;
    if(dropzone.classList.contains("todo"))     newCard=createCard(input,'todo');
    if(dropzone.classList.contains("progress")) newCard=createCard(input,'progress');
    if(dropzone.classList.contains("done"))     newCard=createCard(input,'done');
    if(dropzone.classList.contains("notes"))    newCard=createCard(input,'notes');
    dropzone.appendChild(newCard);
    createCardDrag();
    saveCards();
}

function createCard(txt,type) {
    const card    = createModelCard(type);
    const status  = createStatus(type);
    const content = createContent(txt);
    const button  = createButtonDelete();

    card.appendChild(status);
    card.appendChild(content);
    card.appendChild(button);
    return card;
}

function createModelCard(color) {
    const card=document.createElement('div');
    card.setAttribute('draggable','true');
    card.setAttribute('class','card');
    card.style.borderBottom='3px solid '+ colors[color];
    return card;
}

function createStatus(color) {
    const status=document.createElement('div');
    status.setAttribute('class','status');
    status.style.background=colors[color];
    return status;
}

function createContent(txt) {
    const content=document.createElement('div');
    content.setAttribute('class','content');
    const texto=document.createTextNode(txt)
    content.appendChild(texto);
    return content
}

function createButtonDelete() {
    const button=document.createElement('button');
    button.setAttribute('class','delete');
    button.setAttribute('title','Apagar');
    const texto=document.createTextNode('Apagar')
    button.appendChild(texto);
    return button;
}

function deleteCard(e){
    e.parentNode.remove();
    saveCards();
}

function saveCards() {
    const cardsTodo     = document.querySelectorAll('.todo>.todo>.card');
    const cardsProgress = document.querySelectorAll('.progress>.progress>.card');
    const cardsDone     = document.querySelectorAll('.done>.done>.card');
    const cardsNotes    = document.querySelectorAll('.notes>.notes>.card');
    const listTodo=[]
    const listProgress=[]
    const listDone=[];
    const listNotes=[];
    cardsTodo.forEach(card=>{
        listTodo.push(formatText(card));
    });
    cardsProgress.forEach(card=>{
        listProgress.push(formatText(card));
    });
    cardsDone.forEach(card=>{
        listDone.push(formatText(card));
    });
    cardsNotes.forEach(card=>{
        listNotes.push(formatText(card));
    });
    localStorage.setItem('cardsTodo',formatJSON(listTodo));
    localStorage.setItem('cardsProgress',formatJSON(listProgress));
    localStorage.setItem('cardsDone',formatJSON(listDone));
    localStorage.setItem('cardsNotes',formatJSON(listNotes));
}

function formatText(txt){
    let texto=txt.innerText;
    const apagar=texto.indexOf('Apagar');
    return texto.slice(0,apagar).trim();
}

function formatJSON(array) {
    const json= JSON.stringify(array);
    return json;
}

function restoreFromJSON(item) {
    return localStorage.getItem(item);
}

function restoreCards() {
    const cardsTodo     = JSON.parse(restoreFromJSON('cardsTodo'));
    const cardsProgress = JSON.parse(restoreFromJSON('cardsProgress'));
    const cardsDone     = JSON.parse(restoreFromJSON('cardsDone'));
    const cardsNotes    = JSON.parse(restoreFromJSON('cardsNotes'));

    cardsTodo.forEach(card=>{
        dropzones[0].appendChild(createCard(card,'todo'));
        createCardDrag();
        saveCards();
    });
    cardsProgress.forEach(card=>{
        dropzones[1].appendChild(createCard(card,'progress'));
        createCardDrag();
        saveCards();
    });
    cardsDone.forEach(card=>{
        dropzones[2].appendChild(createCard(card,'done'));
        createCardDrag();
        saveCards();
    });
    cardsNotes.forEach(card=>{
        dropzones[3].appendChild(createCard(card,'notes'));
        createCardDrag();
        saveCards();
    });
}
restoreCards();