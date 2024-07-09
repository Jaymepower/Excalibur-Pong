import { Actor, CollisionType, Color, DisplayMode, Engine, Font, Loader, Sound, Text, vec } from 'excalibur'
import pongSound from './res/pong_sound.mp3'

async function pong() {

    const sound = new Sound(pongSound)
    const loader = new Loader([sound])


    const game = new Engine({
        width: 1200,
        height: 600,
        backgroundColor: Color.Black,
        displayMode: DisplayMode.Fixed
    })

    drawCenterLine(game)

    // Score Cards
    const scoreText1 = new Text({
        text: "0",
        font: new Font({ size: 40 }),
        color: Color.White
    })

    const score1 = new Actor({
        x: game.drawWidth / 4,
        y: 50
    })

    const scoreText2 = new Text({
        text: "0",
        font: new Font({ size: 40 }),
        color: Color.White
    })

    const score2 = new Actor({
        x: (game.drawWidth / 4) * 3,
        y: 50
    })

    score1.graphics.use(scoreText1);
    score2.graphics.use(scoreText2);
    game.add(score1);
    game.add(score2);

    // Players
    const player1 = new Actor({
        x: 40,
        y: game.drawHeight / 2,
        height: 80,
        width: 10,
        color: Color.White
    });

    const player2 = new Actor({
        x: game.drawWidth - 40,
        y: game.drawHeight / 2,
        height: 80,
        width: 10,
        color: Color.White
    });


    player1.body.collisionType = CollisionType.Fixed;

    game.add(player1);
    game.add(player2);
 
    game.input.pointers.primary.on("move", (evt) => {
        player1.pos.y = evt.worldPos.y;
    });

    // Ball
    const ball = new Actor({
        x: game.drawWidth / 2 + 10,
        y: game.drawHeight / 2 + 10,
        width: 10,
        height: 10,
        color: Color.White,
    })

    const speed = vec(250, 250)
    let ballMoving = false;
    game.input.pointers.primary.on("down", () => {
        if(!ballMoving) {
            ball.vel = speed;
            ballMoving = true;
            player2.actions.repeatForever(followBall => {
                if(player2.pos.y !== ball.pos.y && ball.pos.x > game.drawWidth / 2) {
                    followBall.moveTo(vec(player2.pos.x, ball.pos.y), 300)
                }
            })
        }
    })



    ball.body.collisionType = CollisionType.Passive

    ball.on("postupdate", () => {

        if (ball.pos.y + ball.height / 3 > game.drawHeight) {
            ball.vel.y = speed.y * -1;
            sound.play(0.5);
        }

        if (ball.pos.y < ball.height / 3) {
            ball.vel.y = speed.y;
            sound.play(0.5);
        }

    });

    ball.on("collisionstart", (event) => {
        var intersection = event.contact.mtv.normalize()
        console.log(intersection);

        if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
            ball.vel.x *= -1
        } else {
            ball.vel.y *= -1
        }
        sound.play(0.5);
    });

    ball.on("exitviewport", (event) => {
        if(ball.pos.x + ball.width > game.drawWidth) {
            scoreText1.text = (Number(scoreText1.text) + 1).toString();
        }

        if(ball.pos.x + ball.width < game.drawWidth) {
            scoreText2.text = (Number(scoreText2.text) + 1).toString();
        }

        player1.pos.y = game.drawHeight / 2;
        player2.pos.y = game.drawHeight / 2;
        player2.vel = vec(0, 0);
        ball.pos.x = game.drawWidth / 2 + 10;
        ball.pos.y = game.drawHeight / 2;
        ball.vel = vec(0,0);
        ballMoving = false; 
    })

    game.add(ball);
    await game.start(loader);
}



function drawCenterLine(game: Engine) {

    var currentHieght = 0
    const padding = 10;

    while (currentHieght < game.drawHeight - 30) {
        const xPos = game.drawWidth / 2;

        const line = new Actor({
            height: 10,
            width: 10,
            x: xPos,
            y: padding + currentHieght + 20,
            color: Color.White
        })

        line.body.collisionType = CollisionType.PreventCollision

        currentHieght += padding + 20
        game.add(line);
    }

}


pong();