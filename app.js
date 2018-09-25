const $div = document.querySelector("div#container");
var width = $div.offsetWidth;
var height = $div.offsetHeight;

const $s_league = $("select#league");
const $s_team = $("select#team");
const $s_formation = $("select#formation");
const $r_weblogo = $("input[name='logo']");

$.getJSON("./data/all-team.json", function (data) {
    var options = {
        data: data,
        getValue: "team_name",
        list: {
            match: {
                enabled: true
            },
            sort: {
                enabled: true
            },
            maxNumberOfElements: 3000,
            onSelectItemEvent: function () {
                var value = $("#team-data").getSelectedItemData().team_img;
                $("#data-holder").val(value).trigger("change");
            }
        }
    };

    $("#team-data").easyAutocomplete(options);
    // $("#data-holder").change(function () {
    //     console.log($(this).val());
    // });
    
    // $.each(data, function (key, val) {
    //     $s_team.append('<option value="' + val.team_img + '">' + val.team_name + "</option>");
    // });
});

$.getJSON("./data/formation.json", function (data) {
    $.each(data, function (key, val) {
        $s_formation.append(
            '<option value="' + key + '">' + val.plan + "</option>"
        );
    });
});

var formationJSON;
$.getJSON("./data/formation.json", function (data) {
    formationJSON = data;
});

var createImageAndText = (val, img_src, stage, layer, isCoach) => {
    var x = val.x - 26;
    var y = val.y - 26;
    var imageObj = new Image();
    imageObj.src = img_src;
    imageObj.onload = function () {
        var logoTeam = new Konva.Image({
            image: imageObj,
            x: x,
            y: y,
            width: 65,
            height: 65,
            draggable: false
        });

        // add cursor styling
        logoTeam.on("mouseover", function () {
            document.body.style.cursor = "pointer";
        });
        logoTeam.on("mouseout", function () {
            document.body.style.cursor = "default";
        });

        layer.add(logoTeam);
        stage.add(layer);

        var alignText, textColor;
        if (isCoach) {
            // If Coach
            x = x + 75;
            y = y + 15;
            alignText = 'left';
            textColor = '#000';
        } else {
            // If player
            x = x - 68;
            y = y + 75;
            alignText = 'center';
            textColor = '#fff';
        }

        let textNode = new Konva.Text({
            text: "Click to edit",
            x: x,
            y: y,
            fontSize: 20,
            fill: textColor,
            align: alignText,
            width: 200,
            fontFamily: "Anton",
            stroke: "#000",
            strokeWidth: 0.3

        });
        layer.add(textNode);
        layer.draw();

        textNode.on("click", function () {
            // create textarea over canvas with absolute position

            // first we need to find its positon
            var textPosition = textNode.getAbsolutePosition();
            var stageBox = stage.getContainer().getBoundingClientRect();

            var areaPosition = {
                x: textPosition.x + stageBox.left,
                y: textPosition.y + stageBox.top
            };

            // create textarea and style it
            var textarea = document.createElement("textarea");
            document.body.appendChild(textarea);

            // textarea.value = textNode.text();
            textarea.value = '';
            textarea.style.position = "absolute";
            textarea.style.top = areaPosition.y + "px";
            textarea.style.left = areaPosition.x + "px";
            textarea.style.width = textNode.width() + "px";

            textarea.focus();

            textarea.addEventListener("keydown", function (e) {
                // hide on enter
                if (e.keyCode === 13) {
                    if (textarea.value == '') {
                        textNode.text(textNode.text());
                    } else {
                        if (isCoach) {
                            textNode.text(`Coach:\n${textarea.value}`);
                        } else {
                            textNode.text(`${textarea.value}`);
                        }
                    }
                    layer.draw();
                    document.body.removeChild(textarea);
                }
            });
        });
    };
};

$(function () {
    $('input[name="logo"]').prop('disabled', true);

    // Begin - create stage for field
    var stage = new Konva.Stage({
        container: "container",
        width: 1200,
        height: 627
    });

    var layer = new Konva.Layer();
    // stage.add(layer);

    var webLogoObj = new Image();
    webLogoObj.onload = function () {
        // let x = 1200 - this.width;
        bg = new Konva.Image({
            image: webLogoObj,
            x: 1200 - this.width,
            y: 10,
            draggable: false
        });
        layer.add(bg);
        stage.add(layer);
    };
    // webLogoObj.src = `./img/web_logo/newstar-logo.png`;
    // End - Website Logo image

    // When change radio Web Logo
    $r_weblogo.on('change', function () {
        let photoName = $(this)[0].defaultValue;
        webLogoObj.src = `./img/web_logo/${photoName}-logo_w237.png`;
    });

    $("button#create").click(function () {
        var img_src = $("#data-holder").val();
        var formation = $s_formation.val();
        var webLogo = $('input[name="logo"]:checked').val();
        var homeAwayText = $('input[name="home_away"]:checked').val();

        homeAwayText += '\n' + formationJSON[formation].plan;

        var bgObj = new Image();
        bgObj.onload = function () {
            var bg = new Konva.Image({
                image: bgObj,
                x: 0,
                y: 0,
                draggable: false
            });
            // add the shape to the layer
            layer.add(bg);
            // add the layer to the stage
            stage.add(layer);

            // Begin - add Text Home/Away
            var txtHA = new Konva.Text({
                text: homeAwayText,
                x: 0,
                y: 40,
                stroke: "#000",
                strokeWidth: 1,
                width: 250,
                align: "center",
                fontFamily: "Anton",
                fontSize: 45,
                fill: "#fff"
            });
            layer.add(txtHA);
            stage.add(layer);
            // End - add Text Home/Away

            var box = new Konva.Rect({
                x: 0,
                y: 492,
                fill: '#fff',
                draggable: false,
                width: 320,
                height: 100
            });
            layer.add(box);
            stage.add(layer);
        };
        bgObj.src = "./img/Field.jpg";
        // End - create stage fot field

        // Begin - Mascot image
        var mascotObj = new Image();
        mascotObj.onload = function () {
            bg = new Konva.Image({
                image: mascotObj,
                x: 1200 - this.width,
                y: 627 - this.height + 10,
                draggable: false
            });
            layer.add(bg);
            stage.add(layer);
        };
        mascotObj.src = "./img/web_logo/mascot_h200.png";
        // End - Mascot image

        // Begin - Create Logo for formation
        $.each(formationJSON[formation].formation, function (key, val) {
            createImageAndText(val, img_src, stage, layer, false);
        });
        // End - Create Logo for formation

        var positonCoach = {
            "x": 52,
            "y": 534
        };
        createImageAndText(positonCoach, img_src, stage, layer, true);

        $('input[name="logo"]').prop('checked', false);
        $('input[name="logo"]').prop('disabled', false);
    });
});