let LEFT = '0';
let RIGHT = '180';
let TOP = '90';
let BOTTOM = '-90';
let NONE = 'none';
let FIRE = '1';
let LEFTTOP = '45';
let RIGHTTOP = '135';
let LEFTBOTTOM = '-45';
let RIGHTBOTTOM = '-135';
let Keys = {
    RIGHT: 39,
    LEFT: 37,
    BOTTOM: 40,
    TOP: 38,
    SPACE: 32.
};
let barrier;

let ButtonState = {
    RELEASE: 'release',
    PRESS: 'press'
};

let Barrier = function (id)
{
    this._tankDomElement = null;

    this._createTank = function() {
        let obstacle = document.getElementById(id);
        barrier = document.createElement("div");
        obstacle.appendChild(barrier);
        barrier.style.position = "absolute";
        barrier.style.backgroundImage = "url(img/barrier.png)";
        barrier.style.width = Math.random() * 500 + 'px';
        barrier.style.height = 100 + 'px';
        barrier.style.left = Math.random() * 500 + 'px';
        barrier.style.top = Math.random() * 500 + 'px';
        barrier.style.border = "2px solid";
        return barrier;
    };

    this._tankDomElement = this._createTank();


    this.getBoundingBox = () => {
        return this._tankDomElement.getBoundingClientRect();
    }
};

let updatePosition = (pos, direction, deltha) =>
{
    let modificator = 30;
    let Left = barrier.offsetLeft - modificator;
    let Top = barrier.offsetTop - modificator;
    let width = barrier.offsetWidth + Left + modificator;
    let Heihght = barrier.offsetHeight + Top + modificator;
    switch (direction) {
        case TOP:
            if (!((pos.left > Left && pos.left < width) && (pos.top - deltha > Top && pos.top - deltha < Heihght))) {
                pos.top -= deltha;
            }
            break;
        case BOTTOM:
            if (!((pos.left > Left && pos.left < width) && (pos.top + deltha > Top && pos.top + deltha < Heihght))) {
                pos.top += deltha;
            }
            break;
        case LEFT:
            if (!((pos.left - deltha > Left && pos.left - deltha < width) && (pos.top > Top && pos.top < Heihght))) {
                pos.left -= deltha;
            }
            break;
        case RIGHT:
            if (!((pos.left + deltha > Left && pos.left + deltha < width) && (pos.top > Top && pos.top < Heihght))) {
                pos.left += deltha;
            }
            break;
        case LEFTTOP:
            if (!((pos.left - deltha > Left && pos.left < width) && (pos.top - deltha > Top && pos.top - deltha < Heihght))) {
                pos.left -= deltha;
                pos.top -= deltha;
            }
            break;
        case  RIGHTTOP:
            if (!((pos.left + deltha > Left && pos.left < width) && (pos.top - deltha > Top && pos.top - deltha < Heihght))) {
                pos.left += deltha;
                pos.top -= deltha;
            }
            break;
        case  RIGHTBOTTOM:
            if (!((pos.left + deltha > Left && pos.left < width) && (pos.top + deltha > Top && pos.top - deltha < Heihght))) {
                pos.left += deltha;
                pos.top += deltha
            }
            break;
        case LEFTBOTTOM:
            if (!((pos.left - deltha > Left && pos.left < width) && (pos.top - deltha > Top && pos.top - deltha < Heihght))) {
                pos.left -= deltha;
                pos.top += deltha;
            }
            break;
    }
    return pos;
};

let updateBulletPosition = (pos, direction, deltha) =>
{
    switch (direction) {
        case TOP:
                pos.top -= deltha;
            break;
        case BOTTOM:
                pos.top += deltha;
            break;
        case LEFT:
                pos.left -= deltha;
            break;
        case RIGHT:
                pos.left += deltha;
            break;
        case LEFTTOP:
                pos.left -= deltha;
                pos.top -= deltha;
            break;
        case  RIGHTTOP:
                pos.left += deltha;
                pos.top -= deltha;
            break;
        case  RIGHTBOTTOM:
                pos.left += deltha;
                pos.top += deltha;
            break;
        case LEFTBOTTOM:
                pos.left -= deltha;
                pos.top += deltha;
            break;
    }
    return pos;
}

let each = (collection, handler) => {
    for (let i = 0; i < collection.length; ++i)
    {
        handler(collection[i]);
    }
}

let findIf = (collection, handler) => {
    let found = false;
    for (let i = 0; i < collection.length && !found; ++i)
    {
        found = handler(collection[i]);
    }
}

let intersects = (lhs, rhs) => {
    return !(lhs.left > rhs.left + rhs.width || lhs.left + lhs.width < rhs.left || lhs.top > rhs.top + rhs.height || lhs.top + lhs.height < rhs.top);
}

let isMoveAction = (action) =>
{
    return action === LEFT ||
        action === RIGHT ||
        action === TOP ||
        action === BOTTOM ||
        action ===  LEFTTOP ||
        action === RIGHTTOP ||
        action === LEFTBOTTOM ||
        action === RIGHTBOTTOM;

}

let isFireAction = (action) =>
{
    return action === FIRE;
}


function moveDomElement(element, position)
{
    element.style.left = position.left + 'px';
    element.style.top = position.top + 'px';
}


let Tank = function(containerId, id, frameSize, bulletCreationHandler)
{
    let SPEED = 100;
    let POSITION_COEF = 1000;

    this._tankContainer = null;
    this._tankDomElement = null;
    this._direction = LEFT;
    this._speed = 0;

    this._bulletContainer = null;
    this._bulletsCount = 100;
    this._position = {
        left: 0,
        top: 0
    };


    this.getBulletsCount = () => {
        return this._bulletsCount;
    }

    this.getBulletPosition = () => {
    return {
        top: this._tankDomElement.offsetTop + 15,
        left: this._tankDomElement.offsetLeft + 15
    };
}

    this.update = (actions, elapsed, check) => {
        this._handleActions(actions, check);
        this._updatePosition(elapsed);
    }

    this.render = () => {
        moveDomElement(this._tankDomElement, this._position);
        this._updateBackgroundImage();
    }

    this.destroy = () => {
        this._tankContainer.removeChild(this._tankDomElement);
    }

    this._updatePosition = (elapsed) => {
        let deltha = this._speed * (elapsed / POSITION_COEF);
        this._position = updatePosition(this._position, this._direction, deltha);
    }
    this._handleActions = (actions) => {
    let that = this;
    each(actions, (actionInfo) => {
        if (isMoveAction(actionInfo.action))
    {
            that._direction = actionInfo.action;
            that._speed = (actionInfo.state === ButtonState.PRESS) ? SPEED : 0;
    }
    else if (isFireAction(actionInfo.action) && (actionInfo.state === ButtonState.PRESS))
    {
        that._fire();
    }
})
}

    this._fire = () =>
    {
        if (this._bulletsCount > 0)
        {
            let bullet = new Bullet(
                this._bulletContainer,
                'bullet' + id + Math.random(),
                this.getBulletPosition(),
                this._direction
            );
            --this._bulletsCount;
            bulletCreationHandler(bullet);
        }
    }

    this._updateBackgroundImage = () => {
    let map = {};
    map[RIGHT] = -42;
    map[LEFT] = -2;
    map[BOTTOM] = 70;
    map[TOP] = -105;

    if (map.hasOwnProperty(this._direction))
    {
        this._tankDomElement.style.backgroundPosition = map[this._direction] + 'px';
    }
}

    this._createTank = function(container, tankId)
    {
        let tank = document.createElement("div");
        container.appendChild(tank);
        tank.id = tankId;
        tank.style.width = "30px";
        tank.style.height = "30px";
        tank.style.position = "absolute";
        tank.style.display = 'block';
        tank.style.backgroundImage = "url(img/enemy.png)";

        return tank;
    };

    (() => {
        this._tankContainer = document.getElementById(containerId);
        this._tankDomElement = this._createTank(this._tankContainer, id);
        this._bulletContainer = document.getElementById('weapons');
        this._position.left = Math.random() * frameSize.width;
        this._position.top = Math.random() * frameSize.height;
        this.getBoundingBox = () => {
        return this._tankDomElement.getBoundingClientRect();
    }

})();
};

let Bullet = function(container, id, position, direction)
{
    let POSITION_COEF = 600;

    this._bullDomElement = null;
    this._speed = 100;
    this._position = position;

    this.update = (elapsed) => {
        let deltha = this._speed * (elapsed / POSITION_COEF);
        this._position = updateBulletPosition(this._position, direction, deltha);
    }

    this.render = () => {
        moveDomElement(this._bullDomElement, this._position);
    }

    this.getBoundingBox = () => {
        return this._bullDomElement.getBoundingClientRect();
    }

    this.destroy = () => {
        container.removeChild(this._bullDomElement);
    }

    this._createDomElement = () =>
    {
        let bullet = document.createElement("img");
        bullet.src = "img/bullet.png";
        container.appendChild(bullet);
        bullet.id = id;
        bullet.style.width = "10px";
        bullet.style.height = "2px";
        bullet.style.position = "absolute";
        bullet.style.left = position.left +"px";
        bullet.style.top = position.top + "px";
        return bullet;
    }

    (() => {
        this._bullDomElement = this._createDomElement();
        this._bullDomElement.style.transform = 'rotate(' + direction + 'deg)';
})();
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

let Game = function() {
    let ENEMY_CREATION_DELAY = 3000;
    this.checker = true;
    this.player = null;
    this.enemiesCounter = 0;
    this.totalEnemies = 10;
    this.counter = 9;
    this.enemies = [];
    this.bullets = [];
    this.actions = [];
    this.sinceLastEnemyCreation = 0;
    this.bulletsInfoDomObject = null;
    this.width = 0;
    this.windowSize = {
        width: 0,
        height: 0
    };

    let barrier = new Barrier('barrier');

    this.render = () => {
            this.player.render();
        each(this.enemies, (enemy) => {
            enemy.render();
    })
        each(this.bullets, (bullet) => {
            bullet.render();
    })
        this._renderBulletInfo();
    }

    this._createEnemyIfPossible = (elapsed) => {
        this.sinceLastEnemyCreation += elapsed;
        if (this.sinceLastEnemyCreation >= ENEMY_CREATION_DELAY) {
            if (this.counter  > 0) {
                --this.counter ;
                this._createEnemy();
                this.sinceLastEnemyCreation = 0;
            }
        }
    }

    this._createEnemy = () =>
    {
        this.enemies.push(new Tank('enemies', 'enemy' + this.enemiesCounter++, this.windowSize));
    }

    this._renderBulletInfo = () => {
        this.bulletsInfoDomObject.innerHTML = 'Bullet: ' + this.player.getBulletsCount() + ' Enemies: ' + this.totalEnemies;
    }

    this._updateWindowSize = () => {
        this.windowSize.width = window.innerWidth - 100;
        this.windowSize.height = window.innerHeight - 100;
    }

    this._getFireHandler = () => {
        let that = this;
        return (bullet) => {
            that.bullets.push(bullet);
        }
    }

    (() => {
        this._updateWindowSize();
    this.bulletsInfoDomObject = document.getElementById('infobullet');
    this.player = new Tank('battlefield', 'Tank', this.windowSize, this._getFireHandler());
    this._createEnemy();
    this.update = (elapsed) => {
        this._updateWindowSize();
        this._createEnemyIfPossible(elapsed);

        each(this.bullets, (bullet) => {
            bullet.update(elapsed);
    })
        this._handleCollisions();
        this.player.update(this.actions, elapsed);
        this.actions = [];

    }

    this._handleCollisions = () => {
        let that = this;
        let newBullets = [];
        each(this.bullets, (bullet) => {
            let rect = bullet.getBoundingBox();
        let bulletLet = parseFloat(bullet._position.left);
        let bulletTop = parseFloat(bullet._position.top);
        let elem = document.elementFromPoint(bulletLet, bulletTop);
        if (elem === null ||  intersects(rect, barrier.getBoundingBox()))
        {
            bullet.destroy();
            return false;
        }
        let newEnemies = [];
        findIf(this.enemies, (enemy) => {
            if (intersects(rect, enemy.getBoundingBox()))
        {
            enemy.destroy();
            --that.totalEnemies;
            bullet.destroy();
            return false;
        }

        newEnemies.push((enemy));
        return false;
    })
        if (newEnemies.length !== that.enemies.length)
        {
            that.enemies = newEnemies;
        }
        else
        {
            newBullets.push(bullet);
        }
    })
        this.bullets = newBullets;
    }

    let Direction;
    let LeftDirection = false;
    let RightDirection = false;
    let UpDirection = false;
    let DownDirection = false;

    addEventListener('keydown', (e) => {
        let actions = getAction(e);
    if (actions === LEFT) {
        LeftDirection = true;
        Direction = actions
    }
    if (actions === RIGHT) {
        RightDirection = true;
        Direction = actions
    }
    if (actions === TOP) {
        UpDirection = true;
        Direction = actions
    }
    if (actions === BOTTOM) {
        DownDirection = true;
        Direction = actions
    }
    this.actions.push({
        state: ButtonState.PRESS,
        action: getAction(e)
    });
    if ((LeftDirection === true && Direction === TOP) || (UpDirection === true && Direction === LEFT))
    {
        this.actions.push({
            state: ButtonState.PRESS,
            action: LEFTTOP
        })
    }

    if ((RightDirection === true && Direction === TOP) || (UpDirection === true && Direction === RIGHT))
    {
        this.actions.push({
            state: ButtonState.PRESS,
            action: RIGHTTOP
        })
    }

    if ((LeftDirection === true && Direction === BOTTOM) || (DownDirection === true && Direction === LEFT))
    {
        this.actions.push({
            state: ButtonState.PRESS,
            action: LEFTBOTTOM
        })
    }

    if ((RightDirection === true && Direction === BOTTOM) || (DownDirection === true && Direction === RIGHT))
    {
        this.actions.push({
            state: ButtonState.PRESS,
            action: RIGHTBOTTOM
        })
    }
});



    addEventListener('keyup', (e) => {
    let actions = getAction(e);
    if (actions === LEFT) {
        LeftDirection = false;
    }
    if (actions === RIGHT) {
        RightDirection = false
    }
    if (actions === TOP) {
        UpDirection = false
    }
    if (actions === BOTTOM) {
        DownDirection = false
    }
    this.actions.push({
        state: ButtonState.RELEASE,
        action: getAction(e)
    });
});
})();
};

window.onload = function()
{
    let game = new Game();
    let last = null;

    let step = (timestamp) => {
    if (!last)
    {
        last = timestamp;
    }
    let elapsed = timestamp - last;
    if (elapsed >= (1000 / 24))
    {
        last = timestamp;
        game.update(elapsed);
        game.render();
    }

    window.requestAnimationFrame(step);
};

    window.requestAnimationFrame(step);
};