const $div = document.querySelector('div#container');
var width = $div.offsetWidth;
var height = $div.offsetHeight;

var tween = null;

function addStar(layer, stage) {
    var scale = Math.random();

    var star = new Konva.Star({
        x: Math.random() * stage.getWidth(),
        y: Math.random() * stage.getHeight(),
        numPoints: 5,
        innerRadius: 30,
        outerRadius: 50,
        fill: '#89b717',
        opacity: 0.8,
        draggable: true,
        scale: {
            x: scale,
            y: scale
        },
        rotation: Math.random() * 180,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {
            x: 5,
            y: 5
        },
        shadowOpacity: 0.6,
        startScale: scale
    });

    layer.add(star);
}
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var layer = new Konva.Layer();
var dragLayer = new Konva.Layer();

for (var n = 0; n < 10; n++) {
    addStar(layer, stage);
}

stage.add(layer);
stage.add(dragLayer);

// bind stage handlers
stage.on('mousedown', function (evt) {
    var shape = evt.target;
    shape.moveTo(dragLayer);
    stage.draw();
    // restart drag and drop in the new layer
    shape.startDrag();
});

stage.on('mouseup', function (evt) {
    var shape = evt.target;
    shape.moveTo(layer);
    stage.draw();
});

stage.on('dragstart', function (evt) {
    var shape = evt.target;
    if (tween) {
        tween.pause();
    }
    shape.setAttrs({
        shadowOffset: {
            x: 15,
            y: 15
        },
        scale: {
            x: shape.getAttr('startScale') * 1.2,
            y: shape.getAttr('startScale') * 1.2
        }
    });
});

stage.on('dragend', function (evt) {
    var shape = evt.target;

    tween = new Konva.Tween({
        node: shape,
        duration: 0.5,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: shape.getAttr('startScale'),
        scaleY: shape.getAttr('startScale'),
        shadowOffsetX: 5,
        shadowOffsetY: 5
    });

    tween.play();
});