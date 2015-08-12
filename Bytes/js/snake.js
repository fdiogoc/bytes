var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bytes;
(function (Bytes) {
    var SnakeSegment = (function (_super) {
        __extends(SnakeSegment, _super);
        function SnakeSegment(position) {
            _super.call(this);
            this.color = "#04B404";
            this.position = position;
        }
        SnakeSegment.prototype.draw = function () {
            var boardX = (this.position.X * Bytes.GameBoard.blockSize);
            var boardY = (this.position.Y * Bytes.GameBoard.blockSize);
            var size = Bytes.GameBoard.blockSize;
            Bytes.Canvas.fillRect(boardX, boardY, size, size, this.color);
        };
        SnakeSegment.prototype.handleCollision = function (snake) {
            snake.die();
        };
        return SnakeSegment;
    })(Bytes.GameObject);
    Bytes.SnakeSegment = SnakeSegment;
    var Snake = (function (_super) {
        __extends(Snake, _super);
        function Snake(position) {
            _super.call(this, position);
            this.hitDetected = false;
            this.isAlive = false;
            this.hiScore = 0;
            this.points = 0;
            this.lives = 5;
            this.segments = [];
            this.maxLength = 8;
            this.isAlive = true;
            this.position = position;
            this.segments[0] = this;
            Bytes.GameBoard.placeObject(this, position);
        }
        Snake.prototype.onHitScreenEdge = function (edge) {
            this.die();
        };
        Snake.prototype.die = function () {
            this.hitDetected = true;
            this.hiScore = this.points > this.hiScore
                ? this.points
                : this.hiScore;
            Bytes.Game.hiScore = this.hiScore > Bytes.Game.hiScore
                ? this.hiScore
                : Bytes.Game.hiScore;
            if (this.lives == 0) {
                this.isAlive = false;
                return Bytes.Game.reset();
            }
            this.lives -= 1;
            this.destroy();
            this.position = new Bytes.Position(0, 0);
            this.direction = Bytes.Direction.NONE;
        };
        Snake.prototype.processTurn = function () {
            if (!this.isAlive) {
                return;
            }
            this.hitDetected = false;
            var isMoving = true;
            var oldPos = Bytes.Position.copy(this.position);
            var pos = Bytes.Position.copy(this.position);
            switch (this.direction) {
                case Bytes.Direction.UP:
                    pos.Y -= 1;
                    break;
                case Bytes.Direction.DOWN:
                    pos.Y += 1;
                    break;
                case Bytes.Direction.LEFT:
                    pos.X -= 1;
                    break;
                case Bytes.Direction.RIGHT:
                    pos.X += 1;
                    break;
                case Bytes.Direction.NONE:
                    isMoving = false;
            }
            if (isMoving) {
                if (pos.X < 0) {
                    this.onHitScreenEdge(Bytes.ScreenEdge.WEST);
                }
                else if (pos.Y < 0) {
                    this.onHitScreenEdge(Bytes.ScreenEdge.NORTH);
                }
                else if (pos.X == Bytes.GameBoard.width) {
                    this.onHitScreenEdge(Bytes.ScreenEdge.SOUTH);
                }
                else if (pos.Y == Bytes.GameBoard.height) {
                    this.onHitScreenEdge(Bytes.ScreenEdge.SOUTH);
                }
                if (Bytes.GameBoard.grid[pos.X][pos.Y]) {
                    var object = Bytes.GameBoard.grid[pos.X][pos.Y];
                    object.handleCollision(this);
                }
            }
            if (!this.isAlive) {
                this.destroy();
            }
            else if (!this.hitDetected) {
                this.updateBoard(pos);
            }
        };
        Snake.prototype.updateBoard = function (pos) {
            var lastPosition = Bytes.Position.copy(this.position);
            for (var i = 0, ii = this.segments.length; i != ii; i++) {
                var segment = this.segments[i];
                var newPosition = (i == 0)
                    ? pos
                    : lastPosition;
                lastPosition = segment.position;
                Bytes.GameBoard.moveObject(segment, newPosition);
            }
            if (this.segments.length <= this.maxLength) {
                var newSegment = new SnakeSegment(lastPosition);
                this.segments.push(newSegment);
                Bytes.GameBoard.placeObject(newSegment, lastPosition);
            }
        };
        Snake.prototype.destroy = function () {
            for (var i = 0, ii = this.segments.length; i != ii; i++) {
                Bytes.GameBoard.removeObjectAt(this.segments[i].position);
            }
            this.segments = [this];
            this.maxLength = 8;
        };
        return Snake;
    })(SnakeSegment);
    Bytes.Snake = Snake;
})(Bytes || (Bytes = {}));
//# sourceMappingURL=snake.js.map