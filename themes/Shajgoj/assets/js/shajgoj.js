function delete_cookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}
document.addEventListener('readystatechange', function(event) {
    if (event.target.readyState === "complete") {
        var overlay = document.createElement("div");
        overlay.id = "jas-content-overlay";
        var selection = document.querySelector("#jas-content") !== null;
        if (selection) {
            document.querySelector("#jas-content").appendChild(overlay);
            document.querySelector("#primary_menu_container").onmouseover = function() {
                document.querySelector("#jas-content-overlay").style.display = "block";
                document.querySelector("#mega-menu-sub-primary-menu li.mega-menu-item:first-child a").style.color = "var(--pink)";
            };
            document.querySelector("#primary_menu_container").onmouseout = function() {
                document.querySelector("#jas-content-overlay").style.display = "none";
                document.querySelector("#mega-menu-sub-primary-menu li.mega-menu-item:first-child a").style.color = "#333";
            };
        }
        var a2cart = document.createElement('div');
        a2cart.id = 'a2cart';
        a2cart.innerHTML = "<p>Added To cart</p>";
        document.body.appendChild(a2cart);
        jQuery(document.body).on('added_to_cart', function() {
            jQuery('body').trigger('update_checkout');
        });
        jQuery(document.body).on('removed_from_cart', function() {
            jQuery('body').trigger('update_checkout');
        });
        delete_cookie('spu_closing_eid_2');
        delete_cookie('spu_closing_eid_2');
        delete_cookie('spu_conversion_150608');
        delete_cookie('spu_closing_150608');
    }
});

function updateShajgojCart() {
    document.querySelector(".update-cart").click();
}
jQuery(document).ready(function($) {
    if (document.querySelector("input#billing_phone")) {
        var shaj_billing_phone = document.querySelector("input#billing_phone");
        shaj_billing_phone.oninput = function() {
            var regex = /^(?:\+?88|0088)?01[13-9]\d{8}$/g;
            if (this.value.match(regex)) {
                shaj_billing_phone.style.background = "#4caf50";
                shaj_billing_phone.style.color = "white";
            } else {
                shaj_billing_phone.style.background = "#ff5722";
                shaj_billing_phone.style.color = "white";
            }
        };
    }
    document.querySelectorAll('.woocommerce-review__author').forEach(function(element, index) {
        if (!isNaN(element.textContent)) element.textContent = 'Anonymous';
    });
    $(document).on('click', event => {
        const element = $(event.target);
        if (element.hasClass("shaj_freq")) {
            var category = '';
            var action = '';
            var label = '';
            if (element.hasClass("ga_upsell")) {
                category = 'upsell';
                label = "Recommanded for you ";
            } else if (element.hasClass("ga_cross_sell")) {
                category = 'cross_sell';
                label = "Customers also viewed ";
            } else if (element.hasClass("ga_offer_sell")) {
                category = 'offer_sell';
                label = "You may also like ";
            } else if (element.hasClass("ga_freq_buy")) {
                category = 'frequently_bought_together';
                label = "Frequently bought together ";
            }
            if (element.hasClass("ga_add2cart")) {
                action = 'add2cart';
                label = label + "product added to cart";
            } else if (element.hasClass("freq_add2cart_btn")) {
                action = 'add2cart';
                label = label + "product added to cart";
            } else if (element.hasClass("ga_link_open")) {
                action = 'open_product';
                label = label + "product opened on tab";
            }
            ga('send', 'event', category, action, label);
        }
    });
});