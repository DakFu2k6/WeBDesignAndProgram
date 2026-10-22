let age = 17;
let message = age >= 18 ? "You are an adult" : "You are a minor";
console.log(message);
console.log(typeof age);
console.log(`I am ${age} years old`);

let firstName = "DakFu";
console.log(typeof firstName);
console.log(`My name is ${firstName}`);

let online = true;
console.log(typeof online);
console.log(`You are online: ${online}`);

let student = 30;
student++;
console.log(student);

let username;
const pi = 3.14159;
let radius;
let circumference;

document.getElementById("mySubmit").onclick = function () {
        username = document.getElementById("myText").value;
        radius = Number(document.getElementById("myR").value);
        circumference = 2 * pi * radius;
        document.getElementById("myH1").textContent = `Hello ${username}`;
        document.getElementById("myH3").textContent = circumference;
}

const deBtn = document.getElementById("deBtn");
const reBtn = document.getElementById("reBtn");
const inBtn = document.getElementById("inBtn");
const countLabel = document.getElementById("countLabel");

let count = 0;

inBtn.onclick = function () {
        count++;
        countLabel.textContent = count;
}

deBtn.onclick = function () {
        count--;
        countLabel.textContent = count;
}
reBtn.onclick = function () {
        count = 0;
        countLabel.textContent = count;
}
let isStudent = true;
let hasLicense = true;

if (age <= 18 || isStudent) {
        console.log("You are a student ")
}
else {
        console.log("You are a worker")
}

if (age >= 16) {
        console.log("You are old enough to drive");
        if (hasLicense) {
                console.log("You have your license!");
        }
        else {
                console.log("You do not have your license yet!")
        }
}
else {
        console.log("You must be 16+ to have a license");
}

const myAge = document.getElementById("myAge");
const Submit1 = document.getElementById("Submit1");
const resultElement = document.getElementById("resultElement");

let age1;
Submit1.onclick = function () {
        age1 = myAge.value;
        age1 = Number(age1);
        if (age1 >= 100) {
                resultElement.textContent = `You are TOO OLD to enter this site`;
        }
        else if (age1 == 0) {
                resultElement.textContent = `You cannot enter. You were just born`;
        }
        else if (age >= 18) {
                resultElement.textContent = `You are old enough to enter this site`;
        }
        else if (age < 0) {
                resultElement.textContent = `Your age cannot be below 0`;
        }
        else {
                resultElement.textContent = `You must be 18+ to enter this site`;
        }
}

const myCheckBox = document.getElementById("myCheckBox");
const VisaBtn = document.getElementById("VisaBtn");
const MasterBtn = document.getElementById("MasterBtn");
const PayBtn = document.getElementById("PayBtn");
const Submit2 = document.getElementById("Submit2");
const subResult = document.getElementById("subResult");
const payResult = document.getElementById("payResult");

Submit2.onclick = function () {
        if (myCheckBox.checked) {
                subResult.textContent = `You are subscribed!`;
        }
        else {
                subResult.textContent = `You are Not subscribed!`;
        }

        if (VisaBtn.checked) {
                payResult.textContent = `You are paying with Visa`;
        }
        else if (MasterBtn.checked) {
                payResult.textContent = `You are paying with MasterCard`;
        }
        else if (PayBtn.checked) {
                payResult.textContent = `You are paying with Paypal`;
        }
        else {
                payResult.textContent = `You must select a payment type!`;
        }

}

const minNum = 1;
const maxNum = 100;
const answer = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
console.log("Đáp án (để test):", answer);

let attempts = 0;
let myGuess = document.getElementById("myNum");
let Submit3 = document.getElementById("Submit3");
let correctNum = document.getElementById("correctNum");
let running = true;

Submit3.onclick = function () {
        if (!running) return;
        let guess = Number(myGuess.value);
        if (myGuess.value.trim() === "" || isNaN(guess)) {
                correctNum.textContent = `You must select a number!`;
        }
        else if (guess < minNum || guess > maxNum) {
                correctNum.textContent = `The number is between ${minNum} and ${maxNum}!`;
        }
        else {
                attempts++;
                if (guess < answer) {
                        correctNum.textContent = `TOO LOW! TRY AGAIN!`;
                        myGuess.value = "";
                }
                else if (guess > answer) {
                        correctNum.textContent = `TOO HIGH! TRY AGAIN!`;
                        myGuess.value = "";
                }
                else {
                        correctNum.textContent = `CONGRATULATIONS! You guessed it in ${attempts} attempts.`;
                        running = false;
                }
        }
        myGuess.focus();
}