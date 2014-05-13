desire.fn['wheelScroll'] = function (fdown,fup) {
    function func(event) {
        var event = event || window.event;
        if ($.isWheelDown(event)) {
            fdown();
        } else {
            fup();
        }
        return false;
    }

    //ie chrome
    this[0].onmousewheel = func;
    //FF
    $.addEvent(this[0], 'DOMMouseScroll', func);
}