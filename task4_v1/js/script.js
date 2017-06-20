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
let xB;
let yB;
let FRAME_PER_SECONDS = 24;
let counter = 0;

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

let Enemy = function (id) {
    this.enemyDomElement = null;
    this.direction = NONE;
    this.bulletContainer = null;
    this.bulletsCount = 1000;
    this.speed = 10;

    this.initialize = () => {
        this.enemyDomElement = document.getElementById(id);
        this.bulletContainer = document.getElementById('weaponE');
        this.enemyDomElement.style.left = Math.random() * 100 + 'px';
        this.enemyDomElement.style.top = Math.random() * 100 + 'px';
        this.enemyDomElement.style.display = 'block';
        this.create(id);
    };

    this.create = function(id)  {
        let containerEnemy = document.getElementById(id); //!
        let  enemy = document.createElement("div");
        containerEnemy.appendChild(enemy);
        enemy.id = 'enem';
        enemy.style.width = "50px";
        enemy.style.height = "50px";
        enemy.style.position = "absolute";
        enemy.style.left = Math.random() * 1000 + 'px';
        enemy.style.top = Math.random() * 500 + 'px';
        enemy.style.backgroundImage = "url(img/enemy.png)";
    };


    this.updateBackgroundImage = () => {
        switch (this.direction)
        {
            case RIGHT:
                this.enemyDomElement.style.backgroundPosition = -42 + "px";
                break;
            case LEFT:
                this.enemyDomElement.style.backgroundPosition = -2 + "px";
                break;
            case BOTTOM:
                this.enemyDomElement.style.backgroundPosition = 70 + "px";
                break;
            case TOP:
                this.enemyDomElement.style.backgroundPosition = -105 + "px";
                break;
        }
    };

    this.getBulletPosition = () => {
        return {
            top: parseFloat(this.enemyDomElement.style.top),
            left: parseFloat(this.enemyDomElement.style.left)
        };
    };

    this.go = (newDirection) => {
        this.direction = newDirection;
        moveDomElement(this.enemyDomElement, this.direction, this.speed);
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

let count = function () {
    ++counter;
}

let Tank = function(id) {
    this.tankDomElement = null;
    this.direction = NONE;
    this.bulletContainer = null;
    this.bulletsCount = 1000;
    this.speed = 10;
    this.Start = false;

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
            top: this.tankDomElement.offsetTop,
            left:this.tankDomElement.offsetLeft
        };
    };

    this.go = (newDirection) => {
        this.direction = newDirection;
        moveDomElement(this.tankDomElement, this.direction, this.speed);
        this.updateBackgroundImage();
        this.Start = true;
    };

    bulletId = id + 'bullet' + this.bulletsCount;

    this.fire = () => {
        if (this.bulletsCount > 0)
        {
            let position = this.getBulletPosition();
            let bullet = new Bullet(this.bulletContainer, bulletId, position);
            bullet.go(this.direction);
            --this.bulletsCount;
        }

    };

    this.infoBullet = () => {
        let information = 'Bullet: ' +  this.bulletsCount + ' ' ;
        document.getElementById('infobullet').innerHTML = information;
    };

    this.initialize();
};

let Bullet = function(container, id, position) {
    this.bullDomElement = null;
    this.speed = 20;

    this.createDomElement = () => {
        let bullet = document.createElement("img");
        bullet.src = "img/bullet.png";
        container.appendChild(bullet);
        bullet.id = id;
        bullet.style.width = "10px";
        bullet.style.height = "2px";
        bullet.style.position = "absolute";
        bullet.style.left = position.left + 9 + "px";
        bullet.style.top = position.top + 19 + "px";
        return bullet;
    };

    this.initialize = () => {
        this.bullDomElement = this.createDomElement();
    };

    this.go = (direction) => {
        let enem = document.getElementById('enemys');
        this.bullDomElement.style.transform = 'rotate(' + direction + 'deg)';
        setInterval(() => {
            moveDomElement(this.bullDomElement, direction, this.speed);
        this.delety(container, id);
        this.destroy(enem, 'enem')
    }, 1000 / FRAME_PER_SECONDS)
    };

    this.initialize();

    this.delety = function (container, id)
    {
        let bul = document.getElementById(id);
        if (bul != null)
        {
            let xx = parseFloat(bul.style.left);
            let yy = parseFloat(bul.style.top);
            xB = xx;
            yB = yy;
            let elem = document.elementFromPoint(xx, yy);
            if (elem == null) {
                container.removeChild(bul);
            }
        }
    };

    this.destroy = function (container, id) {
        let enemy = document.getElementById(id);
        if (enemy != null) {
            let xx = xB;
            let yy = yB;
            let x = parseFloat(enemy.style.left);
            let y = parseFloat(enemy.style.top);
            let z = x + 50;
            let c = y + 50;
            if  ((xx >= x) && (xx <= z) && ((yy >= y) && (yy <= c))) {
                container.removeChild(enemy);
                count();
                let kills =  'Kills: ' +  counter;
                document.getElementById('infokills').innerHTML = kills;
            }
        }
    };

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
};

let isMoveAction = (action) => {
    return action === LEFT ||
        action === RIGHT ||
        action === TOP ||
        action === BOTTOM;
};

let isFireAction = (action) => {
    return action === FIRE;
};


/*let Game = function() {
 this.player = null;
 this.score = 0;
 this.initialize = () => {
 this.player = new Tank('Tanchik');
 };
 this.createEnemies = () => {
 // случайным образом расположить вражеские танки
 // которые через случайные промежутки времени стреляют
 };
 //this.initialize();
 };*/

window.onload = function () {
    let tank = new Tank('Tanchik');
    let enemy = new Enemy('enemys');
    addEventListener("keydown", (e) => {
        let action = getAction(e);
    tank.infoBullet();
    if (isMoveAction(action))
    {
        tank.go(action);
    }
    else if (isFireAction(action) && tank.Start)
    {
        tank.fire();
    }
});
};