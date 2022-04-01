'use strict';

/// //////////////////////////////////////////////
/// //////////////////////////////////////////////
// BANKIST APP
const cargasPagina = window.localStorage.getItem('cargasPagina') || 0;
window.localStorage.setItem('cargasPagina', Number(cargasPagina) + 1);
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const { movements } = account1;
console.log(movements);

// // son lo mismo:

// for (const [key, value] of movements.entries()) {
//   console.log(key + 1, value);
// }

// for (let index = 0; index < movements.length; index++) {
//   console.log(index + 1, movements[index]);
// }

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((movement, index, movements) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${movement}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// la suma de los movements
// decalarada como propiedad del objeto (para usarla mas tarde)
function displayBalance(account) {
  account.balance = account.movements.reduce(
    (acc, curVal, i, array) => acc + curVal,
    0
  );
  labelBalance.textContent = `${account.balance}€`;
}

function displaySummary(account) {
  // destructuring (pasar las propiedades del objeto account a variables)
  const { movements, interestRate } = account;
  // la suma de los movements positivos

  const sumIn = movements
    .filter(mov => mov > 0)
    .reduce((acc, curVal, i, array) => acc + curVal, 0);
  labelSumIn.textContent = `${sumIn}€`;

  // la suma de los movements negativos

  const sumOut = movements
    .filter(mov => mov < 0)
    .reduce((acc, curVal, i, array) => acc + curVal, 0);
  labelSumOut.textContent = `${sumOut}€`;

  // version simplificada: por cada deposito calcular su interes (segun date del account) y por un año
  // independiente de retiradas de dinero

  const interests = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    // si el interes es mayor a 1 (por cada deposito) se tiene en cuenta, si no no
    .filter(interest => interest > 1)
    .reduce((acc, curVal, i, array) => acc + curVal, 0);

  labelSumInterest.textContent = `${interests}€`;
}

btnLogin.addEventListener('click', function (e) {
  console.log(`me han pulsado`);
  // evita el comportamiento por defecto de un formulario (no carga la misma u otra pagina):
  e.preventDefault();
  // obtener la cuenta que nos interesa
  const user = inputLoginUsername.value;
  const pin = inputLoginPin.value;
  console.log(user, pin);
  const currentAccount = accounts.find(acc => acc.username === user);
  // si existe currentAccount y el pin coincide ('?' para comprobar objetos)
  if (currentAccount?.pin === Number(pin)) {
    labelWelcome.textContent = `Bienvenid@ ${
      /* pillo solo el nombre */ currentAccount.owner.split(' ')[0]
    }`;

    // Llamar a las funciones
    displayMovements(currentAccount.movements);
    displayBalance(currentAccount);
    displaySummary(currentAccount);

    // mostrar app
    containerApp.style.opacity = 1;
    // vaciar inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    // quitar focus
    inputLoginPin.blur();
  } else console.log(`pin incorrecto o usuario desconocido`);
});

// ------------------------------------------------------------------------------

// ----------------------------------------- pruebas

// inmutabilidad -> los métodos son inmutables o mutables
//               -> las variables son inmutables o mutables
// inmutable > mutable
console.log(`parte 1:`);
// funciones dentro de metodos
// sort es mutable (modifica el array original)

const edades = [3, 9, 2, 10, 8, 4];

// // funcion normal
// function functionOrdenar (a,b){
// return a - b;
// }

// en flecha
const functionOrdenar = (a, b) => a - b;

// const edadesOrdenadas = edades.sort(functionOrdenar)

const edadesOrdenadas = edades.sort(functionOrdenar).sort((a, b) => b - a);

console.log(edades);
console.log(edadesOrdenadas);

// hacer inmutabilidad de un objeto:

const estudiante = { nombre: 'Juan', edad: 18 };

// const changeEstudiante = (estudiante, nuevosCampos) =>
// {
//   return {...estudiante, ...nuevosCampos}
// }

// arrow function de retornar un objeto hara que tome los {} como los {} de la funcion en vez del objeto
// hay que ponerlo entre parentesis: ({})
const changeEstudiante = (estudiante, nuevosCampos) => ({
  ...estudiante,
  ...nuevosCampos,
});

const estudiante2 = changeEstudiante(estudiante, { nombre: 'Miguel' });

console.log(estudiante);
console.log(estudiante2);

// 'slice' es un metodo inmutable, 'splice' es un metodo mutable

const letras = ['a', 'b', 'c', 'd', 'e'];
console.log(letras.slice(2)); // recortar
console.log(letras.slice(2, 4)); // recortar una seccion
console.log(letras.slice(-1)); // empieza por el final

// let copyletras = [...letras]

const copyletras = letras.splice(2);
console.log(letras);
console.log(copyletras);

// MAP, FILTER, REDUCE
console.log(`parte 2:`);

// map: coge un array y por cada elemento hace algo con el y retorna un array, (el return y las {} se omiten al ser una sola linea)

const doubles = [1, 2, 5].map(elemento => elemento * 2);
console.log(doubles);

// es lo mismo: (no retorna por defecto) (forma sin map, forof)
const dobles2 = [];
for (const elemento of [1, 2, 5]) dobles2.push(elemento * 2);
console.log(doubles);

// funcion que recibe movimientos y los devuelve en otra moneda

const euroToUSD = 1.09;

const movementsUSD = movements.map(movement => movement * euroToUSD);
console.log(movementsUSD);
console.log(movements);

// (forma sin map, foreach)
const movementsUDS2 = [];
movements.forEach(movement => movementsUDS2.push(movement * euroToUSD));
console.log(movementsUDS2);

// uso del Map con varias funciones Y del Filter

const movementsUSDdoubles = movements
  .filter(movement => movement > 0)
  // solo afectara a los elementos del array que cumplan el filtro
  .map(movement => movement * euroToUSD)
  .map(movement => movement * 2)
  .map(movement => '$' + movement.toFixed(2));
console.log(movementsUSDdoubles);

// ver que pasa en medio de un listado de funciones map

// const movementsUSDdoubles2 = movements
//   .filter(movement => movement > 0)
//   .map(movement => movement * euroToUSD)
//   .map(movement, indice, array => {
//     console.log(array);
//     return movement * 2;
//   })
//   .map(movement => '$' + movement.toFixed(2));

//  funcion que inserta un campo nuevo en los accounts, llamado username que tenga las iniciales

// .split() divide un string en un array formado por cada palabra (separada por  lo que indiques en () en este caso espacio)
const createUsername = function (accounts) {
  // foreach para que afecte a las accounts ya creadas
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      // pillar la primera letra de cada palabra
      .map(palabra => palabra[0])
      .join('');
  });
};

createUsername(accounts);
console.log(accounts);

// resultado querido:

// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
//   username: 'js'
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
//   username: 'jd'
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
//   username: 'st'
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
//   username: 'ss'
// };

// sin programacion funcional

const deposits = movements.filter(mov => mov > 0);
console.log(deposits);

let totalDeposits = 0;
deposits.forEach(elemento => (totalDeposits += elemento));
console.log(`${totalDeposits}€`);

// con programacion funcional y reduce ( hace un acumulativo de un array (valor acumulativo + valor actual, valor inicial)) es lo mismo que arriba
// array es el array resultado del filter y la i el index

const totalDeposit = movements
  .filter(mov => mov > 0)
  .reduce((acc, curVal, i, array) => acc + curVal, 0);
console.log(`${totalDeposit}€`);

// sacar el mayor deposito

const mostDeposit = movements.reduce(
  (acc, curVal) => (curVal > acc ? curVal : acc),
  Number.NEGATIVE_INFINITY
);
console.log(`Depósito máximo: ${mostDeposit}€`);

// con spread
const mostDeposit2 = Math.max(...movements);
console.log(`Depósito máximo: ${mostDeposit2}€`);

// ------------------  resultado: (min: -10, max:30)

const arrayNumeros = [2, 6, -10, 30, 4, 12];

// por separado

const max = arrayNumeros.reduce(
  (acc, curVal) => (curVal > acc ? curVal : acc),
  Number.NEGATIVE_INFINITY
);

const min = arrayNumeros.reduce(
  (acc, curVal) => (curVal < acc ? curVal : acc),
  Number.POSITIVE_INFINITY
);
console.log(`mínimo: ${min}€ | máximo: ${max}€`);

// junto (sin reduce)

const minMaxNumeros = {
  min: Math.min(...arrayNumeros),
  max: Math.max(...arrayNumeros),
};
console.log(minMaxNumeros);

// junto (con reduce)

const minMax = arrayNumeros.reduce(
  (acc, curVal) => {
    return {
      min: Math.min(acc.min, curVal),
      max: Math.max(acc.max, curVal),
    };
  },
  {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
  }
);

console.log(minMax);

// ----------- find (localiza un elemento en la lista y cuando lo tiene detiene su busqueda y devuelve el elemento)
// find devuelve un elemento y filter un array

const boletos = [2, 4, 5, 6, 7, 8, 9];

const boletoPremiado = 7;

const resultadoFind = boletos.find(boleto => boleto === boletoPremiado);
console.log(resultadoFind);

// va a mostrar la primera retirada que encuentre en movements (una vez encuentre una retirada se detendra la busqueda)
const firstWithdrawal = account1.movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const currentAccount = accounts.find(
  account => account.owner === 'Jessica Davis'
);
console.log(currentAccount);
