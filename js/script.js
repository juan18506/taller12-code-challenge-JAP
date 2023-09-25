'use strict'

const TEST_ENDPOINT = 'https://crudcrud.com/api/adc54d7744e946cd8ffc1851accabb6d/juan-alves-pedreira-264-test';
const GROUP_ENDPOINT = 'https://crudcrud.com/api/adc54d7744e946cd8ffc1851accabb6d/grupo264';

let id = null;

const addTest = async ({ name, surname, group, room }) => {
  group = parseInt(group);
  room = parseInt(room);

  if ( !id ) {
    await fetch(GROUP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: name,
        apellido: surname,
        grupo: group,
        sala: room
      }),
    });
  } else {
    await fetch(`${ GROUP_ENDPOINT }/${ id }`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: name,
        apellido: surname,
        grupo: group,
        sala: room
      }),
    });

    id = null;
  }
  
  resetForm();
}

const deleteTests = () => {
  fetch(TEST_ENDPOINT)
    .then(res => res.json())
    .then(data => {
      data.forEach(obj => {
        const { _id } = obj;
        
        fetch(`${TEST_ENDPOINT}/${_id}`, {
          method: 'DELETE'
        });
      });
    });
}

const resetForm = () => {
  const inputs = document.querySelectorAll('.form__input');
  inputs.forEach((input) => input.value = input.defaultValue);
}

const getAndShowData = async () => {
  const res = await fetch(GROUP_ENDPOINT);
  const data = await res.json();


  const list = document.getElementById('list');
  document.querySelectorAll('img').forEach(( button ) => {
    button.removeEventListener('click', handleClick );
  });
  document.querySelectorAll('.section__btn').forEach(( button ) => {
    button.removeEventListener('click', handleClick );
  });
  
  list.innerHTML = '';
  
  for (const item of data) {
    if ( !item.nombre || !item.apellido || !item.grupo || !item.sala ) continue;

    list.innerHTML += `
      <li class="section__li" id="${ item._id }">
        <span>${ item.nombre }</span>
        <span>${ item.apellido }</span>
        grupo: <span>${ item.grupo }</span>
        sala:  <span>${ item.sala }</span>
        <button class="section__btn">Editar</button>
        <img class="section__img" src="assets/basura.svg" alt="tacho de basura">
      </li>
    `;
  }
  
  document.querySelectorAll('.section__img').forEach(( button ) => {
    button.addEventListener('click', handleClick );
  });
  document.querySelectorAll('.section__btn').forEach(( button ) => {
    button.addEventListener('click', handleClick );
  });
}

const handleClick = ({ target }) => {
  const li = target.parentElement;
  
  if( target.matches('.section__img') ) {
    fetch(`${ GROUP_ENDPOINT }/${ li.id }`, {
      method: 'DELETE'
    });
  }

  if( target.matches('.section__btn') ) {
    const formInputs = document.querySelectorAll('.form__input');
    const liInputs = li.querySelectorAll('span');

    formInputs.forEach(( input, i ) => {
      input.value = liInputs[i].innerHTML;
    });

    id = li.id;
  }
}

const handleSubmit= (e) => {
  e.preventDefault();

  const data = Object.fromEntries(
    new FormData(form)
  );
  
  addTest(data);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const resetButton = document.getElementById('reset');

  form.addEventListener('submit', handleSubmit);
  resetButton.addEventListener('click', resetForm);

  setInterval( getAndShowData, 1500 );
})