import { Actor, CollisionType, Color, Engine, Font, Scene, Sound, Text, vec, Vector } from "excalibur";
import { sounds } from "./resources";

export default class PongScene extends Scene {
    private player!: Actor;
    private opponent!: Actor;
    private ball!: Actor;

    private playerScore!: Text;
    private opponentScore!: Text;

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
                this.opponent.actions.repeatForever(followBall => {
                    if (this.opponent.pos.y !== this.ball.pos.y && this.ball.pos.x > engine.drawWidth / 2) {
                        followBall.moveTo(vec(this.opponent.pos.x, this.ball.pos.y), 300)
                    }
                })
            }
        })
    }

    private setupPlayers(engine: Engine) {
        this.player = new Actor({
            x: 40,
            y: engine.drawHeight / 2,
            height: 80,
            width: 10,
            color: Color.White
        });

        this.player.body.collisionType = CollisionType.Fixed;

        // Handle player 1 movement 
        engine.input.pointers.primary.on("move", (evt) => {
            // Prevent the paddle from running off the page
            if(evt.worldPos.y > engine.drawHeight * 0.1 && evt.worldPos.y < engine.drawHeight * 0.90) {
                this.player.pos.y = evt.worldPos.y;
            }
        });

        this.opponent = new Actor({
            x: engine.drawWidth - 40,
            y: engine.drawHeight / 2,
            height: 80,
            width: 10,
            color: Color.White
        });

        engine.add(this.player);
        engine.add(this.opponent);
    }

    private setupBall(engine: Engine) {
        const player1 = this.player;
        const player2 = this.opponent;

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
                sounds.pong.play()
            }

            if (this.ball.pos.y < this.ball.height / 3) {
                this.ball.vel.y = PongScene.speed.y;
                sounds.pong.play()
            }

        });

        this.ball.on("collisionstart", (event) => {
            var intersection = event.contact.mtv.normalize()

            if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
                this.ball.vel.x *= -1
            } else {
                this.ball.vel.y *= -1
            }
            sounds.pong.play()
        });

        // @TODO Add handler for score updates
        this.ball.on("exitviewport", () => {
            if (this.ball.pos.x + this.ball.width > engine.drawWidth) {
                this.addScore(this.playerScore);
            }

            if (this.ball.pos.x + this.ball.width < engine.drawWidth) {
                this.addScore(this.opponentScore);
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

    private addScore(scoreCard : Text) {
        scoreCard.text = (Number(scoreCard.text) + 1).toString();
    }


    private addScoreCards(engine: Engine) {
        // Score Cards
        this.playerScore = new Text({
            text: "0",
            font: new Font({ size: 40 }),
            color: Color.White
        })

        const score1 = new Actor({
            x: engine.drawWidth / 4,
            y: 50
        })

        this.opponentScore = new Text({
            text: "0",
            font: new Font({ size: 40 }),
            color: Color.White
        })

        const score2 = new Actor({
            x: (engine.drawWidth / 4) * 3,
            y: 50
        })

        score1.graphics.use(this.playerScore);
        score2.graphics.use(this.opponentScore);

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