let LEFT = '0';
let RIGHT = '180';
let TOP = '90';
let BOTTOM = '-90';
let NONE = 'none';
let FIRE = '1';
let FireDirection = RIGHT;
let Checker = true;
let firedirection;
let KeyRight = 39;
let KeyLeft = 37;
let KeyBottom = 40;
let KeyTop = 38;
let KeyFire = 32;


let Tank = {
    tankDomElement: null,

    initialize: function (id) {
        this.tankDomElement = document.getElementById(id);
    },

    move: function (direction) {
        let tank = this.tankDomElement;
        let speed = 5;
        x = tank.offsetLeft;
        y = tank.offsetTop;
        switch (direction) {
            case RIGHT:
                tank.style.left = x + speed + "px";
                tank.style.backgroundPosition = -42 + "px";
                FireDirection = chooseFireDirection(direction);
                break;
            case LEFT:
                tank.style.left = x - speed + "px";
                tank.style.backgroundPosition = -2 + "px";
                FireDirection = chooseFireDirection(direction);
                break;
            case BOTTOM:
                tank.style.backgroundPosition = 70 + "px";
                tank.style.top = y + speed + "px";
                FireDirection = chooseFireDirection(direction);
                break;
            case TOP:
                tank.style.backgroundPosition = -105 + "px";
                tank.style.top = y - speed + "px";
                FireDirection = chooseFireDirection(direction);
                break;
        }
    }
};

function chooseFireDirection(direction) {
    switch (direction) {
        case RIGHT:
            return RIGHT;
        case LEFT:
            return LEFT;
        case BOTTOM:
            return BOTTOM;
        case TOP:
            return TOP;
    }
}

let Bullet = {
    bullDomElement: null,

    createbul: function (id) {
        this.bullDomElement = document.getElementById(id);
    },

    createbullet: function (id) {
        var picHolder = document.getElementById(id); //!
        var bullet = document.createElement("img");
        bullet.src = "img/bullet.png";
        picHolder.appendChild(bullet);
        bullet.id = 'bulll';
        bullet.style.width = "10px";
        bullet.style.height = "2px";
        bullet.style.position = "relative";//!
        Bullet.createbul('bulll');
        bullet.style.left = Tank.tankDomElement.offsetLeft + "px";
        bullet.style.top = Tank.tankDomElement.offsetTop + "px";
    },

    fire: function (direction) {
        let bul = this.bullDomElement;
        let pichol = document.getElementById("weapon");
        switch (direction) {
            case FIRE: {
                let intervalID = setInterval(function moveBullet() {
                    xx = bul.offsetLeft;
                    yy = bul.offsetTop;
                    let elem = document.elementFromPoint(xx, yy);
                    if (elem == null) {
                        clearInterval(intervalID);
                        Checker = true;
                        pichol.removeChild(bul)
                    }
                    bul.style.transform = 'rotate(' + FireDirection + 'deg)';
                    switch (firedirection) {
                        case BOTTOM:
                            bul.style.top = yy + 10 + "px";
                            break;
                        case RIGHT:
                            bul.style.left = xx + 10 + "px";
                            break;
                        case LEFT:
                            bul.style.left = xx - 10 + "px";
                            break;
                        case TOP:
                            bul.style.top = yy - 10 + "px";
                            break;
                    }
                }, 10);
            }
        }
    }

};

function chooseDirection(e) {
    switch (e.keyCode) {
        case KeyRight:
            return RIGHT;
        case KeyLeft:
            return LEFT;
        case KeyBottom:
            return BOTTOM;
        case KeyTop:
            return TOP;
        case KeyFire:
            return FIRE;
        default:
            return NONE;
    }
}

function SoundStop(name) {
    name.stop();
}


HTMLAudioElement.prototype.stop = function () {
    this.pause();
    this.currentTime = 0.0;
};

window.onload = function () {
    let tank = Tank;
    let fire_sound = document.getElementById('gun_sound');
    let moving_sound = document.getElementById('player');
    tank.initialize('Tanchik');
    var onKeyDown = function (e) {
        let direction = chooseDirection(e);
        if (direction != NONE && direction != FIRE) {
            tank.move(direction);
            moving_sound.play();
        }
        if (direction == FIRE && Checker == true) {
            if (Checker == true) {
                firedirection = FireDirection;
            }
            Checker = false;
            Bullet.createbullet("weapon");
            fire_sound.play();
            Bullet.fire(direction);
        }
    };
    let onKeyUp = function (e) {
        let direction = chooseDirection(e);
        if (direction != NONE) {
            setTimeout(function () {
                fire_sound.stop()
            }, 800);
            SoundStop(moving_sound);
        }
    };
    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
};