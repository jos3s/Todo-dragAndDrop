const dropzones = document.querySelectorAll('.dropzone');
const colors={
    todo:'#42A5F5',
    progress:'#43A047',
    done:'#AB47BC'

}

const cards=['Do videos!','Forum','Next Level Week'];

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
    const cardBeingDragged = document.querySelector('.is-dragging');
    const status=cardBeingDragged.querySelector(".status");
    const color=cardBeingDragged.parentElement.classList[1];
    status.style.background=colors[color];
    cardBeingDragged.style.borderBottom='3px solid '+ colors[color];
    this.appendChild(cardBeingDragged);
    saveCards();
}

function dragleave() {
    this.classList.remove('over');
    saveCards();
}

function drop() {
    this.classList.remove('over');
}

function createElement(form) {
    const board=form.parentNode.parentNode.parentNode;
    const dropzone=board.querySelector('.dropzone');
    const input=form.querySelector('input').value;
    if(dropzone.classList.contains("todo")) newCard=createCard(input,'todo');
    if(dropzone.classList.contains("progress")) newCard=createCard(input,'progress');
    if(dropzone.classList.contains("done")) newCard=createCard(input,'done');
    dropzone.appendChild(newCard);
    createCardDrag();
    saveCards();
}

function createCard(txt,type) {
    const card=document.createElement('div');
    card.setAttribute('draggable','true');
    card.setAttribute('class','card');
    const status=document.createElement('div');
    status.setAttribute('class','status');
    status.style.background=colors[type];
    card.style.borderBottom='2px solid '+ colors[type];
    card.appendChild(status);
    const content=createContent(txt);
    card.appendChild(content);
    const button=createButtonDelete();
    card.appendChild(button);
    return card;
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
    const cardsTodo=document.querySelectorAll('.todo>.todo>.card');
    const cardsProgress=document.querySelectorAll('.progress>.progress>.card');
    const cardsDone=document.querySelectorAll('.done>.done>.card');
    const listTodo=[]
    const listProgress=[]
    const listDone=[];
    cardsTodo.forEach(card=>{
        listTodo.push(formatText(card));
    });
    cardsProgress.forEach(card=>{
        listProgress.push(formatText(card));
    });
    cardsDone.forEach(card=>{
        listDone.push(formatText(card));
    });
    localStorage.setItem('cardsTodo',formatJSON(listTodo));
    localStorage.setItem('cardsProgress',formatJSON(listProgress));
    localStorage.setItem('cardsDone',formatJSON(listDone));
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

function restoreCards() {
    const todoJSON=localStorage.getItem('cardsTodo');
    const cardsTodo=JSON.parse(todoJSON);
    const progressJSON=localStorage.getItem('cardsProgress');
    const cardsProgress=JSON.parse(progressJSON);
    const doneJSON=localStorage.getItem('cardsDone');
    const cardsDone=JSON.parse(doneJSON);

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
}
restoreCards();