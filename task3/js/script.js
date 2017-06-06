var LEFT = '0';
var RIGHT = '180';
var TOP = '90';
var BOTTOM = '-90';
var NONE = 'none';
var FIRE = '1';


var Tank = {
    tankDomElement: null,

    initialize: function(id)
    {
        this.tankDomElement = document.getElementById(id);
    },

    move: function(direction)
    {
        var tank = this.tankDomElement;
        let speed = 5;
        x = tank.offsetLeft;
        y = tank.offsetTop;
        switch(direction)
        {
            case RIGHT:
                tank.style.left = x + speed + "px";
                tank.style.backgroundPosition = - 42+"px";
                break;
            case LEFT:
                tank.style.left = x - speed + "px";
                tank.style.backgroundPosition = -2+"px";
                break;
            case BOTTOM:
                tank.style.backgroundPosition = 70+"px";
                tank.style.top = y + speed + "px";
                break;
            case TOP:
                tank.style.backgroundPosition = - 105+"px";
                tank.style.top = y - speed + "px";
                break;
        }
    }
};

var bullet = {
    bullDomElement: null,

    createbul: function (id)
    {
        this.bullDomElement = document.getElementById(id);
    },

    fire: function(direct)
    {
        var bul = this.bullDomElement;
        xx = bul.offsetLeft;
        yy = bul.offsetTop;
        switch(direct)
        {
            case FIRE:
            //    setTimeout(function() {
                    bul.style.left = xx + 10 + "px"
             //   }, 500)
        }
    }

};

function chooseDirection(e)
{
    switch(e.keyCode)
    {
        case 39:
            return RIGHT;
        case 37:
            return LEFT;
        case 40:
            return BOTTOM;
        case 38:
            return TOP;
        case 32:
            return FIRE;
        default:
            return NONE;
    }
}

HTMLAudioElement.prototype.stop = function()
{
    this.pause();
    this.currentTime = 0.0;
};

window.onload = function() {
    var tank = Tank;
    var fire_sound = document.getElementById('gun_sound');
    var moving_sound = document.getElementById('player');
    tank.initialize('Tanchik');
    var onKeyDown = function (e) {
        var direction = chooseDirection(e);
        if (direction != NONE && direction != FIRE) {
            tank.move(direction);
            document.getElementById('player').play();
        };
        var direct = chooseDirection(e);
        if (direct == FIRE)
        {
            var picHolder = document.getElementById("test"); //!
            var bulle = document.createElement("img");
            bulle.src = "style/bullet.png";
            picHolder.appendChild(bulle);
            bulle.id = 'bulll';
            var bu = document.getElementById('bulll');
            bu.style.width = "10px";
            bu.style.height = "2px";
            bu.style.position = "absolute";//!
            bullet.createbul('bulll');
            fire_sound.play();
            for(var i = 0; i < 100; i++)
            {
                bullet.fire(direct);
            };
            setTimeout(function () {
                picHolder.removeChild(bulle)
            }, 300)
        }
    };
    var onKeyUp = function (e) {     //переделать в лучший вид
        var direction = chooseDirection(e);
        if (direction != NONE)
        {
            setTimeout(function () {
                fire_sound.stop();
            }, 800);
            moving_sound.stop();
        }
    };
    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
};