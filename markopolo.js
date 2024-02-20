document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        let user_found = Cookies.get("shajgoj_logged_in").split("|") ? .[1] || "";
        jQuery(document.body).on("added_to_cart", (event, fragments, cart_hash, button) => {
            let product_details = JSON.parse(button ? .[0] ? .dataset ? .product_details || "null");
            product = generateMarkoPoloProduct(product_details);
            mtag('event', {
                type: 'AddToCart',
                value: parseInt(product ? .price) || 0,
                currency: 'BDT',
                products: [product]
            });
        });
        jQuery(document.body).on("removed_from_cart", (event, fragments, cart_hash, button) => {
            let product_details = JSON.parse(button ? .[0] ? .dataset ? .product_details || "null");
            product = generateMarkoPoloProduct(product_details);
            mtag('event', {
                type: 'RemoveFromCart',
                value: parseInt(product ? .price) || 0,
                currency: 'BDT',
                products: [product]
            });
        });
        if (document.querySelector(".product_details_data")) {
            let product_details = JSON.parse(document.querySelector(".product_details_data").dataset ? .product_details || "null");
            product = generateMarkoPoloProduct(product_details);
            mtag('event', {
                type: 'ViewItem',
                value: parseInt(product ? .price) || 0,
                currency: 'BDT',
                products: [product],
                content_type: 'product'
            });
        }
        if (window.location.href.includes("checkout/order-received") && google_tag_params ? .orderData) {
            let orderAttr = google_tag_params ? .orderData ? .attributes;
            let orderTotal = google_tag_params ? .orderData ? .totals;
            let orderItems = google_tag_params ? .orderData ? .items || [];
            let orderData = {
                type: 'Purchase',
                transaction_id: orderAttr ? .order_number || "",
                value: Number(orderTotal ? .total || 0),
                currency: "BDT",
                shipping_cost: Number(orderTotal ? .shipping_total || 0),
                phone: google_tag_params ? .orderData ? .customer ? .billing ? .phone || "",
                email: google_tag_params ? .orderData ? .customer ? .billing ? .email || "",
                products: orderItems.map((data) => {
                    return {
                        id: data ? .id,
                        name: data ? .name,
                        category: data ? .category || "",
                        variant: "",
                        description: data ? .description,
                        price: data.price,
                        quantity: data.quantity,
                    };
                }),
            };
            const markOrderIDfromLocalStorage = localStorage.getItem("mark_order_received");
            if (orderData.transaction_id != markOrderIDfromLocalStorage) {
                localStorage.setItem("mark_order_received", orderData.transaction_id);
                mtag('event', orderData);
            }
        } else if (window.location.href.includes("/checkout/")) {
            let cart_details = JSON.parse(document.querySelector(".cart_details_data").dataset ? .cart_details || "null");
            cart_proudcts = cart_details ? .proudcts;
            cart_total = parseInt(cart_details ? .total) + 49;
            item_count = cart_details ? .item_count;
            marko_products = [];
            cart_proudcts.forEach((cart_proudct) => {
                marko_products.push(generateMarkoPoloProduct(cart_proudct));
            });
            mtag('event', {
                type: "BeginCheckout",
                value: cart_total || 0,
                currency: 'BDT',
                products: marko_products,
            });
        }

        function handleCartOpened(event_type = "ViewCart") {
            let cart_details = JSON.parse(document.querySelector(".cart_details_data").dataset ? .cart_details || "null");
            cart_proudcts = cart_details ? .proudcts;
            cart_total = parseInt(cart_details ? .total);
            item_count = cart_details ? .item_count;
            marko_products = [];
            cart_proudcts.forEach((cart_proudct) => {
                marko_products.push(generateMarkoPoloProduct(cart_proudct));
            });
            mtag('event', {
                type: "ViewCart",
                value: cart_total || 0,
                currency: 'BDT',
                products: marko_products,
            });
        }

        function mutationCallback(mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (document.body.classList.contains('cart-opened')) {
                        handleCartOpened();
                    }
                }
            }
        }
        var observer = new MutationObserver(mutationCallback);
        var config = {
            attributes: true,
            attributeFilter: ['class']
        };
        observer.observe(document.body, config);
    }
});

function generateMarkoPoloProduct(data) {
    if (!data) {
        return null;
    }
    return {
        id: data ? .id,
        name: data ? .name,
        category: data ? .categories ? .[0] || "",
        variant: "",
        description: data ? .description,
        quantity: data ? .quantity || 1,
        price: parseInt(data ? .price),
    };
}