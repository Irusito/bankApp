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
// const labelDate = document.querySelector('.date');
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

// global variables

let currentAccount;
let timer;
let order = 'afterBegin';

// funciones

function updateUI(currentAccount) {
  displayMovements(currentAccount.movements);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
  if (timer) clearInterval(timer);
  timer = setTimer();
}

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((movement, index, movements) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${type}</div>
          <div class="movements__value">${movement}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML(order, html);
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

// Login -

btnLogin.addEventListener('click', function (e) {
  console.log(`me han pulsado`);
  // evita el comportamiento por defecto de un formulario (no carga la misma u otra pagina):
  e.preventDefault();
  // obtener la cuenta que nos interesa
  const user = inputLoginUsername.value;
  const pin = inputLoginPin.value;
  console.log(user, pin);
  currentAccount = accounts.find(acc => acc.username === user);
  // si existe currentAccount y el pin coincide ('?' para comprobar objetos)
  if (currentAccount?.pin === Number(pin)) {
    labelWelcome.textContent = `Bienvenid@ ${
      /* pillo solo el nombre */ currentAccount.owner.split(' ')[0]
    }`;

    // Llamar a las funciones (Actualizar la UI)
    updateUI(currentAccount);
    // mostrar app
    containerApp.style.opacity = 1;
    // vaciar inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    // quitar focus
    inputLoginPin.blur();
  } else console.log(`pin incorrecto o usuario desconocido`);
});

// Transfer

btnTransfer.addEventListener('click', function (e) {
  console.log(`Hacer transferencia`);
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferUsername = inputTransferTo.value;
  // pillar la cuenta del username del input
  const transferAccount = accounts.find(
    acc => acc.username === transferUsername
  );

  // condiciones: amount positivo, usuario existente, balance >= amount, transfer user diferente al current

  if (
    transferAccount &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    transferAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferAccount.movements.push(amount);

    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
  } else {
    console.log('transferencia error');
  }
});

// close

btnClose.addEventListener('click', function (e) {
  console.log(`Hacer close`);
  e.preventDefault();
  const closePin = Number(inputClosePin.value);
  const closeUsername = inputCloseUsername.value;

  if (
    currentAccount.username === closeUsername &&
    currentAccount.pin === closePin
  ) {
    // buscar la cuenta
    const index = accounts.findIndex(acc => acc.username === closeUsername);
    console.log(`cuenta cerrada, cuenta a eliminar:${index}`);
    // eliminarla: slice es inmutable y splice no

    accounts.splice(index, 1);

    // cerrar perfil
    logout(currentAccount);
  } else {
    console.log('close error, credenciales incorrectas');
  }
});

// loan (prestamo)

btnLoan.addEventListener('click', function (e) {
  console.log(`Hacer prestamo`);
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  const validLoan = currentAccount.movements.some(mov => mov > amount * 0.1);
  if (
    amount > 0 &&
    validLoan
    // amount >10% deposits
  ) {
    currentAccount.movements.push(amount);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    console.log('préstamo realizado');
    updateUI(currentAccount);
  } else {
    console.log(
      'loan error, el préstamo debe ser menor al 10% de algún depósito anterior'
    );
  }
});

// sort (ordenar movements)

btnSort.addEventListener('click', function (e) {
  console.log(`Ordenar movimientos`);
  e.preventDefault();

  order = order === 'afterBegin' ? 'beforeEnd' : 'afterBegin';
  updateUI(currentAccount);
});

// logout

function logout() {
  currentAccount = null;
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;

  inputCloseUsername.value =
    inputClosePin.value =
    inputLoanAmount.value =
    inputTransferAmount.value =
    inputLoginPin.value =
    inputLoginUsername.value =
    inputTransferTo.value =
      '';
}
// logout Timer

function setTimer() {
  let time = 301;
  const tick = () => {
    time -= 1;
    const min = Math.trunc(time / 60) // pillar el cociente de una division
      .toString()
      .padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); // pillar el resto de una division y añadirle el 0 delante con padStart(2 longitud, 0 caracter(es) a rellenar)
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      logout(currentAccount);
    }
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
