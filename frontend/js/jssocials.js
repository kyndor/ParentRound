/*! jssocials - v1.4.0 - 2016-10-10
* http://js-socials.com
* Copyright (c) 2016 Artem Tabalin; Licensed MIT */

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

(function(window, $, undefined) {

    var JSSOCIALS = "JSSocials",
        JSSOCIALS_DATA_KEY = JSSOCIALS;

    var getOrApply = function(value, context) {
        if($.isFunction(value)) {
            return value.apply(context, $.makeArray(arguments).slice(2));
        }
        return value;
    };

    var IMG_SRC_REGEX = /(\.(jpeg|png|gif|bmp|svg)$|^data:image\/(jpeg|png|gif|bmp|svg\+xml);base64)/i;
    var URL_PARAMS_REGEX = /(&?[a-zA-Z0-9]+=)?\{([a-zA-Z0-9]+)\}/g;

    var MEASURES = {
        "G": 1000000000,
        "M": 1000000,
        "K": 1000
    };

    var shares = {};

    function Socials(element, config) {
        var $element = $(element);

        $element.data(JSSOCIALS_DATA_KEY, this);

        this._$element = $element;

        this.shares = [];

        this._init(config);
        this._render();
    }

    Socials.prototype = {
        url: "",
        text: "",
        shareIn: "blank",

        showLabel: function(screenWidth) {
            return (this.showCount === false) ?
                (screenWidth > this.smallScreenWidth) :
                (screenWidth >= this.largeScreenWidth);
        },

        showCount: function(screenWidth) {
            return (screenWidth <= this.smallScreenWidth) ? "inside" : true;
        },

        smallScreenWidth: 640,
        largeScreenWidth: 1024,

        resizeTimeout: 200,

        elementClass: "jssocials",
        sharesClass: "jssocials-shares",
        shareClass: "jssocials-share",
        shareButtonClass: "jssocials-share-button",
        shareLinkClass: "jssocials-share-link",
        shareLogoClass: "jssocials-share-logo",
        shareLabelClass: "jssocials-share-label",
        shareLinkCountClass: "jssocials-share-link-count",
        shareCountBoxClass: "jssocials-share-count-box",
        shareCountClass: "jssocials-share-count",
        shareZeroCountClass: "jssocials-share-no-count",

        _init: function(config) {
            this._initDefaults();
            $.extend(this, config);
            this._initShares();
            this._attachWindowResizeCallback();
        },

        _initDefaults: function() {
            var school_id = localStorage.getItem('school_id');
            var school_name = localStorage.getItem('school_name');
            shareHash = Base64.encode(school_id);

            this.url = window.location.origin +'/share?uid='+shareHash;
            this.text = 'I have thanked '+school_name+' at thanks.parentround.com';
        },

        _initShares: function() {
            this.shares = $.map(this.shares, $.proxy(function(shareConfig) {
                if(typeof shareConfig === "string") {
                    shareConfig = { share: shareConfig };
                }

                var share = (shareConfig.share && shares[shareConfig.share]);

                if(!share && !shareConfig.renderer) {
                    throw Error("Share '" + shareConfig.share + "' is not found");
                }

                return $.extend({ url: this.url, text: this.text }, share, shareConfig);
            }, this));
        },

        _attachWindowResizeCallback: function() {
            $(window).on("resize", $.proxy(this._windowResizeHandler, this));
        },

        _detachWindowResizeCallback: function() {
            $(window).off("resize", this._windowResizeHandler);
        },

        _windowResizeHandler: function() {
            if($.isFunction(this.showLabel) || $.isFunction(this.showCount)) {
                window.clearTimeout(this._resizeTimer);
                this._resizeTimer = setTimeout($.proxy(this.refresh, this), this.resizeTimeout);
            }
        },

        _render: function() {
            this._clear();

            this._defineOptionsByScreen();

            this._$element.addClass(this.elementClass);

            this._$shares = $("<div>").addClass(this.sharesClass)
                .appendTo(this._$element);

            this._renderShares();
        },

        _defineOptionsByScreen: function() {
            this._screenWidth = $(window).width();
            this._showLabel = getOrApply(this.showLabel, this, this._screenWidth);
            this._showCount = getOrApply(this.showCount, this, this._screenWidth);
        },

        _renderShares: function() {
            $.each(this.shares, $.proxy(function(_, share) {
                this._renderShare(share);
            }, this));
        },

        _renderShare: function(share) {
            var $share;

            if($.isFunction(share.renderer)) {
                $share = $(share.renderer());
            } else {
                $share = this._createShare(share);
            }

            $share.addClass(this.shareClass)
                .addClass(share.share ? "jssocials-share-" + share.share : "")
                .addClass(share.css)
                .appendTo(this._$shares);
        },

        _createShare: function(share) {
            var $result = $("<div>");
            var $shareLink = this._createShareLink(share).appendTo($result);

            if(this._showCount) {
                var isInsideCount = (this._showCount === "inside");
                var $countContainer = isInsideCount ? $shareLink : $("<div>").addClass(this.shareCountBoxClass).appendTo($result);
                $countContainer.addClass(isInsideCount ? this.shareLinkCountClass : this.shareCountBoxClass);
                this._renderShareCount(share, $countContainer);
            }

            return $result;
        },

        _createShareLink: function(share) {
            var shareStrategy = this._getShareStrategy(share);

            var $result = shareStrategy.call(share, {
                shareUrl: this._getShareUrl(share)
            });

            $result.addClass(this.shareLinkClass)
                .append(this._createShareLogo(share));

            if(this._showLabel) {
                $result.append(this._createShareLabel(share));
            }

            $.each(this.on || {}, function(event, handler) {
                if($.isFunction(handler)) {
                    $result.on(event, $.proxy(handler, share));
                }
            });

            return $result;
        },

        _getShareStrategy: function(share) {
            var result = shareStrategies[share.shareIn || this.shareIn];

            if(!result)
                throw Error("Share strategy '" + this.shareIn + "' not found");

            return result;
        },

        _getShareUrl: function(share) {
            var shareUrl = getOrApply(share.shareUrl, share);
            return this._formatShareUrl(shareUrl, share);
        },

        _createShareLogo: function(share) {
            var logo = share.logo;

            var $result = IMG_SRC_REGEX.test(logo) ?
                $("<img>").attr("src", share.logo) :
                $("<i>").addClass(logo);

            $result.addClass(this.shareLogoClass);

            return $result;
        },

        _createShareLabel: function(share) {
            return $("<span>").addClass(this.shareLabelClass)
                .text(share.label);
        },

        _renderShareCount: function(share, $container) {
            var $count = $("<span>").addClass(this.shareCountClass);

            $container.addClass(this.shareZeroCountClass)
                .append($count);

            this._loadCount(share).done($.proxy(function(count) {
                if(count) {
                    $container.removeClass(this.shareZeroCountClass);
                    $count.text(count);
                }
            }, this));
        },

        _loadCount: function(share) {
            var deferred = $.Deferred();
            var countUrl = this._getCountUrl(share);

            if(!countUrl) {
                return deferred.resolve(0).promise();
            }

            var handleSuccess = $.proxy(function(response) {
                deferred.resolve(this._getCountValue(response, share));
            }, this);

            $.getJSON(countUrl).done(handleSuccess)
                .fail(function() {
                    $.get(countUrl).done(handleSuccess)
                        .fail(function() {
                            deferred.resolve(0);
                        });
                });

            return deferred.promise();
        },

        _getCountUrl: function(share) {
            var countUrl = getOrApply(share.countUrl, share);
            return this._formatShareUrl(countUrl, share);
        },

        _getCountValue: function(response, share) {
            var count = ($.isFunction(share.getCount) ? share.getCount(response) : response) || 0;
            return (typeof count === "string") ? count : this._formatNumber(count);
        },

        _formatNumber: function(number) {
            $.each(MEASURES, function(letter, value) {
                if(number >= value) {
                    number = parseFloat((number / value).toFixed(2)) + letter;
                    return false;
                }
            });

            return number;
        },

        _formatShareUrl: function(url, share) {
            return url.replace(URL_PARAMS_REGEX, function(match, key, field) {
                var value = share[field] || "";
                return value ? (key || "") + window.encodeURIComponent(value) : "";
            });
        },

        _clear: function() {
            window.clearTimeout(this._resizeTimer);
            this._$element.empty();
        },

        _passOptionToShares: function(key, value) {
            var shares = this.shares;

            $.each(["url", "text"], function(_, optionName) {
                if(optionName !== key)
                    return;

                $.each(shares, function(_, share) {
                    share[key] = value;
                });
            });
        },

        _normalizeShare: function(share) {
            if($.isNumeric(share)) {
                return this.shares[share];
            }

            if(typeof share === "string") {
                return $.grep(this.shares, function(s) {
                    return s.share === share;
                })[0];
            }

            return share;
        },

        refresh: function() {
            this._render();
        },

        destroy: function() {
            this._clear();
            this._detachWindowResizeCallback();

            this._$element
                .removeClass(this.elementClass)
                .removeData(JSSOCIALS_DATA_KEY);
        },

        option: function(key, value) {
            if(arguments.length === 1) {
                return this[key];
            }

            this[key] = value;

            this._passOptionToShares(key, value);

            this.refresh();
        },

        shareOption: function(share, key, value) {
            share = this._normalizeShare(share);

            if(arguments.length === 2) {
                return share[key];
            }

            share[key] = value;
            this.refresh();
        }
    };


    $.fn.jsSocials = function(config) {
        var args = $.makeArray(arguments),
            methodArgs = args.slice(1),
            result = this;

        this.each(function() {
            var $element = $(this),
                instance = $element.data(JSSOCIALS_DATA_KEY),
                methodResult;

            if(instance) {
                if(typeof config === "string") {
                    methodResult = instance[config].apply(instance, methodArgs);
                    if(methodResult !== undefined && methodResult !== instance) {
                        result = methodResult;
                        return false;
                    }
                } else {
                    instance._detachWindowResizeCallback();
                    instance._init(config);
                    instance._render();
                }
            } else {
                new Socials($element, config);
            }
        });

        return result;
    };

    var setDefaults = function(config) {
        var component;

        if($.isPlainObject(config)) {
            component = Socials.prototype;
        } else {
            component = shares[config];
            config = arguments[1] || {};
        }

        $.extend(component, config);
    };

    var shareStrategies = {
        popup: function(args) {
            return $("<a>").attr("href", "#")
                .on("click", function() {
                    window.open(args.shareUrl, null, "width=600, height=400, location=0, menubar=0, resizeable=0, scrollbars=0, status=0, titlebar=0, toolbar=0");
                    return false;
                });
        },

        blank: function(args) {
            return $("<a>").attr({ target: "_blank", href: args.shareUrl });
        },

        self: function(args) {
            return $("<a>").attr({ target: "_self", href: args.shareUrl });
        }
    };

    window.jsSocials = {
        Socials: Socials,
        shares: shares,
        shareStrategies: shareStrategies,
        setDefaults: setDefaults
    };

}(window, jQuery));


(function(window, $, jsSocials, undefined) {

    $.extend(jsSocials.shares, {

        email: {
            label: "E-mail",
            logo: "fa fa-at",
            shareUrl: "mailto:{to}?subject={text}&body={url}",
            countUrl: "",
            shareIn: "self"
        },

        twitter: {
            label: "Tweet",
            logo: "fa fa-twitter",
            shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
            countUrl: ""
        },

        facebook: {
            label: "Like",
            logo: "fa fa-facebook",
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: "https://graph.facebook.com/?id={url}",
            getCount: function(data) {
                return data.share && data.share.share_count || 0;
            }
        },

        vkontakte: {
            label: "Like",
            logo: "fa fa-vk",
            shareUrl: "https://vk.com/share.php?url={url}&title={title}&description={text}",
            countUrl: "https://vk.com/share.php?act=count&index=1&url={url}",
            getCount: function(data) {
                return parseInt(data.slice(15, -2).split(', ')[1]);
            }
        },

        googleplus: {
            label: "+1",
            logo: "fa fa-google",
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: ""
        },

        linkedin: {
            label: "Share",
            logo: "fa fa-linkedin",
            shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url={url}",
            countUrl: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        pinterest: {
            label: "Pin it",
            logo: "fa fa-pinterest",
            shareUrl: "https://pinterest.com/pin/create/bookmarklet/?media={media}&url={url}&description={text}",
            countUrl: "https://api.pinterest.com/v1/urls/count.json?&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        stumbleupon: {
            label: "Share",
            logo: "fa fa-stumbleupon",
            shareUrl: "http://www.stumbleupon.com/submit?url={url}&title={title}",
            countUrl:  "https://cors-anywhere.herokuapp.com/https://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}",
            getCount: function(data) {
                return data.result.views;
            }
        },

        telegram: {
            label: "Telegram",
            logo: "fa fa-paper-plane",
            shareUrl: "tg://msg?text={url} {text}",
            countUrl: "",
            shareIn: "self"
        },

        whatsapp: {
            label: "WhatsApp",
            logo: "fa fa-whatsapp",
            shareUrl: "whatsapp://send?text={url} {text}",
            countUrl: "",
            shareIn: "self"
        },

        line: {
            label: "LINE",
            logo: "fa fa-comment",
            shareUrl: "http://line.me/R/msg/text/?{text} {url}",
            countUrl: ""
        },

        viber: {
            label: "Viber",
            logo: "fa fa-volume-control-phone",
            shareUrl: "viber://forward?text={url} {text}",
            countUrl: "",
            shareIn: "self"
        },

        pocket: {
            label: "Pocket",
            logo: "fa fa-get-pocket",
            shareUrl: "https://getpocket.com/save?url={url}&title={title}",
            countUrl: ""
        },

        messenger: {
            label: "Share",
            logo: "fa fa-commenting",
            shareUrl: "fb-messenger://share?link={url}",
            countUrl: "",
            shareIn: "self"
        }

    });

}(window, jQuery, window.jsSocials));

