//local storage
const clientData = localStorage.getItem("JSONclient");
const client = JSON.parse(clientData);

const deliveryData = localStorage.getItem("JSONdelivery");
const delivery = JSON.parse(deliveryData);

const allPizzasData = localStorage.getItem("JSONplacedPizzas");
const pizzas = JSON.parse(allPizzasData);

const insertHeader = document.getElementById("insertHeader");
const insertPizza = document.getElementById("insertPizza");
const insertTax = document.getElementById("insertTax");
const insertTotal = document.getElementById("insertTotal");

if (client && insertHeader) {
    insertHeader.innerHTML = `<p>${client.dataFName} ${client.dataLName}</p><p>${client.dataPhone}</p>`;
    insertHeader.innerHTML += `<div>${delivery.dataAddress || ""} ${delivery.dataAddressTwo || ""}
    <br>${delivery.dataCity || ""}, ${delivery.dataState || ""} ${delivery.dataZip || ""}</div>`;
}

let finalPrice = 0;

if (pizzas.length && insertPizza) {
    for (let i = 0; i < pizzas.length; i++) {
        const eachPizza = pizzas[i];
        let pizzaOrdered = `${eachPizza.thisPizzaSize} pizza. ($${eachPizza.thisPizzaPrice})<br>`;

        for (let y = 0; y < eachPizza.thisPizzaToppings.length; y++) {
            pizzaOrdered += `---${eachPizza.thisPizzaToppings[y][0]} ($${eachPizza.thisPizzaToppings[y][1]})<br>`;
            finalPrice += parseFloat(eachPizza.thisPizzaToppings[y][1]);
        }

        finalPrice += eachPizza.thisPizzaPrice;
        insertPizza.innerHTML += `<div>${pizzaOrdered}</div>`;
    }
}

if (insertTax && insertTotal) {
    insertTax.innerHTML = `<div>SubTotal: $${finalPrice.toFixed(2)}</p><br>Tax - (${delivery.dataZip || "60067"}) </div>`;
    insertTotal.innerHTML = `Total: $${(finalPrice + finalPrice * 0.1).toFixed(2)}`;
}