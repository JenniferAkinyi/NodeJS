let cart = [];


const contentDisplay = document.querySelector('#content-display')
const cartItemsDisplay = document.querySelector('#list-products')
const cartSubtotal = document.querySelector('#cart-subtotal')
const cartCount = document.querySelector('#cart-count')
const cartProducts = document.querySelector('.cart-products')
const cartIcon = document.querySelector('#cart-icon')

let viewPopup = document.querySelector('#view-popup');
let closeViewPopup = document.querySelector('#close-view-popup');
if (!closeViewPopup) {
    console.error('Close popup button not found!');
} else {
    closeViewPopup.addEventListener('click', () => {
        console.log('Close button clicked');
        viewPopup.style.display = 'none';
    });
}

const fetchData = async (sorter = null) => {
    try {
        const response = await fetch('http://localhost:3000/api/events')
        let data = await response.json()

        if (sorter === 'price-asc') {
            data = data.sort((a, b) => a.price - b.price)
        } else if (sorter === 'price-desc') {
            data = data.sort((a, b) => b.price - a.price)
        } else if (sorter === 'date') {
            data = data.sort((a, b) => new Date(a.date) - new Date(b.date))
        }

        let output = ''

        data.forEach(({ imageUrl, id, title, date, location, price, company }) => {
            output += `
                <div class="content">
                    <img src="${imageUrl}" alt="${id}" loading="lazy" />
                    <div class="content__description">
                        <h4>${title}</h4>
                        <p>${date}</p>
                        <p>${location}</p>
                        <p>ksh.${price}</p>
                        <button class="add-to-cart" data-id="${id}" data-title="${title}" data-price="${price}">Add to Cart</button>
                        <div class="action=buttons">
                            <button class="view" data-id="${id}">View</button>
                            <button class="edit" 
                                data-id="${id}" 
                                data-title="${title}" 
                                data-imageurl="${imageUrl}" 
                                data-price="${price}" 
                                data-date="${date}" 
                                data-location="${location}" 
                                data-company="${company}">Edit</button>

                            <button class="delete" 
                                data-id="${id}">Delete</button>
                        </div>
                    </div>
                </div>
            `
        })
        contentDisplay.innerHTML = output

        // event listener for add to cart
        const addToCartButtons = document.querySelectorAll('.add-to-cart')
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id')
                const title = button.getAttribute('data-title')
                const price = parseFloat(button.getAttribute('data-price'))

                addToCart({ id, title, price, quantity: 1 })
            })
        })
        function addToCart(product) {
            const existingProduct = cart.find(item => item.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }

            updateCartDisplay();
            updateCartSubtotal();
            updateCartCount();

            cartProducts.style.display = 'block';
        }
        function updateCartDisplay() {
            cartItemsDisplay.innerHTML = '';

            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <p>${item.title} x (${item.quantity}) - ksh.${item.price * item.quantity}</p>
                `;
                cartItemsDisplay.appendChild(itemElement);
            });
        }

        // cart subtotal
        function updateCartSubtotal() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            // cartSubtotal.innerHTML = `ksh.${subtotal}`
            cartSubtotal.textContent = subtotal.toFixed(2);
        }
        function updateCartCount() {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0)
            cartCount.textContent = count
            cartCount.style.display = count > 0 ? 'inline-block' : 'none'
        }

        cartIcon.addEventListener('click', () => {
            if (cartProducts.style.display === 'block') {
                cartProducts.style.display = 'none';
            } else {
                cartProducts.style.display = 'block';
            }
        })

        document.querySelector('#close-cart').addEventListener('click', () => {
            cartProducts.style.display = 'none'
        })


        // view an event popup
        document.querySelectorAll('.view').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id')
                const selectedItem = data.find(item => item.id == id)

                if (selectedItem) {
                    document.getElementById('popup-title').textContent = selectedItem.title
                    document.getElementById('popup-image').src = selectedItem.imageUrl
                    document.getElementById('popup-date').textContent = `Date: ${selectedItem.date}`
                    document.getElementById('popup-location').textContent = `Location: ${selectedItem.location}`
                    document.getElementById('popup-company').textContent = `Company: ${selectedItem.company}`
                    document.getElementById('popup-price').textContent = selectedItem.price

                    viewPopup.style.display = 'flex';
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const priceascending = document.querySelector('#price-asc')
const pricedescending = document.querySelector('#price-desc')
const sortdateasc = document.querySelector('#date')

priceascending.addEventListener('click', () => fetchData('price-asc'))
pricedescending.addEventListener('click', () => fetchData('price-desc'))
sortdateasc.addEventListener('click', () => fetchData('date'))

const subtotal = document.querySelector('#subtotal')

// document.querySelector('#close-cart').addEventListener('click', () => {
//     document.querySelector('.cart-products').style.display = 'none'
// })


fetchData()

// add new event
const popupForm = document.getElementById('popup-form');
const addDataButton = document.querySelector('#add-data-button');
const closeButton = document.getElementById('close-popup');
const dataForm = document.getElementById('dataForm');

addDataButton.addEventListener('click', () => {
    popupForm.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
    popupForm.style.display = 'none';
});

dataForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect data from the form inputs
    const formData = new FormData(dataForm);
    const newEvent = {
        title: formData.get('title'),
        imageUrl: formData.get('imageUrl'),
        price: parseFloat(formData.get('price')),
        date: formData.get('date'),
        location: formData.get('location'),
        company: formData.get('company')
    };

    try {
        console.log(newEvent)
        // Send a POST request to add the new event
        const response = await fetch('http://localhost:3000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            throw new Error('Failed to add the event');
        }

        const addedEvent = await response.json();
        console.log('Event added:', addedEvent);

        popupForm.style.display = 'none';
        dataForm.reset();
    } catch (error) {
        console.error('Error:', error);
    }
})



// Open edit popup and populate form
document.addEventListener('DOMContentLoaded', () => {
    const closeEditPopup = document.getElementById('close-edit-popup');
    const editDataForm = document.getElementById('editDataForm');
    const editPopupForm = document.getElementById('edit-popup-form');

    if (!closeEditPopup) {
        console.error('Close button not found');
    } else {
        console.log('Close button found'); // Make sure the button is present in the DOM
    }

    // Verify if there are any buttons with the class 'edit'
    const editButtons = document.querySelectorAll('.edit');
    if (editButtons.length === 0) {
        console.error("No .edit buttons found on the page");
    } else {
        console.log(`Found ${editButtons.length} .edit buttons`); // Check if the buttons exist
    }

    // Close the popup
    closeEditPopup.addEventListener('click', () => {
        console.log("Close button clicked");
        editPopupForm.style.display = 'none';
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            console.log('Edit button clicked');

            console.log('Before:', editPopupForm.style.display);


            const { id, title, imageurl, price, date, location, company } = e.target.dataset;

            // Set the form fields with the current values
            document.getElementById('edit-imageUrl').value = imageurl;
            document.getElementById('edit-title').value = title;
            document.getElementById('edit-price').value = price;
            document.getElementById('edit-date').value = date;
            document.getElementById('edit-location').value = location;
            document.getElementById('edit-company').value = company;


            // Store the ID for later use
            editDataForm.dataset.id = id;

            // Display the popup
            editPopupForm.style.display = 'flex';

            console.log('After:', editPopupForm.style.display);
        }
    })



    // Handle form submission
    editDataForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = editDataForm.dataset.id;
        const formData = new FormData(editDataForm);
        const updatedEvent = {};

        // Convert form data to a JSON object
        formData.forEach((value, key) => {
            updatedEvent[key] = value;
        });

        try {
            const response = await fetch(`http://localhost:3000/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Event updated successfully!');
                location.reload(); // Refresh to reflect changes
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update the event. Please try again.');
        }
    });

})
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the delete confirmation popup and buttons
    const deleteConfirmationPopup = document.getElementById('delete-confirmation-popup');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    const feedbackMessage = document.getElementById('feedback-message');

    let itemIdToDelete = null; // To store the ID of the item to be deleted

    // Function to open the delete confirmation popup
    function openDeleteConfirmation(event) {
        itemIdToDelete = event.target.getAttribute('data-id'); // Get the item ID from the data attribute
        console.log(`Open delete confirmation for item ID: ${itemIdToDelete}`); // Log the item ID
        deleteConfirmationPopup.style.display = 'flex'; // Show the popup
    }

    // Function to attach event listeners to delete buttons
    function attachDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete');
        console.log(`Found ${deleteButtons.length} delete buttons.`); // Log the number of buttons found

        deleteButtons.forEach(button => {
            console.log('Attaching click event to delete button:', button); // Log each button
            button.addEventListener('click', openDeleteConfirmation); // Attach click event
        });
    }

    // Attach listeners after rendering the buttons
    attachDeleteListeners();

    // Event listener for the cancel delete button
    cancelDeleteButton.addEventListener('click', () => {
        console.log('Cancel delete button clicked. Hiding confirmation popup.'); // Log cancel action
        deleteConfirmationPopup.style.display = 'none'; // Hide the confirmation popup
        itemIdToDelete = null; // Reset the item ID
    });

    // Event listener for the confirm delete button
    confirmDeleteButton.addEventListener('click', async () => {
        console.log('Confirm delete button clicked.');
        if (itemIdToDelete) {
            try {
                // Show feedback message for deleting
                feedbackMessage.innerText = 'Deleting event...';
                feedbackMessage.style.display = 'block';

                // Send a DELETE request to remove the item
                const response = await fetch(`http://localhost:3000/api/events/${itemIdToDelete}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete the event');
                }

                console.log('Event deleted successfully');

                // Optionally, remove the item from the UI
                const eventItem = document.querySelector(`.event-item[data-id="${itemIdToDelete}"]`);
                if (eventItem) {
                    eventItem.remove(); // Remove the event item from the UI
                    console.log(`Event item with ID ${itemIdToDelete} removed from UI`);
                }

                // Show success feedback
                feedbackMessage.innerText = 'Event deleted successfully!';
                feedbackMessage.style.color = 'green'; // Change color to green
                setTimeout(() => {
                    feedbackMessage.style.display = 'none'; // Hide feedback after 3 seconds
                }, 3000);
                
                deleteConfirmationPopup.style.display = 'none'; // Hide the confirmation popup
                itemIdToDelete = null; // Reset itemIdToDelete
            } catch (error) {
                console.error('Error:', error);
                feedbackMessage.innerText = 'Error deleting event. Please try again.';
                feedbackMessage.style.color = 'red'; // Change color to red
                feedbackMessage.style.display = 'block'; // Show error feedback
            }
        } else {
            console.error('No item ID to delete');
        }
    });
});
