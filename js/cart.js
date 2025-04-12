document.addEventListener("DOMContentLoaded", function () {
    const payButton = document.querySelector(".btn-highlight.text-main.mt-4");
    const cart = [];
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalContainer = document.getElementById("cart-total");

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Creates ordered item element when the item is added into the list
            const cartItem = document.createElement("div");
            cartItem.classList.add("d-flex", "justify-content-between", "align-items-center", "my-2");
            cartItem.innerHTML = `
                <p class="fw-bold">${item.name}</p>
                <p>${item.quantity}</p>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Correctly set the total amount
        cartTotalContainer.textContent = `₱${total.toFixed(2)}`;
    }

    payButton.addEventListener("click", function () {
        const paymentInput = document.querySelector('input[type="number"][placeholder="Pay Here"]');
        
        // Extract numeric value from total price
        let totalText = cartTotalContainer.textContent.replace(/[^\d.]/g, "");
        let totalAmount = parseFloat(totalText);

        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("Error: The total amount is invalid.");
            console.log("Debug: cart-total textContent =", cartTotalContainer.textContent);
            console.log("Debug: Extracted totalText =", totalText);
            return;
        }

        const paymentAmount = parseFloat(paymentInput.value);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        if (paymentAmount >= totalAmount) {
            const change = paymentAmount - totalAmount;
            alert(`Payment Successful! Here is your ₱${change.toFixed(2)} change.`);

            cart.length = 0; // Empty the cart array
            cartItemsContainer.innerHTML = "";
            cartTotalContainer.textContent = "₱0.00";
            paymentInput.value = "";
        } else {
            alert("Balance is not enough. Please enter the correct amount.");
        }
    });

    // Add to cart buttons
    document.querySelectorAll(".btn-highlight").forEach(button => {
        button.addEventListener("click", (e) => {
            const name = e.target.getAttribute("data-name");
            const price = parseFloat(e.target.getAttribute("data-price"));
            const quantityInput = e.target.previousElementSibling;
            const quantity = parseInt(quantityInput?.value) || 1;

            if (!name || isNaN(price)) {
                return;
            }

            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name, price, quantity });
            }

            updateCart();
        });
    });
});
