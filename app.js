(function() {

    var context = new AudioContext(),
        points = [],
        WIDTH = innerWidth,
        HEIGHT = innerHeight;

    function gainValue(touch) {
        var max = 0.2,
            min = 0,
            height = window.innerHeight,
            value = min + (max - min) * (height - touch.clientY) / height;
        return Math.min(max, Math.max(min, value));
    }

    function freqValue(touch) {
        var max = 5500,
            min = 0,
            width = window.innerWidth,
            value = min + (max - min) * touch.clientX / width;
        return Math.min(max, Math.max(min, value));
    }

    function start(e) {

        var gain, oscillator, touch;

        e.preventDefault();
        touch = e.touches[e.touches.length - 1];

        oscillator = context.createOscillator();
        gain = context.createGain();

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.type = 'square';
        oscillator.frequency.value = freqValue(touch);
        oscillator.start();

        gain.gain.value = gainValue(touch);

        points.push({
            gain: gain,
            oscillator: oscillator,
            identifier: touch.identifier
        });

        move(e);
    }

    function move(e) {
        [].forEach.call(e.touches, function(touch) {
             points.forEach(function(point) {
                if (point.identifier === touch.identifier) {
                    point.oscillator.frequency.value = freqValue(touch);
                    point.gain.gain.value = gainValue(touch);
                }
             });
        });
    }

    function end(e) {
        e.preventDefault();
        [].forEach.call(e.changedTouches, function(removed) {
            points = points.filter(function(point) {
                if (point.identifier === removed.identifier) {
                    point.oscillator.stop();
                    return false;
                }
                return true;
            });
        });
    }

    window.addEventListener('touchstart', start, false);
    window.addEventListener('touchmove', move, false);
    window.addEventListener('touchend', end, false);

})();
