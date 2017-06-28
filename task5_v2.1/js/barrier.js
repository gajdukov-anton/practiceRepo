let barrier;

export  Barrier = function (id)
{
    this._barrierDomElement = null;

    this._createBarrier = function() {
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

    this._barrierDomElement = this._createBarrier();


    this.getBoundingBox = () => {
        return this._barrierDomElement.getBoundingClientRect();
    }
};

