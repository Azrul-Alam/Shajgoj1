$ = jQuery;
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
        if (element.hasClass("ga_link_open")) {
            action = 'open_product';
            label = label + "product opened on tab";
        }
        if (action != '') {
            ga('send', 'event', category, action, label);
        }
    }
    if (element.hasClass("alg-checkout-link")) {
        ga('send', 'event', 'algolia_search_product', 'add2cart', 'Algolila Search product added to cart');
    }
});

function generate_related_product_html(product, product_class, ga_class) {
    str = "";
    sale_str = "";
    if (product.on_sale == true) sale_str = "<span class='freq_sale_ribbon'>SALE</span>";
    if (product.stock_quantity <= 0) {
        disabled = "disabled";
        add2cartStr = "OUT OF STOCK";
    } else {
        disabled = "";
        add2cartStr = "ADD TO CART";
    }
    product_unit = "";
    product_sizes = "";
    product_colors = "";
    if (product.hasOwnProperty('attributes')) {
        product.attributes.forEach((att, i) => {
            if (att.hasOwnProperty("name") && att.name == 'Unit') product_unit = att.options[0];
            if (att.hasOwnProperty("name") && att.name == 'Size' && att.hasOwnProperty("options") && att.options.length > 0) product_sizes = "(" + att.options.length + " Sizes) ";
            if (att.hasOwnProperty("name") && att.name == 'Shade' && att.hasOwnProperty("options") && att.options.length > 0) product_colors = "(" + att.options.length + " Shades)";
        });
    }
    if (product_unit != '' && product.weight && product.weight != '') product_unit = "(" + product.weight + " " + product_unit + ") ";
    product_unit = product_unit + product_colors + product_sizes;
    product_unit = product_unit + "&nbsp;"
    var new_customer_price = 0;
    var new_customer_price_html = "";
    if (product.hasOwnProperty('meta_data') && product.meta_data.length > 0) {
        var promotion_starts_from = promotion_ends_on = promotion_price = app_percent = 0;
        product.meta_data.forEach((meta, i) => {
            if (meta.key == "promotion_start_date") promotion_starts_from = parseInt(meta.value);
            else if (meta.key == "promotion_end_date") promotion_ends_on = parseInt(meta.value);
            else if (meta.key == "promotion_price") promotion_price = parseInt(meta.value);
            else if (meta.key == "app_percent") app_percent = parseInt(meta.value);
        });
        var now = Math.floor(new Date().getTime() / 1000);
        if (now <= promotion_ends_on && now >= promotion_starts_from && promotion_price != 0) {
            new_customer_price = promotion_price;
            new_customer_price_html = '<div class="nup_promotion nup_container"><span class="scissors">✂</span><div class="nup_message">NEW CUSTOMER PRICE</div><div class="nup_price">৳&nbsp;' + new_customer_price + '</div></div>';
        }
    }
    str = str + "<div class='" + product_class + "'>";
    str = str + '<div class="product_page shajgoj_upsell">';
    str = str + "<div class='upsell_product'>";
    str = str + "<div class='upsell_img'><a class='shaj_freq ga_link_open " + ga_class + "' href='" + product.permalink + "'>";
    str = str + '<img width="570" height="570" src="' + product.images[0].src.replace("images.shajgoj.com", "shop.shajgoj.com") + '" class="card-img-top" alt="" sizes="(max-width: 570px) 100vw, 570px">';
    str = str + "</a></div>";
    str = str + "<div class='upsell_product_info'>";
    str = str + '<div class="upsell_name"><a class="shaj_freq ga_link_open ' + ga_class + '" href="' + product.permalink + '">' + product.name + '</a></div>';
    str = str + '<div class="upsell_weight">' + product_unit + '</div>';
    str = str + sale_str;
    str = str + '<div class="upsell_price">' + product.price_html + '</div>';
    if (app_percent && app_percent > 0) {
        app_price = Math.round(product.price * (100 - app_percent) / 100);
        str = str + '<div style="font-size: .8rem;color: var(--pink);">App Price: ৳ ' + app_price + '.00</div>';
    } else {
        str = str + '<div style="font-size: .8rem;color: var(--pink);">&nbsp;</div>';
    }
    str = str + "</div>";
    str = str + "</div>";
    str = str + new_customer_price_html;
    str = str + '<div class="card-body btn-atc atc-popup">';
    let product_details = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        qt: 1,
        stock_status: product.in_stock ? 'instock' : 'outofstock',
        image: product.images[0].src.replace("images.shajgoj.com", "shop.shajgoj.com"),
        url: product.permalink,
        categories: product ? .categories ? .map(a => a.name),
        brands: product ? .brands ? .map(a => a.name),
    }
    if (product.type == 'simple') {
        if (disabled == "") {
            str = str + '<form action="' + product.permalink + '" class="cart" method="post" enctype="multipart/form-data">';
            str = str + '<div class="quantity pr fl mr__10"><input type="number" class="input-text qty text tc" step="1" min="0" max="" name="quantity" value="1" title="Qty" size="4" pattern="[0-9]*" inputmode="numeric" aria-labelledby="Makeup Revolution Pro Fix Oil Control Fixing Spray quantity"><div class="qty tc"><a class="plus db cb pa" href="javascript:void(0);"><i class="fa fa-plus"></i></a><a class="minus db cb pa" href="javascript:void(0);"><i class="fa fa-minus"></i></a></div></div>';
            str = str + '<input type="hidden" name="add-to-cart" value="' + product.id + '">';
            str = str + '<button type="submit" data-quantity="" name="add-to-cart" value="' + product.id + '" data-product_id="' + product.id + '" data-product_details=\'' + JSON.stringify(product_details) + '\' class="single_add_to_cart_button ajax_add_to_cart add_to_cart_button button alt shaj_freq ga_add2cart ' + ga_class + " " + disabled + '">' + add2cartStr + '</button>';
            str = str + '</form>';
        } else {
            if (disabled != "") str = str + "<button data-product_id='" + product.id + "' data-product_title='" + product.name + "' data-product_img='" + product.images[0].src.replace("images.shajgoj.com", "shop.shajgoj.com") + "' data-product_cap='" + product_unit + "' class='request_restock product_recom'>REQUEST STOCK</button>";
        }
    } else {
        str = str + "<a data-product_id='" + product.id + "' href='" + product.permalink + "' target='_blank' data-product_title='" + product.name + "' class='btn-collection'>VIEW COLLECTION</button>";
    }
    str = str + '</div>';
    str = str + '</div>';
    str = str + '</div>';
    return str;
}
document.addEventListener("DOMContentLoaded", function(event) {
    if (window.location.href.includes("/product/")) {
        classes = document.body.classList;
        product_id = 0;
        product_type = "";
        classes.forEach((item, i) => {
            if (item.includes("postid-")) product_id = item.replace("postid-", "");
            if (item === "single") product_type = "single";
        });
        if (product_id) {
            var related_api = "https://c.shajgoj.com/api/products/related_product/" + product_id;
            $.getJSON(related_api).done(function(data) {
                related_products = data.related_products;
                str = "";
                for (i = 0; i < 5; i++) {
                    product = related_products[i];
                    product_class = "";
                    ga_class = "ga_upsell";
                    str = str + generate_related_product_html(product, product_class, ga_class);
                }
                $(".shajgoj_promoted_products_container.shajgoj_upsell_container").html(str);
                product_1 = data.freq_bought_together[0];
                product_2 = data.freq_bought_together[1];
                if (product_1 == null || product_2 == null) return;
                let product_details_1 = {
                    id: product_1.id,
                    name: product_1.name,
                    sku: product_1.sku,
                    price: product_1.price,
                    qt: 1,
                    stock_status: product_1.in_stock ? 'instock' : 'outofstock',
                    image: product_1.images[0].src,
                    url: product_1.permalink,
                    categories: product_1 ? .categories ? .map(a => a.name),
                    brands: product_1 ? .brands ? .map(a => a.name),
                }
                let product_details_2 = {
                    id: product_2.id,
                    name: product_2.name,
                    sku: product_2.sku,
                    price: product_2.price,
                    qt: 1,
                    stock_status: product_2.in_stock ? 'instock' : 'outofstock',
                    image: product_2.images[0].src,
                    url: product_2.permalink,
                    categories: product_2 ? .categories ? .map(a => a.name),
                    brands: product_2 ? .brands ? .map(a => a.name),
                }
                total_price = product_1.price + product_2.price;
                str = '';
                if (product_1 && product_2) {
                    str = "<div class='freq_header'><h4>Frequently bought together</h4></div>";
                    str = str + "<div class='freq_main'>";
                    str = str + "<div class='freq_photoset'>";
                    str = str + "<div class='freq_photo_1'>";
                    str = str + '<img width="570" height="570" src="' + product_1.images[0].src + '" sizes="(max-width: 570px) 100vw, 570px">';
                    str = str + "</div>";
                    str = str + "<div class='freq_addition'>+</div>";
                    str = str + "<div class='freq_photo_2'>";
                    str = str + "<a class='shaj_freq ga_freq_buy ga_link_open' target='_blank' href='" + product_2.permalink + "'>";
                    str = str + '<img width="570" height="570" src="' + product_2.images[0].src + '" sizes="(max-width: 570px) 100vw, 570px">';
                    str = str + "</a>";
                    str = str + "</div>";
                    str = str + "</div>";
                    str1 = "";
                    str1 = str1 + "<div class='freq_action'>";
                    str1 = str1 + "<div class='freq_price'>Total price: <span>৳ " + total_price + "</span></div>";
                    str1 = str1 + "<div class='freq_add2cart'>";
                    str1 = str1 + '<div style="display:none !important;" class="card-body atc-popup">';
                    str1 = str1 + '<form action="' + product_1.permalink + '" class="cart" method="post" enctype="multipart/form-data">';
                    str1 = str1 + '<div class="quantity pr fl mr__10"><input type="number" class="input-text qty text tc" step="1" min="0" max="" name="quantity" value="1" title="Qty" size="4" pattern="[0-9]*" inputmode="numeric" aria-labelledby="Makeup Revolution Pro Fix Oil Control Fixing Spray quantity"><div class="qty tc"><a class="plus db cb pa" href="javascript:void(0);"><i class="fa fa-plus"></i></a><a class="minus db cb pa" href="javascript:void(0);"><i class="fa fa-minus"></i></a></div></div>';
                    str1 = str1 + '<input type="hidden" name="add-to-cart" value="' + product_1.id + '">';
                    str1 = str1 + '<button type="submit" data-quantity="" name="add-to-cart" value="' + product_1.id + '" data-product_id="' + product_1.id + '" data-product_details=\'' + product_details_1 + '\' class="single_add_to_cart_button ajax_add_to_cart add_to_cart_button button alt">Add To Cart</button>';
                    str1 = str1 + '</form>';
                    str1 = str1 + '</div>';
                    str1 = str1 + '<div style="display:none !important;" class="card-body atc-popup">';
                    str1 = str1 + '<form action="' + product_2.permalink + '" class="cart" method="post" enctype="multipart/form-data">';
                    str1 = str1 + '<div class="quantity pr fl mr__10"><input type="number" class="input-text qty text tc" step="1" min="0" max="" name="quantity" value="1" title="Qty" size="4" pattern="[0-9]*" inputmode="numeric" aria-labelledby="Makeup Revolution Pro Fix Oil Control Fixing Spray quantity"><div class="qty tc"><a class="plus db cb pa" href="javascript:void(0);"><i class="fa fa-plus"></i></a><a class="minus db cb pa" href="javascript:void(0);"><i class="fa fa-minus"></i></a></div></div>';
                    str1 = str1 + '<input type="hidden" name="add-to-cart" value="' + product_2.id + '">';
                    str1 = str1 + '<button type="submit" data-quantity="" name="add-to-cart" value="' + product_2.id + '" data-product_id="' + product_2.id + '" data-product_details=\'' + product_details_2 + '\' class="single_add_to_cart_button ajax_add_to_cart add_to_cart_button button alt">Add To Cart</button>';
                    str1 = str1 + '</form>';
                    str1 = str1 + '</div>';
                    str1 = str1 + "<button class='shaj_freq ga_freq_buy freq_add2cart_btn'>Add both to Cart</button>";
                    str1 = str1 + "</div>";
                    str1 = str1 + "</div>";
                    str = str + str1;
                    str = str + "<div class='freq_dont_miss'></div>";
                    product_1_unit = "";
                    product_1.attributes.forEach((att, i) => {
                        if (att.name == 'Unit') product_1_unit = att.options[0];
                    });
                    if (product_1_unit != '' && product_1.weight && product_1.weight != '') product_1_unit = "(" + product_1.weight + " " + product_1_unit + ")";
                    product_2_unit = "";
                    product_2.attributes.forEach((att, i) => {
                        if (att.name == 'Unit') product_2_unit = att.options[0];
                    });
                    if (product_2_unit != '' && product_2.weight && product_2.weight != '') product_2_unit = "(" + product_2.weight + " " + product_2_unit + ")";
                    str = str + "</div>";
                    str = str + "<div class='freq_info'>";
                    str = str + "<div class='freq_info_product'>";
                    str = str + '<i class="fa fa-check-square"></i>';
                    str = str + "<div class='freq_name'>";
                    str = str + "<b>This Item:</b>";
                    str = str + "<a target='_blank' href='" + product_1.permalink + "'>" + product_1.name + "</a>" + product_1_unit;
                    str = str + "</div>";
                    str = str + "<span>" + product_1.price_html + "</span>";
                    str = str + "</div>";
                    str = str + "<div class='freq_info_product'>";
                    str = str + '<i class="fa fa-check-square"></i>';
                    str = str + "<div class='freq_name'><a target='_blank' href='" + product_2.permalink + "'>" + product_2.name + "</a>" + product_2_unit + "</div>";
                    str = str + "<span>" + product_2.price_html + "</span>";
                    str = str + "</div>";
                    str = str + "</div>";
                    str = str + str1;
                }
                $(".frequently_bought").html(str);
                product_class = "jas-col-lg-3 jas-col-md-4 jas-col-sm-12 jas-col-xs-12";
                ga_class = "ga_cross_sell";
                str = "";
                for (i = 0; i < 12; i++) {
                    product = data.related_products[i];
                    str = str + generate_related_product_html(product, product_class, ga_class);
                }
                $(".cross_sell .shajgoj_promoted_products_container").html(str);
                product_class = "jas-col-lg-3 jas-col-md-4 jas-col-sm-12 jas-col-xs-12";
                ga_class = "ga_offer_sell";
                str = "";
                for (i = 0; i < 12; i++) {
                    product = data.related_cat_offers[i];
                    str = str + generate_related_product_html(product, product_class, ga_class);
                }
                $(".cross_sell .shajgoj_promoted_products_container.offer_sale").html(str);
            });
        }
    }
});

function print_products(api, selector, page = "", per_page = "", page_and = "") {
    if (page != "") gson_api = api + page_and + "page=" + page + "&per_page=" + per_page;
    $.getJSON(gson_api).done(function(data) {
        product_class = "jas-col-lg-3 jas-col-md-4 jas-col-sm-12 jas-col-xs-12";
        ga_class = "ga_cross_sell";
        str = "";
        data.forEach((product, i) => {
            str = str + generate_related_product_html(product, product_class, ga_class);
        });
        $(selector).append(str);
        if (data.length == per_page) {
            print_products(api, selector, page + 1, per_page, page_and);
        }
    });
    return;
}

function print_shortcode_products(api, selector, page = "", per_page = "", page_and = "") {
    if (page != "") gson_api = api + page_and + "page=" + page + "&per_page=" + per_page;
    $.getJSON(gson_api).done(function(data) {
        product_class = "jas-col-lg-3 jas-col-md-4 jas-col-sm-12 jas-col-xs-12";
        str = "";
        data.forEach((product, i) => {
            ga_class = "upsell_product";
            str = str + generate_related_product_html(product, product_class, ga_class);
        });
        $(selector).append(str);
        if (data.length == per_page) {
            print_shortcode_products(api, selector, page + 1, per_page, page_and);
        }
    });
    return;
}

function show_products(config) {
    if (config.hasOwnProperty("promotion")) {
        promotion = config.promotion;
        if (promotion == 'crp') {
            var page = 1;
            var per_page = 20;
            var customer_id = config.customer_id;
            var crp_api = "https://c.shajgoj.com/api/customers/crp/" + customer_id;
            var selector = "#" + config.selector + " > ." + promotion;
            if (!document.querySelector(selector)) {
                document.getElementById(config.selector).classList.add('cross_sell');
                var node = document.createElement("DIV");
                node.classList.add(promotion);
                node.classList.add('shajgoj_promoted_products_container');
                document.getElementById(config.selector).appendChild(node);
            }
            print_products(crp_api, selector, 1, 20, '?');
        } else if (promotion == 'nca') {
            var page = 1;
            var per_page = 20;
            var customer_id = 1;
            var api = "https://c.shajgoj.com/api/products/nca/";
            var selector = "#" + config.selector + " > ." + promotion;
            if (!document.querySelector(selector)) {
                document.getElementById(config.selector).classList.add('cross_sell');
                if (config.title) {
                    var title = document.createElement("H4");
                    title.classList.add('shajgoj_cross_title');
                    title.textContent = config.title;
                    document.getElementById(config.selector).appendChild(title);
                }
                var node = document.createElement("DIV");
                node.classList.add(promotion);
                node.classList.add('shajgoj_promoted_products_container');
                document.getElementById(config.selector).appendChild(node);
            }
            print_products(api, selector, 1, 20, '?');
        } else if (promotion == 'search_products') {
            search = config.search;
            var product_api = "https://search.shajgoj.com/wp-json/wc/v2/products/?" + search;
            var selector = "#" + config.selector;
            print_shortcode_products(product_api, selector, 1, 20, '&', "upsell_product");
        }
    }
}