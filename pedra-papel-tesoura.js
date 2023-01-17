// Exercício 3
const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
  
const randomNumber = getRndInteger(1, 3)

if(randomNumber === 1){
    if(process.argv[2] === "pedra"){
        console.log("Você escolheu pedra e o computador escolheu pedra. Empate!")
    }else if (process.argv[2] === "papel"){
        console.log("Você escolheu papel e o computador escolheu pedra. Você ganhou!")
    }else if (process.argv[2] === "tesoura"){
        console.log("Você escolheu tesoura e o computador escolheu pedra. Você perdeu!")
    }
}else if(randomNumber === 2){
    if(process.argv[2] === "pedra"){
        console.log("Você escolheu pedra e o computador escolheu papel. Você perdeu!")
    }else if (process.argv[2] === "papel"){
        console.log("Você escolheu papel e o computador escolheu papel. Empate!")
    }else if (process.argv[2] === "tesoura"){
        console.log("Você escolheu tesoura e o computador escolheu papel. Você ganhou!")
    }
}else if(randomNumber === 3){
    if(process.argv[2] === "pedra"){
        console.log("Você escolheu pedra e o computador escolheu tesoura. Você ganhou!")
    }else if (process.argv[2] === "papel"){
        console.log("Você escolheu papel e o computador escolheu tesoura. Você perdeu!")
    }else if (process.argv[2] === "tesoura"){
        console.log("Você escolheu tesoura e o computador escolheu tesoura. Empate!")
    }
}