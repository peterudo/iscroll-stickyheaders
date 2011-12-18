iScroll sticky headers
======================

Plugin for [iScroll](http://cubiq.org/iscroll-4) that adds support for sticky headers.


## Usage
``` js
var scroll = new iScroll('scroll-element');
scroll.enableStickyHeaders('h1');
```

## Info
This plugin only supports sticky headers when using transform (CSS translate) in iScroll.
It also only supports vertical scrolling. I'll look into adding support for horizontal scrolling if anyone needs it.
