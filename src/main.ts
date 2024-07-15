import { Color, DisplayMode, Engine } from "excalibur";
import PongScene from "./PongScene";


const game = new Engine({
    width: 1200,
    height: 600,
    backgroundColor: Color.Black,
    displayMode: DisplayMode.Fixed
})

game.add("pong", new PongScene())
game.goToScene("pong")

game.on('visible', () => {
    console.log('start');
    game.start()
});


