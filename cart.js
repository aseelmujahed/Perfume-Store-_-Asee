document.addEventListener("DOMContentLoaded", function () {
    const cartTable = document.getElementById("cart-table");
    const cartTableBody = cartTable.querySelector("tbody");
    const cartTotalElement = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-btn");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    if (cart.length === 0) {
        cartTable.style.display = "none";
        checkoutButton.style.display = "none";
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your cart is empty.";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.fontSize = "1.2em";
        document.querySelector(".cart-container").appendChild(emptyMessage);
    } else {
        cartTable.style.display = "table";
        checkoutButton.style.display = "block";

        cart.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; margin-right: 10px;">
                    ${item.title}
                </td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="btn-remove" data-index="${index}">Remove</button></td>
            `;
            total += item.price * item.quantity;
            cartTableBody.appendChild(row);
        });

        document.querySelectorAll(".btn-remove").forEach(button => {
            button.addEventListener("click", function () {
                const index = button.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                location.reload();
            });
        });
    }

    cartTotalElement.textContent = total.toFixed(2);

    document.getElementById("checkout-btn").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("payment-modal2").style.display = "block";
    });

    document.getElementById("credit-card-btn").addEventListener("click", function () {
        showPaymentForm("credit-card-form");
    });

    document.getElementById("paypal-btn").addEventListener("click", function () {
        showPaymentForm("paypal-form");
    });

    document.getElementById("cash-on-delivery-btn").addEventListener("click", function () {
        showPaymentForm("cash-on-delivery-form");
    });

    function showPaymentForm(formId) {
        const forms = document.querySelectorAll(".payment-form");
        forms.forEach(form => (form.style.display = "none"));
        document.getElementById(formId).style.display = "block";
    }

    const paymentForms = document.querySelectorAll(".payment-form");

    paymentForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const isValid = validatePaymentForm(form);
            if (!isValid) return;

            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            cartTotalElement.textContent = "0.00";

            cartTable.style.display = "none";
            checkoutButton.style.display = "none";
            document.getElementById("payment-modal2").style.display = "none";
            alert("Payment Successful! Thank you for your order.");

            const successMessage = document.createElement("p");
            successMessage.textContent = "Payment completed successfully. Your cart is now empty.";
            successMessage.style.textAlign = "center";
            successMessage.style.fontSize = "1.2em";

            const cartContainer = document.querySelector(".cart-container");
            cartContainer.appendChild(successMessage);
        });
    });

    function validatePaymentForm(form) {
        let isValid = true;
        form.querySelectorAll("input").forEach(input => {
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains("error")) {
                errorElement.remove();
            }

            input.style.borderColor = "";

            if (input.value.trim() === "") {
                const errorElement = document.createElement("p");
                errorElement.classList.add("error");
                input.style.borderColor = "red"; 
                input.parentElement.appendChild(errorElement);
                isValid = false;
            }

            input.addEventListener("input", function () {
                if (input.value.trim() !== "") {
                    input.style.borderColor = ""; 
                    const errorElement = input.nextElementSibling;
                    if (errorElement && errorElement.classList.contains("error")) {
                        errorElement.remove(); 
                    }
                }
            });
        });

        return isValid;
    }
});

function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

document.getElementById("checkout-btn").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("payment-modal2").style.display = "block";
});

document.getElementById("close-modal-btn").addEventListener("click", function () {
    closeModal2();
});

function closeModal2() {
    document.getElementById("payment-modal2").style.display = "none";
}