$ = jQuery;
document.addEventListener("DOMContentLoaded", function(event) {
    ref = "";
    var current_url = window.location.href;
    var regexp = new RegExp("shajgoj.com\/r\/([0-9a-zA-Z]+)", "g");
    var match = regexp.exec(current_url);
    if (match) {
        ref = match[1];
    }
    if (ref == "") {
        var regexp = new RegExp("[&?]sref=([0-9a-zA-Z]+)", "g");
        var match = regexp.exec(current_url);
        if (match) {
            ref = match[1];
        }
    }
    if (ref !== "" && ref.length > 5) {
        setCookie("sref", ref, 30);
    }
    if (getCookie("sref")) {
        let ref_coupon = getCookie("sref");
        if (window.location.href.includes("shajgoj.com/checkout")) {
            if ($("#shajgoj_coupon_code").length > 0) {
                let modal = '<div class="modal micromodal-slide modal-sref" id="modal-sref" aria-hidden="true">' +
                    '<div class="modal__overlay" tabindex="-1" data-micromodal-close>' +
                    '<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-login-title">' +
                    '<header class="modal__header">' +
                    '<span class="modal__close" aria-label="Close modal" data-micromodal-close></span>' +
                    '</header>' +
                    '<div id="modal-1-content">' +
                    '<div class="modal_text">Do you like to apply referral couopon <strong>"' + ref_coupon + '"</strong></div>' +
                    '<div>' +
                    '<button class="btn btn-sm sref-yes">Yes</button>' +
                    '<button class="btn btn-sm sref-no">No</button>' +
                    '</div>' +
                    '<div class="delete-coupon-container">' +
                    '<a href="JavaScript:Void(0);" class="sref-delete-coupon">No, Delete Coupon</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $("body").append(modal);
                MicroModal.show('modal-sref');
                $('body').on('click', event => {
                    const elm = $(event.target);
                    if (elm.hasClass("sref-no")) {
                        $(".modal__close").click();
                    } else if (elm.hasClass("sref-delete-coupon")) {
                        eraseCookie("sref");
                        $(".modal__close").click();
                    } else if (elm.hasClass("sref-yes")) {
                        if ($(".woocommerce-remove-coupon").length > 0) {
                            $(".woocommerce-remove-coupon").click();
                            timedelay(2000).then(function() {
                                $("#shajgoj_coupon_code").val(ref_coupon);
                                $(".shaj_apply_coupon").click();
                            });
                            $(".modal__close").click();
                        } else {
                            $("#shajgoj_coupon_code").val(ref_coupon);
                            $(".shaj_apply_coupon").click();
                            $(".modal__close").click();
                        }
                    }
                });
            }
        }
    }
});
$(document).ready(function() {
    $(document).on("click", function(event) {
        let btn = $(event.target);
        if (btn.hasClass("purchase-voucher")) {
            let v_id = btn.data('v_id');
            let v_title = $(btn).parent().find(".e-voucher-title").text();
            let v_point = $(btn).parent().find(".e-voucher-point").text();
            if ($("#modal-sref-voucher").length > 0) $("#modal-sref-voucher").remove();
            let modal = '<div class="modal micromodal-slide modal-sref" id="modal-sref-voucher" aria-hidden="true">' +
                '<div class="modal__overlay" tabindex="-1" data-micromodal-close>' +
                '<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-login-title">' +
                '<header class="modal__header">' +
                '<div class="modal_type"></div>' +
                '<span class="modal__close" aria-label="Close modal" data-micromodal-close></span>' +
                '</header>' +
                '<div id="modal-1-content">' +
                '<div class="modal_text modal-sref-voucher-title">Do you like to Redeem <strong>' + v_title + '</strong> for <strong>' + v_point + '</strong>?</div>' +
                '<div>' +
                '<button data-v_id="' + v_id + '" class="btn btn-sm purchase-voucher-confirmed">Proceed <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></button>' +
                '<button class="btn btn-sm sref-no">Cancel</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $("body").append(modal);
            MicroModal.show('modal-sref-voucher');
        }
        if (btn.hasClass("purchase-voucher-confirmed")) {
            let v_id = btn.data('v_id');
            $.ajax({
                url: "/wp-admin/admin-ajax.php",
                contentType: "application/json",
                data: {
                    'action': 'scp_purchase_voucher',
                    'v_id': v_id
                },
                beforeSend: function() {
                    $(".modal-sref i").css('display', 'inline-block');
                },
                success: function(data) {
                    $(".modal-sref i").hide();
                    if (data.success != 1) {
                        $("#modal-sref-voucher .modal_type").addClass("modal-error");
                        $("#modal-sref-voucher .modal_type").html("Failed!");
                        $("#modal-sref-voucher .modal-sref-voucher-title").html(data.error);
                        $("#modal-sref-voucher .purchase-voucher-confirmed").hide();
                        $("#modal-sref-voucher .sref-no").html("Close");
                        return;
                    } else {
                        $(".my_vouchers").html(data.my_vouchers);
                        $("#modal-sref-voucher .modal_type").addClass("modal-success");
                        $("#modal-sref-voucher .modal_type").html("Congratulations!");
                        $("#modal-sref-voucher .modal-sref-voucher-title").html("Voucher " + data.voucher.coupon_code + " is added to your account.");
                        $("#modal-sref-voucher .purchase-voucher-confirmed").hide();
                        $("#modal-sref-voucher .sref-no").html("Close");
                    }
                },
                error: function(errorThrown) {
                    $(".modal-sref i").hide();
                    if (data.success == 0) {
                        $("#modal-sref-voucher .modal_type").addClass("modal-error");
                        $("#modal-sref-voucher .modal_type").html("Error!");
                        $("#modal-sref-voucher .modal-sref-voucher-title").html("Something wrong. Please try again.");
                        $("#modal-sref-voucher .purchase-voucher-confirmed").hide();
                        $("#modal-sref-voucher .sref-no").html("Close");
                    }
                }
            });
        }
        if (btn.hasClass("sref-no")) {
            $(".modal__close").click();
        }
        if (btn.hasClass("account-primary-phone-set")) {
            let phone = $(".account-primary_phone").val();
            let phone_pattern = /^(88)?01\d{9}$/;
            let msg = $(".primary-phone-set-msg");
            if (phone_pattern.test(phone)) {
                $.ajax({
                    url: "/wp-admin/admin-ajax.php",
                    contentType: "application/json",
                    data: {
                        'action': 'scp_send_phone_otp',
                        'phone': phone,
                    },
                    beforeSend: function() {
                        $(".account-primary-phone-set i").css('display', 'inline-block');
                    },
                    success: function(data) {
                        $(".account-primary-phone-set i").hide();
                        if (data.success != 1) {
                            msg.html(data.error);
                        } else {
                            $(".set-primary-container.otp-container").css('display', 'block');
                            msg.html("<font color='green'>A One Time Passcode has been sent to " + phone + "</font>");
                        }
                    },
                    error: function(errorThrown) {
                        $(".account-primary-phone-set i").hide();
                        if (data.success == 0) {
                            msg.html("Something wrong. Please try again.");
                        }
                    }
                });
            } else {
                msg.html("Invalid Phone number, please check your input.");
            }
        }
        if (btn.hasClass("verify-primary_phone_otp")) {
            let msg = $(".primary-phone-set-msg");
            let otp = $(".account-primary_phone_otp").val();
            if (otp.length == 5) {
                $.ajax({
                    url: "/wp-admin/admin-ajax.php",
                    contentType: "application/json",
                    data: {
                        'action': 'scp_verify_otp',
                        'otp': otp
                    },
                    beforeSend: function() {
                        $(".verify-primary_phone_otp i").css('display', 'inline-block');
                    },
                    success: function(data) {
                        $(".verify-primary_phone_otp i").hide();
                        if (data.success != 1) {
                            msg.html(data.error);
                        } else {
                            $.ajax({
                                url: "/wp-admin/admin-ajax.php",
                                contentType: "application/json",
                                data: {
                                    'action': 'scp_change_primary_account',
                                },
                                beforeSend: function() {
                                    $(".verify-primary_phone_otp i").css('display', 'inline-block');
                                },
                                success: function(data) {
                                    $(".verify-primary_phone_otp i").hide();
                                    if (data.success != 1) {
                                        msg.html(data.error);
                                    } else {
                                        msg.html("<font color='green'>Successfully linked phone number to account.</font>");
                                        $(".set-primary-container").css('display', 'none');
                                    }
                                },
                                error: function(errorThrown) {
                                    $(".verify-primary_phone_otp i").hide();
                                    if (data.success == 0) {
                                        msg.html("Something wrong. Please try again.");
                                    }
                                }
                            });
                        }
                    },
                    error: function(errorThrown) {
                        $(".verify-primary_phone_otp i").hide();
                        if (data.success == 0) {
                            msg.html("Something wrong. Please try again.");
                        }
                    }
                });
            } else {
                msg.html("Invalid OTP, please check your input.");
            }
        }
    });
    $(".referral_copy_button").on("click", function(event) {
        var referral_block = event.target.parentElement.parentElement;
        var copyText = referral_block.querySelector("input");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(copyText.value);
        } else {
            document.execCommand('copy');
        }
        var tooltip = referral_block.querySelector("span");
        tooltip.innerHTML = "Copied to clipboard";
    });
    $(".referral_copy_button").on("mouseenter", function(event) {
        var referral_block = event.target.parentElement.parentElement;
        var tooltip = referral_block.querySelector("span");
        tooltip.innerHTML = "Copy to clipboard";
    });
});

function epoch() {
    return Math.round(Date.now() / 1000);
}

function timedelay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}