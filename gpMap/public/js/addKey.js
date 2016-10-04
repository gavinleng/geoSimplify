//var aKeyValues = ["           NA", "    < 100%", "100-105%", "105-110%", "110-120%", "120-130%", "130-150%", "    > 150%"]
var aKeyValues = ["+150%", "+130%", "+120%", "+110%", "+105%", "+100%", "<100%",  "no data"]


function setKeyColors(){
    var oKeyColors = {};
    oKeyColors["color0"] = "hsla(60, 16%, 50%, 1)";
    oKeyColors["color1"] = "hsla(120, 100%, 70%, 1)";
    var hue = 60;
    var hueMin = 0;
    var hueStep = (hue - hueMin) /  (aKeyValues.length - 3);
    var lightness = 70;
    var lightnessMin = 50;
    var lightnessStep = (lightness - lightnessMin) /  (aKeyValues.length - 3);
    for(i = 2; i < aKeyValues.length; i++){
        name = "color" + i;
        value = "hsla(" + hue + " ,100%, " + lightness + "%, 1)";
        oKeyColors[name] = value
        hue -= hueStep;
        lightness -=lightnessStep;
    }
    return oKeyColors
}

function selectKeyColor(n){
    if (isNaN(n)){return oKeyColors["color0"]};
    if(n < 1){return oKeyColors["color1"]};
    if(n < 1.05 && n >= 1){return oKeyColors["color2"]};
    if(n < 1.1 && n >= 1.05){return oKeyColors["color3"]};
    if(n < 1.2 && n >= 1.1){return oKeyColors["color4"]};
    if(n < 1.3 && n >= 1.2){return oKeyColors["color5"]};
    if(n < 1.5 && n >= 1.3){return oKeyColors["color6"]}
    if(n >= 1.5){return oKeyColors["color7"]};
    console.log("here " +  n)
}

function addKeyD3() {

    var oKeyColors = setKeyColors()

    var h = 300;
    var w = 100;

    var svg = d3.select("#mapContainer")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .attr("id", "keyContainer")
        .append("svg")
        .attr("id", "keyCanvas")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + w + " " + (h) )
        //class to make it responsive
        .classed("svg-content-responsive", true);


    //var h = Number(svg.style("height").slice(0, -2));
    //var w = Number(svg.style("width").slice(0, -2));
    var rectPadding = 5;
    var keyPadding = 10;
    var boxh = (h / aKeyValues.length - rectPadding - 2)


    svg.selectAll("rect")
        .data(aKeyValues)
        .enter()
        .append("rect")
        .attr("rx", boxh / 2)
        .attr("ry", boxh / 2)

        .attr("y", function(d, i){
                return i * (h / aKeyValues.length);
        })
        .attr("height", boxh)

        .attr("x", 0)
        .attr("width", w)
        .attr("fill", "white");

    var r = boxh / 2

    svg.selectAll("circle")
        .data(aKeyValues)
        .enter()
        .append("circle")
        .attr("cx", w - r)
        .attr("cy", function(d, i) {
            return i * (h / aKeyValues.length) + boxh / 2;
        })
        .attr("r", r)
        .attr("fill", function(d, i){
            name = "color" + (aKeyValues.length - i - 1)
            return oKeyColors[name]
        })
        .attr("opacity", "0.7")

    var fontSize = Math.round(boxh * 0.5)
    svg.selectAll("text")
        .data(aKeyValues)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        //.attr("text-anchor", "middle")
        .attr("x", 5)
        .attr("y", function(d, i) {
            return i * (h / aKeyValues.length) + boxh / 2 + fontSize / 3;
        })
        .attr("font-family", "Arial")
        .attr("font-size", fontSize + "px")
        .attr("fill", "darkslategrey");


}