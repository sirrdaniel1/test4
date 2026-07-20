const cartItemsContainer = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const ordersSection = document.getElementById("ordersSection");
const ordersList = document.getElementById("ordersList");
const CART_KEY = "hcmnCart";
const ORDERS_KEY = "hcmnOrders";

function getCart() {
    const stored = window.localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCart(items) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function getOrders() {
    const stored = window.localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders) {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function deleteOrder(orderId) {
    const id = Number(orderId);
    const orders = getOrders().filter(order => order.id !== id);
    saveOrders(orders);
    renderOrders();
}

function renderOrders() {
    const orders = getOrders();
    if (!ordersSection || !ordersList) return;

    if (orders.length === 0) {
        ordersSection.classList.add("hidden");
        ordersList.innerHTML = "";
        return;
    }

    ordersSection.classList.remove("hidden");
    ordersList.innerHTML = orders.map(order => {
        const lines = Array.isArray(order.lines) ? order.lines : [];
        const placed = order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown";
        const linesHtml = lines.map(line => `<p>${line.count}x ${line.name} (${line.size}) - ${line.lineTotal}</p>`).join("");
        return `
        <div class="order-card">
            <h3>Order #${order.id}</h3>
            <p>Status: <strong>${order.status}</strong></p>
            <p>Placed: ${placed}</p>
            <div class="order-summary">
                ${linesHtml}
            </div>
            <p><strong>Total: ${order.totalPrice || "EGP 0"}</strong></p>
            <button type="button" data-order-id="${order.id}" class="delete-order-btn">Delete order</button>
        </div>
    `;
    }).join("");

    document.querySelectorAll(".delete-order-btn").forEach(button => {
        button.addEventListener("click", () => {
            deleteOrder(button.dataset.orderId);
            renderCart();
        });
    });
}

function renderCart() {
    const cartItems = getCart();
    if (!cartItemsContainer || !cartTotal || !cartEmpty || !confirmOrderBtn) return;
    renderOrders();
    confirmOrderBtn.disabled = cartItems.length === 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "";
        cartEmpty.style.display = "block";
        cartTotal.textContent = "EGP 0";
        return;
    }

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>Size: ${item.size}</p>
                <p>Price: ${item.price}</p>
            </div>
        </div>
    `).join("");

    cartEmpty.style.display = "none";

    const total = cartItems.reduce((sum, item) => {
        const numeric = parseInt(item.price.replace(/[^0-9]/g, ""), 10) || 0;
        return sum + numeric;
    }, 0);
    cartTotal.textContent = `EGP ${total}`;
}

if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        saveCart([]);
        renderCart();
    });
}

if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", () => {
        const items = getCart();
        if (items.length === 0) {
            alert("Your cart is empty. Add items from the checkout page before confirming.");
            return;
        }

            const grouped = items.reduce((acc, item) => {
                const key = `${item.name}||${item.size}`;
                if (!acc[key]) acc[key] = { name: item.name, size: item.size, price: item.price, count: 0 };
                acc[key].count += 1;
                return acc;
            }, {});

            const lines = Object.values(grouped).map(g => {
                const unit = parseInt(g.price.replace(/[^0-9]/g, ""), 10) || 0;
                return {
                    name: g.name,
                    size: g.size,
                    count: g.count,
                    unitPrice: `EGP ${unit}`,
                    lineTotal: `EGP ${unit * g.count}`
                };
            });

            const totalPrice = `EGP ${lines.reduce((s, l) => s + (parseInt(l.lineTotal.replace(/[^0-9]/g, ""), 10) || 0), 0)}`;
            const signature = lines.map(l => `${l.name}|${l.size}`).sort().join(";");

            const orders = getOrders();
            const existing = orders.find(o => o.signature === signature);
            if (existing) {
                // merge counts into existing order
                lines.forEach(l => {
                    const ex = existing.lines.find(x => x.name === l.name && x.size === l.size);
                    if (ex) {
                        ex.count += l.count;
                        const unit = parseInt(ex.unitPrice.replace(/[^0-9]/g, ""), 10) || 0;
                        ex.lineTotal = `EGP ${unit * ex.count}`;
                    } else {
                        existing.lines.push(l);
                    }
                });
                existing.totalPrice = `EGP ${existing.lines.reduce((s, ln) => s + (parseInt(ln.lineTotal.replace(/[^0-9]/g, ""), 10) || 0), 0)}`;
                existing.updatedAt = new Date().toISOString();
            } else {
                const nextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
                const order = {
                    id: nextId,
                    lines,
                    status: "Pending",
                    signature,
                    totalPrice,
                    createdAt: new Date().toISOString()
                };
                orders.push(order);
            }

            saveOrders(orders);
        saveCart([]);
        renderCart();
        renderOrders();
    });
}


renderCart();