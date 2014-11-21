/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        $d = $(document),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        sections = this,
        loaded;

    this.on("unveil", function() {
      // var source = this.getAttribute(attrib);
      // source = source || this.getAttribute("data-src");
      // if (source) {
      //   this.setAttribute("src", source);
      if (typeof callback === "function") callback.call(this);
      // }
    });

    function unveil() {
      sections.filter(function() {
        var $e = $(this);
        // if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return (et - wt) <= th && (eb - wt) > th;
      }).trigger("unveil");
    }


    // $w.on("scroll.unveil resize.unveil lookup.unveil", function(){scrolled = true;});
    $d.on("human-scroll", unveil);

    // unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
