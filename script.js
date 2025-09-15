// Elements 
const billInput = document.getElementById("billInput");
const consumptionInputs = document.getElementById("consumptionInputs");

let tip = 20;
let peopleCount = 1;
let splitType = "equal";

// Tip buttons & input
const tip10Btn = document.getElementById("tip10");
const tip20Btn = document.getElementById("tip20");
const customTipInput = document.getElementById("customTip");

// Split buttons
const splitEqualBtn = document.getElementById("splitEqual");
const splitConsumptionBtn = document.getElementById("splitConsumption");

// Other elements
const addPersonBtn = document.getElementById("addPerson");
const removePersonBtn = document.getElementById("removePerson");
const peopleCountDisplay = document.getElementById("peopleCount");
const proceedBtn = document.getElementById("proceedBtn");
const resultBox = document.getElementById("result");

// ----- TIP HANDLING -----
tip10Btn.addEventListener("click", () => {
  const billAmount = parseFloat(billInput.value) || 0;
  tip = billAmount * 0.1;
  setActiveTip(tip10Btn);
});
tip20Btn.addEventListener("click", () => {
  tip = 20;
  setActiveTip(tip20Btn);
});
// Custom tip input (accepts both % and flat numbers)
customTipInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();

  // Check if value ends with %
  if (value.endsWith("%")) {
    const percent = parseFloat(value.slice(0, -1));
    if (!isNaN(percent)) {
      const billAmount = parseFloat(billInput.value) || 0;
      tip = (billAmount * percent) / 100;
    } else {
      tip = 0;
      alert("Invalid Value for Custom Tip");
      e.target.value = "";
    }
  } 
  // Check if value ends with $
  else if (value.endsWith("$")) {
    const fixed = parseFloat(value.slice(0, -1));
    if (!isNaN(fixed)) {
      tip = fixed;
    } else {
      tip = 0;
      alert("Invalid Value for Custom Tip");
      e.target.value = "";
    }
  } 
  // Plain number
  else if (/^\d+(\.\d+)?$/.test(value)) {
    tip = parseFloat(value);
  } 
  // Invalid
  else if (value.length > 0) {
    tip = 0;
    alert("Invalid Value for Custom Tip");
    e.target.value = "";
  }

  clearActiveTips();
});

function setActiveTip(button) {
  clearActiveTips();
  button.classList.add("active");
  customTipInput.value = "";
}
function clearActiveTips() {
  [tip10Btn, tip20Btn].forEach(btn => btn.classList.remove("active"));
}

// ----- SPLIT HANDLING -----
splitEqualBtn.addEventListener("click", () => {
  splitType = "equal";
  setActiveSplit(splitEqualBtn);
  consumptionInputs.style.display = "none"; // hide inputs
});

splitConsumptionBtn.addEventListener("click", () => {
  splitType = "consumption";
  setActiveSplit(splitConsumptionBtn);
  consumptionInputs.style.display = "block"; // show inputs
});

function setActiveSplit(button) {
  [splitEqualBtn, splitConsumptionBtn].forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
}

// ----- ADD PEOPLE -----
addPersonBtn.addEventListener("click", () => {
  peopleCount++;
  peopleCountDisplay.textContent = peopleCount;

  // Add a new input for consumption
  const newInput = document.createElement("input");
  newInput.type = "number";
  newInput.placeholder = `Person ${peopleCount} consumption`;
  newInput.classList.add("person-input");
  consumptionInputs.appendChild(newInput);

  syncRemoveState();
});

// ----- REMOVE PEOPLE -----
removePersonBtn.addEventListener("click", () => {
  if (peopleCount > 1) {
    peopleCount--;
    peopleCountDisplay.textContent = peopleCount;

    // remove last consumption input if any
    const inputs = consumptionInputs.querySelectorAll(".person-input");
    if (inputs.length > 0) {
      consumptionInputs.removeChild(inputs[inputs.length - 1]);
    }

    syncRemoveState();
  }
});

// helper to toggle remove button state
function syncRemoveState() {
  if (peopleCount <= 1) {
    removePersonBtn.classList.add("disabled");
  } else {
    removePersonBtn.classList.remove("disabled");
  }
}
syncRemoveState();

// ----- PROCEED -----
proceedBtn.addEventListener("click", () => {
  const billAmount = parseFloat(billInput.value) || 0;
  let total = billAmount + tip;

  let perPerson;
  if (splitType === "equal") {
    perPerson = (total / peopleCount).toFixed(2);
  } else {
    // Get all consumption inputs
    const inputs = document.querySelectorAll(".person-input");
    let consumptions = [];
    let totalConsumption = 0;

    inputs.forEach(input => {
      let value = parseFloat(input.value) || 0;
      consumptions.push(value);
      totalConsumption += value;
    });

    // Calculate each share
    perPerson = consumptions.map((val, idx) => {
      let share = (val / totalConsumption) * total;
      return `Person ${idx + 1}: $${share.toFixed(2)}`;
    }).join("<br>");
  }

  resultBox.innerHTML = `
    <p><strong>Total Bill:</strong> $${total}</p>
    <p><strong>People:</strong> ${peopleCount}</p>
    <p><strong>Each Pays:</strong> ${perPerson}</p>
  `;
});


