﻿namespace Bytes {

    export interface IGameResolution {
        width: number;
        height: number;
    }

    export class GameResolutions {

        public static vga: IGameResolution = { width: 640, height: 480 }
        public static svga: IGameResolution = { width: 800, height: 600 }
        public static xga: IGameResolution = { width: 1024, height: 768 }
        public static sxga: IGameResolution = { width: 800, height: 600 }

        public static default: IGameResolution = GameResolutions.svga;
    }

    export interface IGameIndex {
        [id: number]: typeof Game | IGame;
    }

    export class GameIndex {

        // All game instances
        static index: IGameIndex = { 0: Game };

        // Get next id
        static get next(): number {
            
            for (var i in GameIndex.index) {

                if (GameIndex.index[i]) {
                    return parseInt(i);
                }
            }

            return parseInt(i) + 1;
        }
        
        // Add game to index
        static add(game: Game) {

            game.id = GameIndex.next;
            GameIndex.index[game.id] = game;
        }
    }

    export interface IGame {

        id: number;

        resolution: IGameResolution;
        width: number;
        height: number;

        clock: Timer;
        board: GameBoard;
        objectList: ObjectList;
    
        hiScore: number;
        isRunning: boolean;
        constructor;
    }

    export class Game {

        public static gameIndex: IGameIndex = {};
        public static get 
        public id: number; 

        public resolution: IGameResolution = GameResolutions.default;
        public width: number = GameResolutions.default.width;
        public height: number = GameResolutions.default.height;
        
        public clock: Timer;
        public board: GameBoard;
        public objectList: ObjectList;
        public players: { [index: number]: Player };        
        
        public hiScore: number = 0;        
        public isRunning: boolean = false;
        
        public constructor() {

            
            this.players = {};

            console.log("Game created");
        }

        public init() {

            if (this.isRunning) {
                console.log("Game must be stopped before calling init()");
                return;
            }

            this.board = new GameBoard();
            this.objectList = new ObjectList();
            this.clock = new Timer(GameDifficulty.DIFFICULT, 0, Game.onClockTick);
            
            // Player 1 top left, facing right
            this.players[PlayerNumber.ONE] = new Player(PlayerNumber.ONE, { X: 0, Y: 0 });
            this.players[PlayerNumber.ONE].direction = Direction.RIGHT;

            // Player 2 bottom right, facing left
            this.players[PlayerNumber.TWO] = new Player(PlayerNumber.TWO, { X: this.width, Y: this.height });
            this.players[PlayerNumber.ONE].direction = Direction.LEFT;

            //Canvas.init(<HTMLCanvasElement>document.querySelector("canvas"));
            //Controls.init();

            //Game.htmlBody = <HTMLBodyElement>document.querySelector("body");
            //Game.htmlBody.onkeyup = Controls.onKeyUp;

            Game.ready();
        }

        static ready() {
                       

            
            // Game.player1.direction = Direction.RIGHT;

            

            // GUI.draw();
        }

        static start() {

            if (Game.isRunning) {
                return;
            }

            if (Game.clock.isPaused) {
                return Game.togglePause();
            }

            Game.isRunning = true;
            Game.clock.start();
        }

        static togglePause() {
            
            if (Game.clock.isPaused) {
                Game.clock.resume();
                Game.isRunning = true;
            }
            else {
                Game.clock.pause();
                Game.isRunning = false;
                // GUI.draw();
            }
        }

        static reset() {

            Game.clock && Game.clock.stop();
            Game.isRunning = false;
            Game.ready();
        }

        // TODO: Move this to item randomizer class
        static coinCounter = 0;

        static onClockTick() {

            // Controls.processInput();
            // Game.player1.processTurn();

            if (Game.clock.tick == ClockTick.EVEN) {

                // TODO: Move this to item randomizer class
                Game.coinCounter += 1;
                if (Game.coinCounter >= 20) {
                    Game.coinCounter = 0;

                    if (!Math.floor(Math.random() + .5)) {

                        var probability = (Coin.coinsActive + .5) / 5;
                        if (!Math.floor(Math.random() + probability)) {

                            if (!Math.floor(Math.random() + .5)) {
                                var coin = Coin.generateRandom();
                                Game.board.placeAtRandom(coin);
                            }
                            else {

                                if (!Math.floor(Math.random() + .5)) {
                                    var slowPlayer = new SlowPlayer();
                                    GameBoard.placeAtRandom(slowPlayer);
                                }
                                else {
                                    var fastPlayer = new FastPlayer();
                                    GameBoard.placeAtRandom(fastPlayer);
                                }
                            }

                            console.log("Coins on board: " + Coin.coinsActive);
                        }
                    }
                }
            }

            GameBoard.draw();
            GUI.draw();
        }
    }
    
}