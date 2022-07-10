// Code modified from Dennis Wilhelm, 2013
// https://github.com/dwilhelm89/LeafletSlider/blob/master/index.html

L.Control.SliderControl = L.Control.extend({
    options: {
        position: 'topright',
        layers: null,
        sliderAttribute: 'mag',
        minValue: 0,
        maxValue: 1,
        maxIndex: -1,
        minIndex: 0,
        markers: null,
        range: true
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layer = this.options.layer;

    },

    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
        this.startSlider();
        return this;
    },

    onAdd: function (map) {
        this.options.map = map;

        // Create a control sliderContainer with a jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'slider', this._container);
        $(sliderContainer).append('<div id="leaflet-slider" style="width:200px"><div class="ui-slider-handle"></div><div id="slider-magdisplay" style="width:200px; margin-top:13px; background-color:#FFFFFF; text-align:center; border-radius:5px;"></div></div>');
        //Prevent map panning/zooming while using the slider
        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
        });

        var options = this.options;
        this.options.markers = [];

        //If a layer has been provided: calculate the min and max values for the slider
        if (this._layer) {
            var index_temp = 0;
            console.log(this._layer);
            this._layer.eachLayer(function (layer) {
                options.markers[index_temp] = layer;
                ++index_temp;
            });
            options.maxIndex = index_temp - 1;
            this.options = options;
        } else {
            console.log("Error: You have to specify a layer via new SliderControl({layer: your_layer});");
        }
        return sliderContainer;
    },

    onRemove: function (map) {
        //Delete all markers which where added via the slider and remove the slider div
        for (i = this.options.minIndex; i <= this.options.maxIndex; i++) {
            map.removeLayer(this.options.markers[i]);
        }
        $('#leaflet-slider').remove();

        // unbind listeners to prevent memory leaks
        $(document).off("mouseup");
        $(".slider").off("mousedown");
    },

    startSlider: function () {
        _options = this.options;
        var i;
        if(_options.range) _options.values = [_options.minValue,_options.maxValue];
            else _options.value = _options.maxIndex;
        $("#leaflet-slider").slider({
            range: _options.range,
            value: _options.value,
            values: _options.values,
            min: _options.minValue,
            max: _options.maxValue,
            step: (_options.maxValue - _options.minValue) / 100,
            slide: function (e, ui) {
                var map = _options.map;
                $('#slider-magdisplay').html(
                    `Mag. Range: ${ui.values[0].toFixed(3)} to ${ui.values[1].toFixed(3)}`);
                // clear markers
                for (i = _options.minIndex; i <= _options.maxIndex; i++) {
                    if(_options.markers[i])
                        map.removeLayer(_options.markers[i]);
                }
                // jquery ui using range
                for (i = _options.minIndex; i <= _options.maxIndex; i++){
                    if(_options.markers[i].feature.properties.mag >= ui.values[0] &&
                        _options.markers[i].feature.properties.mag <= ui.values[1]) {
                            _options.markers[i].addTo(map);
                    }
                }
            }
        });
        $('#slider-magdisplay').html(
            `Mag. Range: ${this.options.minValue.toFixed(3)} to ${this.options.maxValue.toFixed(3)}`);
        for (i = _options.minIndex; i <= _options.maxIndex; i++) {
            _options.map.addLayer(_options.markers[i]);
        }
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};