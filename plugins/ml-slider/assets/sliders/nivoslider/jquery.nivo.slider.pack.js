! function(t) {
    var i = function(i, e) {
        var n = t.extend({}, t.fn.nivoSlider.defaults, e),
            a = {
                currentSlide: 0,
                currentImage: "",
                totalSlides: 0,
                running: !1,
                paused: !1,
                stop: !1,
                controlNavEl: !1
            },
            o = t(i);
        o.data("nivo:vars", a).addClass("nivoSlider");
        var r = o.children();
        r.each(function() {
            var i = t(this),
                e = "";
            i.is("img") || (i.is("a") && (i.addClass("nivo-imageLink"), e = i), i = i.find("img:first"));
            var n = 0 === n ? i.attr("width") : i.width(),
                o = 0 === o ? i.attr("height") : i.height();
            "" !== e && e.css("display", "none"), i.css("display", "none"), a.totalSlides++
        }), n.randomStart && (n.startSlide = Math.floor(Math.random() * a.totalSlides)), n.startSlide > 0 && (n.startSlide >= a.totalSlides && (n.startSlide = a.totalSlides - 1), a.currentSlide = n.startSlide), t(r[a.currentSlide]).is("img") ? a.currentImage = t(r[a.currentSlide]) : a.currentImage = t(r[a.currentSlide]).find("img:first"), t(r[a.currentSlide]).is("a") && t(r[a.currentSlide]).css("display", "block");
        var s = t("<img/>").addClass("nivo-main-image");
        s.prop({
            src: a.currentImage.attr("src"),
            alt: a.currentImage.attr("alt")
        }).show(), o.append(s), t(window).resize(function() {
            o.children("img").width(o.width()), s.prop({
                src: a.currentImage.attr("src"),
                alt: a.currentImage.attr("alt")
            }), s.stop().height("auto"), t(".nivo-slice").remove(), t(".nivo-box").remove()
        }), o.append(t('<div class="nivo-caption"></div>'));
        var c = function(i) {
            var e = t(".nivo-caption", o);
            if (a.currentImage.data("caption")) {
                var n = a.currentImage.data("caption");
                "#" === n.substr(0, 1) && (n = t(n).html()), "block" === e.css("display") ? setTimeout(function() {
                    e.html(n)
                }, i.animSpeed) : (e.html(n), e.stop().fadeIn(i.animSpeed))
            } else e.stop().fadeOut(i.animSpeed)
        };
        c(n);
        var l = 0;
        if (!n.manualAdvance && r.length > 1 && (l = setInterval(function() {
                u(o, r, n, !1)
            }, n.pauseTime)), n.directionNav && (o.append('<div class="nivo-directionNav"><a class="nivo-prevNav">' + n.prevText + '</a><a class="nivo-nextNav">' + n.nextText + "</a></div>"), t(o).on("click", "a.nivo-prevNav", function() {
                return !a.running && (clearInterval(l), l = "", a.currentSlide -= 2, void u(o, r, n, "prev"))
            }), t(o).on("click", "a.nivo-nextNav", function() {
                return !a.running && (clearInterval(l), l = "", void u(o, r, n, "next"))
            })), n.controlNav) {
            a.controlNavEl = t('<div class="nivo-controlNav"></div>'), o.after(a.controlNavEl);
            for (var d = 0; d < r.length; d++)
                if (n.controlNavThumbs) {
                    a.controlNavEl.addClass("nivo-thumbs-enabled");
                    var v = r.eq(d);
                    v.is("img") || (v = v.find("img:first")), v.attr("data-thumb") && a.controlNavEl.append('<a class="nivo-control" rel="' + d + '"><img src="' + v.attr("data-thumb") + '" alt="" /></a>')
                } else a.controlNavEl.append('<a class="nivo-control" rel="' + d + '">' + (d + 1) + "</a>");
            t("a:eq(" + a.currentSlide + ")", a.controlNavEl).addClass("active"), t("a", a.controlNavEl).bind("click", function() {
                return !a.running && (!t(this).hasClass("active") && (clearInterval(l), l = "", s.prop({
                    src: a.currentImage.attr("src"),
                    alt: a.currentImage.attr("alt")
                }), a.currentSlide = t(this).attr("rel") - 1, void u(o, r, n, "control")))
            })
        }
        n.pauseOnHover && o.hover(function() {
            a.paused = !0, clearInterval(l), l = ""
        }, function() {
            a.paused = !1, "" !== l || n.manualAdvance || (l = setInterval(function() {
                u(o, r, n, !1)
            }, n.pauseTime))
        }), o.bind("nivo:animFinished", function() {
            s.attr("src", a.currentImage.attr("src")).attr("alt", a.currentImage.attr("alt")), a.running = !1, t(r).each(function() {
                t(this).is("a") && t(this).css("display", "none")
            }), t(r[a.currentSlide]).is("a") && t(r[a.currentSlide]).css("display", "block"), "" !== l || a.paused || n.manualAdvance || (l = setInterval(function() {
                u(o, r, n, !1)
            }, n.pauseTime)), n.afterChange.call(this)
        });
        var p = function(i, e, n) {
                t(n.currentImage).parent().is("a") && t(n.currentImage).parent().css("display", "block"), t('img[src="' + n.currentImage.attr("src") + '"]', i).not(".nivo-main-image,.nivo-control img").width(i.width()).css("visibility", "hidden").show();
                for (var a = t('img[src="' + n.currentImage.attr("src") + '"]', i).not(".nivo-main-image,.nivo-control img").parent().is("a") ? t('img[src="' + n.currentImage.attr("src") + '"]', i).not(".nivo-main-image,.nivo-control img").parent().height() : t('img[src="' + n.currentImage.attr("src") + '"]', i).not(".nivo-main-image,.nivo-control img").height(), o = 0; o < e.slices; o++) {
                    var r = Math.round(i.width() / e.slices);
                    o === e.slices - 1 ? i.append(t('<div class="nivo-slice" name="' + o + '"><img src="' + n.currentImage.attr("src") + '" style="position:absolute; width:' + i.width() + "px; height:auto; display:block !important; top:0; left:-" + (r + o * r - r) + 'px;" /></div>').css({
                        left: r * o + "px",
                        width: i.width() - r * o + "px",
                        height: a + "px",
                        opacity: "0",
                        overflow: "hidden"
                    })) : i.append(t('<div class="nivo-slice" name="' + o + '"><img src="' + n.currentImage.attr("src") + '" style="position:absolute; width:' + i.width() + "px; height:auto; display:block !important; top:0; left:-" + (r + o * r - r) + 'px;" /></div>').css({
                        left: r * o + "px",
                        width: r + "px",
                        height: a + "px",
                        opacity: "0",
                        overflow: "hidden"
                    }))
                }
                t(".nivo-slice", i).height(a), s.stop().animate({
                    height: t(n.currentImage).height()
                }, e.animSpeed)
            },
            m = function(i, e, n) {
                t(n.currentImage).parent().is("a") && t(n.currentImage).parent().css("display", "block"), t('img[src="' + n.currentImage.attr("src") + '"]', i).not(".nivo-main-image,.nivo-control img").width(i.width()).css("visibility", "hidden").show();
                for (var a = Math.round(i.width() / e.boxCols), o = Math.round(t('img[src="' + n.currentImage.attr("src") + '"]', i).not(".nivo-main-image,.nivo-control img").height() / e.boxRows), r = 0; r < e.boxRows; r++)
                    for (var c = 0; c < e.boxCols; c++) c === e.boxCols - 1 ? (i.append(t('<div class="nivo-box" name="' + c + '" rel="' + r + '"><img src="' + n.currentImage.attr("src") + '" style="position:absolute; width:' + i.width() + "px; height:auto; display:block; top:-" + o * r + "px; left:-" + a * c + 'px;" /></div>').css({
                        opacity: 0,
                        left: a * c + "px",
                        top: o * r + "px",
                        width: i.width() - a * c + "px"
                    })), t('.nivo-box[name="' + c + '"]', i).height(t('.nivo-box[name="' + c + '"] img', i).height() + "px")) : (i.append(t('<div class="nivo-box" name="' + c + '" rel="' + r + '"><img src="' + n.currentImage.attr("src") + '" style="position:absolute; width:' + i.width() + "px; height:auto; display:block; top:-" + o * r + "px; left:-" + a * c + 'px;" /></div>').css({
                        opacity: 0,
                        left: a * c + "px",
                        top: o * r + "px",
                        width: a + "px"
                    })), t('.nivo-box[name="' + c + '"]', i).height(t('.nivo-box[name="' + c + '"] img', i).height() + "px"));
                s.stop().animate({
                    height: t(n.currentImage).height()
                }, e.animSpeed)
            },
            u = function(i, e, n, a) {
                var o = i.data("nivo:vars");
                if (o && o.currentSlide === o.totalSlides - 1 && n.lastSlide.call(this), (!o || o.stop) && !a) return !1;
                n.beforeChange.call(this), a ? ("prev" === a && s.prop({
                    src: o.currentImage.attr("src"),
                    alt: o.currentImage.attr("alt")
                }), "next" === a && s.prop({
                    src: o.currentImage.attr("src"),
                    alt: o.currentImage.attr("alt")
                })) : s.prop({
                    src: o.currentImage.attr("src"),
                    alt: o.currentImage.attr("alt")
                }), o.currentSlide++, o.currentSlide === o.totalSlides && (o.currentSlide = 0, n.slideshowEnd.call(this)), o.currentSlide < 0 && (o.currentSlide = o.totalSlides - 1), t(e[o.currentSlide]).is("img") ? o.currentImage = t(e[o.currentSlide]) : o.currentImage = t(e[o.currentSlide]).find("img:first"), n.controlNav && (t("a", o.controlNavEl).removeClass("active"), t("a:eq(" + o.currentSlide + ")", o.controlNavEl).addClass("active")), c(n), t(".nivo-slice", i).remove(), t(".nivo-box", i).remove();
                var r = n.effect,
                    l = "";
                "random" === n.effect && (l = new Array("sliceDownRight", "sliceDownLeft", "sliceUpRight", "sliceUpLeft", "sliceUpDown", "sliceUpDownLeft", "fold", "fade", "boxRandom", "boxRain", "boxRainReverse", "boxRainGrow", "boxRainGrowReverse"), r = l[Math.floor(Math.random() * (l.length + 1))], void 0 === r && (r = "fade")), n.effect.indexOf(",") !== -1 && (l = n.effect.split(","), r = l[Math.floor(Math.random() * l.length)], void 0 === r && (r = "fade")), o.currentImage.attr("data-transition") && (r = o.currentImage.attr("data-transition")), o.running = !0;
                var d = 0,
                    v = 0,
                    u = "",
                    f = "",
                    g = "",
                    x = "";
                if ("sliceDown" === r || "sliceDownRight" === r || "sliceDownLeft" === r) p(i, n, o), d = 0, v = 0, u = t(".nivo-slice", i), "sliceDownLeft" === r && (u = t(".nivo-slice", i)._reverse()), u.each(function() {
                    var e = t(this);
                    e.css({
                        top: "0px"
                    }), v === n.slices - 1 ? setTimeout(function() {
                        e.animate({
                            opacity: "1.0"
                        }, n.animSpeed, "", function() {
                            i.trigger("nivo:animFinished")
                        })
                    }, 100 + d) : setTimeout(function() {
                        e.animate({
                            opacity: "1.0"
                        }, n.animSpeed)
                    }, 100 + d), d += 50, v++
                });
                else if ("sliceUp" === r || "sliceUpRight" === r || "sliceUpLeft" === r) p(i, n, o), d = 0, v = 0, u = t(".nivo-slice", i), "sliceUpLeft" === r && (u = t(".nivo-slice", i)._reverse()), u.each(function() {
                    var e = t(this);
                    e.css({
                        bottom: "0px"
                    }), v === n.slices - 1 ? setTimeout(function() {
                        e.animate({
                            opacity: "1.0"
                        }, n.animSpeed, "", function() {
                            i.trigger("nivo:animFinished")
                        })
                    }, 100 + d) : setTimeout(function() {
                        e.animate({
                            opacity: "1.0"
                        }, n.animSpeed)
                    }, 100 + d), d += 50, v++
                });
                else if ("sliceUpDown" === r || "sliceUpDownRight" === r || "sliceUpDownLeft" === r) {
                    p(i, n, o), d = 0, v = 0;
                    var w = 0;
                    u = t(".nivo-slice", i), "sliceUpDownLeft" === r && (u = t(".nivo-slice", i)._reverse()), u.each(function() {
                        var e = t(this);
                        0 === v ? (e.css("top", "0px"), v++) : (e.css("bottom", "0px"), v = 0), w === n.slices - 1 ? setTimeout(function() {
                            e.animate({
                                opacity: "1.0"
                            }, n.animSpeed, "", function() {
                                i.trigger("nivo:animFinished")
                            })
                        }, 100 + d) : setTimeout(function() {
                            e.animate({
                                opacity: "1.0"
                            }, n.animSpeed)
                        }, 100 + d), d += 50, w++
                    })
                } else if ("fold" === r) p(i, n, o), d = 0, v = 0, t(".nivo-slice", i).each(function() {
                    var e = t(this),
                        a = e.width();
                    e.css({
                        top: "0px",
                        width: "0px"
                    }), v === n.slices - 1 ? setTimeout(function() {
                        e.animate({
                            width: a,
                            opacity: "1.0"
                        }, n.animSpeed, "", function() {
                            i.trigger("nivo:animFinished")
                        })
                    }, 100 + d) : setTimeout(function() {
                        e.animate({
                            width: a,
                            opacity: "1.0"
                        }, n.animSpeed)
                    }, 100 + d), d += 50, v++
                });
                else if ("fade" === r) p(i, n, o), f = t(".nivo-slice:first", i), f.css({
                    width: i.width() + "px"
                }), f.animate({
                    opacity: "1.0"
                }, 2 * n.animSpeed, "", function() {
                    i.trigger("nivo:animFinished")
                });
                else if ("slideInRight" === r) p(i, n, o), f = t(".nivo-slice:first", i), f.css({
                    width: "0px",
                    opacity: "1"
                }), f.animate({
                    width: i.width() + "px"
                }, 2 * n.animSpeed, "", function() {
                    i.trigger("nivo:animFinished")
                });
                else if ("slideInLeft" === r) p(i, n, o), f = t(".nivo-slice:first", i), f.css({
                    width: "0px",
                    opacity: "1",
                    left: "",
                    right: "0px"
                }), f.animate({
                    width: i.width() + "px"
                }, 2 * n.animSpeed, "", function() {
                    f.css({
                        left: "0px",
                        right: ""
                    }), i.trigger("nivo:animFinished")
                });
                else if ("boxRandom" === r) m(i, n, o), g = n.boxCols * n.boxRows, v = 0, d = 0, x = h(t(".nivo-box", i)), x.each(function() {
                    var e = t(this);
                    v === g - 1 ? setTimeout(function() {
                        e.animate({
                            opacity: "1"
                        }, n.animSpeed, "", function() {
                            i.trigger("nivo:animFinished")
                        })
                    }, 100 + d) : setTimeout(function() {
                        e.animate({
                            opacity: "1"
                        }, n.animSpeed)
                    }, 100 + d), d += 20, v++
                });
                else if ("boxRain" === r || "boxRainReverse" === r || "boxRainGrow" === r || "boxRainGrowReverse" === r) {
                    m(i, n, o), g = n.boxCols * n.boxRows, v = 0, d = 0;
                    var S = 0,
                        b = 0,
                        I = [];
                    I[S] = [], x = t(".nivo-box", i), "boxRainReverse" !== r && "boxRainGrowReverse" !== r || (x = t(".nivo-box", i)._reverse()), x.each(function() {
                        I[S][b] = t(this), b++, b === n.boxCols && (S++, b = 0, I[S] = [])
                    });
                    for (var y = 0; y < 2 * n.boxCols; y++) {
                        for (var R = y, N = 0; N < n.boxRows; N++) R >= 0 && R < n.boxCols && (! function(e, a, o, s, c) {
                            var l = t(I[e][a]),
                                d = l.width(),
                                v = l.height();
                            "boxRainGrow" !== r && "boxRainGrowReverse" !== r || l.width(0).height(0), s === c - 1 ? setTimeout(function() {
                                l.animate({
                                    opacity: "1",
                                    width: d,
                                    height: v
                                }, n.animSpeed / 1.3, "", function() {
                                    i.trigger("nivo:animFinished")
                                })
                            }, 100 + o) : setTimeout(function() {
                                l.animate({
                                    opacity: "1",
                                    width: d,
                                    height: v
                                }, n.animSpeed / 1.3)
                            }, 100 + o)
                        }(N, R, d, v, g), v++), R--;
                        d += 100
                    }
                }
            },
            h = function(t) {
                for (var i, e, n = t.length; n; i = parseInt(Math.random() * n, 10), e = t[--n], t[n] = t[i], t[i] = e);
                return t
            },
            f = function(t) {
                this.console && "undefined" != typeof console.log && console.log(t)
            };
        return this.stop = function() {
            t(i).data("nivo:vars").stop || (t(i).data("nivo:vars").stop = !0, f("Stop Slider"))
        }, this.start = function() {
            t(i).data("nivo:vars").stop && (t(i).data("nivo:vars").stop = !1, f("Start Slider"))
        }, n.afterLoad.call(this), this
    };
    t.fn.nivoSlider = function(e) {
        return this.each(function(n, a) {
            var o = t(this);
            if (o.data("nivoslider")) return o.data("nivoslider");
            var r = new i(this, e);
            o.data("nivoslider", r)
        })
    }, t.fn.nivoSlider.defaults = {
        effect: "random",
        slices: 15,
        boxCols: 8,
        boxRows: 4,
        animSpeed: 500,
        pauseTime: 3e3,
        startSlide: 0,
        directionNav: !0,
        controlNav: !0,
        controlNavThumbs: !1,
        pauseOnHover: !0,
        manualAdvance: !1,
        prevText: "Prev",
        nextText: "Next",
        randomStart: !1,
        beforeChange: function() {},
        afterChange: function() {},
        slideshowEnd: function() {},
        lastSlide: function() {},
        afterLoad: function() {}
    }, t.fn._reverse = [].reverse
}(jQuery);