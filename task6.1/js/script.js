let LEFT = '0';
let RIGHT = '180';
let TOP = '90';
let BOTTOM = '-90';
let LEFTBOTTOM = '-45';
let LEFTTOP = '45';
let RIGHTTOP = '135';
let RIGHTBOTTOM = '-135';
let NONE = 'none';
let FIRE = '1';
let Nothing = '10';
let barrier;
let Keys = {
    RIGHT: 39,
    LEFT: 37,
    BOTTOM: 40,
    TOP: 38,
    SPACE: 32.
};

let ButtonState = {
    RELEASE: 'release',
    PRESS: 'press'
};

let moving = (coordinates, position, deltha, element) => {
    position.left += deltha.x;
    position.top += deltha.y;
    let direction = ChooseDirection(deltha.x, deltha.y);
    updateBackgroundImage(element, direction);
    return position
};

let Barrier = function (id) {
    this._barrierDomElement = null;

    this._createBarrier = function () {
        let obstacle = document.getElementById(id);
        barrier = document.createElement("div");
        obstacle.appendChild(barrier);
        barrier.style.position = "absolute";
        barrier.style.backgroundImage = "url(img/barrier.png)";
        barrier.style.width = 100 + 'px';
        barrier.style.height = 100 + 'px';
        barrier.style.left = Math.random() * 500 + 'px';
        barrier.style.top = Math.random() * 500 + 'px';
        return barrier;
    };

    this._barrierDomElement = this._createBarrier();


    this.getBoundingBox = () => {
        return this._barrierDomElement.getBoundingClientRect();
    }
};

createVector = (coordinates, _position) => {
    let deltha = {
        x: 0,
        y: 0
    };

    let x = coordinates.x - _position.left;
    let y = coordinates.y - _position.top;
    let Vector;
    x *= x;
    y *= y;
    Vector = x + y;
    Vector = Math.sqrt(Vector);
    x = Math.sqrt(x);
    y = Math.sqrt(y);
    x = x / Vector;
    y = y / Vector;
    deltha.x = x;
    deltha.y = y;
    if (coordinates.x < _position.left) {
        deltha.x *= -1;
    }
    if (coordinates.y < _position.top) {
        deltha.y *= -1;
    }
    return deltha;
};


let updateBackgroundImage = (element, direction) => {
    let map = {};
    map[RIGHT] = -52;
    map[LEFT] = -2;
    map[BOTTOM] = -99;
    map[TOP] = -130;
    map[RIGHTTOP] = -170;
    map[RIGHTBOTTOM] = -240;
    map[LEFTBOTTOM] = -300;
    map[LEFTTOP] = -360;
    if (map.hasOwnProperty(direction)) {
        element.style.backgroundPosition = map[direction] + 'px';
    }
};

let ChooseDirection = (delthaX, delthaY) => {
    let result;
    if (delthaX > 0 && delthaY === 0) {
        result = RIGHT
    }
    if (delthaX < 0 && delthaY === 0) {
        result = LEFT
    }
    if (delthaX === 0 && delthaY > 0) {
        result = BOTTOM
    }
    if (delthaX === 0 && delthaY < 0) {
        result = TOP
    }
    if (delthaX > 0 && delthaY > 0) {
        result = RIGHTBOTTOM
    }
    if (delthaX > 0 && delthaY < 0) {
        result = RIGHTTOP
    }
    if (delthaX < 0 && delthaY < 0) {
        result = LEFTTOP
    }
    if (delthaX < 0 && delthaY > 0) {
        result = LEFTBOTTOM
    }
    if (delthaX === 0 && delthaY === 0) {
        result = NONE
    }
    return result
};

let updatePosition = (pos, deltha, element, direction) => {
    let borderX = document.body.clientWidth;
    let borderY = document.body.clientHeight;
    if (deltha.x !== 0 && deltha.y !== 0) {
        deltha.x *= 0.8;
        deltha.y *= 0.8
    }
    if ((pos.top + deltha.y > 0) && (pos.top + deltha.y <= borderY - 50)) {
        pos.top += deltha.y;
    }
    if ((pos.left + deltha.x > 0) && (pos.left + deltha.x <= borderX - 50)) {
        pos.left += deltha.x;
    }
    direction = ChooseDirection(deltha.x, deltha.y);
    updateBackgroundImage(element, direction);
    return pos;
};


let updateBulletPosition = (pos, direction, deltha) => {
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
        case LEFTBOTTOM:
            pos.top += deltha;
            pos.left -= deltha;
            break;
        case LEFTTOP:
            pos.top -= deltha;
            pos.left -= deltha;
            break;
        case RIGHTBOTTOM:
            pos.top += deltha;
            pos.left += deltha;
            break;
        case  RIGHTTOP:
            pos.top -= deltha;
            pos.left += deltha;
            break;
    }
    return pos;
};

let each = (collection, handler) => {
    for (let i = 0; i < collection.length; ++i) {
        handler(collection[i]);
    }
};

let findIf = (collection, handler) => {
    let found = false;
    for (let i = 0; i < collection.length && !found; ++i) {
        found = handler(collection[i]);
    }
};

let intersects = (lhs, rhs) => {
    return !(lhs.left > rhs.left + rhs.width || lhs.left + lhs.width < rhs.left || lhs.top > rhs.top + rhs.height || lhs.top + lhs.height < rhs.top);
};

let isMoveAction = (action) => {
    return action === LEFT ||
        action === RIGHT ||
        action === TOP ||
        action === BOTTOM ||
        action === Nothing;

};

let isFireAction = (action) => {
    return action === FIRE;
};


function moveDomElement(element, position) {
    element.style.left = position.left + 'px';
    element.style.top = position.top + 'px';
}

let Boat = function (containerId, id, frameSize, bulletCreationHandler, checker) {
    let SPEED = 100;
    let POSITION_COEF = 1000;

    this._boatContainer = null;
    this.bulletchange = false;
    this._boatDomElement = null;
    this._direction = NONE;
    this._speed =
        {
            x: 0,
            y: 0
        };

    this._bulletContainer = null;
    this._bulletsCount = 100;
    this._position = {
        left: 0,
        top: 0
    };

    this.getBulletsCount = () => {
        return this._bulletsCount;
    };

    this.getBulletPosition = () => {
        return {
            top: this._boatDomElement.offsetTop + 25,
            left: this._boatDomElement.offsetLeft + 25
        };
    };

    this.update = (actions, elapsed) => {
        this._handleActions(actions);
        this._updatePosition(elapsed);
    };

    this.render = () => {
        moveDomElement(this._boatDomElement, this._position);
    };

    this.destroy = () => {
        this._boatContainer.removeChild(this._boatDomElement);
    };

    this._handleActions = (actions) => {
        let that = this;
        each(actions, (actionInfo) => {
            if (isMoveAction(actionInfo.action)) {
                that._direction = actionInfo.action;
                switch (actionInfo.action) {
                    case LEFT:
                        if (actionInfo.state === ButtonState.PRESS) {
                            that._speed.x = -SPEED;
                        }
                        else {
                            that._speed.x = 0;
                        }
                        break;
                    case RIGHT:
                        if (actionInfo.state === ButtonState.PRESS) {
                            that._speed.x = SPEED;
                        }
                        else {
                            that._speed.x = 0;
                        }
                        break;
                    case TOP:
                        if (actionInfo.state === ButtonState.PRESS) {
                            that._speed.y = -SPEED;
                        }
                        else {
                            that._speed.y = 0;
                        }
                        break;
                    case  BOTTOM:
                        if (actionInfo.state === ButtonState.PRESS) {
                            that._speed.y = SPEED;
                        }
                        else {
                            that._speed.y = 0;
                        }
                        break;
                    case Nothing:
                        break;
                }
            }
            else if (isFireAction(actionInfo.action) && (actionInfo.state === ButtonState.PRESS)) {
                if (that._speed.x != 0 || that._speed.y != 0) {
                    that._direction = ChooseDirection(that._speed.x, that._speed.y);
                }
                if (that._direction != NONE) {
                    that._fire();
                }
            }
        })
    };

    this._updatePosition = (elapsed) => {
        let deltha =
            {
                x: 0,
                y: 0
            };
        deltha.x = this._speed.x * (elapsed / POSITION_COEF);
        deltha.y = this._speed.y * (elapsed / POSITION_COEF);

        this._position = updatePosition(this._position, deltha, this._boatDomElement, this._direction);
    };

    this.move = (coordinates, elapsed) => {
        if (!((coordinates.x + 10 > this._position.left && coordinates.x - 10 < this._position.left) && (coordinates.y + 10 > this._position.top && coordinates.y - 10 < this._position.top))) {
            let deltha = {
                x: 0,
                y: 0
            };
            let del;
            del = createVector(coordinates, this._position);
            deltha.x = del.x * SPEED * (elapsed / POSITION_COEF);
            deltha.y = del.y * SPEED * (elapsed / POSITION_COEF);
            this._position = moving(coordinates, this._position, deltha, this._boatDomElement)
        }
    };
    this.mouseFire = (coordinates) => {
        let checker = 'mouse';
        let deltha;
        deltha = createVector(coordinates, this._position);
        let direction = ChooseDirection(deltha.x, deltha.y);
        if (this._bulletsCount > 0) {
            let bullet = new Bullet(
                this._bulletContainer,
                'bullet' + id + Math.random(),
                this.getBulletPosition(),
                direction, checker, coordinates, deltha.x, deltha.y
            );
            --this._bulletsCount;
            this.bulletchange = true;
            bulletCreationHandler(bullet);
        }
    };

    this._fire = () => {
        if (this._bulletsCount > 0) {
            let bullet = new Bullet(
                this._bulletContainer,
                'bullet' + id + Math.random(),
                this.getBulletPosition(),
                this._direction, checker
            );
            --this._bulletsCount;
            this.bulletchange = true;
            bulletCreationHandler(bullet);
        }
    };

    this._createBoat = function (container, boatId) {
        let boat = document.createElement("div");
        container.appendChild(boat);
        boat.id = boatId;
        boat.style.width = "50px";
        boat.style.height = "50px";
        boat.style.position = "absolute";
        boat.style.display = 'block';
        boat.style.backgroundImage = "url(img/boat.png)";
        return boat;
    };

    (() => {
        this._boatContainer = document.getElementById(containerId);
        this._boatDomElement = this._createBoat(this._boatContainer, id);
        this._bulletContainer = document.getElementById('weapons');
        this._position.left = Math.random() * frameSize.width;
        this._position.top = Math.random() * frameSize.height;
        this.getBoundingBox = () => {
            return this._boatDomElement.getBoundingClientRect();
        }

    })();
};

let enemyDirection = () => {
    let array = [LEFT, RIGHT, TOP, BOTTOM, NONE, FIRE];
    let random;
    random = Math.floor(Math.random() * array.length);
    return array[random]
};

let enemyState = () => {
    let array = [ButtonState.PRESS, ButtonState.RELEASE];
    let random;
    random = Math.floor(Math.random() * array.length);
    return array[random]
};

let Bullet = function (container, id, position, direction, checker, coordinates, x, y) {
    let POSITION_COEF = 600;
    this._checker = checker;
    this._bullDomElement = null;
    this._speed = 500;
    let SPEED = 500;
    this._position = position;

    this.update = (elapsed) => {
        let deltha = this._speed * (elapsed / POSITION_COEF);
        this._position = updateBulletPosition(this._position, direction, deltha);
    };
    this.updateMouseBullet = (elapsed) => {
        let deltha = {
            x: 0,
            y: 0
        };
        let gradus = y / x;
        gradus *= 19;
        console.log(gradus);
        this._bullDomElement.style.transform = 'rotate(' + gradus + 'deg)';
        deltha.x = x * SPEED * (elapsed / POSITION_COEF);
        deltha.y = y * SPEED * (elapsed / POSITION_COEF);
        this._position = moving(coordinates, this._position, deltha, this._bullDomElement)
    };

    this.render = () => {
        moveDomElement(this._bullDomElement, this._position);
    };

    this.getBoundingBox = () => {
        return this._bullDomElement.getBoundingClientRect();
    };

    this.destroy = () => {
        container.removeChild(this._bullDomElement);
    };

    this._createDomElement = () => {
        let bullet = document.createElement("img");
        bullet.src = "img/bullet.png";
        container.appendChild(bullet);
        bullet.id = id;
        bullet.style.width = "15px";
        bullet.style.height = "3px";
        bullet.style.position = "absolute";
        bullet.style.left = position.left + "px";
        bullet.style.top = position.top + "px";
        return bullet;
    };

    (() => {
        this._bullDomElement = this._createDomElement();
        this._bullDomElement.style.transform = 'rotate(' + direction + 'deg)';
    })();
};

function getAction(e) {
    switch (e.keyCode) {
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

let Game = function () {

    let ENEMY_CREATION_DELAY = 3000;
    this.coordinates = {
        x: 0,
        y: 0
    };
    this.Firecoordinates = {
        x: 0,
        y: 0
    };
    this.keyAction = false;
    this.mouseFire = false;
    this.mouseAction = false;
    this.enemiesDirectionCounter = 0;
    this.player = null;
    this.enemiesCounter = 0;
    this.totalEnemies = 10;
    this.counter = 9;
    this.enemies = [];
    this.bullets = [];
    this.actions = [];
    this.bulletsinfo = true;
    this.sinceLastEnemyCreation = 0;
    this.bulletsInfoDomObject = null;
    this.width = 0;
    this.windowSize = {
        width: 0,
        height: 0
    };
    this.enemiesAction = [];
    let barrier = new Barrier('barrier');

    this.render = () => {
        this.player.render();
        each(this.enemies, (enemy) => {
            enemy.render();
        });
        each(this.bullets, (bullet) => {
            bullet.render();
        });
        this._renderBulletInfo();
    };

    this._createEnemyIfPossible = (elapsed) => {
        this.sinceLastEnemyCreation += elapsed;
        if (this.sinceLastEnemyCreation >= ENEMY_CREATION_DELAY) {
            if (this.counter > 0) {
                --this.counter;
                this._createEnemy();
                this.sinceLastEnemyCreation = 0;
            }
        }
    };

    this._createEnemy = () => {
        this.enemies.push(new Boat('enemies', 'enemy' + this.enemiesCounter++, this.windowSize, this._getFireHandler(), false));
    };

    this._renderBulletInfo = () => {
        if (this.bulletsinfo === true || this.player.bulletchange === true) {
            this.player.bulletchange = false;
            this.bulletsinfo = false;
            this.bulletsInfoDomObject.innerHTML = 'Bullet: ' + this.player.getBulletsCount() + ' Enemies: ' + this.totalEnemies;
        }
    };

    this._updateWindowSize = () => {
        this.windowSize.width = window.innerWidth - 100;
        this.windowSize.height = window.innerHeight - 100;
    };

    this._getFireHandler = () => {
        let that = this;
        return (bullet) => {
            that.bullets.push(bullet);
        }
    };

    this.updateDirection = (object) => {
        object.push({
            state: enemyState(),
            action: enemyDirection()
        });
        return object
    };


    (() => {
        this._updateWindowSize();
        this.bulletsInfoDomObject = document.getElementById('infobullet');
        this.player = new Boat('battlefield', 'Boat', this.windowSize, this._getFireHandler(), true);
        this._createEnemy();

        this.update = (elapsed) => {
            ++this.enemiesDirectionCounter;
            this._updateWindowSize();
            this._createEnemyIfPossible(elapsed);
            each(this.bullets, (bullet) => {
                if (bullet._checker !== 'mouse') {

                    bullet.update(elapsed);
                }
            });
            each(this.bullets, (bullet) => {
                if (bullet._checker === 'mouse') {
                    bullet.updateMouseBullet(elapsed)
                }
            });
            this._handleCollisions();
            if (this.keyAction === true) {
                this.player.update(this.actions, elapsed);
                this.keyAction = false
            }
            if (this.mouseAction === true) {
                this.player.move(this.coordinates, elapsed);
            }
            if (this.mouseFire === true) {
                this.player.mouseFire(this.Firecoordinates);
                this.mouseFire = false
            }
            if (this.enemiesDirectionCounter === 10) {
                each(this.enemies, (enemies) => {
                    enemies.update(this.updateDirection(this.enemiesAction), elapsed);
                });
                this.enemiesDirectionCounter = 0
            }
            else {
                each(this.enemies, (enemies) => {
                    enemies.update(Nothing, elapsed);
                });
            }

            this.enemiesAction = [];
            this.actions = [];
        };

        this._handleCollisions = () => {
            let that = this;
            let newBullets = [];
            each(this.bullets, (bullet) => {
                let rect = bullet.getBoundingBox();
                let bulletLet = parseFloat(bullet._position.left);
                let bulletTop = parseFloat(bullet._position.top);
                let elem = document.elementFromPoint(bulletLet, bulletTop);
                if (elem === null || intersects(rect, barrier.getBoundingBox())) {
                    bullet.destroy();
                    return false;
                }
                let newEnemies = [];
                findIf(this.enemies, (enemy) => {
                    if (intersects(rect, enemy.getBoundingBox()) && (bullet._checker === true || bullet._checker === 'mouse')) {
                        enemy.destroy();
                        that.bulletsinfo = true;
                        --that.totalEnemies;
                        bullet.destroy();
                        return false;
                    }
                    newEnemies.push((enemy));
                    return false;
                });
                if (newEnemies.length !== that.enemies.length) {
                    that.enemies = newEnemies;
                }
                else {
                    newBullets.push(bullet);
                }
            });
            this.bullets = newBullets;
        };

        addEventListener('keydown', (e) => {
            this.keyAction = true;
            this.mouseAction = false;
            this.actions.push({
                state: ButtonState.PRESS,
                action: getAction(e)
            });
        });

        addEventListener('click', () => {
            this.mouseAction = true;
            this.coordinates.x = event.clientX;
            this.coordinates.y = event.clientY
        });

        window.oncontextmenu = () => {
            this.mouseFire = true;
            this.Firecoordinates.x = event.clientX;
            this.Firecoordinates.y = event.clientY;
            return false;
        };

        addEventListener('keyup', (e) => {
            this.keyAction = true;
            this.actions.push({
                state: ButtonState.RELEASE,
                action: getAction(e)
            });
        });
    })();

};

window.onload = function () {
    let game = new Game();
    let last = null;
    let step = (timestamp) => {
        if (!last) {
            last = timestamp;
        }
        let elapsed = timestamp - last;
        if (elapsed >= (1000 / 24)) {
            last = timestamp;
            game.update(elapsed);
            game.render();
        }

        window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
};