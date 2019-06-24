window.onload = function(){
  var mouse = {x:0, y:0, down:false};
  var history = [];
  var line = null;
  var canvas = $('canvas')[0].getContext('2d');
  
  $('canvas').mousedown(function(e){
    mouse.down = true;
    canvas.beginPath();
    canvas.moveTo(mouse.x,mouse.y);
    canvas.lineWidth = $("#size").val();
    canvas.strokeStyle = $("#color").val();

    line = {color:null, size:0, x: mouse.x, y:mouse.y, points:[]}; // INIT LINE
    line.size = $("#size").val();
    line.color = $("#color").val();    
  });
  
  $('canvas').mouseup(function(e){
    mouse.down = false;
    canvas.closePath();
    history.push(line);
  });
    
  $('canvas').mousemove(function(e){
    mouse.x = e.pageX - $('canvas').offset().left;
    mouse.y = e.pageY - $('canvas').offset().top;
    if(mouse.down)
      draw();
  });
  

  $('#arc').click(function() {
    mouse.down = true;
    canvas.beginPath();
    canvas.arc(mouse.x, mouse.y, 0, 2*Math.PI);
    canvas.stroke();
  }); 


  function draw(){
    line.points.push({x:mouse.x, y:mouse.y});
    canvas.lineTo(mouse.x, mouse.y);
    canvas.stroke();
  }

  $("#clear").click(clear);
  $("#undo").click(function(){
    if(history.length > 0){
      history.pop();
      clear();
      display();
    }
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
}