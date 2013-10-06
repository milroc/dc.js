/**
## <a name="color-chart" href="#color-chart">#</a> Color Chart [Abstract]
Color chart is an abstract chart functional class created to provide universal coloring support as a mix-in for any concrete
chart implementation.

**/

dc.colorChart = function(_chart) {
    var _colors = d3.scale.category20c();

    var _colorAccessor = function(d, i) { return i; };

    var _elasticColor = false;

    var _colorCalculator = function(value) {
        if (_elasticColor) {
            var newDomain = (function() {
                return [dc.utils.groupMin(this.group(), this.valueAccessor()),
                        dc.utils.groupMax(this.group(), this.valueAccessor())];
                }).call(_chart);
            _colors.domain(newDomain);
        }
        return _colors(value);
    };

    /**
    #### .colors([colorScaleType or colorScale or colorArray])
    Retrieve current color scale or set a new color scale. This function accepts both d3 color scale and arbitrary color
    array. By default d3.scale.category20c() is used.
    colorScaleType: is a convenience argument for switching between varying color scales.
    ```js
    // color scale type
    chart.colors("linear");
    chart.colors("ordinal");
    // color scale
    chart.colors(d3.scale.category20b());
    // arbitrary color array
    chart.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);
    ```

    **/
    _chart.colors = function(_) {
        if (!arguments.length) return _colors;

        if (_ === "ordinal") {
            _colors = d3.scale.category20c();
        } else if (_ === "linear") {
            _colors = d3.scale.linear()
                                .range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
                                .interpolate(d3.interpolateHcl);
        } else if (_ instanceof Array) {
            _colors = d3.scale.ordinal().range(_);
        } else {
            _colors = _;
        }
        return _chart;
    };

    /**
    #### .colorAccessor([colorAccessorFunction])
    Set or get color accessor function. This function will be used to map a data point on crossfilter group to a specific
    color value on the color scale. Default implementation of this function simply returns the next color on the scale using
    the index of a group.
    ```js
    // default index based color accessor
    .colorAccessor(function(d, i){return i;})
    // color accessor for a multi-value crossfilter reduction
    .colorAccessor(function(d){return d.value.absGain;})
    ```

    **/
    _chart.colorAccessor = function(_){
        if(!arguments.length) return _colorAccessor;
        _colorAccessor = _;
        return _chart;
    };

    /**
    #### .elasticColor([boolean])
    get or set whether or not the color scales with the available values.

    **/
    _chart.elasticColor = function(_){
        if(!arguments.length) return _elasticColor;
        _elasticColor = _;
        return _chart;
    };

    _chart.getColor = function(d, i){
        return _colorCalculator(_colorAccessor(d, i));
    };

    _chart.colorCalculator = function(_){
        if(!arguments.length) return _colorCalculator;
        _colorCalculator = _;
        return _chart;
    };

    return _chart;
};
