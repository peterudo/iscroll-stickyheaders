/**
 * iscroll.stickyheaders.js
 * (c) 2011-2012 Peter Rudolfsen
 * May be freely distributed under the MIT license.
 */

(function(iScroll) {

    var m = Math,

        // Hoping iscroll gets easier to extend, so this can be skipped.
        vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
                (/firefox/i).test(navigator.userAgent) ? 'Moz' :
                'opera' in window ? 'O' : '',
        has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        trnOpen = 'translate' + (has3d ? '3d(' : '('),
        trnClose = has3d ? ',0)' : ')';

    iScroll.prototype.enableStickyHeaders = function (selector) {
        return new iScrollStickyHeaders(this, selector);
    };

    var iScrollStickyHeaders = function (iscroll, selector) {
        if (!iscroll.options.useTransform) {
            return;
        }

        this.iscroll = iscroll;
        this.selector = selector;

        this.initialize();
    };

    iScrollStickyHeaders.prototype = {

        headers: [],

        initialize: function () {
            var that = this;

            this._augment();

            this.iscroll.on('refresh', function() {
                that.refresh()
            });

            this.iscroll.refresh()
        },

        refresh: function () {
            var i, ii,
                elms = this.iscroll.scroller.querySelectorAll(this.selector);

            this.headers = [];

            for (i = 0, ii = elms.length; i < ii; i++) {
                var header = {
                        elm: elms[i],
                        minY: elms[i].offsetTop,
                        maxY: elms[i].offsetHeight + elms[i].offsetTop
                    },
                    prevHeader = this.headers[i - 1];


                if (prevHeader) {
                    prevHeader.maxY = m.abs(prevHeader.maxY - header.minY);
                }

                this.headers.push(header);
            }

            this._translate();
        },

        _translate: function (x, y) {
            var absY = m.abs(y),
                preventTranslate = y > 0;

            for (var i = 0, ii = this.headers.length; i < ii; i++) {
                var header = this.headers[i],
                    translateY = absY - header.minY;

                if (preventTranslate || translateY < 0) {
                    translateY = 0;
                } else if (translateY > header.maxY) {
                    // Skip the check for the last section head because there is now max allowed position
                    if (i + 1 !== ii)
                        // Make sure it never exceeds it's max allowed position
                        translateY = header.maxY;
                }

                header.elm.style[vendor + 'Transform'] = trnOpen + ('0, ' + translateY + 'px') + trnClose;
            }
        },

        _augment: function () {
            var that = this;

            this.iscroll.on('scroll', function() {
                that._translate(this.x, this.y)
            });
        }

    };

}(window.IScroll));
