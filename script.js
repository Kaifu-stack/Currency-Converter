const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const dropdowns = document.querySelectorAll(".dropdown select");
const amountInput = document.querySelector(".amount input");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".fa-right-left");
const button = document.querySelector("form button");

const API_BASE = "https://v6.exchangerate-api.com/v6/da713edd05d91e4d88c36c58/latest/";

for (let select of dropdowns) {
    for (let code in countryList) {
        let option = document.createElement("option");
        option.value = code;
        option.innerText = code;

        if (select.name === "from" && code === "USD") option.selected = true;
        if (select.name === "to" && code === "INR") option.selected = true;

        select.appendChild(option);
    }

    select.addEventListener("change", e => updateFlag(e.target));
}

function updateFlag(element) {
    const code = element.value;
    const countryCode = countryList[code];
    const img = element.parentElement.querySelector("img");
    if (img && countryCode) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
}

swapIcon.addEventListener("click", () => {
    [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
    updateFlag(fromCurr);
    updateFlag(toCurr);
    getExchangeRate();
});

async function getExchangeRate() {
    let amtVal = amountInput.value;
    if (amtVal === "" || +amtVal < 1) {
        amtVal = "1";
        amountInput.value = "1";
    }

    const fromCode = fromCurr.value;
    const toCode = toCurr.value;

    msg.innerText = "Getting exchange rate...";

    try {
        const res = await fetch(`${API_BASE}${fromCode}`);
        const data = await res.json();

        if (data.result !== "success") {
            throw new Error("Failed to get rates");
        }

        const rate = data.conversion_rates[toCode];
        if (!rate) throw new Error("Exchange rate not found");

        const total = (+amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCode} = ${total} ${toCode}`;
    } catch (err) {
        msg.innerText = "Error fetching exchange rate.";
        console.error("Exchange rate error:", err);
    }
}

window.addEventListener("load", () => {
    updateFlag(fromCurr);
    updateFlag(toCurr);
    getExchangeRate();
});

button.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});
