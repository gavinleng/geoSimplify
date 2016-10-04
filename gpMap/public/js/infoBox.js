/*GP info data*/

function gpDataString(surgery){

    string =    "<div id='gpText'>"
                +"<h3 id='gpH1Text'>" + surgery.name + "</h1>"
                + "<br/>"
                +  "<p class='gpP'>KEY FACTS" + "</p>"
                +  "<p class='gpP'>Registered Patients: "
                    + Math.round(surgery.registered_patients) + "</p>"
                + "<p class='gpP'>User Rating: "
                    +  surgery.nhs_choices_user_rating + "</p>"
                + "<br/>"

    aAddress = surgery.address.split('\n')
    for(i = 0; i < aAddress.length; i++){
        string += "<p class='gpP'>&nbsp;&nbsp"
                    + aAddress[i] + "</p>"
    }

    string += "<br/><p class='gpP'>attribution: NHS Choices</p></div>";

    return string;
}

var infowindow = new google.maps.InfoWindow({maxWidth: 400})

function createMarker(surgery, loc, name, id){ // create a marker with a info window

    var marker = new google.maps.Marker({position: loc,
                                        title: name,
                                        icon: "/images/medical96.png"
                                        });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.close();
        infowindow.setOptions({maxWidth: 400});
        infowindow.setContent(gpDataString(surgery));
        infowindow.open(map, marker);
        //$("#mapContainer").append("<div id='infoCanvas'></div>")
        //$("#header2").html(surgery.name);
        //string = gpDataString(surgery);
        //$("#dataBox").empty();
        //$("#dataBox").append(string);
    });
    return marker;
}


function hideMarkers(){
    for (i = 0; i < markers.length; i++){ //remove old markers
        markers[i].setMap(null);
        markers[i] = null;
    }
    markers = [];
    markerCluster.clearMarkers();
}


function showMarkers(){
    markers = addGPMarkers(markers)
    var mcOptions = {gridSize: 30, maxZoom: 14};
    markerCluster = new MarkerClusterer(map, markers, mcOptions);
}


function addSearchMarker(loc_Center, name){
    var marker = new google.maps.Marker({position: loc_Center, title: name});
    google.maps.event.addListener(marker, 'click', function () {
        var infowindow = new google.maps.InfoWindow({content: name
                                                    , maxWidth: 200
                                                    })
        infowindow.open(map, marker);
    })
    return marker
}

function getLoc(surgery){ //extracts google location from surgery object
    return new google.maps.LatLng(surgery.geoCode.lat, surgery.geoCode.lng);
};

function addGPMarkers(markers){

    for (var i = 0; i < oGPsData.surgeries.length; i++){
        var surgery = oGPsData.surgeries[i];
        if (surgery.geoStatus == "OK"){
            var name = surgery.name;
            var loc = getLoc(surgery);
            var id = surgery.id;
            markers.push(createMarker(surgery, loc, name, id));
        }
    };
    return markers
}

//function addMarkersToMap(markers) {
//    for (i = 0; i < markers.length; i++) { //add markers to map
//        markers[i].setMap(map);
//    }
//}

//
//function doMarkers(markers, loc_Center){
//    console.log("do markers")
//    console.log(markers)
//    markers = removeOldMarkers(markers)
//    markers = addGPMarkers(loc_Center, markers);
//    addMarkersToMap(markers)
//    return markers
//}


function findAddress() {
    var geocoder = new google.maps.Geocoder();
    var address = $('#address').val();
    console.log(address)
    geocoder.geocode( {'address': address + ', hampshire, uk'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var loc_Center = results[0].geometry.location;
            map.setCenter(loc_Center);
            map.setZoom(13);
            zoomChanged();
        } else {
            alert('We could not find your address for the following reason: ' + status);
        }
    });
}

/*Geographic feature data*/

function createSexArray(oSexData, oConsultData){
    var aSexData = [];
    var aConsultData = [];
    for(age in oSexData){
        aSexData.push(Number(oSexData[age]));
        aConsultData.push(Math.round(Number(oSexData[age]) * Number(oConsultData[age])))
    }
    return [aSexData, aConsultData];
}

function createAgeArray(oPopData){
    var aAges = [];
    for(age in oPopData["male"]){
        age = age.replace("-to-", "-")
        if(age == "90-and-over"){
            age = "90+"
        }
        aAges.push(age);
    }
    return aAges;
}

function sumArray(aA){
    var sum = 0;
    for(i in aA){
        sum += aA[i];
    }
    return sum;
}

function bucketArray(aA){
    aB = [];
    sum = 0; //children
    for (i = 0; i < 3; i++){
        sum += aA[i];
    }
    aB.push(sum);
    sum = 0; //adults
    for (i = 3; i < 11; i++){
        sum += aA[i];
    }
    aB.push(sum);
    sum = 0; //retired
    for (i = 11; i < aA.length; i++){
        sum += aA[i];
    }
    aB.push(sum);
    return aB;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function popPyramid(oPopDataIdYear, maxValue){

    var aAges = createAgeArray(oPopDataIdYear);

    var aRes = createSexArray(oPopDataIdYear["male"], oConsultationData["consultationRates"]["male"]);
    var aPopDataMale = aRes[0];
    var aConsultDataMale = aRes[1];
    var aBucketMale = bucketArray(aConsultDataMale);
    var aMaleImages = ["images/boyMale.png", "images/male.png", "images/oldMale.png"]

    var aRes = createSexArray(oPopDataIdYear["female"], oConsultationData["consultationRates"]["female"]);
    var	aPopDataFemale = aRes[0];
    var aConsultDataFemale = aRes[1];
    var aBucketFemale = bucketArray(aConsultDataFemale);

    console.log(aBucketFemale)

    var aKeyNames = ["Population Count", "General Practice Visits"];
    var aKeyWidth = [50, 80];

    var totalPop = sumArray(aPopDataMale) + sumArray(aPopDataFemale);
    var totalConsult = sumArray(aConsultDataMale) + sumArray(aConsultDataFemale);
    var totalsString = "Total patients = "
                        + numberWithCommas(totalPop)
                        + ", with the total number of GP visits = "
                        + numberWithCommas(totalConsult);
    $("#totalsText").html(totalsString);

    var w = 800,
        h = 700;

    var keyWidth1 = 50;
    var keyWidth2 = 100;

    var margin = {
        top: 60,
        right: 80,
        bottom: 60,
        left: 80,
        middle: 0
    };

// the width of each side of the chart
    var regionWidth = w/2 - margin.middle;

// these are the x-coordinates of the y-axes
    var pointA = regionWidth,
        pointB = w - regionWidth;

    d3.select("#featureInfoContainer").remove()

    var svg = d3.select("#featureInfoCanvas")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .attr("id", "featureInfoContainer")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + (margin.left + w + margin.right) + " " + (margin.top + h + margin.bottom) )
        .classed("svg-content-responsive", true)
        .append('g')
        .attr('transform', translation(margin.left, margin.top));


    ////add people icons
    //var img = svg.selectAll("image")
    //    .data(aBucketMale)
    //    .enter()
    //    .append("svg:image")
    //    .attr("xlink:href", function(d, i){
    //        return aMaleImages[i];
    //    })
    //    .attr("width", 500)
    //    .attr("height", 500)
    //    .attr("x", function(d, i){
    //        console.log(pointA)
    //        return pointA - (i * 200);
    //    })
    //    .attr("y", h - 500)
    //    .attr("opacity", 0.1)

// find the maximum data value on either side
//  since this will be shared by both of the x-axes
//    var maxValue = Math.max(
//        Math.max.apply( Math, aPopDataMale ),
//        Math.max.apply( Math, aPopDataFemale )
//    );

// SET UP SCALES

// the xScale goes from 0 to the width of a region
//  it will be reversed for the left x-axis
    var xScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([0, regionWidth])
        .nice();

    var xScaleLeft = d3.scale.linear()
        .domain([0, maxValue])
        .range([regionWidth, 0]);

    var xScaleRight = d3.scale.linear()
        .domain([0, maxValue])
        .range([0, regionWidth]);


    var yScale = d3.scale.ordinal()
        .domain(aAges.map(function(d) {return d; }))
        .rangeRoundBands([h,0], 0.1);


// SET UP AXES
    var yAxisLeft = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickSize(0,0)
        //.tickPadding(margin.middle-4);


    //var yAxisRight = d3.svg.axis()
    //    .scale(yScale)
    //    .orient('left')
    //    .tickSize(4,0)
    //    .tickFormat('');

    var xAxisRight = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(5);

    var xAxisLeft = d3.svg.axis()
        // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
        .scale(xScale.copy().range([pointA, 0]))
        .orient('bottom')
        .ticks(5);

// MAKE GROUPS FOR EACH SIDE OF CHART
// scale(-1,1) is used to reverse the left side so the bars grow left instead of right
    var leftBarGroup = svg.append('g')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)')
        .attr('fill', 'steelblue');
    var leftBarGroup2 = svg.append('g')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)')
        .attr('fill', 'lightsteelblue');

    var rightBarGroup = svg.append('g')
        .attr('transform', translation(pointB, 0))
        .attr('fill', 'pink');

    var rightBarGroup2 = svg.append('g')
        .attr('transform', translation(pointB, 0))
        .attr('fill', 'lightpink');


    var keyGroup = svg.append('g')
        .attr('transform', translation(w + margin.left + margin.right - keyWidth2 - keyWidth2 - 100, 0));

// DRAW AXES
    svg.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(0, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle')


    //svg.append('g')
    //    .attr('class', 'axis y right')
    //    .attr('transform', translation(pointB, 0))
    //    .call(yAxisRight);

    svg.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, h))
        .call(xAxisLeft);

    svg.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB, h))
        .call(xAxisRight);

// DRAW BARS
    leftBarGroup2.selectAll('.bar.left2')
        .data(aConsultDataMale)
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('x', 0)
        .attr('y', function(d, i) { return yScale(aAges[i]); })
        .attr('width', function(d) { return xScale(d); })
        .attr('height', yScale.rangeBand());

    leftBarGroup.selectAll('.bar.left')
        .data(aPopDataMale)
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('x', 0)
        .attr('y', function(d, i) { return yScale(aAges[i]); })
        .attr('width', function(d) { return xScale(d); })
        .attr('height', yScale.rangeBand());

    rightBarGroup2.selectAll('.bar.right2')
        .data(aConsultDataFemale)
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('x', 0)
        .attr('y', function(d, i) { return yScale(aAges[i]); })
        .attr('width', function(d) { return xScale(d); })
        .attr('height', yScale.rangeBand());

    rightBarGroup.selectAll('.bar.right')
        .data(aPopDataFemale)
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('x', 0)
        .attr('y', function(d, i) { return yScale(aAges[i]); })
        .attr('width', function(d) { return xScale(d); })
        .attr('height', yScale.rangeBand());

//keys
    var pointerCircle = svg.append("circle")
                            .attr("cx", pointA)
                            .attr("cy", yScale.rangeBand()* 4)
                            .attr("r", 6)
                            .attr("fill", "blue")

    var pointerText = svg.append("text")
        .text("dark bars = number of patients")
        .attr("x", pointA + 100)
        .attr("y", yScale.rangeBand() * 2 + 5)
        .attr("fill", "blue")
        .attr("font-size", "25px")
        .attr("font-family", "cursive")

    var lineData = [{"x":pointA, "y": yScale.rangeBand()* 4 }
                ,{"x": pointA + 280, "y": yScale.rangeBand()* 4}
                , {"x":pointA + 300, "y":yScale.rangeBand() * 2 + 10}]

    var lineFunction = d3.svg.line()
                             .x(function(d) { return d.x; })
                             .y(function(d) { return d.y; })
                             .interpolate("basis");

    var pointer = svg.append("path")
                    .attr("d", lineFunction(lineData))
                    .attr("stroke", "blue")
                    .attr("stroke-width", "2.5px")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("fill", "none")
                    //.attr("shape-rendering", "crispEdges");

    leftBracket = pointA - xScale(aConsultDataMale[aConsultDataMale.length - 1]);
    rightBracket = pointB + xScale(aConsultDataFemale[aConsultDataFemale.length - 1]);
    centerBracket = (leftBracket + rightBracket) /2

    var bracketText = svg.append("text")
        .text("light bars = total number of visits to doctor in a year")
        .attr('text-anchor', 'left')
        .attr("x", pointA - 150)
        .attr("y", -20)
        .attr("fill", "blue")
        .attr("font-size", "25px")
        .attr("font-family", "cursive")

    var bracketData = [{"x": leftBracket, "y": 0}
                        ,{"x": (leftBracket + centerBracket) / 2, "y": -10}
                        ,{"x": centerBracket - 2  , "y": 0}
                        ,{"x": centerBracket, "y": -15}
                        ,{"x": centerBracket + 2, "y": 0}
                        ,{"x": (rightBracket + centerBracket) / 2, "y": -10}
                        ,{"x": rightBracket, "y": 0}];

    var bracket = svg.append("path")
        .attr("d", lineFunction(bracketData))
        .attr("stroke", "blue")
        .attr("stroke-width", "2.5px")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("fill", "none");

    var ageText = svg.append("text")
        .text("Age")
        .attr('text-anchor', 'right')
        .attr("x", -30)
        .attr("y", -5)
        .attr("fill", "darkslategray")
        .attr("font-size", "25px")

    var xAxisText = svg.append("text")
        .text("Population and Visit Count")
        .attr('text-anchor', 'middle')
        .attr("x", pointA)
        .attr("y", h + 55)
        .attr("fill", "darkslategray")
        .attr("font-size", "25px")

    var maleText = svg.append('text')
        .text("males")
        .attr('text-anchor', 'left')
        .attr("x", 0)
        .attr("y", h + 55)
        .attr("fill", "blue")
        .attr("font-size", "25px")
        .attr("font-family", "cursive")

    var femalText = svg.append("text")
        .text("females")
        .attr('text-anchor', 'right')
        .attr("x", regionWidth * 2 - 50)
        .attr("y", h + 55)
        .attr("fill", "blue")
        .attr("font-size", "25px")
        .attr("font-family", "cursive")

}



function translation(x,y) {
    return 'translate(' + x + ',' + y + ')';
}

function getPopMaxValue(oPopDataId){
    var maxValue = 0;
    for(year in oPopDataId){
        for(sex in oPopDataId[year]){
            for(age in oPopDataId[year][sex]) {
                newValue = Number(oPopDataId[year][sex][age]) * Number(oConsultationData["consultationRates"][sex][age])
                if(newValue > maxValue) {
                    maxValue = newValue
                }
            }
        }
    }
    return maxValue;
}

function loadFeatureInfoBox(oPopDataId) {
    var year = $("#yearList").val();
    var maxValue = getPopMaxValue(oPopDataId);
    popPyramid(oPopDataId[year], maxValue)

    $(".featureInfo").modal("show");
}

function featureClick(event){

    var id = event.feature.getProperty('LSOA01CD');
    var name = event.feature.getProperty('LSOA01NM');
    var year = $("#yearList").val();

    $("#featureTitle").html(" Who will be visiting the doctor in " + year)
    $(".modal-header").attr("id", id)
    $("#featureIdTitle").html("Local Area: " + name);

    if (oPopData.hasOwnProperty(id)){
        loadFeatureInfoBox(oPopData[id]);
    } else {
        $.ajax("/pop_data/" + id ).done(function (oPopDataId) {
            oPopData[id] = oPopDataId;
            loadFeatureInfoBox(oPopDataId);
        });
    };
}