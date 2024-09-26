// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Load menu data from localStorage or use default data
    let menuData = JSON.parse(localStorage.getItem('menuData')) || {};

    // Function to save menu data to localStorage
    function saveMenuData() {
        localStorage.setItem('menuData', JSON.stringify(menuData));
    }

    // Function to load category color settings
    function loadCategoryColors() {
        const categoryColorSettings = document.getElementById('category-color-settings');
        categoryColorSettings.innerHTML = '';

        for (let category in menuData) {
            const colorItem = document.createElement('div');
            colorItem.className = 'category-color-item';

            const label = document.createElement('label');
            label.textContent = `Color for ${category} Category`;

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = menuData[category].color || '#3498db';
            colorInput.onchange = (e) => {
                menuData[category].color = e.target.value;
                saveMenuData();
            };

            colorItem.appendChild(label);
            colorItem.appendChild(colorInput);
            categoryColorSettings.appendChild(colorItem);
        }
    }

    // Function to load menu item settings
    function loadMenuSettings() {
        const menuSettings = document.getElementById('menu-settings');
        menuSettings.innerHTML = '';

        for (let category in menuData) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'menu-category-setting';

            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = category;

            // Add button to add new menu item
            const addItemBtn = document.createElement('button');
            addItemBtn.className = 'add-menu-item-btn';
            addItemBtn.textContent = `Add Item to ${category}`;
            addItemBtn.onclick = () => addMenuItem(category);

            categoryDiv.appendChild(categoryHeader);
            categoryDiv.appendChild(addItemBtn);

            menuData[category].items.forEach((item, index) => {
                const itemSetting = document.createElement('div');
                itemSetting.className = 'menu-item-setting';

                // Item Name
                const nameLabel = document.createElement('label');
                nameLabel.textContent = 'Item Name';

                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.value = item.name;
                nameInput.onchange = (e) => {
                    item.name = e.target.value;
                    saveMenuData();
                };

                // Item Price
                const priceLabel = document.createElement('label');
                priceLabel.textContent = 'Item Price (€)';

                const priceInput = document.createElement('input');
                priceInput.type = 'number';
                priceInput.step = '0.01';
                priceInput.value = item.price;
                priceInput.onchange = (e) => {
                    item.price = parseFloat(e.target.value);
                    saveMenuData();
                };

                // Delete Item Button
                const deleteItemBtn = document.createElement('button');
                deleteItemBtn.className = 'delete-btn';
                deleteItemBtn.textContent = 'Delete Item';
                deleteItemBtn.onclick = () => {
                    menuData[category].items.splice(index, 1);
                    saveMenuData();
                    loadMenuSettings();
                };

                // Append elements
                itemSetting.appendChild(nameLabel);
                itemSetting.appendChild(nameInput);
                itemSetting.appendChild(priceLabel);
                itemSetting.appendChild(priceInput);
                itemSetting.appendChild(deleteItemBtn);

                categoryDiv.appendChild(itemSetting);
            });

            // Delete Category Button
            const deleteCategoryBtn = document.createElement('button');
            deleteCategoryBtn.className = 'delete-btn';
            deleteCategoryBtn.textContent = `Delete ${category} Category`;
            deleteCategoryBtn.onclick = () => {
                delete menuData[category];
                saveMenuData();
                loadCategoryColors();
                loadMenuSettings();
            };

            categoryDiv.appendChild(deleteCategoryBtn);

            menuSettings.appendChild(categoryDiv);
        }
    }

    // Function to add a new category
    document.getElementById('add-category-btn').onclick = () => {
        const categoryName = prompt('Enter the name of the new category:');
        if (categoryName && !menuData[categoryName]) {
            menuData[categoryName] = {
                color: '#3498db',
                items: []
            };
            saveMenuData();
            loadCategoryColors();
            loadMenuSettings();
        } else {
            alert('Category already exists or invalid name.');
        }
    };

    // Function to add a new menu item
    function addMenuItem(category) {
        const itemName = prompt('Enter the name of the new menu item:');
        const itemPrice = prompt('Enter the price of the new menu item (€):');
        if (itemName && !isNaN(itemPrice)) {
            menuData[category].items.push({
                name: itemName,
                price: parseFloat(itemPrice)
            });
            saveMenuData();
            loadMenuSettings();
        } else {
            alert('Invalid item name or price.');
        }
    }

    // Load settings on page load
    loadCategoryColors();
    loadMenuSettings();
});
