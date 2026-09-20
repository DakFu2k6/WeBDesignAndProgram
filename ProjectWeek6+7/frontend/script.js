const predictionForm = document.getElementById("predictionForm");
const predictionResult = document.getElementById("predictionResult");
const predictedPrice = document.getElementById("predictedPrice");
const predictionDetails = document.getElementById("predictionDetails");
const predictionError = document.getElementById("predictionError");

predictionForm.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        predictionError.textContent = "";
        predictionResult.classList.add("hidden");
        const area =
            Number(document.getElementById("area").value);
        const bedrooms =
            Number(document.getElementById("bedrooms").value);
        const distance =
            Number(document.getElementById("distance").value);
        const location =
            document.getElementById("location").value;
        try {
            const response = await fetch(
                "/predict/house-price",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        area_sqm: area,
                        bedrooms: bedrooms,
                        distance_to_center_km: distance
                    })
                }
            );
            if (!response.ok) {
                const errorData =
                    await response.json();
                throw new Error(
                    errorData.detail
                        ? JSON.stringify(errorData.detail)
                        : `Request failed: ${response.status}`
                );
            }
            const data =
                await response.json();
            const formattedPrice =
                Number(
                    data.predicted_price
                ).toLocaleString("en-US");
            predictedPrice.textContent =
                `${formattedPrice} ${data.currency}`;
            predictionDetails.textContent =
                `${area} m² · ${bedrooms} bedrooms · ${distance} km from center · ${location}`;
            predictionResult.classList.remove(
                "hidden"
            );
        }
        catch (error) {
            predictionError.textContent =
                `Error: ${error.message}`;
        }
    }
);

const itemsTableBody = document.getElementById("itemsTableBody");
const totalItems = document.getElementById("totalItems");
const currentPage = document.getElementById("currentPage");
const itemsError = document.getElementById("itemsError");
const searchInput = document.getElementById("search");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const sortByInput = document.getElementById("sortBy");
const orderInput = document.getElementById("order");
const applyFiltersButton = document.getElementById("applyFilters");
const refreshButton = document.getElementById("refreshItems");
const previousButton = document.getElementById("previousPage");
const nextButton = document.getElementById("nextPage");

let currentSkip = 0;
const pageLimit = 5;
async function loadItems() {
    itemsError.textContent = "";
    const params = new URLSearchParams();
    const search = searchInput.value.trim();
    if (search.length >= 2) {
        params.append("q", search);
    }
    const minPrice = minPriceInput.value;
    if (minPrice !== "") {
        params.append(
            "min_price",
            minPrice
        );
    }
    const maxPrice = maxPriceInput.value;
    if (maxPrice !== "") {
        params.append(
            "max_price",
            maxPrice
        );
    }
    params.append(
        "sort_by",
        sortByInput.value
    );
    params.append(
        "order",
        orderInput.value
    );
    params.append(
        "skip",
        currentSkip
    );
    params.append(
        "limit",
        pageLimit
    );
    try {
        const response = await fetch(`/items?${params.toString()}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.detail ||
                `Request failed: ${response.status}`
            );
        }
        const data = await response.json();
        renderItems(data);
    }
    catch (error) {
        itemsError.textContent =
            `Error: ${error.message}`;
        itemsTableBody.innerHTML = "";
    }
}

function renderItems(data) {
    itemsTableBody.innerHTML = "";
    if (data.items.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="3">
                No items found.
            </td>
        `;
        itemsTableBody.appendChild(row);
    }
    else {
        data.items.forEach(
            function (item) {
                const row =
                    document.createElement("tr");
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>
                        <strong>
                            ${item.name}
                        </strong>
                    </td>
                    <td>
                        ${Number(
                    item.price
                ).toLocaleString("en-US")} VND
                    </td>
                `;
                itemsTableBody.appendChild(row);
            }
        );
    }

    totalItems.textContent = data.total;
    currentPage.textContent =
        Math.floor(
            data.skip / data.limit
        ) + 1;
    previousButton.disabled =
        data.skip === 0;
    nextButton.disabled =
        data.skip + data.limit >= data.total;
}

applyFiltersButton.addEventListener(
    "click",
    function () {
        currentSkip = 0;
        loadItems();
    }
);

refreshButton.addEventListener(
    "click",
    function () {
        currentSkip = 0;
        searchInput.value = "";
        minPriceInput.value = "";
        maxPriceInput.value = "";
        sortByInput.value = "id";
        orderInput.value = "asc";
        loadItems();
    }
);

previousButton.addEventListener(
    "click",
    function () {
        if (currentSkip === 0) {
            return;
        }
        currentSkip =
            Math.max(
                0,
                currentSkip - pageLimit
            );
        loadItems();
    }
);

nextButton.addEventListener(
    "click",
    function () {
        currentSkip += pageLimit;
        loadItems();
    }
);

loadItems();