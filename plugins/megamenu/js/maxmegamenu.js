/*!Max Mega Menu jQuery Plugin*/
(function($) {
    "use strict";
    $.maxmegamenu = function(menu, options) {
        var plugin = this;
        var $menu = $(menu);
        var $toggle_bar = $menu.siblings(".mega-menu-toggle");
        var defaults = {
            event: $menu.attr("data-event"),
            effect: $menu.attr("data-effect"),
            effect_speed: parseInt($menu.attr("data-effect-speed")),
            effect_mobile: $menu.attr("data-effect-mobile"),
            effect_speed_mobile: parseInt($menu.attr("data-effect-speed-mobile")),
            panel_width: $menu.attr("data-panel-width"),
            panel_inner_width: $menu.attr("data-panel-inner-width"),
            mobile_force_width: $menu.attr("data-mobile-force-width"),
            second_click: $menu.attr("data-second-click"),
            vertical_behaviour: $menu.attr("data-vertical-behaviour"),
            document_click: $menu.attr("data-document-click"),
            breakpoint: $menu.attr("data-breakpoint"),
            unbind_events: $menu.attr("data-unbind")
        };
        plugin.settings = {};
        var items_with_submenus = $("li.mega-menu-megamenu.mega-menu-item-has-children," +
            "li.mega-menu-flyout.mega-menu-item-has-children," +
            "li.mega-menu-tabbed > ul.mega-sub-menu > li.mega-menu-item-has-children," +
            "li.mega-menu-flyout li.mega-menu-item-has-children", menu);
        plugin.hidePanel = function(anchor, immediate) {
            anchor.parent().triggerHandler("before_close_panel");
            if ((!immediate && plugin.settings.effect == 'slide') || (plugin.isMobileView() && plugin.settings.effect_mobile == 'slide')) {
                var speed = plugin.isMobileView() ? plugin.settings.effect_speed_mobile : plugin.settings.effect_speed;
                anchor.siblings(".mega-sub-menu").animate({
                    'height': 'hide',
                    'paddingTop': 'hide',
                    'paddingBottom': 'hide',
                    'minHeight': 'hide'
                }, speed, function() {
                    anchor.siblings(".mega-sub-menu").css("display", "");
                    anchor.parent().removeClass("mega-toggle-on").triggerHandler("close_panel");
                });
                return;
            }
            if (immediate) {
                anchor.siblings(".mega-sub-menu").css("display", "none").delay(plugin.settings.effect_speed).queue(function() {
                    $(this).css("display", "").dequeue();
                });
            }
            anchor.siblings(".mega-sub-menu").find('.widget_media_video video').each(function() {
                this.player.pause();
            });
            anchor.parent().removeClass("mega-toggle-on").triggerHandler("close_panel");
            plugin.addAnimatingClass(anchor.parent());
        };
        plugin.addAnimatingClass = function(element) {
            if (plugin.settings.effect === "disabled") {
                return;
            }
            $(".mega-animating").removeClass("mega-animating");
            var timeout = plugin.settings.effect_speed + parseInt(megamenu.timeout, 10);
            element.addClass("mega-animating");
            setTimeout(function() {
                element.removeClass("mega-animating");
            }, timeout);
        };
        plugin.hideAllPanels = function() {
            $(".mega-toggle-on > a.mega-menu-link", $menu).each(function() {
                plugin.hidePanel($(this), false);
            });
        };
        plugin.hideSiblingPanels = function(anchor, immediate) {
            anchor.parent().parent().find(".mega-toggle-on").children("a.mega-menu-link").each(function() {
                plugin.hidePanel($(this), immediate);
            });
        };
        plugin.isDesktopView = function() {
            return Math.max(window.outerWidth, $(window).width()) > plugin.settings.breakpoint;
        };
        plugin.isMobileView = function() {
            return !plugin.isDesktopView();
        };
        plugin.showPanel = function(anchor) {
            anchor.parent().triggerHandler("before_open_panel");
            $(".mega-animating").removeClass("mega-animating");
            if (plugin.isMobileView() && anchor.parent().hasClass("mega-hide-sub-menu-on-mobile")) {
                return;
            }
            if (plugin.isDesktopView() && ($menu.hasClass("mega-menu-horizontal") || $menu.hasClass("mega-menu-vertical"))) {
                plugin.hideSiblingPanels(anchor, true);
            }
            if ((plugin.isMobileView() && $menu.hasClass("mega-keyboard-navigation")) || plugin.settings.vertical_behaviour === "accordion") {
                plugin.hideSiblingPanels(anchor, false);
            }
            plugin.calculateDynamicSubmenuWidths(anchor);
            if (plugin.settings.effect == "slide" || plugin.isMobileView() && plugin.settings.effect_mobile == 'slide') {
                var speed = plugin.isMobileView() ? plugin.settings.effect_speed_mobile : plugin.settings.effect_speed;
                anchor.siblings(".mega-sub-menu").css("display", "none").animate({
                    'height': 'show',
                    'paddingTop': 'show',
                    'paddingBottom': 'show',
                    'minHeight': 'show'
                }, speed, function() {
                    $(this).css("display", "");
                });
            }
            anchor.parent().addClass("mega-toggle-on").triggerHandler("open_panel");
        };
        plugin.calculateDynamicSubmenuWidths = function(anchor) {
            if (anchor.parent().hasClass("mega-menu-megamenu") && anchor.parent().parent().hasClass("max-mega-menu") && plugin.settings.panel_width && $(plugin.settings.panel_width).length > 0) {
                if (plugin.isDesktopView()) {
                    var submenu_offset = $menu.offset();
                    var target_offset = $(plugin.settings.panel_width).offset();
                    anchor.siblings(".mega-sub-menu").css({
                        width: $(plugin.settings.panel_width).outerWidth(),
                        left: (target_offset.left - submenu_offset.left) + "px"
                    });
                } else {
                    anchor.siblings(".mega-sub-menu").css({
                        width: "",
                        left: ""
                    });
                }
            }
            if (anchor.parent().hasClass("mega-menu-megamenu") && anchor.parent().parent().hasClass("max-mega-menu") && plugin.settings.panel_inner_width && $(plugin.settings.panel_inner_width).length > 0) {
                var target_width = 0;
                if ($(plugin.settings.panel_inner_width).length) {
                    target_width = parseInt($(plugin.settings.panel_inner_width).width(), 10);
                } else {
                    target_width = parseInt(plugin.settings.panel_inner_width, 10);
                }
                var submenu_width = parseInt(anchor.siblings(".mega-sub-menu").innerWidth(), 10);
                if (plugin.isDesktopView() && target_width > 0 && target_width < submenu_width) {
                    anchor.siblings(".mega-sub-menu").css({
                        "paddingLeft": (submenu_width - target_width) / 2 + "px",
                        "paddingRight": (submenu_width - target_width) / 2 + "px"
                    });
                } else {
                    anchor.siblings(".mega-sub-menu").css({
                        "paddingLeft": "",
                        "paddingRight": ""
                    });
                }
            }
        }
        var bindClickEvents = function() {
            var dragging = false;
            $(document).on({
                "touchmove": function(e) {
                    dragging = true;
                },
                "touchstart": function(e) {
                    dragging = false;
                }
            });
            $(document).on("click touchend", function(e) {
                if (!dragging && plugin.settings.document_click === "collapse" && !$(e.target).closest(".max-mega-menu li").length && !$(e.target).closest(".mega-menu-toggle").length) {
                    plugin.hideAllPanels();
                    plugin.hideMobileMenu();
                }
                dragging = false;
            });
            $("> a.mega-menu-link", items_with_submenus).on("touchend.megamenu", function(e) {
                plugin.unbindHoverEvents();
                plugin.unbindHoverIntentEvents();
            });
            $("> a.mega-menu-link", items_with_submenus).on("click.megamenu", function(e) {
                if (plugin.isDesktopView() && $(this).parent().hasClass("mega-toggle-on") && $(this).parent().parent().parent().hasClass("mega-menu-tabbed")) {
                    if (plugin.settings.second_click === "go") {
                        return;
                    } else {
                        e.preventDefault();
                        return;
                    }
                }
                if (dragging) {
                    return;
                }
                if (plugin.isMobileView() && $(this).parent().hasClass("mega-hide-sub-menu-on-mobile")) {
                    return;
                }
                if ((plugin.settings.second_click === "go" || $(this).parent().hasClass("mega-click-click-go")) && $(this).attr('href') !== undefined) {
                    if (!$(this).parent().hasClass("mega-toggle-on")) {
                        e.preventDefault();
                        plugin.showPanel($(this));
                    }
                } else {
                    e.preventDefault();
                    if ($(this).parent().hasClass("mega-toggle-on")) {
                        plugin.hidePanel($(this), false);
                    } else {
                        plugin.showPanel($(this));
                    }
                }
            });
        };
        var bindHoverEvents = function() {
            items_with_submenus.on({
                "mouseenter.megamenu": function() {
                    plugin.unbindClickEvents();
                    if (!$(this).hasClass("mega-toggle-on")) {
                        plugin.showPanel($(this).children("a.mega-menu-link"));
                    }
                },
                "mouseleave.megamenu": function() {
                    if ($(this).hasClass("mega-toggle-on") && !$(this).hasClass("mega-disable-collapse") && !$(this).parent().parent().hasClass("mega-menu-tabbed")) {
                        plugin.hidePanel($(this).children("a.mega-menu-link"), false);
                    }
                }
            });
        };
        var bindHoverIntentEvents = function() {
            items_with_submenus.hoverIntent({
                over: function() {
                    plugin.unbindClickEvents();
                    if (!$(this).hasClass("mega-toggle-on")) {
                        plugin.showPanel($(this).children("a.mega-menu-link"));
                    }
                },
                out: function() {
                    if ($(this).hasClass("mega-toggle-on") && !$(this).hasClass("mega-disable-collapse") && !$(this).parent().parent().hasClass("mega-menu-tabbed")) {
                        plugin.hidePanel($(this).children("a.mega-menu-link"), false);
                    }
                },
                timeout: megamenu.timeout,
                interval: megamenu.interval
            });
        };
        var bindKeyboardEvents = function() {
            var tab_key = 9;
            var escape_key = 27;
            $("body").on("keyup", function(e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === escape_key) {
                    $menu.parent().removeClass("mega-keyboard-navigation");
                    plugin.hideAllPanels();
                }
                if ($menu.parent().hasClass("mega-keyboard-navigation") && !($(e.target).closest(".max-mega-menu li").length || $(e.target).closest(".mega-menu-toggle").length)) {
                    $menu.parent().removeClass("mega-keyboard-navigation");
                    plugin.hideAllPanels();
                    if (plugin.isMobileView()) {
                        plugin.hideMobileMenu();
                    }
                }
            });
            $menu.parent().on("keyup", function(e) {
                var keyCode = e.keyCode || e.which;
                var active_link = $(e.target);
                if (keyCode === tab_key) {
                    $menu.parent().addClass("mega-keyboard-navigation");
                    if (active_link.parent().is(items_with_submenus)) {
                        plugin.showPanel(active_link);
                    } else {
                        plugin.hideSiblingPanels(active_link);
                    }
                    if (active_link.hasClass("mega-menu-toggle")) {
                        plugin.showMobileMenu();
                    }
                }
            });
        };
        plugin.unbindAllEvents = function() {
            $("ul.mega-sub-menu, li.mega-menu-item, li.mega-menu-row, li.mega-menu-column, a.mega-menu-link, span.mega-indicator", menu).off().unbind();
        };
        plugin.unbindClickEvents = function() {
            $("> a.mega-menu-link", items_with_submenus).off("click.megamenu touchend.megamenu");
        };
        plugin.unbindHoverEvents = function() {
            items_with_submenus.unbind("mouseenter.megamenu mouseleave.megamenu");
        };
        plugin.unbindHoverIntentEvents = function() {
            items_with_submenus.unbind("mouseenter mouseleave").removeProp('hoverIntent_t').removeProp('hoverIntent_s');
        };
        plugin.unbindMegaMenuEvents = function() {
            if (plugin.settings.event === "hover_intent") {
                plugin.unbindHoverIntentEvents();
            }
            if (plugin.settings.event === "hover") {
                plugin.unbindHoverEvents();
            }
            plugin.unbindClickEvents();
        }
        plugin.bindMegaMenuEvents = function() {
            if (plugin.isDesktopView() && plugin.settings.event === "hover_intent") {
                bindHoverIntentEvents();
            }
            if (plugin.isDesktopView() && plugin.settings.event === "hover") {
                bindHoverEvents();
            }
            bindClickEvents();
            bindKeyboardEvents();
        };
        plugin.monitorView = function() {
            if (plugin.isDesktopView()) {
                $menu.data("view", "desktop");
            } else {
                $menu.data("view", "mobile");
                plugin.switchToMobile();
            }
            plugin.checkWidth();
            $(window).resize(function() {
                plugin.checkWidth();
            });
        };
        plugin.checkWidth = function() {
            if (plugin.isMobileView() && $menu.data("view") === "desktop") {
                $menu.data("view", "mobile");
                plugin.switchToMobile();
            }
            if (plugin.isDesktopView() && $menu.data("view") === "mobile") {
                $menu.data("view", "desktop");
                plugin.switchToDesktop();
            }
            plugin.calculateDynamicSubmenuWidths($("> li.mega-menu-megamenu > a.mega-menu-link", $menu));
        };
        plugin.reverseRightAlignedItems = function() {
            if (!$('body').hasClass('rtl')) {
                $menu.append($menu.children("li.mega-item-align-right").get().reverse());
            }
        };
        plugin.addClearClassesToMobileItems = function() {
            $(".mega-menu-row", $menu).each(function() {
                $("> .mega-sub-menu > .mega-menu-column:not(.mega-hide-on-mobile)", $(this)).filter(":even").addClass('mega-menu-clear');
            });
        }
        plugin.switchToMobile = function() {
            plugin.unbindMegaMenuEvents();
            plugin.bindMegaMenuEvents();
            plugin.reverseRightAlignedItems();
            plugin.addClearClassesToMobileItems();
            plugin.hideAllPanels();
        };
        plugin.switchToDesktop = function() {
            plugin.unbindMegaMenuEvents();
            plugin.bindMegaMenuEvents();
            plugin.reverseRightAlignedItems();
            plugin.hideAllPanels();
            $menu.css({
                width: '',
                left: '',
                display: ''
            });
            $toggle_bar.removeClass('mega-menu-open');
        };
        plugin.initToggleBar = function() {
            $toggle_bar.on("click", function(e) {
                if ($(e.target).is(".mega-menu-toggle, .mega-menu-toggle-block, .mega-menu-toggle-animated-block, .mega-menu-toggle-animated-block *, .mega-toggle-blocks-left, .mega-toggle-blocks-center, .mega-toggle-blocks-right, .mega-toggle-label, .mega-toggle-label span")) {
                    if ($(this).hasClass("mega-menu-open")) {
                        plugin.hideMobileMenu();
                    } else {
                        plugin.showMobileMenu();
                    }
                }
            });
        };
        plugin.hideMobileMenu = function() {
            if (!$toggle_bar.is(":visible")) {
                return;
            }
            $('body').removeClass($menu.attr('id') + "-mobile-open");
            if (plugin.settings.effect_mobile == 'slide') {
                $menu.animate({
                    'height': 'hide'
                }, plugin.settings.effect_speed_mobile, function() {
                    $menu.css({
                        width: '',
                        left: '',
                        display: ''
                    });
                });
            }
            $toggle_bar.removeClass("mega-menu-open");
        };
        plugin.showMobileMenu = function() {
            if (!$toggle_bar.is(":visible")) {
                return;
            }
            $('body').addClass($menu.attr('id') + "-mobile-open");
            plugin.toggleBarForceWidth();
            if (plugin.settings.effect_mobile == 'slide') {
                $menu.animate({
                    'height': 'show'
                }, plugin.settings.effect_speed_mobile);
            }
            $toggle_bar.addClass("mega-menu-open");
        };
        plugin.toggleBarForceWidth = function() {
            if ($(plugin.settings.mobile_force_width).length) {
                var submenu_offset = $toggle_bar.offset();
                var target_offset = $(plugin.settings.mobile_force_width).offset();
                $menu.css({
                    width: $(plugin.settings.mobile_force_width).outerWidth(),
                    left: (target_offset.left - submenu_offset.left) + "px"
                });
            }
        };
        plugin.init = function() {
            $menu.triggerHandler("before_mega_menu_init");
            plugin.settings = $.extend({}, defaults, options);
            $menu.removeClass("mega-no-js");
            plugin.initToggleBar();
            if (plugin.settings.unbind_events == 'true') {
                plugin.unbindAllEvents();
            }
            $("span.mega-indicator", $menu).on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                plugin.hidePanel($(this).parent(), false);
            });
            $(window).on("load", function() {
                plugin.calculateDynamicSubmenuWidths($("> li.mega-menu-megamenu > a.mega-menu-link", $menu));
            });
            plugin.bindMegaMenuEvents();
            plugin.monitorView();
            $menu.triggerHandler("after_mega_menu_init");
        };
        plugin.init();
    };
    $.fn.maxmegamenu = function(options) {
        return this.each(function() {
            if (undefined === $(this).data("maxmegamenu")) {
                var plugin = new $.maxmegamenu(this, options);
                $(this).data("maxmegamenu", plugin);
            }
        });
    };
    $(function() {
        $('.max-mega-menu').maxmegamenu();
    });
})(jQuery);