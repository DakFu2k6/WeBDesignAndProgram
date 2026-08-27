const form = document.getElementById("houseForm");
const messageContainer = document.getElementById("messageContainer");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    messageContainer.innerHTML = "";
    const locationInput = document.getElementById("location").value.trim();
    const areaInput = document.getElementById("area").value.trim();
    const bedroomsInput = document.getElementById("bedrooms").value.trim();
    const bedroomsNumber = Number(bedroomsInput);
    let errorMessage = "";
    if (!locationInput || !areaInput || !bedroomsInput) {
        errorMessage = "All fields are required and cannot be empty.";
    }
    else if (isNaN(bedroomsNumber) || bedroomsNumber <= 0) {
        errorMessage = "Bedrooms must be a positive number greater than 0.";
    }
    if (errorMessage) {
        const errorEl = document.createElement("p");
        errorEl.className = "error-msg";
        errorEl.textContent = errorMessage;
        messageContainer.appendChild(errorEl);
    } else {
        const successEl = document.createElement("p");
        successEl.className = "success-msg";
        successEl.textContent = "Ready to submit";
        messageContainer.appendChild(successEl);
    }
});
const predictions = [
    { id: 1, name: "Alpha", result: 84.5, confidence: 0.92 },
    { id: 2, name: "Beta", result: 42.0, confidence: 0.65 },
    { id: 3, name: "Gamma", result: 96.2, confidence: 0.98 },
    { id: 4, name: "Delta", result: 73.1, confidence: 0.81 },
    { id: 5, name: "Epsilon", result: 61.4, confidence: 0.74 }
];
const highScores = [];
for (let i = 0; i < predictions.length; i++) {
    if (predictions[i].result > 70) {
        highScores.push(predictions[i]);
    }
}
console.log("Filtered items (result > 70):", highScores);
function sumField(items, fieldName) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        if (typeof items[i][fieldName] === "number") {
            total += items[i][fieldName];
        }
    }
    return total;
}
const totalResultScore = sumField(predictions, "result");
console.log("Total Result Score:", totalResultScore);
function findMaxByField(items, fieldName) {
    if (!items || items.length === 0) return null;
    let maxObj = items[0];
    for (let i = 1; i < items.length; i++) {
        if (items[i][fieldName] > maxObj[fieldName]) {
            maxObj = items[i];
        }
    }
    return maxObj;
}
const topPrediction = findMaxByField(predictions, "result");
console.log("Prediction with highest result:", topPrediction);
const sumFieldArrow = (items, fieldName) =>
    items.reduce((sum, item) => sum + (typeof item[fieldName] === "number" ? item[fieldName] : 0), 0);
console.log("Total (via Arrow Function):", sumFieldArrow(predictions, "result"));