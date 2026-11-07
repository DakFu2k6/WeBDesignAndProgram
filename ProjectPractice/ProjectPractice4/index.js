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

function happyBirthday() {
        console.log("Happy birthday to you!")
        console.log(`Happy birthday dear ${username}`)
}

happyBirthday();

function add(x, y) {
        return x + y;
}

function subtract(x, y) {
        return x - y;
}

function multiply(x, y) {
        return x * y
}

function divide(x, y) {
        return x / y;
}

function isEven(x) {
        return x % 2 === 0 ? true : false;
}

function isEmail(email) {
        return email.includes("@") ? true : false;
}

console.log(isEven(2));
console.log(isEmail("Duoc@gami.com"));
console.log(isEmail("Duocgmail.com"));

const textTemp = document.getElementById("textTemp");
const toFa = document.getElementById("toFa");
const toCe = document.getElementById("toCe");
const coResult = document.getElementById("coResult");
let temp;

function convert() {
        if (toFa.checked) {
                temp = Number(textTemp.value);
                temp = temp * 9 / 5 + 32;
                coResult.textContent = temp.toFixed(1) + "°F";
        }
        else if (toCe.checked) {
                temp = Number(textTemp.value);
                temp = (temp - 32) * (5 / 9);
                coResult.textContent = temp.toFixed(1) + "°F"
        }
        else {
                coResult.textContent = "Select a unit";
        }
}

const person1 = {
        fName: "Nguyen",
        lName: "Duoc",
        mage: 30,
        isEmployed: true,
        sayHello: function () { console.log("Hi! I am Duoc") }
}

const person2 = {
        fName: "Duong",
        lName: "Duoc1",
        mage: 20,
        isEmployed: false,
        sayHello: function () { console.log("Hi! I am Duoc1") }
}

person1.sayHello();
person2.sayHello();

function Car(make, model, year, color) {
        this.make = make, this.model = model, this.year = year, this.color = color
}

const car1 = new Car("Ford", "Mustang", 2024, "red");
console.log(car1.make);
console.log(car1.model);
console.log(car1.color);
console.log(car1.year);

class Product {
        constructor(name, price) {
                this.name = name;
                this.price = price;
        }
        displayProduct() {
                console.log(`Product: ${this.name}`);
                console.log(`Price: ${this.price.toFixed(2)}`);
        }
        calculateTotal(saleTax) {
                return this.price + (this.price * saleTax);
        }
}
const saleTax = 0.05;
const product1 = new Product("Shirt", 19.99);
product1.displayProduct();
const total = product1.calculateTotal(saleTax);
console.log(`Total price (with tax): ${total.toFixed(2)}`);

class MathUtil {
        static PI = 3.14159;

        static getDiameter(radius) {
                return 2 * radius;
        }

        static getCir(radius) {
                return 2 * this.PI * radius;
        }
}

console.log(MathUtil.PI);
console.log(MathUtil.getDiameter(5));
console.log(MathUtil.getCir(5));

class User {
        static userCount = 0;
        constructor(username) {
                this.username = username;
                User.userCount++;
        }
        static getUserCount() {
                return console.log(`Total users: ${User.userCount}`);
        }
        sayHello() {
                console.log(`Hello, my name is ${this.username}`);
        }
}

const user1 = new User("DakFu");
const user2 = new User("Duoc");
user1.sayHello();
user2.sayHello();
User.getUserCount();

class Animal {
        alive = true;
        eat() {
                console.log(`This ${this.name} is eating`);
        }
        sleep() {
                console.log(`This ${this.name} is sleeping`);
        }
}

class Rabbit extends Animal {
        name = "Rabbit";
        run() {
                console.log(`This ${this.name} is running`);
        }
}

class Fish extends Animal {
        name = "Fish";
        swim() {
                console.log(`This ${this.name} is swimming`);
        }
}

class Hawk extends Animal {
        name = "Hawk";
        fly() {
                console.log(`This ${this.name} is flying`);
        }
}

const rabbit = new Rabbit();
const fish = new Fish();
const hawk = new Hawk();

console.log(rabbit.alive);
rabbit.eat();
rabbit.sleep();
rabbit.run();
fish.swim();
hawk.fly();

class Animal1 {
        constructor(name, age) {
                this.name = name;
                this.age = age;
        }
}

class Dog extends Animal1 {
        constructor(name, age, run) {
                super(name, age);
                this.run = run;
        }
}
class Cat extends Animal1 {
        constructor(name, age, jump) {
                super(name, age);
                this.jump = jump;
        }
}

const dog = new Dog("Dog", 3, true);
const cat = new Cat("Cat", 2, true);
console.log(dog.name);
console.log(dog.age);
console.log(dog.run);
console.log(cat.name);
console.log(cat.age);
console.log(cat.jump);


class Rectangle {
        constructor(width, height) {
                this.width = width;
                this.height = height;
        }

        set width(newWidth) {
                if (newWidth > 0) {
                        this._width = newWidth;
                }
                else {
                        console.log("Width must be greater than 0");
                }
        }

        set height(newHeight) {
                if (newHeight > 0) {
                        this._height = newHeight;
                }
                else {
                        console.log("Height must be greater than 0");
                }
        }

        get width() {
                return this._width.toFixed(2);
        }

        get height() {
                return this._height.toFixed(2);
        }

        get area() {
                return (this._width * this._height).toFixed(2);
        }
}
const rectangle = new Rectangle(3, 5);
console.log(rectangle.width);
console.log(rectangle.height);
console.log(rectangle.area);

class Person {
        constructor(firstName, lastName, age) {
                this.firstName = firstName;
                this.lastName = lastName;
                this.age = age;
        }

        set firstName(newFirstName) {
                if (typeof newFirstName === "string" && newFirstName.trim() !== "") {
                        this._firstName = newFirstName;
                }
                else {
                        console.log("First name must be a non-empty string");
                }
        }

        set lastName(newLastName) {
                if (typeof newLastName === "string" && newLastName.trim() !== "") {
                        this._lastName = newLastName;
                }
                else {
                        console.log("Last name must be a non-empty string");
                }
        }

        set age(newAge) {
                if (typeof newAge === "number" && newAge >= 0) {
                        this._age = newAge;
                }
                else {
                        console.log("Age must be a non-negative number");
                }
        }

        get firstName() {
                return this._firstName;
        }

        get lastName() {
                return this._lastName;
        }

        get age() {
                return this._age;
        }

        get fullName() {
                return `${this._firstName} ${this._lastName}`;
        }
}


const person = new Person("Nguyen", "Duoc", 30);
console.log(person.firstName);
console.log(person.lastName);
console.log(person.age);
console.log(person.fullName);
