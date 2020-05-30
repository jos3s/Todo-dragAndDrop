const cards = document.querySelectorAll('.card');
const dropzones = document.querySelectorAll('.dropzone');

const form=document.querySelector('form');
form.addEventListener('submit', e=>{
    createElement();
});

const colors=[]


document.addEventListener('click', el=>{
    e=el.target;
    if(e.classList.contains('delete')) deleteCard(e);
});

cards.forEach(card => {
    card.addEventListener('dragstart', dragstart);
    card.addEventListener('drag', drag);
    card.addEventListener('dragend', dragend);
});

function dragstart() {
    dropzones.forEach( dropzone => dropzone.classList.add('highlight'));
    this.classList.add('is-dragging');
}

function drag() {
}

function dragend() {
    dropzones.forEach( dropzone => dropzone.classList.remove('highlight'));
    this.classList.remove('is-dragging');
}

dropzones.forEach( dropzone => {
    dropzone.addEventListener('dragenter', dragenter);
    dropzone.addEventListener('dragover', dragover);
    dropzone.addEventListener('dragleave', dragleave);
    dropzone.addEventListener('drop', drop);
});

function dragenter() {
}

function dragover() {
    this.classList.add('over');
    const cardBeingDragged = document.querySelector('.is-dragging');
    this.appendChild(cardBeingDragged);
}

function dragleave() {
    this.classList.remove('over');
}

function drop() {
    this.classList.remove('over');
}

function deleteCard(e){
    e.parentNode.remove()
}


function createElement() {
    const card=document.querySelector('.board-create');
    const input=card.querySelector('input').value;
    newCard=createCard(input)  
    dropzones[0].appendChild(newCard);
}

function createCard(txt) {
    const card=document.createElement('div');
    card.setAttribute('draggable','true');
    card.setAttribute('class','card');
    const status=document.createElement('div');
    status.setAttribute('class','status');
    const content=document.createElement('div');
    content.setAttribute('class','content');
    const texto=document.createTextNode(txt)
    content.appendChild(texto);
    card.appendChild(status);
    card.appendChild(content);
    return card;
}