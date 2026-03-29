let people = [];

function addPerson() {
  people.push({
    name: "",
    paymentMethod: "Niet betaald",
    paidAmount: 0,
    pickedUp: false,
    lines: [
      { product: "", size: "", quantity: 1, price: 0 }
    ]
  });
  renderPeople();
}

function addLine(personIndex) {
  people[personIndex].lines.push({
    product: "",
    size: "",
    quantity: 1,
    price: 0
  });
  renderPeople();
}

function removeLine(personIndex, lineIndex) {
  people[personIndex].lines.splice(lineIndex, 1);
  renderPeople();
}

function removePerson(personIndex) {
  people.splice(personIndex, 1);
  renderPeople();
}

function updatePersonName(personIndex, value) {
  people[personIndex].name = value;
}

function updatePaymentMethod(personIndex, value) {
  people[personIndex].paymentMethod = value;
}

function updatePaidAmount(personIndex, value) {
  people[personIndex].paidAmount = Number(value) || 0;
  updateSummary(personIndex);
}

function togglePickedUp(personIndex) {
  people[personIndex].pickedUp = !people[personIndex].pickedUp;
  renderPeople();
}

function updateLine(personIndex, lineIndex, field, value) {
  if (field === "quantity" || field === "price") {
    people[personIndex].lines[lineIndex][field] = Number(value) || 0;
  } else {
    people[personIndex].lines[lineIndex][field] = value;
  }

  updateLineTotal(personIndex, lineIndex);
  updateSummary(personIndex);
}

function calculateTotal(person) {
  return person.lines.reduce((sum, line) => {
    return sum + ((Number(line.quantity) || 0) * (Number(line.price) || 0));
  }, 0);
}

function updateLineTotal(personIndex, lineIndex) {
  const person = people[personIndex];
  const line = person.lines[lineIndex];
  const lineTotal = (Number(line.quantity) || 0) * (Number(line.price) || 0);

  const cell = document.getElementById(`line-total-${personIndex}-${lineIndex}`);
  if (cell) {
    cell.textContent = `€${lineTotal.toFixed(2)}`;
  }
}

function updateSummary(personIndex) {
  const person = people[personIndex];
  const total = calculateTotal(person);
  const paid = Number(person.paidAmount) || 0;
  const openAmount = total - paid;

  const totalEl = document.getElementById(`total-${personIndex}`);
  const paidEl = document.getElementById(`paid-${personIndex}`);
  const openEl = document.getElementById(`open-${personIndex}`);

  if (totalEl) totalEl.textContent = `Totaal: €${total.toFixed(2)}`;
  if (paidEl) paidEl.textContent = `Betaald: €${paid.toFixed(2)}`;
  if (openEl) openEl.textContent = `Openstaand: €${openAmount.toFixed(2)}`;
}

function renderPeople() {
  const container = document.getElementById("peopleContainer");
  container.innerHTML = "";

  people.forEach((person, personIndex) => {
    const total = calculateTotal(person);
    const paid = Number(person.paidAmount) || 0;
    const openAmount = total - paid;

    let linesHtml = "";

    person.lines.forEach((line, lineIndex) => {
      const lineTotal = (Number(line.quantity) || 0) * (Number(line.price) || 0);

      linesHtml += `
                <tr>
                    <td>
                        <input type="text" value="${line.product}"
                               oninput="updateLine(${personIndex}, ${lineIndex}, 'product', this.value)">
                    </td>
                    <td>
                        <input type="text" value="${line.size}"
                               oninput="updateLine(${personIndex}, ${lineIndex}, 'size', this.value)">
                    </td>
                    <td>
                        <input type="number" value="${line.quantity}"
                               oninput="updateLine(${personIndex}, ${lineIndex}, 'quantity', this.value)">
                    </td>
                    <td>
                        <input type="number" value="${line.price}"
                               oninput="updateLine(${personIndex}, ${lineIndex}, 'price', this.value)">
                    </td>
                    <td id="line-total-${personIndex}-${lineIndex}">€${lineTotal.toFixed(2)}</td>
                    <td>
                        <button onclick="removeLine(${personIndex}, ${lineIndex})">Verwijder</button>
                    </td>
                </tr>
            `;
    });

    container.innerHTML += `
            <div class="person-card" style="background:${person.pickedUp ? '#d4edda' : 'white'}">
                <div class="person-header">
                    <input type="text" placeholder="Naam" value="${person.name}"
                           oninput="updatePersonName(${personIndex}, this.value)">

                    <select onchange="updatePaymentMethod(${personIndex}, this.value)">
                        <option value="Niet betaald" ${person.paymentMethod === "Niet betaald" ? "selected" : ""}>Niet betaald</option>
                        <option value="Cash" ${person.paymentMethod === "Cash" ? "selected" : ""}>Cash</option>
                        <option value="PQ" ${person.paymentMethod === "PQ" ? "selected" : ""}>PQ</option>
                    </select>

                    <input type="number" placeholder="Betaald bedrag" value="${person.paidAmount}"
                           oninput="updatePaidAmount(${personIndex}, this.value)">

                    <button onclick="addLine(${personIndex})">+ Lijn toevoegen</button>

                    <button onclick="togglePickedUp(${personIndex})">
                        ${person.pickedUp ? "Afgehaald ✅" : "Nog niet afgehaald ❌"}
                    </button>

                    <button onclick="removePerson(${personIndex})">Persoon verwijderen</button>
                </div>

                <table class="lines-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Maat</th>
                            <th>Aantal</th>
                            <th>Prijs</th>
                            <th>Totaal</th>
                            <th>Actie</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${linesHtml}
                    </tbody>
                </table>

                <div class="summary">
                    <strong id="total-${personIndex}">Totaal: €${total.toFixed(2)}</strong>
                    <strong id="paid-${personIndex}">Betaald: €${paid.toFixed(2)}</strong>
                    <strong id="open-${personIndex}">Openstaand: €${openAmount.toFixed(2)}</strong>
                </div>
            </div>
        `;
  });
}
