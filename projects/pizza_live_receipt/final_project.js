//collect information from customer

let clientFirstName;
let clientLastName;
let clientPhoneNumber;

let deliveryAddress;
let deliveryAdressTwo;
let deliveryCity;
let deliveryState;
let deliveryZip;

let pizzaSizeChoose;
let pizzaToppings;
let finalPrice = 0;
let allPizzas = [];

function checkSetNameButton() {
    clientFirstName = document.getElementById("fName").value;
    clientLastName = document.getElementById("lName").value;
    clientPhoneNumber= document.getElementById("phone").value;
    let validity = true;

    //first name 
    if (clientFirstName === "") {
        validity = false;
        document.getElementById("firstNameErrorMessage").style = "display: none";
    }
    else if (!isNaN(clientFirstName)) {
        validity = false;
        document.getElementById("firstNameErrorMessage").innerHTML = "You can't enter a number.";
        document.getElementById("firstNameErrorMessage").style = "display: block";
    }
    else if (clientFirstName.length < 2) {
        validity = false;
        document.getElementById("firstNameErrorMessage").innerHTML = "Name too short.";
        document.getElementById("firstNameErrorMessage").style = "display: block";
    }
    else {
        document.getElementById("firstNameErrorMessage").style = "display: none";
    }

    // last name
    if (clientLastName === "") {
        validity = false;
        document.getElementById("lastNameErrorMessage").style = "display: none";
    }
    else if (!isNaN(clientLastName)) {
        validity = false;
        document.getElementById("lastNameErrorMessage").innerHTML = "You can't enter a number.";
        document.getElementById("lastNameErrorMessage").style = "display: block";
    }
    else if (clientLastName.length < 2) {
        validity = false;
        document.getElementById("lastNameErrorMessage").innerHTML = "Last name too short.";
        document.getElementById("lastNameErrorMessage").style = "display: block";
    }
    else {
        document.getElementById("lastNameErrorMessage").style = "display: none";
    }

    // phone number
    const phoneFormat = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

    if (clientPhoneNumber === "") {
        validity = false;
        document.getElementById("phoneErrorMessage").style = "display: none";
    }
    else if (!phoneFormat.test(clientPhoneNumber)) {
        validity = false;
        document.getElementById("phoneErrorMessage").innerHTML = "Phone format not valid.";
        document.getElementById("phoneErrorMessage").style = "display: block";
    }
    else {
        document.getElementById("phoneErrorMessage").style = "display: none";
    }

    //able set button
    if (validity) {
        document.getElementById("setName").disabled = false;
    }
    else {
        document.getElementById("setName").disabled = true;
    }
}

function getCustomerInformation() {
    document.getElementById("customerChoice").style.display = "block";
    document.getElementById("fName").disabled = true;
    document.getElementById("lName").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("setName").disabled = true;

    //put the information in the file
    const userData = {
        dataFName: clientFirstName,
        dataLName: clientLastName,
        dataPhone: clientPhoneNumber,
    };

    const myJSONstring = JSON.stringify(userData);
    localStorage.setItem("JSONclient", myJSONstring);

    //adding information to the receipt
    document.getElementById("changeName").style.display = "block";
    document.getElementById("clientUser").innerHTML = "<p>" + userData.dataFName + " " + userData.dataLName + "</p><p>" + userData.dataPhone + "</p>";
}

function changeName() {
    document.getElementById("fName").disabled = false;
    document.getElementById("lName").disabled = false;
    document.getElementById("phone").disabled = false;
    document.getElementById("setName").disabled = false;
}

function userDeliveryChoice() {
    if (document.getElementById("deliveryChoice").checked) {
        document.getElementById("deliveryInformation").style.display = "flex";
        document.getElementById("pizzaMaking").style.display = "none";
    }
    if (document.getElementById("pickUpChoice").checked) {
        document.getElementById("deliveryInformation").style.display = "none";
        document.getElementById("pizzaMaking").style.display = "block";

        document.getElementById("clientDeliveryInformation").style.display = "block";
        document.getElementById("clientDeliveryInformation").innerHTML = "Pick up";
        document.getElementById("changeAddress").style.display = "none";
        changeAddress();
    }
}

function checkDeliveryButton() {
    deliveryAddress = document.getElementById("deliveryAddress").value;
    deliveryAdressTwo = document.getElementById("deliveryAddressTwo").value;
    deliveryCity = document.getElementById("deliveryCity").value;
    deliveryState = document.getElementById("deliveryState").value;
    deliveryZip = document.getElementById("deliveryZip").value;

    let validity = true;

    //address
    if (deliveryAddress === "") {
        validity = false;;
        document.getElementById("addressErrorMessage").style.display = "none";
    }
    else if (deliveryAddress.length < 4) {
       validity = false;
       document.getElementById("addressErrorMessage").style = "display: block";
       document.getElementById("addressErrorMessage").innerHTML = "Address too short.";
    }
    else {
        validity = true;
        document.getElementById("addressErrorMessage").style.display = "none";
    }

    //city  
    if (deliveryCity === "") {
        validity = false;
        document.getElementById("cityErrorMessage").style.display = "none";
    }
    else if (!isNaN(deliveryCity)) {
        validity = false;
        document.getElementById("cityErrorMessage").style.display = "block";
        document.getElementById("cityErrorMessage").innerHTML = "City can't be a number."
    }
    else if (deliveryCity.length < 2) {
        validity = false;
        document.getElementById("cityErrorMessage").style.display = "block";
        document.getElementById("cityErrorMessage").innerHTML = "City too short."
    }
    else {
        validity = true;
        document.getElementById("cityErrorMessage").style.display = "none";
    }

    //state
    if (deliveryState === "") {
        validity = false;
        document.getElementById("stateErrorMessage").style.display = "none";
    }
    else if (!isNaN(deliveryState)) {
        validity = false;
        document.getElementById("stateErrorMessage").style.display = "block";
        document.getElementById("stateErrorMessage").innerHTML = "State can't be a number."
    }
    else if (deliveryState.length < 2) {
        validity = false;
        document.getElementById("stateErrorMessage").style.display = "block";
        document.getElementById("stateErrorMessage").innerHTML = "City too short."
    }
    else {
        validity = true;
        document.getElementById("stateErrorMessage").style.display = "none";
    }

    //zip 
    if (deliveryZip === "") {
        validity = false;
        document.getElementById("zipErrorMessage").style.display = "none";
    }
    else if (isNaN(deliveryZip)) {
        validity = false;
        document.getElementById("zipErrorMessage").style.display = "block";
        document.getElementById("zipErrorMessage").innerHTML = "ZIP code must be a number."
    }
    else if (deliveryZip.length < 5) {
        validity = false;
        document.getElementById("zipErrorMessage").style.display = "block";
        document.getElementById("zipErrorMessage").innerHTML = "Zip code too short.";
    }
    else {
        validity = true;
        document.getElementById("zipErrorMessage").style.display = "none";
    }

    //button validation
    if (validity == true) {
        document.getElementById("setAddress").disabled = false;
    }
    else {
        document.getElementById("setAddress").disabled = true;
    }
}

function getDeliveryInformation() {
    document.getElementById("deliveryAddress").disabled = true;
    document.getElementById("deliveryAddressTwo").disabled = true;
    document.getElementById("deliveryCity").disabled = true;
    document.getElementById("deliveryState").disabled = true;
    document.getElementById("deliveryZip").disabled = true;
    document.getElementById("setAddress").disabled = true;

    document.getElementById("pizzaMaking").style.display = "block";
    document.getElementById("clientDeliveryInformation").style.display = "block";
    document.getElementById("changeAddress").style.display = "block";
    
    const deliveryData = {
        dataAddress: deliveryAddress,
        dataAddressTwo: deliveryAdressTwo,
        dataCity: deliveryCity,
        dataState: deliveryState,
        dataZip: deliveryZip,
    };

    const myJSONstring = JSON.stringify(deliveryData);
    localStorage.setItem("JSONdelivery", myJSONstring);

    document.getElementById("clientDeliveryInformation").innerHTML = deliveryData.dataAddress + " " + deliveryData.dataAddressTwo
        + "<br>" + deliveryData.dataCity + ", " + deliveryData.dataState + " " + deliveryData.dataZip;
}

function changeAddress() {
    document.getElementById("deliveryAddress").disabled = false;
    document.getElementById("deliveryAddressTwo").disabled = false;
    document.getElementById("deliveryCity").disabled = false;
    document.getElementById("deliveryState").disabled = false;
    document.getElementById("deliveryZip").disabled = false;
}

function getSize() {
    let pizzaSize = document.getElementsByName('pizzaSize');

    for (let i = 0; i < pizzaSize.length; i++) {
        if (pizzaSize[i].checked) {
            if (pizzaSize[i].value == "Small") {
                pizzaSizeChoose = ["Small", 13];
            }
            else if (pizzaSize[i].value == "Medium") {
                pizzaSizeChoose = ["Medium", 17];
            }
            else if (pizzaSize[i].value == "Large") {
                pizzaSizeChoose = ["Large", 21];
            }
            break;
        }
    }
    document.getElementById("addPizzas").disabled = false;
}

function getToppings() {
    let toppingList = document.getElementsByName('topping');
    pizzaToppings = [];

    for (let i = 0; i < toppingList.length; i++){
        if (toppingList[i].checked) {
            pizzaToppings.push([toppingList[i].value, .99]);
        }
    }
}

function addPizza() {
    document.getElementById("pizzaTitle").innerHTML = "Order";

    const thisPizza = {
        thisPizzaSize: pizzaSizeChoose[0],
        thisPizzaPrice: pizzaSizeChoose[1],
        thisPizzaToppings: pizzaToppings,
    };

    const myJSONpizza = JSON.stringify(thisPizza);
    localStorage.setItem("JSONpizza", myJSONpizza)

    let pizzaOrdered = thisPizza.thisPizzaSize + " pizza.  ($" + thisPizza.thisPizzaPrice + ")<br>";
    finalPrice += thisPizza.thisPizzaPrice;

    for (let i = 0; i < thisPizza.thisPizzaToppings.length; i++) {
        pizzaOrdered +=  "---" + thisPizza.thisPizzaToppings[i][0] + " ($" + thisPizza.thisPizzaToppings[i][1] + ")<br>";
        finalPrice += parseFloat(thisPizza.thisPizzaToppings[i][1]);
    }

    allPizzas.push(thisPizza);
    const myJSONallPizzas = JSON.stringify(allPizzas);
    localStorage.setItem("JSONplacedPizzas", myJSONallPizzas);

    document.getElementById("addingOrder").innerHTML += "<div>" + pizzaOrdered + "</div>";
    document.getElementById("tax").innerHTML = "SubTotal:  $" + finalPrice.toFixed(2) + "<br>Tax: 10%";
    document.getElementById("totalPrice").innerHTML = "Total: $" + (finalPrice + (finalPrice * .1)).toFixed(2);

    document.getElementById("pizzaMaking").reset();
    document.getElementById("addPizzas").disabled = true;
    document.getElementById("placeOrder").disabled = false;
    pizzaSizeChoose = null;
    pizzaToppings = []; 
} 

function printReceipt() {
    window.open("index_receipt.html")
}