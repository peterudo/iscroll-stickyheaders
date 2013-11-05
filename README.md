iScroll sticky headers
======================

Plugin for [iScroll](http://cubiq.org/iscroll-5) that adds support for sticky headers.


## Example and usage
Working demo: http://rudolfrck.github.com/iscroll-stickyheaders/

Usage:

``` js
var scroll = new IScroll('#scroll-element', { probeType: 3 });
scroll.enableStickyHeaders('h1');
```

## Info
This plugin only supports sticky headers when using transform (CSS translate) in iScroll.
It also only supports vertical scrolling. I'll look into adding support for horizontal scrolling if anyone needs it.
