var Mtank ={
      moveR: function(e) {
          x = document.getElementById("Tanchik").offsetLeft;
          y = document.getElementById("Tanchik").offsetTop;
          switch(e.keyCode){
              case 39:
                  document.getElementById("Tanchik").style.transform = 'rotate(180deg)';
                  document.getElementById("Tanchik").style.left = x + 3 + "px";
                  break;
              case 37:
                  document.getElementById("Tanchik").style.transform = 'rotate(0deg)';
                  document.getElementById("Tanchik").style.left = x - 3 + "px";
                  break;
              case 40:
                  document.getElementById("Tanchik").style.transform = 'rotate(-90deg)';
                  document.getElementById("Tanchik").style.top = y + 3 + "px";
                  break;
              case 38:
                  document.getElementById("Tanchik").style.transform = 'rotate(90deg)';
                  document.getElementById("Tanchik").style.top = y - 3 + "px";
                  break;
          }
      },
  }
addEventListener("keydown", Mtank.moveR);
document.addEventListener("DOMContentLoaded", "ready");