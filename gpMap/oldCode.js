
function getMinAndMaxVisits(){

    for(id in oPopData){
        var baseValue = 0;
        for(sex in oPopData[id]["2015"]){
            for(age in oPopData[id]["2015"][sex]){
                baseValue += Number(oPopData[id]["2015"][sex][age])
            }
        }

        for(year in oPopData[id]){
            var sumValue = 0;
            for(sex in oPopData[id][year]){
                for(age in oPopData[id][year][sex]){
                    sumValue += Number(oPopData[id][year][sex][age])
                }
            }
            var normalisedVisits = sumValue / baseValue;
            if (normalisedVisits < minVisits){minVisits = normalisedVisits}
            if (normalisedVisits > maxVisits){maxVisits = normalisedVisits}
        }
    }
    return minVisits, maxVisits
}

function rainbow(n, saturation) {
    n = 1 - n;
    n = 0 + (120 - 0) / ((maxVisits - 1) - (minVisits - 1)) * (n - (minVisits - 1));
    return 'hsl(' + n + ',' + saturation + '%,50%)';
    //output = output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
}


//---------------------------------------------------------

<!DOCTYPE html>
<html>
<body>

<canvas id="myCanvas" width="160" height="310"
style="border:1px solid #c3c3c3;">
Your browser does not support the HTML5 canvas tag.
</canvas>

<script>
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var color150 = "hsla(0, 100%, 50%, 1)";
var color140 = "hsla(20, 100%, 50%, 1)";
var color120 = "hsla(40, 100%, 60%, 1)";
var color100 = "hsla(60, 100%, 70%, 1)";
var colorless100 = "hsla(120, 100%, 70%, 1)";
var colorNA = "hsla(60, 16%, 50%, 1)";

ctx.font = "bold 30px  Arial";
ctx.fillStyle = "hsla(239, 31%, 14%, 1)";
ctx.fillText(" +150%",50, 45);
ctx.fillText("   140%",50, 95);
ctx.fillText("   120%",50, 145);
ctx.fillText("   100%",50, 195);
ctx.fillText(" <100%",50, 245);
ctx.fillText("   NA",50, 295);


ctx.fillStyle = color150;
ctx.fillRect(10,10,40,40);

ctx.fillStyle = color140;
ctx.fillRect(10,60,40,40);

ctx.fillStyle = color120;
ctx.fillRect(10,110,40,40);

ctx.fillStyle = color100;
ctx.fillRect(10,160,40,40);

ctx.fillStyle = colorless100;
ctx.fillRect(10,210,40,40);

ctx.fillStyle = colorNA;
ctx.fillRect(10,260,40,40);


</script>

</body>
</html>

//------------------

//var oKeyColors = {
//                "color5": "hsla(0, 100%, 50%, 1)",
//                "color4": "hsla(20, 100%, 50%, 1)",
//                "color3": "hsla(40, 100%, 60%, 1)",
//                "color2": "hsla(60, 100%, 70%, 1)",
//                "color1": "hsla(120, 100%, 70%, 1)",
//                "color0": "hsla(60, 16%, 50%, 1)"
//                }
