//pure JS for behaviors


//collect information from customer
let clientFirstName;
let clientLastName;
let clientPhoneNumber;

let deliveryAddress;
let deliveryAdressTwo;
let deliveryCity;
let deliveryState;
let deliveryZip;

let pizzaSizeChoose = null;
let pizzaToppings = [];
let finalPrice = 0;
let allPizzas = [];

function checkSetNameButton() {
    clientFirstName = document.getElementById("fName").value;
    clientLastName = document.getElementById("lName").value;
    clientPhoneNumber= document.getElementById("phone").value;
    clientEmail= document.getElementById("email").value;
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

    //email
    const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (clientEmail === "") {
        validity = false;
        document.getElementById("emailErrorMessage").style = "display: none";
    }
    else if (!emailFormat.test(clientEmail)) {
        validity = false;
        document.getElementById("emailErrorMessage").innerHTML = "Email format not valid.";
        document.getElementById("emailErrorMessage").style = "display: block";
    }
    else {
        document.getElementById("emailErrorMessage").style = "display: none";
    }

    //able set button
    if (validity) {
        document.getElementById("setName").disabled = false;
        document.getElementById("displayOrders").disabled = false;
    }
    else {
        document.getElementById("setName").disabled = true;
        document.getElementById("displayOrders").disabled = true;
    }
}

function getCustomerInformation() {
    document.getElementById("customerChoice").style.display = "block";
    document.getElementById("fName").disabled = true;
    document.getElementById("lName").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("setName").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("displayOrders").disabled = true;

    const userData = {
        fName: document.getElementById("fName").value,
        lName: document.getElementById("lName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value
    };

    //send the data to the session
    fetch("/final_app/storeCustomerData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to store customer data.");
        }
        return response.text();
    })
    .catch((error) => {
        console.error("Error storing customer data:", error);
    });

    const myJSONstring = JSON.stringify({
        dataFName: userData.fName,
        dataLName: userData.lName,
        dataPhone: userData.phone,
    });
    localStorage.setItem("JSONclient", myJSONstring);

    document.getElementById("changeName").style.display = "block";
    document.getElementById("clientUser").innerHTML = `<p>${userData.fName} ${userData.lName}</p><p>${userData.phone}</p>`;
}

function changeName() {
    document.getElementById("fName").disabled = false;
    document.getElementById("lName").disabled = false;
    document.getElementById("phone").disabled = false;
    document.getElementById("setName").disabled = false;
    document.getElementById("displayOrders").disabled = false;
    document.getElementById("email").disabled = false;
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

        const deliveryData = {
            dataAddress: "Pick up", 
            dataAddressTwo: "",
            dataCity: "",
            dataState: "",
            dataZip: "",
            isPickup: true
        };
        const myJSONstring = JSON.stringify(deliveryData);
        localStorage.setItem("JSONdelivery", myJSONstring);

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

    const deliveryAddress = document.getElementById("deliveryAddress").value;
    const deliveryAddressTwo = document.getElementById("deliveryAddressTwo").value;
    const deliveryCity = document.getElementById("deliveryCity").value;
    const deliveryState = document.getElementById("deliveryState").value;
    const deliveryZip = document.getElementById("deliveryZip").value;

    fetch("/final_app/storeDeliveryData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            deliveryAddress,
            deliveryAddressTwo,
            deliveryCity,
            deliveryState,
            deliveryZip,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to store delivery data.");
            }
            return response.text();
        })
        .catch((error) => {
            console.error("Error storing delivery data:", error);
        });

    const deliveryData = {
        dataAddress: deliveryAddress,
        dataAddressTwo: deliveryAddressTwo,
        dataCity: deliveryCity,
        dataState: deliveryState,
        dataZip: deliveryZip,
    };

    const myJSONstring = JSON.stringify(deliveryData);
    localStorage.setItem("JSONdelivery", myJSONstring);

    document.getElementById("clientDeliveryInformation").innerHTML =
        deliveryData.dataAddress +
        " " +
        deliveryData.dataAddressTwo +
        "<br>" +
        deliveryData.dataCity +
        ", " +
        deliveryData.dataState +
        " " +
        deliveryData.dataZip;
}

function changeAddress() {
    document.getElementById("deliveryAddress").disabled = false;
    document.getElementById("deliveryAddressTwo").disabled = false;
    document.getElementById("deliveryCity").disabled = false;
    document.getElementById("deliveryState").disabled = false;
    document.getElementById("deliveryZip").disabled = false;
    document.getElementById("displayOrders").disabled = false;
    document.getElementById("email").disabled = false;
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
    document.getElementById("tax").innerHTML = "SubTotal:  $" + finalPrice.toFixed(2) + "<br>Tax: ";
    document.getElementById("totalPrice").innerHTML = "Total: $" + (finalPrice + (finalPrice * .1)).toFixed(2);

    document.getElementById("pizzaMaking").reset();
    document.getElementById("addPizzas").disabled = true;
    document.getElementById("placeOrder").disabled = false;
    pizzaSizeChoose = null;
    pizzaToppings = []; 

    //sending to the session
    const currentPizzaCount = allPizzas.length;
    fetch("/final_app/updatePizzaDetails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pizzaCount: currentPizzaCount,
            pizzaSize: thisPizza.thisPizzaSize,
            toppings: thisPizza.thisPizzaToppings.map(topping => topping[0]),
        }),
    })
        .then(response => {
            if (!response.ok) {
                console.error("Failed to send pizza details to server:", response.status);
            }
        })
        .catch(error => {
            console.error("Fetch error sending pizza details:", error);
        });
} 
