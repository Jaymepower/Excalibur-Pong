import { Actor, CollisionType, Color, DefaultLoader, Engine, Font, Loader, Scene, Sound, Text, vec, Vector } from "excalibur";
import pongSound from './res/pong_sound.mp3'

export default class PongScene extends Scene {

    private player1!: Actor;
    private player2!: Actor;
    private ball!: Actor;

    private sound!: Sound;

    private ballMoving = false;

    static speed: Vector = vec(250, 250)

    constructor() {
        super();
    }

    public onInitialize(engine: Engine): void {
        this.setupPlayers(engine);
        this.addScoreCards(engine);
        this.drawCenterLine(engine);
        this.setupBall(engine);

        engine.input.pointers.primary.on("down", () => {
            if (!this.ballMoving) {
                this.ball.vel = PongScene.speed;
                this.ballMoving = true;
                this.player2.actions.repeatForever(followBall => {
                    if (this.player2.pos.y !== this.ball.pos.y && this.ball.pos.x > engine.drawWidth / 2) {
                        followBall.moveTo(vec(this.player2.pos.x, this.ball.pos.y), 300)
                    }
                })
            }
        })

        engine.start();
    }

    // @TODO fix sound pre loading
    public onPreLoad(loader: DefaultLoader): void {
        this.sound = new Sound(pongSound);
        loader.addResource(this.sound);
    }

    private setupPlayers(engine: Engine) {
        this.player1 = new Actor({
            x: 40,
            y: engine.drawHeight / 2,
            height: 80,
            width: 10,
            color: Color.White
        });

        this.player1.body.collisionType = CollisionType.Fixed;

        // Handle player 1 movement 
        engine.input.pointers.primary.on("move", (evt) => {
            this.player1.pos.y = evt.worldPos.y;
        });

        this.player2 = new Actor({
            x: engine.drawWidth - 40,
            y: engine.drawHeight / 2,
            height: 80,
            width: 10,
            color: Color.White
        });

        engine.add(this.player1);
        engine.add(this.player2);
    }

    private setupBall(engine: Engine) {
        const player1 = this.player1;
        const player2 = this.player2;

        this.ball = new Actor({
            x: engine.drawWidth / 2 + 10,
            y: engine.drawHeight / 2 + 10,
            width: 10,
            height: 10,
            color: Color.White,
        })

        this.ball.body.collisionType = CollisionType.Passive

        this.ball.on("postupdate", () => {

            if (this.ball.pos.y + this.ball.height / 3 > engine.drawHeight) {
                this.ball.vel.y = PongScene.speed.y * -1;
                //sound.play(0.5);
            }

            if (this.ball.pos.y < this.ball.height / 3) {
                this.ball.vel.y = PongScene.speed.y;
                //sound.play(0.5);
            }

        });

        this.ball.on("collisionstart", (event) => {
            var intersection = event.contact.mtv.normalize()
            console.log(intersection);

            if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
                this.ball.vel.x *= -1
            } else {
                this.ball.vel.y *= -1
            }
            //sound.play(0.5);
        });

        // @TODO Add handler for score updates
        this.ball.on("exitviewport", (event) => {
            if (this.ball.pos.x + this.ball.width > engine.drawWidth) {
                //scoreText1.text = (Number(scoreText1.text) + 1).toString();
            }

            if (this.ball.pos.x + this.ball.width < engine.drawWidth) {
                //scoreText2.text = (Number(scoreText2.text) + 1).toString();
            }

            player1.pos.y = engine.drawHeight / 2;
            player2.pos.y = engine.drawHeight / 2;
            player2.vel = vec(0, 0);
            this.ball.pos.x = engine.drawWidth / 2 + 10;
            this.ball.pos.y = engine.drawHeight / 2;
            this.ball.vel = vec(0, 0);
            this.ballMoving = false;
        })

        engine.add(this.ball);
    }


    private addScoreCards(engine: Engine) {
        // Score Cards
        const scoreText1 = new Text({
            text: "0",
            font: new Font({ size: 40 }),
            color: Color.White
        })

        const score1 = new Actor({
            x: engine.drawWidth / 4,
            y: 50
        })

        const scoreText2 = new Text({
            text: "0",
            font: new Font({ size: 40 }),
            color: Color.White
        })

        const score2 = new Actor({
            x: (engine.drawWidth / 4) * 3,
            y: 50
        })

        score1.graphics.use(scoreText1);
        score2.graphics.use(scoreText2);

        engine.add(score1);
        engine.add(score2);
    }

    private drawCenterLine(engine: Engine) {

        var currentHieght = 0
        const padding = 10;

        while (currentHieght < engine.drawHeight - 30) {
            const xPos = engine.drawWidth / 2;

            const line = new Actor({
                height: 10,
                width: 10,
                x: xPos,
                y: padding + currentHieght + 20,
                color: Color.White
            })

            line.body.collisionType = CollisionType.PreventCollision

            currentHieght += padding + 20
            engine.add(line);
        }
    }



}