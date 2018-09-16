const $div = document.querySelector('div#container');
var width = $div.offsetWidth;
var height = $div.offsetHeight;

$(function () {
    // get all leagues
    const $s_league = $('select#league');
    const $s_team = $('select#team');
    const $s_formation = $('select#formation');

    $.getJSON('./data/league.json', function (data) {
        $.each(data, function (key, val) {
            $s_league.append('<option value="' + key + '">' + val.name + '</option>');
        });
    });

    $.getJSON('./data/formation.json', function (data) {
        $.each(data, function (key, val) {
            $s_formation.append('<option value="' + key + '">' + val.plan + '</option>');
        });
    });

    $s_league.change(function () {
        let league = $(this).val();
        $s_team.html('<option value="">Select Team</option>');
        if (league != '') {
            $.getJSON('./data/league.json', function (data) {
                if (data[league].hasOwnProperty('teams')) {
                    $.each(data[league].teams, function (key, val) {
                        // $s_team.append('<option value="' + val + '">' + val.charAt(0).toUpperCase() + val.substr(1) + '</option>');
                        $s_team.append('<option value="./img/logo/' + league + '/' + val.logo + '">' + val.name + '</option>');
                    });
                }
            });
        }
    });

    $('button#create').click(function () {
        let img_src = $s_team.val();
        let formation = $s_formation.val();

        var stage = new Konva.Stage({
            container: 'container',
            width: width,
            height: height
        });
        var layer = new Konva.Layer();
        stage.add(layer);

        for (let i = 0; i < 11; i++) {
            let imageObj = new Image();
            imageObj.src = img_src;
            imageObj.onload = function () {
                var darthVaderImg = new Konva.Image({
                    image: imageObj,
                    x: 317,
                    y: 100,
                    width: 80,
                    height: 80,
                    draggable: true
                });

                // add cursor styling
                darthVaderImg.on('mouseover', function () {
                    document.body.style.cursor = 'pointer';
                });
                darthVaderImg.on('mouseout', function () {
                    document.body.style.cursor = 'default';
                });

                layer.add(darthVaderImg);
                stage.add(layer);
            };
        }
    });
});