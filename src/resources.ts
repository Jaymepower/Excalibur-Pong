import { Sound } from "excalibur";
import pongSound from './res/pong_sound.mp3'

 const sounds: { [key: string] : Sound} = {
    pong : new Sound(pongSound)
}

export {sounds};