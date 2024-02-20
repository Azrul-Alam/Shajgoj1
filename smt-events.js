document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        let user_found = Cookies.get("shajgoj_logged_in").split("|") ? .[1] || "";
        if (typeof smartech === "function") {
            console.log("SMT Event Listener Added");
            smartech("identify", user_found);
            jQuery(document.body).on("added_to_cart", (event, fragments, cart_hash, button) => {
                let product_details = JSON.parse(button ? .[0] ? .dataset ? .product_details || "null");
                smartech("dispatch", "Add To Cart", generateNetcoreProduct(product_details));
            });
            jQuery(document.body).on("removed_from_cart", (event, fragments, cart_hash, button) => {
                let product_details = JSON.parse(button ? .[0] ? .dataset ? .product_details || "null");
                smartech("dispatch", "Removed From Cart", generateNetcoreProduct(product_details));
            });
            if (document.querySelector(".product_details_data")) {
                let product_details = JSON.parse(document.querySelector(".product_details_data").dataset ? .product_details || "null");
                smartech("dispatch", "Product View", generateNetcoreProduct(product_details));
            }
            if (window.location.href.includes("checkout/order-received") && google_tag_params ? .orderData) {
                let orderAttr = google_tag_params ? .orderData ? .attributes;
                let orderTotal = google_tag_params ? .orderData ? .totals;
                let orderItems = google_tag_params ? .orderData ? .items || [];
                let orderData = {
                    orderid: orderAttr ? .order_number || "",
                    cart_total: Number(orderTotal ? .subtotal || 0),
                    grand_total: Number(orderTotal ? .total || 0),
                    currency: "BDT",
                    shippingfee: 49,
                    discount: Number(orderTotal ? .discount_total || 0),
                    address: google_tag_params ? .orderData ? .customer ? .billing ? .address_1 || "",
                    district: google_tag_params ? .orderData ? .customer ? .billing ? .city || "",
                    usertype: "New/Returning",
                    total_items: orderItems ? .length || 0,
                    Source: "Web",
                    items: orderItems.map((data) => {
                        return {
                            productname: data ? .name,
                            SKU: data ? .sku,
                            brand: data ? .brand || "",
                            category1: data ? .category || "",
                            category2: "",
                            category3: "",
                            web_price: data.price,
                            app_price: data.price,
                            prqt: data.quantity,
                            instock: data.stocklevel > 0 ? "Yes" : "No",
                            image: "",
                            produrl: "",
                            Source: "Web",
                        };
                    }),
                };
                const orderIDfromLocalStorage = localStorage.getItem("order_received");
                if (orderData.orderid != orderIDfromLocalStorage) {
                    localStorage.setItem("order_received", orderData.orderid);
                    smartech("dispatch", "Product Purchase", orderData);
                    window.BOXX_PURCHASED_PRODUCT_PROPS = orderItems.map((data) => {
                        return {
                            productid: data.id,
                            msp: data.price
                        };
                    });
                }
            }
        }
    }
    const search_params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (search_params ? .is_app_ui === "true") {
        let css = `#smartbanner, header, footer, .page-head.pr.tc, div#floating-cart, #chat-support {display: none !important}`;
        let styleElem = document.createElement('style');
        styleElem.textContent = css;
        document.head.append(styleElem);
    }
});

function generateNetcoreProduct(data) {
    if (!data) {
        return null;
    }
    return {
        productname: data ? .name,
        SKU: data ? .sku,
        brand: data ? .brands ? .[0] || "",
        category1: data ? .categories ? .[0] || "",
        category2: data ? .categories ? .[1] || "",
        category3: data ? .categories ? .[2] || "",
        web_price: data.price,
        app_price: data.price,
        prqt: 1,
        instock: data.stock_status == "instock" ? "Yes" : "No",
        image: data.image,
        produrl: data.url,
        Source: "Web",
    };
}