/*!
* dumbfixed - Allows selected element to stay visible with vertical scroll but within the confines of its parent container.
* Ideal for ecommerce cart total indicators or status indicators on long scrolling pages.
*
* options:
* $(selector).dumbfixed({ 
*     topSpace : 10 // default spacing from viewport top edge in pixels
* });
*
* Copyright 2012, Jason Sebring, mail@jasonsebring.com
* Dual licensed under the MIT or GPL Version 2 licenses.
*
* depends on: 
* jQuery : tested in version 1.7.1
*/
(function (w, d, $) {
    var $w = $(w), $d = $(d);
    $.fn.dumbFixed = function () {
        var $self = $(this), state, $parent = $self.parent(),
        args = Array.prototype.slice.apply(arguments),
        config = { topSpace: 10 };
        if ($self.data('dumbfixed-defined')) {
            return $self;
        } else {
            if ($parent.css('position') === 'static') { $parent.css({ position: 'relative' }); }
            state = { $self: $self, $parent: $parent };
            if (args.length > 0 && $.isPlainObject(args[0])) { config = $.extend(config, args[0]); }
            $self.data('dumbfixed-state', state);
            $self.data('dumbfixed-defined', true);
            $self.data('dumbfixed-config', config);
            $w.bind('load.dumbfixed', function () {
                var state = $self.data('dumbfixed-state');
                state.selfOffset = state.$self.offset();
                state.selfPosition = state.$self.position();
                state.parentOffset = state.$parent.offset();
                state.verticalPadding = state.selfOffset.top - state.parentOffset.top;
                state.$parent.css({
                    'min-width': $self.width(),
                    'min-height': $self.height() + state.verticalPadding 
                });
                state.$self.css({
                    position: 'absolute',
                    left: state.selfPosition.left,
                    top: state.selfPosition.top
                });
                $w.bind('scroll.dumbfixed resize.dumbfixed', function () {
                    var state = $self.data('dumbfixed-state'),
                    config = $self.data('dumbfixed-config'),
                    st = $d.scrollTop(),
                    sl = $d.scrollLeft(),
                    sh = state.$self.outerHeight(),
                    ph = state.$parent.height(),
                    anchorTop = (state.parentOffset.top >= st + config.topSpace),
                    abc1 = sh + state.$self.offset().top,
                    abc2 = state.parentOffset.top + ph,
                    anchorBottom = (!anchorTop && (abc1 >= abc2) && (st + config.topSpace > (state.parentOffset.top + ph - sh)));
                    if (anchorTop) {
                        state.$self.css({
                            top: state.selfPosition.top,
                            left: state.selfPosition.left,
                            position: 'absolute'
                        });
                    } else if (anchorBottom) {
                        state.$self.css({
                            top: (ph - sh + state.verticalPadding),
                            left: state.selfPosition.left,
                            position: 'absolute'
                        });
                    } else {
                        state.$self.css({
                            top: state.verticalPadding + config.topSpace,
                            left: state.$parent.offset().left + state.selfPosition.left - sl,
                            position: 'fixed'
                        });
                    }
                });
                window.setTimeout(function () { $w.trigger('scroll.dumbfix'); }, 1);
            });
        }
        return $self;
    };
})(window, document, jQuery);