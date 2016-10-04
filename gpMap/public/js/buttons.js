function findYearIndex(){
    var i = 0;
    while($("#yearList").val() != aYears[i]){
        i++;
    }
    return i
}


function setButtonColors(year){
    var i = findYearIndex()
    $(".backButton").css("color", "black");
    $(".forwardButton").css("color", "black");
    if( i == aYears.length - 1) {
        $(".forwardButton").css("color", "lightgrey");
    }
    if( i == 0) {
        $(".backButton").css("color", "lightgrey");
    }
}


function addPolygonColors(oPressureDataYear){

    map.data.setStyle(function(feature) {
        var id = feature.getProperty('LSOA01CD');

        if(typeof id != "string"){
            var id = feature.getProperty('LSOA11CD');
        }
        if (!oPressureDataYear.hasOwnProperty(id)) {
            return {
                fillColor: selectKeyColor("NA"),
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        } else {
            var n = oPressureDataYear[id];
            var color = selectKeyColor(n);
            return {
                fillColor: color,
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        }
    })

}



function polygonColors(year){
    $('.loading').show();
    if(oPressureData.hasOwnProperty(year)) {
        addPolygonColors((oPressureData[year]))
        $('.loading').hide();
    } else {
        $.ajax("/pressure_data/" + year).done(function (oPressureDataYear) {
            oPressureData[year] = oPressureDataYear;
            addPolygonColors((oPressureData[year]))
            $('.loading').hide();
        });
    };
}


$(function () { //change year from list
    $("#yearList").change(function () {
        var year = $("#yearList").val();
        setButtonColors(year);
        polygonColors(year);
    });
});




$(function () {
    $(".forwardButton").click(function(){ //change from forward button
        var i = findYearIndex()
        if( i == aYears.length - 1) {
            var year = aYears[i]
        }else {
            var year = aYears[i + 1];
            $("#yearList").val(year);
        }
        updateModal(year);
        setButtonColors(year);
        polygonColors(year);
    })
})


$(function () { // change from back button
    $(".backButton").click(function(){
        var i = findYearIndex()
        if( i == 0) {
            var year = aYears[0]
        }else {
            var year = aYears[i - 1];
            $("#yearList").val(year);
        }
        updateModal(year);
        setButtonColors(year);
        polygonColors(year);
    })
})

function updateModal(year) {

    if($(".featureInfo").hasClass('in') ) {
        $("#featureTitle").html(" Who will be visiting the doctor in " + year);
        var id = $(".modal-header").attr("id");
        //console.log(oPopData);
        loadFeatureInfoBox(oPopData[id]);

    }

}

$(function() { //search address
    $("#findButton").click(function(){
        findAddress();
    })
})

$(function() { //search address
    $("#address").keydown(function () {
        if (event.keyCode == 13) {
            findAddress();
        }
    });
})


$(function() { //search address
    $("#gpButton").click(function(){
        if(gpFlag == false) {
            showMarkers();
            gpFlag = true;
        }
    })
})

$(function() { //search address
    $("#hideButton").click(function(){
        hideMarkers();
        gpFlag = false;
    })
})
