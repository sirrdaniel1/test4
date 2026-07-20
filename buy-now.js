const params = new URLSearchParams(window.location.search);

const productDetails = {
    name: params.get("name") || "HCMN item",
    price: params.get("price") || "EGP 0",
    image: params.get("image") || "images/logo.png",
    description: params.get("description") || "Premium piece from HCMN"
};

const checkoutName = document.getElementById("checkoutName");
const checkoutPrice = document.getElementById("checkoutPrice");
const checkoutDescription = document.getElementById("checkoutDescription");
const checkoutImage = document.getElementById("checkoutImage");
const checkoutForm = document.getElementById("checkoutForm");
const formMessage = document.getElementById("formMessage");
const selectedSizeInput = document.getElementById("selectedSize");
const CART_KEY = "hcmnCart";

function getCart() {
    const saved = window.localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveCart(items) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(item) {
    const cart = getCart();
    cart.push(item);
    saveCart(cart);
}

if (checkoutName) checkoutName.textContent = productDetails.name;
if (checkoutPrice) checkoutPrice.textContent = productDetails.price;
if (checkoutDescription) checkoutDescription.textContent = productDetails.description;
if (checkoutImage) {
    checkoutImage.src = productDetails.image;
    checkoutImage.alt = productDetails.name;
}

if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const customerName = document.getElementById("customerName").value.trim();
        const selectedSize = selectedSizeInput ? selectedSizeInput.value : "Size not selected";

        const cartItem = {
            name: productDetails.name,
            price: productDetails.price,
            image: productDetails.image,
            description: productDetails.description,
            size: selectedSize,
            customerName,
            address: document.getElementById("address").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            notes: document.getElementById("notes").value.trim()
        };

        addToCart(cartItem);

        if (formMessage) {
            formMessage.textContent = `Thanks ${customerName || "there"}! Your ${selectedSize} order for ${productDetails.name} is now saved to cart.`;
        }
        checkoutForm.reset();
        // Redirect to cart so the user sees their saved item
        setTimeout(() => {
            window.location.href = "cart.html";
        }, 300);
    });
}