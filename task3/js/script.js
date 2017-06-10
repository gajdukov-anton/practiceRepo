let LEFT = '0';
let RIGHT = '180';
let TOP = '90';
let BOTTOM = '-90';
let NONE = 'none';
let FIRE = '1';
let Keys = {
    RIGHT: 39,
    LEFT: 37,
    BOTTOM: 40,
    TOP: 38,
    SPACE: 32
};
let FRAME_PER_SECONDS = 24;

let getPosition = (element) => {
    let left = parseFloat(element.style.left);
    let top = parseFloat(element.style.top);
    return {
        left: isNaN(left) ? 0 : left,
        top: isNaN(top) ? 0 : top
    };
};

function moveDomElement(element, direction, speed)
{
    let pos = getPosition(element);
    switch (direction) {
        case BOTTOM:
            element.style.top = pos.top + speed + "px";
            break;
        case RIGHT:
            element.style.left = pos.left + speed + "px";
            break;
        case LEFT:
            element.style.left = pos.left - speed + "px";
            break ;
        case TOP:
            element.style.top = pos.top - speed + "px";
            break;
    }
}

let Tank = function(id) {
    this.tankDomElement = null;
    this.direction = NONE;
    this.bulletContainer = null;
    this.bulletsCount = 10;
    this.speed = 10;

    this.initialize = () => {
        this.tankDomElement = document.getElementById(id);
        this.bulletContainer = document.getElementById('weapon');
        this.tankDomElement.style.left = Math.random() * 100 + 'px';
        this.tankDomElement.style.top = Math.random() * 100 + 'px';
        this.tankDomElement.style.display = 'block';
    };

    this.updateBackgroundImage = () => {
        switch (this.direction)
        {
            case RIGHT:
                this.tankDomElement.style.backgroundPosition = -42 + "px";
                break;
            case LEFT:
                this.tankDomElement.style.backgroundPosition = -2 + "px";
                break;
            case BOTTOM:
                this.tankDomElement.style.backgroundPosition = 70 + "px";
                break;
            case TOP:
                this.tankDomElement.style.backgroundPosition = -105 + "px";
                break;
        }
    };

    this.getBulletPosition = () => {
        return {
            top: parseFloat(this.tankDomElement.style.top),
            left: parseFloat(this.tankDomElement.style.left)
        };
    };

    this.go = (newDirection) => {
        this.direction = newDirection;
        moveDomElement(this.tankDomElement, this.direction, this.speed);
        this.updateBackgroundImage();
    };

    this.fire = () => {
        if (this.bulletsCount > 0)
        {
            let position = this.getBulletPosition();
            let bulletId = id + 'bullet' + this.bulletsCount;
            let bullet = new Bullet(this.bulletContainer, bulletId, position);
            bullet.go(this.direction);
            --this.bulletsCount;
        }

    };

    this.initialize();
};

let Bullet = function(container, id, position) {
    this.bullDomElement = null;
    this.speed = 10;

    this.createDomElement = () => {
        let bullet = document.createElement("img");
        bullet.src = "img/bullet.png";
        container.appendChild(bullet);
        bullet.id = id;
        bullet.style.width = "10px";
        bullet.style.height = "2px";
        bullet.style.position = "relative";
        bullet.style.left = position.left + "px";
        bullet.style.top = position.top + "px";
        return bullet;
    };

    this.initialize = () => {
        this.bullDomElement = this.createDomElement();
    };

    this.go = (direction) => {
        this.bullDomElement.style.transform = 'rotate(' + direction + 'deg)';
        setInterval(() => {
            moveDomElement(this.bullDomElement, direction, this.speed);
        }, 1000 / FRAME_PER_SECONDS);
    };

    this.initialize();
};

function getAction(e)
{
    switch (e.keyCode)
    {
        case Keys.RIGHT:
            return RIGHT;
        case Keys.LEFT:
            return LEFT;
        case Keys.BOTTOM:
            return BOTTOM;
        case Keys.TOP:
            return TOP;
        case Keys.SPACE:
            return FIRE;
        default:
            return NONE;
    }
}

let isMoveAction = (action) => {
    return action === LEFT ||
           action === RIGHT ||
           action === TOP ||
           action === BOTTOM;
};

let isFireAction = (action) => {
    return action === FIRE;
};

let Game = function() {
    this.player = null;
    this.score = 0;

    this.initialize = () => {
        this.player = new Tank('Tanchik');
    };

    this.createEnemies = () => {
        // случайным образом расположить вражеские танки
        // которые через случайные промежутки времени стреляют
    };

    this.initialize();
};

window.onload = function () {
    let tank = new Tank('Tanchik');
    addEventListener("keydown", (e) => {
        let action = getAction(e);
        if (isMoveAction(action))
        {
            tank.go(action);
        }
        else if (isFireAction(action))
        {
            tank.fire();
        }
    });
};