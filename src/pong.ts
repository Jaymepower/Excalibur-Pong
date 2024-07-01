import { Actor, CollisionType, Color, Engine, Font, Text, vec } from 'excalibur'


function pong() {

    const game = new Engine({
        width: 800,
        height: 600,
        backgroundColor: Color.Black
    })

    const score1 = new Text({
        text: "0",
        font: new Font({size: 40}),
        color: Color.White
    })

    const scoreLabel = new Actor({
        x: game.drawHeight / 3, 
        y:  50,
    })

    scoreLabel.graphics.use(score1);
    game.add(scoreLabel)

    const player1 = new Actor({
        x: 40,
        y: game.drawHeight / 2,
        height: 100,
        width: 20,
        color: Color.White
    });

    const player2 = new Actor({
        x: game.drawWidth - 40,
        y: game.drawHeight / 2,
        height: 100,
        width: 20,
        color: Color.White
    });

    player1.body.collisionType = CollisionType.Fixed;

    game.add(player1)
    game.add(player2)

    game.input.pointers.primary.on("move", (evt) => {
        player1.pos.y = evt.worldPos.y;
    });


    const ball = new Actor({
        x: player1.pos.x + 20,
        y: game.drawHeight / 2,
        width: 20,
        height: 20,
        color: Color.White,
    })

    const speed = vec(100, 100)

    game.input.pointers.primary.on("down", () => {
        ball.vel = speed;
    })


    ball.body.collisionType = CollisionType.Passive

    ball.on("postupdate", () => {
        // If the ball collides with the top, reverse
        if (ball.pos.y < ball.height / 2) {
            ball.vel.y = speed.y * -1;
        }

        if (ball.pos.y + ball.height / 2 > game.drawHeight) {
            ball.vel.y = speed.y * -1;
        }


    });

    game.add(ball)
    game.start()
}


pong();