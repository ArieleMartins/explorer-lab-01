import IMask from 'imask'

import "./css/index.css"

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')

const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')

const ccLog = document.querySelector('.cc-logo span:nth-child(2) img')


function setCardType(type){
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0]) // qual elemento que adicionar ou alterar

  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLog.setAttribute('src', `cc-${type}.svg`)
  
  
}

globalThis.setCardType = setCardType

// input cvc
const securityCode = document.querySelector('#security-code')

// Padrão da mascara
const securityCodePattern = {
  mask : '0000'
}

//inserindo a mascara no input
const securityCodeMasked= IMask(securityCode, securityCodePattern)

// data de expiração
const expirationDate = document.querySelector("#expiration-date")

// Padrão  da Mascara
const expirationDatePattern = {
  mask: 'MM{/}YY',
  blocks:{ // Pega o nome que você colocou na mask
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY:{
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }

  }
}

//inserindo a mascara  no input
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


// -- Expressões Regulares -- \\
// Buscar padrões dentro de textos
// É uma tecnologia que faz buscas de padrões

// Leitura da esquerda para a direita
// Ler um caractere de cada vez, um após o outro
// Conhecer os caracteres reservados da tecnologia - Não pode colocar qualquer caracteres

// const re = /foo/ - dentro das barras é uma expressoes regulares - Procure um f seguido de um o e seguido de outro o
// const re = new RegExp(/foo/) - Outra forma de criar expressoes regulares

// Exemplo
// const matches = 'aBC.match(/[A-Z]/g) - busque no texto inteiro todos os caracteres mauisculos de A até Z
// Output: Array [B, C]

//visa
//inicia com o digito 4 e seguido de mais 15 digitos


//master
// inicia com 5 seguido de um digito entre 1 e 5, seguido de mais 2 digitos
// OU
// inicia com 22 seguido de um digito entre 2 e 9 seguido de mais 1 digios
// OU
// inicia com 2 seugido de um digito entre 3 e 7, seguido de mais 2 digitos seguido de mais 12 digitos

const cardNumber = document.querySelector('#card-number')

const cardNumberPattern = {
  mask:[
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardtype: 'visa'
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: 'mastercard'
    },
    {
      mask: '0000 0000 0000 0000',
      cardtype: 'default'
    },
    
  ],
  dispatch: function (appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g, '')

    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex)
    })

    return foundMask
  }

}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector('#add-card')

addButton.addEventListener('click', () =>{

})

document.querySelector("form").addEventListener('submit', (e)=>{
  e.preventDefault()  
})

const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener("input", (e) =>{

    const ccHolder = document.querySelector('.cc-holder .value')
    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value 
})

securityCodeMasked.on('accept', () =>{
  updateSecurityCode(securityCodeMasked.value)
  
}) // qual é o conteudo do input, capture se ele for aceito - igual ao input

function updateSecurityCode(code){
  const ccSecurity = document.querySelector('.cc-security .value')

  ccSecurity.innerText = code.length === 0 ? '123' : code
}

cardNumberMasked.on('accept', ()=>{
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
  const ccNumber = document.querySelector('.cc-number')

  ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number
}

expirationDateMasked.on('accept', () =>{
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector('.cc-extra .value')
  ccExpiration.innerText = date.length === 0 ? '02/32' : date
}