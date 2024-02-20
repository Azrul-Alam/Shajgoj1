jQuery(function($) {
    $(document).ready(function() {
        $(document).on('submit', '#customer_address_verified', function(e) {
            e.preventDefault();
            var order_id = $("#customer_address_verified .customer_order").val();
            $.ajax({
                url: verify_customer_address.ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'customer_address_verified',
                    order_id: order_id
                },
                beforeSend: function() {
                    $(".input_customer_address_verified").val('Confirming');
                    $(".input_customer_address_verified").prop('disabled', true);
                },
                success: function(response, status, jqXHR) {
                    $(".input_customer_address_verified").val('Address Confirmed');
                    $(".input_customer_address_verified").prop('disabled', true);
                }
            });
        });
        current_city = $('#billing_city').find(":selected").text();
        if (current_city != "") {
            show_area_selection();
        }
        $('select#billing_city, select#billing_city').on('change', function() {
            show_area_selection();
        });

        function show_area_selection() {
            current_city = $('#billing_city').find(":selected").text();
            var areas_in_city = {
                "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
                "Bandarban": ["Alikadam", "Bandarban Sadar", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
                "Barguna": ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Pathorghata", "Taltali"],
                "Barisal": ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Barisal Sadar", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
                "Bhola": ["Bhola Sadar", "Borhan Sddin", "Charfesson", "Doulatkhan", "Lalmohan", "Monpura", "Tazumuddin"],
                "Bogura": ["Adamdighi", "Bogra Sadar", "Dhunot", "Dupchanchia", "Gabtali", "Kahaloo", "Nondigram", "Shajahanpur", "Shariakandi", "Sherpur", "Shibganj", "Sonatala"],
                "Brahmanbaria": ["Akhaura", "Ashuganj", "Bancharampur", "Bijoynagar", "Brahmanbaria Sadar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"],
                "Chandpur": ["Chandpur Sadar", "Faridgonj", "Haimchar", "Hajiganj", "Kachua", "Matlab North", "Matlab South", "Shahrasti"],
                "Chapainawabganj": ["Bholahat", "Chapainawabganj Sadar", "Gomostapur", "Nachol", "Shibganj"],
                "Chattogram": ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Chattogram Sadar", "Fatikchhari", "Hathazari", "Karnafuli", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"],
                "Chuadanga": ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"],
                "Comilla": ["Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Comilla Sadar", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohargonj", "Muradnagar", "Nangalkot", "Sadarsouth", "Titas"],
                "Coxsbazar": ["Chakaria", "Coxsbazar Sadar", "Kutubdia", "Moheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhiya"],
                "Dhaka": ["Dhaka Sadar", "Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar"],
                "Dinajpur": ["Birampur", "Birganj", "Birol", "Bochaganj", "Chirirbandar", "Dinajpur Sadar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharol", "Khansama", "Nawabganj", "Parbatipur"],
                "Faridpur": ["Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"],
                "Feni": ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi"],
                "Gaibandha": ["Gaibandha Sadar", "Gobindaganj", "Palashbari", "Phulchari", "Sadullapur", "Saghata", "Sundarganj"],
                "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
                "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
                "Habiganj": ["Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj"],
                "Jamalpur": ["Bokshiganj", "Dewangonj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandah", "Sarishabari"],
                "Jashore": ["Abhaynagar", "Bagherpara", "Chougachha", "Jessore Sadar", "Jhikargacha", "Keshabpur", "Manirampur", "Sharsha"],
                "Jhalakathi": ["Jhalakathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
                "Jhenaidah": ["Harinakundu", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Moheshpur", "Shailkupa"],
                "Joypurhat": ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"],
                "Khagrachhari": ["Dighinala", "Guimara", "Khagrachhari Sadar", "Laxmichhari", "Manikchari", "Matiranga", "Mohalchari", "Panchari", "Ramgarh"],
                "Khulna": ["Botiaghata", "Dakop", "Digholia", "Dumuria", "Fultola", "Khulna Sadar", "Koyra", "Paikgasa", "Rupsha", "Terokhada"],
                "Kishoreganj": ["Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimgonj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamoin", "Nikli", "Pakundia", "Tarail"],
                "Kurigram": ["Bhurungamari", "Charrajibpur", "Chilmari", "Kurigram Sadar", "Nageshwari", "Phulbari", "Rajarhat", "Rowmari", "Ulipur"],
                "Kushtia": ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"],
                "Lakshmipur": ["Kamalnagar", "Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati"],
                "Lalmonirhat": ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"],
                "Madaripur": ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"],
                "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
                "Manikganj": ["Doulatpur", "Gior", "Harirampur", "Manikganj Sadar", "Saturia", "Shibaloy", "Singiar"],
                "Meherpur": ["Gangni", "Meherpur Sadar", "Mujibnagar"],
                "Moulvibazar": ["Barlekha", "Juri", "Kamolganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"],
                "Munshiganj": ["Gajaria", "Louhajanj", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"],
                "Mymensingh": ["Bhaluka", "Dhobaura", "Fulbaria", "Gafargaon", "Gouripur", "Haluaghat", "Iswarganj", "Muktagacha", "Mymensingh Sadar", "Nandail", "Phulpur", "Tarakanda", "Trishal"],
                "Naogaon": ["Atrai", "Badalgachi", "Dhamoirhat", "Manda", "Mohadevpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
                "Narail": ["Kalia", "Lohagara", "Narail Sadar"],
                "Narayanganj": ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"],
                "Narsingdi": ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"],
                "Natore": ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Naldanga", "Natore Sadar", "Singra"],
                "Netrokona": ["Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohongonj", "Netrokona Sadar", "Purbadhala"],
                "Nilphamari": ["Dimla", "Domar", "Jaldhaka", "Kishorganj", "Nilphamari Sadar", "Syedpur"],
                "Noakhali": ["Begumganj", "Chatkhil", "Companiganj", "Hatia", "Kabirhat", "Noakhali Sadar", "Senbug", "Sonaimori", "Subarnachar"],
                "Pabna": ["Atghoria", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishurdi", "Pabna Sadar", "Santhia", "Sujanagar"],
                "Panchagarh": ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"],
                "Patuakhali": ["Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali"],
                "Pirojpur": ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Pirojpur Sadar", "Zianagar"],
                "Rajbari": ["Baliakandi", "Goalanda", "Kalukhali", "Pangsa", "Rajbari Sadar"],
                "Rajshahi": ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohonpur", "Paba", "Puthia", "Rajshahi Sadar", "Tanore"],
                "Rangamati": ["Baghaichari", "Barkal", "Belaichari", "Juraichari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar"],
                "Rangpur": ["Badargonj", "Gangachara", "Kaunia", "Mithapukur", "Pirgacha", "Pirgonj", "Rangpur Sadar", "Taragonj"],
                "Satkhira": ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"],
                "Shariatpur": ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zajira"],
                "Sherpur": ["Jhenaigati", "Nalitabari", "Nokla", "Sherpur Sadar", "Sreebordi"],
                "Sirajganj": ["Belkuchi", "Chauhali", "Kamarkhand", "Kazipur", "Raigonj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullapara"],
                "Sunamganj": ["Bishwambarpur", "Chhatak", "Derai", "Dharmapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Shalla", "South Sunamganj", "Sunamganj Sadar", "Tahirpur"],
                "Sylhet": ["Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshinsurma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmaninagar", "Sylhet Sadar", "Zakiganj"],
                "Tangail": ["Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar"],
                "Thakurgaon": ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"]
            };
            options = '<option value="">Select Area</option>';
            if (current_city != "" && areas_in_city[current_city].length > 0) {
                areas_in_city[current_city].forEach((item, i) => {
                    options = options + '<option value="' + item + '">' + item + '</option>';
                });
            }
            $('select#billing_address_2').html(options);
        }
    });
    $(document).ready(function() {
        $(document).on("click", function(event) {
            let btn = $(event.target);
            if (btn.hasClass("cancel_order_request")) {
                event.preventDefault();
                href = btn.attr("href");
                match = btn.attr("href").match(/order_id\/(\d+)\//);
                order_id = match[1];
                if ($("#modal-order-cancel").length > 0) $("#modal-order-cancel").remove();
                let modal = '<div class="modal micromodal-slide modal-sref" id="modal-order-cancel" aria-hidden="true">' +
                    '<div class="modal__overlay" tabindex="-1" data-micromodal-close>' +
                    '<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-login-title">' +
                    '<header class="modal__header">' +
                    '<div class="modal_type"><strong>Cancel order</strong></div>' +
                    '<span class="modal__close" aria-label="Close modal" data-micromodal-close></span>' +
                    '</header>' +
                    '<div id="modal-1-content">' +
                    '<div class="modal_text modal-order-cancel-title">Please tell us why do you like to cancel the order <strong># ' + order_id + '</strong>?</div>' +
                    '<div style="margin-bottom: 20px" class="modal_text"><select class="modal-cancel-reasons">' +
                    '<option value="Select Cancel Reason">Select Cancel Reason</option>' +
                    '<option value="Change of Mind">Change of Mind</option>' +
                    '<option value="Change or Combine Order">Change or Combine Order</option>' +
                    '<option value="Offer Price Change">Offer Price Change</option>' +
                    '<option value="Duplicate Order">Duplicate Order</option>' +
                    '<option value="Mistakenly Placed">Mistakenly Placed</option>' +
                    '<option value="Financial Issue">Financial Issue</option>' +
                    '<option value="Change Payment Method">Change Payment Method</option>' +
                    '<option value="Forgot to Use Coupon or Coupon Issue">Forgot to Use Coupon or Coupon Issue</option>' +
                    '<option value="Change of Delivery Address or Contact No">Change of Delivery Address or Contact No</option>' +
                    '<option value="Found Cheaper Elsewhere">Found Cheaper Elsewhere</option>' +
                    '</select></div>' +
                    '<div>' +
                    '<button data-order_id="' + order_id + '" class="btn btn-sm order-cancel-confirmed">Cancel Order <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></button>' +
                    '<button class="btn btn-sm sref-no">Close</button>' +
                    '</div>' +
                    '<div style="margin-top:5px; color: red; font-size: .8rem;">' +
                    '<div class="btn btn-sm order-cancel-msg"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $("body").append(modal);
                MicroModal.show('modal-order-cancel');
            }
            if (btn.hasClass("order-cancel-confirmed")) {
                let order_id = btn.data('order_id');
                var cancel_reason = $('.modal-cancel-reasons').find(":selected").text();
                $(".order-cancel-msg").html("");
                if (cancel_reason == '' || cancel_reason == 'Select Cancel Reason') $(".order-cancel-msg").html("Please select a cancelling reason.");
                else {
                    $.ajax({
                        url: "/wp-admin/admin-ajax.php",
                        contentType: "application/json",
                        data: {
                            'action': 'account_order_cancel',
                            'order_id': order_id,
                            'cancel_reason': cancel_reason
                        },
                        beforeSend: function() {
                            $(".modal-sref i").css('display', 'inline-block');
                        },
                        success: function(data) {
                            $(".modal-sref i").hide();
                            if (data.success != 1) {
                                $(".order-cancel-msg").html(data.error);
                                return;
                            } else {
                                window.location.reload();
                            }
                        },
                        error: function(errorThrown) {
                            $(".modal-sref i").hide();
                            if (data.success == 0) {
                                $(".order-cancel-msg").html(data.error);
                            }
                        }
                    });
                }
            }
        });
    });
});