let age = 20;
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

console.log(Math.PI);
console.log(Math.E);

