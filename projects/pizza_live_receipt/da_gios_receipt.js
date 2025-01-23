//geting local storages
const clientData = localStorage.getItem("JSONclient");
const client = JSON.parse(clientData);

const deliveryData = localStorage.getItem("JSONdelivery");
const delivery = JSON.parse(deliveryData);

const allPizzasData = localStorage.getItem("JSONplacedPizzas");
const pizzas = JSON.parse(allPizzasData);


//using the local storages
//header
const insert = document.getElementById("insertHeader");

insert.innerHTML += "<p>" + client.dataFName + " " + client.dataLName + "</p><p>" + client.dataPhone + "</p>";
insert.innerHTML += "<div>" + delivery.dataAddress + " " + delivery.dataAddressTwo
+ "<br>" + delivery.dataCity + ", " + delivery.dataState + " " + delivery.dataZip + "</div>";

//pizzas
let finalPrice = 0;
let eachPizza;

for (let i = 0; i < allPizzasData.length; i++) {
    eachPizza = pizzas[i];
    let pizzaOrdered = eachPizza.thisPizzaSize + " pizza  ($" + eachPizza.thisPizzaPrice + ")<br>";

    for (let y = 0; y < eachPizza.thisPizzaToppings.length; y++) {
        pizzaOrdered +=  "---" + eachPizza.thisPizzaToppings[y][0] + " ($" + eachPizza.thisPizzaToppings[y][1] + ")<br>";
        finalPrice += parseFloat(eachPizza.thisPizzaToppings[y][1]);
    }
    
    finalPrice += eachPizza.thisPizzaPrice;
    document.getElementById("insertPizza").innerHTML += "<div>" + pizzaOrdered + "</div>";
    document.getElementById("insertTax").innerHTML = "<div>SubTotal:  $" + finalPrice.toFixed(2) + "</p><br>Tax: 10%";
    document.getElementById("insertTotal").innerHTML = "Total: $" + (finalPrice + (finalPrice * .1)).toFixed(2);
}

//insert notes from the client
