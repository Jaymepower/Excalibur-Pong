import { Actor, CollisionType, Color, Engine, Font, Text, vec } from 'excalibur'

function pong() {

    const game = new Engine({
        width: 800,
        height: 600,
        backgroundColor: Color.Black
    })

    
    drawCenterLine(game)
    drawScoreLabels(game)


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

    game.add(player1)
    game.add(player2)

    game.input.pointers.primary.on("move", (evt) => {
        player1.pos.y = evt.worldPos.y;
    });

    const ball = new Actor({
        x: game.drawWidth / 2 + 10,
        y: game.drawHeight / 2 + 10,
        width: 10,
        height: 10,
        color: Color.White,
    })

    player2.vel = vec(0, 80)

    player2.on("postupdate", () => {

        if (player2.pos.y > game.drawHeight * 0.9) {
            player2.vel.y *= -1
        }

        if (player2.pos.y < game.drawHeight * 0.1) {
            player2.vel.y *= -1
        }

    })

    const speed = vec(200, 200)

    game.input.pointers.primary.on("down", () => {
        ball.vel = speed;
    })


    ball.body.collisionType = CollisionType.Passive

    ball.on("postupdate", () => {

        if (ball.pos.y + ball.height / 3 > game.drawHeight) {
            ball.vel.y = speed.y * -1;
        }

        if (ball.pos.y < ball.height / 3) {
            ball.vel.y = speed.y;
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

    });

    game.add(ball)
    game.start()
}

function drawScoreLabels(game : Engine) {

    const scoreText1 = new Text({
        text: "00",
        font: new Font({ size: 40 }),
        color: Color.White
    })

    this.score1  = new Actor({
        x: game.drawWidth / 4,
        y: 50
    })

    const scoreText2 =  new Text({
        text: "00",
        font: new Font({ size: 40 }),
        color: Color.White
    })

    this.score2 = new Actor({
        x: (game.drawWidth / 4) * 3,
        y: 50
    })

    this.score1.graphics.use(scoreText1);
    this.score2.graphics.use(scoreText2);
    game.add(this.score1);
    game.add(this.score2);
}

function drawCenterLine(game : Engine) {

    var currentHieght = 0
    const padding = 10;

    while(currentHieght < game.drawHeight - 30)  {
        const xPos = game.drawWidth / 2; 

        const line = new Actor({
            height : 10,
            width : 10,
            x : xPos,
            y: padding + currentHieght + 20,
            color: Color.White
        })

        line.body.collisionType = CollisionType.PreventCollision

        currentHieght += padding + 20
        game.add(line);
    }

}


pong();