window.onload = function(){
  var mouse = {x:0, y:0, down:false};
  var history = [];
  var line = null;
  var canvas = $('canvas')[0].getContext('2d');
  var nbClick = 0;

  
  $('canvas').mousedown(function(e){
    mouse.down = true;
    canvas.beginPath(); // début du chemin
    canvas.moveTo(mouse.x,mouse.y); // ppint de départ du tracé
    canvas.lineWidth = $("#size").val(); // taille 
    canvas.strokeStyle = $("#color").val(); // couleurs
    line = {color:null, size:0, x: mouse.x, y:mouse.y, points:[]}; // INIT LINE
    line.size = $("#size").val();
    line.color = $("#color").val();    
  });
  
  $('canvas').mouseup(function(e){
    mouse.down = false;
    canvas.closePath();
    history.push(line);
    if($('#ligne').is(":checked") || $('#arc').is(":checked") || $('#rect').is(":checked") || $('#gomme').is(":checked")) {
      draw();
    }
  });

  $('canvas').mousemove(function(e){
    mouse.x = e.pageX - $('canvas').offset().left;
    mouse.y = e.pageY - $('canvas').offset().top;
    if(mouse.down && !$('#ligne').is(":checked")) {
      draw();
    }
  });
  

  function draw(){
    if ($('#rect').is(":checked")) {
      if ($('#remplir').is(":checked")) {
        canvas.beginPath();
        canvas.globalCompositeOperation = 'source-over';
        canvas.lineWidth = $("#size").val(); // taille 
        canvas.strokeStyle = $("#color").val(); // couleurs 
        canvas.rect(mouse.x,mouse.y,150,100);
        canvas.fillStyle = $("#color").val();
        canvas.fill();
        line.points.push({x:mouse.x, y:mouse.y}); 
        canvas.stroke();
      } else {
        canvas.beginPath(); 
        canvas.globalCompositeOperation = 'source-over';
        canvas.rect(mouse.x,mouse.y,150,100);
        line.points.push({x:mouse.x, y:mouse.y});
        canvas.stroke(); 
      }
    }
    
      
    if ($('#crayon').is(":checked")) {
      canvas.globalCompositeOperation = 'source-over';
      canvas.lineTo(mouse.x, mouse.y);
      line.points.push({x:mouse.x, y:mouse.y});
      canvas.stroke(); // affiché sur le canevas
    }

    if ($('#arc').is(":checked")) {
      if ($('#remplir').is(":checked")) {
        canvas.beginPath();
        canvas.globalCompositeOperation = 'source-over';
        canvas.arc(mouse.x, mouse.y,50,0,Math.PI*2);
        canvas.fillStyle = $("#color").val();
        canvas.fill();
        line.points.push({x:mouse.x, y:mouse.y});
        canvas.stroke();
      } else {
        canvas.beginPath();
        canvas.globalCompositeOperation = 'source-over';
        canvas.arc(mouse.x, mouse.y,50,0,Math.PI*2);
        line.points.push({x:mouse.x, y:mouse.y});
        canvas.stroke();
      }
    }

    if($('#ligne').is(":checked")) {
      nbClick++;
      if(nbClick == 1){ // POINT A
        canvas.beginPath();
        canvas.globalCompositeOperation = 'source-over';
        canvas.moveTo(mouse.x, mouse.y);      
      } else { // POINT B
        canvas.globalCompositeOperation = 'source-over';
        canvas.lineTo(mouse.x , mouse.y);
        canvas.stroke();
        canvas.closePath();
      }
    }

  
    if ($('#gomme').is(':checked')) {
      canvas.beginPath();
      canvas.globalCompositeOperation = 'source-over';
      canvas.rect(mouse.x, mouse.y - $('canvas').offset().top, $('input[type=range]').val(), 35 ,50);
      canvas.globalCompositeOperation = "destination-out";
      canvas.strokeStyle = "rgba(0,0,0,1.0)";
      canvas.fill();
      canvas.stroke();
    }
  }

  $("#clear").click(clear);
  $("#undo").click(function(){
    if(history.length > 0){
      history.pop();
      clear();
      display();
    }
  });

 $('#img').click(function() {
    var img = document.getElementById("canvas");
    window.location = img.toDataURL("image/png");
    console.log(img);
  });

  
  function clear(){
    canvas.clearRect(0, 0,  $('canvas').width(), $('canvas').height());
  }

  function display(){
    for(var elem of history){
      canvas.beginPath();
      canvas.moveTo(elem.x,elem.y);
      canvas.lineWidth = elem.size;
      canvas.strokeStyle = elem.color;
      for(var point of elem.points){
        canvas.lineTo(point.x, point.y);
        canvas.stroke();  // pour afficher sur le canevas
      }
      canvas.closePath();
    }
  }

 function el(id) {
    return document.getElementById(id);
  } 

  function readImage() {
    if (this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.addEventListener("load", function() {
             canvas.drawImage(img, 0, 0);
           });
           img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
  }
  el("fileUpload").addEventListener("change", readImage, false); 
}