'use strict';
var points = [];
var linesCount = 1;
var circleRadius = 6;
var toDraw = false;
var toMovePointsLines = false;
var startDraw = document.getElementsByClassName('startDraw')[0];
var stopDraw = document.getElementsByClassName('stopDraw')[0];
var startMovePointsLines = document.getElementsByClassName('startMovePointsLines')[0];
var svgObj;
stopDraw.disabled = true;
generateSVG();

function generateSVG() {
    svgObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgObj.setAttribute('id', 'drawField');
    svgObj.setAttribute('height', '100%');
    svgObj.setAttribute('width', '100%');
    field.appendChild(svgObj);
}

function initializeDrawing() {
    stopDraw.disabled = false;
    toDraw = true;
    clearField();

    function clearField() {
        while (svgObj.lastChild) {
            svgObj.removeChild(svgObj.lastChild);
        }
        points = [];
        linesCount = 1;
    }
}

function drawLine(x1, y1, x2, y2) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'rgb\(255,0,0\)');
    line.setAttribute('stroke-width', 2);
    line.id = "line" + linesCount;
    linesCount++;
    // drawField.appendChild(line);
    drawField.insertBefore(line, drawField.firstChild);
}

function drawCircle(x, y, circleNumber) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', circleRadius);
    circle.setAttribute('stroke', 'rgb\(0,0,0\)');
    circle.setAttribute('stroke-width', 2);
    circle.setAttribute('fill', 'red');
    circle.id = "circle" + circleNumber;
    drawField.appendChild(circle);
    //    circle.addEventListener('click', function (event) {
    //        event.stopPropagation();
    //        var line1 = document.getElementById('line' + (circleNumber - 1));
    //        if (line1 !== null) {
    //            line1.setAttribute('stroke', 'green');
    //        }
    //        var line2 = document.getElementById('line' + circleNumber);
    //        if (line2 !== null) {
    //            line2.setAttribute('stroke', 'blue');
    //        }
    //        //alert(length);
    //    });
    circle.addEventListener('click', function (event) {
        event.stopPropagation();
    })
    circle.addEventListener('mousedown', function (event) {
        function moveAt(event) {
            var line1 = document.getElementById('line' + (circleNumber - 1));
            var line2 = document.getElementById('line' + circleNumber);
            circle.setAttribute('cx', event.offsetX);
            circle.setAttribute('cy', event.offsetY);
            if (line1 !== null) {
                line1.setAttribute('x2', event.offsetX);
                line1.setAttribute('y2', event.offsetY);
            }
            else {
                if (toDraw == false && points.length > 1) {
                    line1 = document.getElementById('line' + points.length);
                    line1.setAttribute('x2', event.offsetX);
                    line1.setAttribute('y2', event.offsetY);
                }
            }
            if (line2 !== null) {
                line2.setAttribute('x1', event.offsetX);
                line2.setAttribute('y1', event.offsetY);
            }
            points[circleNumber - 1].x = event.offsetX;
            points[circleNumber - 1].y = event.offsetY;
            if (!toDraw) {
                drawField.removeChild(drawField.childNodes[0]);
                drawPolygon();
            }
        }
        moveAt(event);

        function clearEvent(event) {
            field.removeEventListener('mousemove', moveAt);
            circle.removeEventListener('mouseup', clearEvent);
        }
        field.addEventListener('mousemove', moveAt);
        circle.addEventListener('mouseup', clearEvent);
    });
    circle.ondragstart = function () {
        return false;
    };
}

function drawLastLine() {
    if (points.length >= 3) {
        drawLine(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);
    }
    toDraw = false;
    stopDraw.disabled = true;
    drawPolygon();
}

function drawPolygon() {
    function getPointsStr() {
        var str = "";
        for (var i = 0; i < points.length; i++) {
            str += points[i].x + "," + points[i].y + " ";
        }
        return str;
    }
    var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    var strPoints = getPointsStr();
    polygon.setAttribute('points', strPoints);
    polygon.setAttribute('fill', 'green');
    polygon.setAttribute('stroke-width', 0);
    drawField.insertBefore(polygon, drawField.firstChild);
}

function draw(event) {
    if (toDraw) {
        points.push({
            x: event.offsetX
            , y: event.offsetY
        });
        if (points.length >= 2) {
            drawLine(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
        }
        drawCircle(event.offsetX, event.offsetY, points.length);
    }
}
//function testingSmth() {
//    var pointsStr = "";
//    for (var i = 0; i < points.length; i++) pointsStr += points[i].x + ";" + points[i].y + "\n";
//    meme.innerHTML = pointsStr;
//}
startDraw.addEventListener('click', initializeDrawing);
stopDraw.addEventListener('click', drawLastLine);
field.addEventListener('click', draw);
//помимо points заведи массивы линий и кругов, работать с этим намного проще