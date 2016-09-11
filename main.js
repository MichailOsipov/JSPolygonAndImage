'use strict';
var points = [];
var toDraw = false;
var startDraw = document.getElementsByClassName('startDraw')[0];
var stopDraw = document.getElementsByClassName('stopDraw')[0];
stopDraw.disabled = true;

function clearField() {
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
}

function initializeDrawing() {
    stopDraw.disabled = false;
    toDraw = true;
    clearField();
    generateSVG();
}

function generateSVG() {
    var svgObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgObj.setAttribute('id', 'drawField');
    svgObj.setAttribute('height', '100%');
    svgObj.setAttribute('width', '100%');
    field.appendChild(svgObj);
}

function clearField() {
    field.innerHTML = "";
    points = [];
}

function drawLine(x1, y1, x2, y2) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'rgb\(255,0,0\)');
    line.setAttribute('stroke-width', 2);
    drawField.appendChild(line);
}

function drawLastLine() {
    if (points.length >= 3) {
        drawLine(points[0].x, points[0].y, points[points.length - 1].x, points[points.length - 1].y);
    }
    toDraw = false;
    stopDraw.disabled = true;
}

function draw(event) {
    if (toDraw) {
        points.push({
            x: event.offsetX
            , y: event.offsetY
        });
        if (points.length >= 2) {
            //drawLine(0, 0, event.offsetX, event.offsetY);
            drawLine(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
        }
    }
}
startDraw.addEventListener('click', initializeDrawing);
stopDraw.addEventListener('click', drawLastLine);
field.addEventListener('click', draw);