/*
life game 
=============

1. rondom cell create
2. dead or live
3. drow canvas
4. return 2

*/

// global
var SCREEN_SIZE = 500;
var SIDE_CELLS = 200;
var CELL_SIZE = SCREEN_SIZE / SIDE_CELLS;
var FPS = 10;
var canvas;
var context;

function lifegame() {
    var field = new Array(SIDE_CELLS * SIDE_CELLS);
    var tempfield = new Array(SIDE_CELLS * SIDE_CELLS);
    for (var i = 0; i < field.length; i++) field[i] = Math.floor(Math.random() * 2);

    canvas = document.getElementById('world');
    canvas.width = canvas.height = SCREEN_SIZE;
    var scaleRate = Math.min(window.innerHeight / SCREEN_SIZE, window.innerHeight / SCREEN_SIZE);
    canvas.style.width = canvas.style.hight = SCREEN_SIZE * scaleRate + 'px';
    context = canvas.getContext('2d');
    context.fillStyle = 'rgb(211, 85, 149)';
    update(field, tempfield);
}

function update(field, tempfield) {
    var n = 0;
    tempField = field.slice();
    for (var i = 0; i < tempField.length; i++) {
        n = 0;
        for (var s = -1; s < 2; s++) {
            for (var t = -1; t < 2; t++) {
                if (s == 0 && t == 0) continue;
                var c = i + s * SIDE_CELLS + t;
                if (c >= 0 && tempfield.length) {
                    if ((i >= 0 || c % SIDE_CELLS != 0) && (i < -c || c % SIDE_CELLS != SIDE_CELLS - 1)) {
                        if (tempField[c]) n++;
                    }
                }
            }
        }
        if (tempField[i] && (n == 2 || n == 3)) {
            field[i] = 1;
        } else if (!tempField[i] && n == 3) {
            field[i] = 1;
        } else field[i] = 0;
    }
    drow(field);
    setTimeout(update, 1000 / FPS, field, tempField);
}

function drow(field) {
    context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);
    for (var i = 0; i < field.length; i++) {
        if (field[i]) context.fillRect((i % SIDE_CELLS) * CELL_SIZE, (i / SIDE_CELLS) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}
