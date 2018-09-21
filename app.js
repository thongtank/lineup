const $div = document.querySelector("div#container");
var width = $div.offsetWidth;
var height = $div.offsetHeight;

$(function() {
  // get all leagues
  const $s_league = $("select#league");
  const $s_team = $("select#team");
  const $s_formation = $("select#formation");

  $.getJSON("./data/league.json", function(data) {
    $.each(data, function(key, val) {
      $s_league.append('<option value="' + key + '">' + val.name + "</option>");
    });
  });

  $.getJSON("./data/formation.json", function(data) {
    $.each(data, function(key, val) {
      $s_formation.append(
        '<option value="' + key + '">' + val.plan + "</option>"
      );
    });
  });

  var formationJSON;
  $.getJSON("./data/formation.json", function(data) {
    formationJSON = data;
  });

  // Fill Team after choose league
  $s_league.change(function() {
    let league = $(this).val();
    $s_team.html('<option value="">Select Team</option>');
    if (league != "") {
      $.getJSON("./data/league.json", function(data) {
        if (data[league].hasOwnProperty("teams")) {
          $.each(data[league].teams, function(key, val) {
            // $s_team.append('<option value="' + val + '">' + val.charAt(0).toUpperCase() + val.substr(1) + '</option>');
            $s_team.append(
              '<option value="./img/logo/' +
                league +
                "/" +
                val.logo +
                '">' +
                val.name +
                "</option>"
            );
          });
        }
      });
    }
  });

  $("button#create").click(function() {
    var img_src = $s_team.val();
    var formation = $s_formation.val();
    var webLogo = $('input[name="logo"]:checked').val();
    var homeAwayText = $('input[name="home_away"]:checked').val();

    // Begin - create stage for field
    var stage = new Konva.Stage({
      container: "container",
      width: 1200,
      height: 627
    });

    var layer = new Konva.Layer();
    stage.add(layer);

    var bgObj = new Image();
    bgObj.onload = function() {
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
        width: 220,
        align: "center",
        fontFamily: "Notable",
        fontSize: 40,
        fill: "#fff"
      });
      layer.add(txtHA);
      stage.add(layer);
      // End - add Text Home/Away
    };
    bgObj.src = "./img/Field.jpg";
    // End - create stage fot field

    // Begin - Mascot image
    var mascotObj = new Image();
    mascotObj.onload = function() {
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

    // Begin - Website Logo image
    var webLogoObj = new Image();
    webLogoObj.onload = function() {
      bg = new Konva.Image({
        image: webLogoObj,
        x: 1200 - this.width,
        y: 20,
        draggable: false
      });
      layer.add(bg);
      stage.add(layer);
    };
    webLogoObj.src = `./img/web_logo/${webLogo}-logo.png`;
    // End - Website Logo image

    $.each(formationJSON[formation].formation, function(key, val) {
    //   if (key == "plan") {
    //     return true;
    //   }
      var x = val.x - 21;
      var y = val.y - 21;
      var imageObj = new Image();
      imageObj.src = img_src;
      imageObj.onload = function() {
        var logoTeam = new Konva.Image({
          image: imageObj,
          x: x,
          y: y,
          width: 70,
          height: 70,
          draggable: false
        });

        // add cursor styling
        logoTeam.on("mouseover", function() {
          document.body.style.cursor = "pointer";
        });
        logoTeam.on("mouseout", function() {
          document.body.style.cursor = "default";
        });

        layer.add(logoTeam);
        stage.add(layer);

        let textNode = new Konva.Text({
          text: "Click to edit",
          x: x - 65,
          y: y + 75,
          fontSize: 18,
          fill: "#fff",
          align: "center",
          width: 200
        });
        layer.add(textNode);
        layer.draw();

        textNode.on("click", function() {
          // create textarea over canvas with absolute position

          // first we need to find its positon
          var textPosition = textNode.getAbsolutePosition();
          var stageBox = stage.getContainer().getBoundingClientRect();

          var areaPosition = {
            x: textPosition.x + stageBox.left + 45,
            y: textPosition.y + stageBox.top
          };

          // create textarea and style it
          var textarea = document.createElement("textarea");
          document.body.appendChild(textarea);

          textarea.value = textNode.text();
          textarea.style.position = "absolute";
          textarea.style.top = areaPosition.y + "px";
          textarea.style.left = areaPosition.x + "px";
          textarea.style.width = textNode.width();

          textarea.focus();

          textarea.addEventListener("keydown", function(e) {
            // hide on enter
            if (e.keyCode === 13) {
              textNode.text(textarea.value);
              layer.draw();
              document.body.removeChild(textarea);
            }
          });
        });
      };
    });
  });
});
