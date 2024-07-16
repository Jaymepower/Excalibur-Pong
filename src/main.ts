import { Color, DisplayMode, Engine, Loader } from "excalibur";
import PongScene from "./PongScene";
import { sounds } from "./resources";

const game = new Engine({
    width: 1200,
    height: 600,
    backgroundColor: Color.Black,
    displayMode: DisplayMode.Fixed
})

const loader = new Loader();
loader.addResource(sounds.pong)

game.add("pong", new PongScene())
game.goToScene("pong")

game.start(loader)


