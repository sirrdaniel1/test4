const products = [
    {
        name: "Diamond Black Tee",
        price: "EGP 550",
        tag: "Best Seller",
        category: "best-seller",
        image: "images/tshirts/Diamond-Black.jpeg",
        description: "Soft cotton • breathable fit"
    },
    {
        name: "Hunter Green Tee",
        price: "EGP 600",
        tag: "New",
        category: "new",
        image: "images/tshirts/Hunter-Green.jpeg",
        description: "Relaxed fit • everyday comfort"
    },
    {
        name: "Off White Tee",
        price: "EGP 580",
        tag: "Best Seller",
        category: "best-seller",
        image: "images/tshirts/Off-White.jpeg",
        description: "Modern streetwear look"
    },
    {
        name: "Pacific Blue Tee",
        price: "EGP 520",
        tag: "New",
        category: "new",
        image: "images/tshirts/Pacific-Blue.jpeg",
        description: "Clean design • premium fabric"
    },
    {
        name: "Silver Grey Tee",
        price: "EGP 620",
        tag: "Best Seller",
        category: "best-seller",
        image: "images/tshirts/Silver-Grey.jpeg",
        description: "Bold graphic • premium cotton"
    },
    {
        name: "Mud Brown",
        price: "EGP 560",
        tag: "New",
        category: "new",
        image: "images/tshirts/Brown.jpeg",
        description: "Fresh color • easy styling"
    }
];

const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

let activeFilter = "all";

function renderProducts() {
    const filteredProducts = products.filter(product => {
        return activeFilter === "all" || product.category === activeFilter;
    });

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-body">
                <span class="tag">${product.tag}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-actions">
                    <span class="price">${product.price}</span>
                    <button
                        class="buy-btn"
                        type="button"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-image="${product.image}"
                        data-description="${product.description}"
                    >
                        Buy now
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    document.querySelectorAll(".buy-btn").forEach(button => {
        button.addEventListener("click", () => {
            const params = new URLSearchParams({
                name: button.dataset.name,
                price: button.dataset.price,
                image: button.dataset.image,
                description: button.dataset.description
            });
            window.location.href = `buy-now.html?${params.toString()}`;
        });
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        activeFilter = button.getAttribute("data-filter");
        renderProducts();
    });
});

renderProducts();