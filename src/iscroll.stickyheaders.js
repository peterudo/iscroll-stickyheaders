(function(iScroll) {

    var _transitionTime = iScroll.prototype._transitionTime,
        _pos = iScroll.prototype._pos,
        vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
                (/firefox/i).test(navigator.userAgent) ? 'Moz' :
                'opera' in window ? 'O' : '',
        m = Math;
    
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
    }

    iScrollStickyHeaders.prototype = {
        
        headers: [],

        initialize: function () {
            var that = this;

            this._augment();

            this.iscroll.options.onRefresh = function () {
                that.refresh();
            };
            this.iscroll.refresh();
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

                header.elm.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(.33, .66, .66, 1)';
                header.elm.style[vendor + 'TransitionProperty'] = '-' + vendor.toLowerCase() + '-transform';
                header.elm.style[vendor + 'TransitionDuration'] = '0';
                header.elm.style[vendor + 'TransformOrigin'] = '0 0';

                this.headers.push(header);
            }
        },

        _position: function () {
            var roundedAbsY = m.round(m.abs(this.iscroll.y)),
                preventTranslate = this.iscroll.y > 0;

            for (var i = 0, ii = this.headers.length; i < ii; i++) {
                var header = this.headers[i],
                    translateY = roundedAbsY - header.minY;

                if (preventTranslate || translateY < 0) {
                    translateY = 0;
                } else if (translateY > header.maxY) {
                    // Make sure it never exceeds it's max allowed position
                    translateY = header.maxY;
                }

                header.elm.style[vendor + 'Transform'] = 'translate3d(0, ' + translateY + 'px, 0)';
            }
        },

        _transition: function (time) {
            for (var i = 0, ii = this.headers.length; i < ii; i++) {
                this.headers[i].elm.style[vendor + 'TransitionDuration'] = time + 'ms';
            }
        },

        _augment: function () {
            var that = this;

            this.iscroll._pos = function () {
                _pos.apply(this, [].slice.call(arguments));
                that._position();
            };

            this.iscroll._transitionTime = function (time) {
                _transitionTime.apply(this, [].slice.call(arguments));
                that._transition(time);
            };            
        }

    };

}(window.iScroll));
