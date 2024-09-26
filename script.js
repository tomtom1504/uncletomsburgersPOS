// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Load menu data from localStorage or use default data
    let menuData = JSON.parse(localStorage.getItem('menuData')) || {
        "Burgers": {
            color: "#3498db",
            items: [
                { name: "Bacon Cheeseburger", price: 10.99 },
                { name: "Veggie Burger", price: 8.99 },
                { name: "Meatlovers Burger", price: 12.99 },
                { name: "BBQ Burger", price: 9.99 }
            ]
        },
        "Sides": {
            color: "#3498db",
            items: [
                { name: "Fries", price: 4.99 },
                { name: "Coleslaw", price: 2.99 },
                { name: "Onion Rings", price: 6.99 },
                { name: "Salad", price: 5.99 }
            ]
        },
        "Drinks": {
            color: "#3498db",
            items: [
                { name: "Soft Drink", price: 2.99 },
                { name: "Iced Tea", price: 2.50 },
                { name: "Lemonade", price: 3.50 },
                { name: "Water", price: 1.50 }
            ]
        },
        "Desserts": {
            color: "#3498db",
            items: [
                { name: "Ice Cream", price: 4.99 },
                { name: "Brownie", price: 4.50 },
                { name: "Mousse", price: 5.50 },
                { name: "Cake", price: 6.50 }
            ]
        },
        "Beers": {
            color: "#3498db",
            items: [
                { name: "Lager", price: 5.50 },
                { name: "Bock", price: 6.50 },
                { name: "Weiss", price: 5.50 },
                { name: "Brown", price: 5.00 }
            ]
        },
        "Wines": {
            color: "#3498db",
            items: [
                { name: "White", price: 7.00 },
                { name: "Red", price: 8.00 },
                { name: "Sparkling", price: 10.00 },
                { name: "Rosé", price: 9.00 }
            ]
        }
    };

    // Initialize order array
    let order = [];

    // Function to save menu data to localStorage
    function saveMenuData() {
        localStorage.setItem('menuData', JSON.stringify(menuData));
    }

    // Function to load categories
    function loadCategories() {
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '';

        for (let category in menuData) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category;
            button.setAttribute('data-category', category);
            button.style.backgroundColor = menuData[category].color || '#3498db';
            button.onclick = () => displayMenuItems(category);
            li.appendChild(button);
            categoryList.appendChild(li);
        }
    }

    // Function to update the order summary display
    function updateOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const totalPriceElement = document.getElementById('total-price');

        // Clear current order items
        orderItems.innerHTML = '';

        let totalPrice = 0.00;

        // Add each item in the order to the list
        order.forEach((item, index) => {
            const li = document.createElement('li');

            // Item total price (price * quantity)
            const itemTotalPrice = item.price * item.quantity;

            // Update total price
            totalPrice += itemTotalPrice;

            // Create item description
            const itemDesc = document.createElement('span');
            itemDesc.textContent = `${item.name} - €${itemTotalPrice.toFixed(2)}`;

            // Create quantity rocker
            const quantityRocker = document.createElement('div');
            quantityRocker.className = 'quantity-rocker';

            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.onclick = () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    // Remove item from order if quantity is 1
                    order.splice(index, 1);
                }
                updateOrderSummary();
            };

            const qtyDisplay = document.createElement('span');
            qtyDisplay.textContent = item.quantity;
            qtyDisplay.className = 'quantity-display';

            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.onclick = () => {
                item.quantity++;
                updateOrderSummary();
            };

            quantityRocker.appendChild(minusBtn);
            quantityRocker.appendChild(qtyDisplay);
            quantityRocker.appendChild(plusBtn);

            // Append elements to list item
            li.appendChild(itemDesc);
            li.appendChild(quantityRocker);

            orderItems.appendChild(li);
        });

        // Update total price
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Function to display menu items for a selected category
    function displayMenuItems(category) {
        const menuItemsContainer = document.getElementById('menu-items');
        const categoryTitle = document.getElementById('category-title');

        // Update the category title
        categoryTitle.textContent = category;

        // Clear previous menu items
        menuItemsContainer.innerHTML = '';

        // Get the menu items for the selected category
        const items = menuData[category].items;

        // Create buttons for each menu item
        items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'menu-item';
            button.textContent = `${item.name} - €${item.price.toFixed(2)}`;
            button.onclick = () => {
                // Check if item is already in the order
                const existingItem = order.find(orderItem => orderItem.name === item.name);

                if (existingItem) {
                    // Increment quantity
                    existingItem.quantity++;
                } else {
                    // Add new item to order with quantity 1
                    order.push({ name: item.name, price: item.price, quantity: 1 });
                }
                // Update the display
                updateOrderSummary();
            };

            menuItemsContainer.appendChild(button);
        });
    }

    // Proceed to payment button
    document.getElementById('proceed-payment').addEventListener('click', () => {
        if (order.length === 0) {
            alert('Your order is empty!');
        } else {
            // Calculate total price
            let totalPrice = 0.00;
            order.forEach(item => {
                totalPrice += item.price * item.quantity;
            });

            // Simple alert for demonstration purposes
            alert(`Total amount due: €${totalPrice.toFixed(2)}\nThank you for your order!`);

            // Reset order
            order = [];
            updateOrderSummary();

            // Reset menu items and category title
            document.getElementById('menu-items').innerHTML = '';
            document.getElementById('category-title').textContent = 'Please select a category';
        }
    });

    // Load categories on page load
    loadCategories();
});
