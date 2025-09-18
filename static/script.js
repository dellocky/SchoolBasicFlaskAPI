const size_buttons = document.getElementsByClassName("size_button");
const flavor_buttons = document.getElementsByClassName("flavor_button");
const extra_buttons = document.getElementsByClassName("extra_button");
const checkout_button = document.getElementById("checkout_button");
const checkout_label = document.getElementById("checkout_label");

let size_button_selected = false;
let flavor_button_selected = false;
let id_num
const extra_price = 0.5;

 fetch('/assign_number', { //initates a unique id for the client
        method: 'POST'//post to server
    })
    .then(res => res.json())
    .then(data => {
        id_num = parseInt(data.id_num); //updates this client's id to match the server's client data index
    });

for (let i = 0; i < size_buttons.length; i++) { //called when a size button is clicked, sends a request to the server to update the value of that clients price
    let button = size_buttons[i];
    button.onclick = function () {
        if (!size_button_selected) {
            size_button_selected = true;
            let amount = parseFloat(button.getAttribute("data-price"));
            //console.log(id_num, amount)
            fetch(`/add_price?amount=${amount}&id_num=${id_num}`); //calculation to python server
            button.setAttribute("data-active", "true"); //custom html data type, might have been better to make a paralell boolean array in js for managing data but it's done and works now
            button.style.border = "3px solid #04AA6d"; //update the css
        } else if (button.getAttribute("data-active") === "true") {
            size_button_selected = false;
            let amount = -parseFloat(button.getAttribute("data-price"));
            fetch(`/add_price?amount=${amount}&id_num=${id_num}`);
            button.setAttribute("data-active", "false");
            button.style.border = "3px solid  #161616";
        }
    };
}

for (let i = 0; i < flavor_buttons.length; i++) { //buttons don't do anything but play with the css
    let button = flavor_buttons[i]; 
    button.onclick = function () {
        if (!flavor_button_selected) {
            flavor_button_selected = true;
            button.setAttribute("data-active", "true");
            button.style.border = "3px solid #04AA6d";
        } else if (button.getAttribute("data-active") === "true") {
            flavor_button_selected = false;
            button.setAttribute("data-active", "false");
            button.style.border = "3px solid  #161616";
        }
    };
}

for (let i = 0; i < extra_buttons.length; i++) {//called when an extra button is clicked logic is same as size_buttons but multiple can be clicked simaltaniously
    let button = extra_buttons[i];
    button.setAttribute("data-active", "false");
    button.onclick = function () {
        if (button.getAttribute("data-active") === "false") {
            fetch(`/add_price?amount=${extra_price}&id_num=${id_num}`);
            button.setAttribute("data-active", "true");
            button.style.border = "3px solid #04AA6d";
        } else {
            fetch(`/add_price?amount=${-extra_price}&id_num=${id_num}`);
            button.setAttribute("data-active", "false");
            button.style.border = "3px solid  #161616";
        }
    };
}

checkout_button.onclick = function () {//gets the value the server is currently holding for this client's id
    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_num: id_num }) //send the client ID to the server
    })
    .then(res => res.json())
    .then(data => {
        checkout_label.innerText = data.price; //recieve the price from the server
    });
};

