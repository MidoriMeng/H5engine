interface Dialogable {
    portrait: engine.Bitmap;
    name: string;
    //dialog list
    //cur dialog index
}
type appearance_4 = {
    NORTH:engine.Texture,
    SOUTH:engine.Texture,
    EAST:engine.Texture,
    WEST:engine.Texture
}
interface Displayable {
    appearances: appearance_4;
    orientation: DIRECTION;
}

interface Movable extends Displayable {
    curAnimation: Animation;
    animationList;
    velocity: number;
}

interface Fightable {
    hp: number;
}

interface UIinterface extends engine.DisplayObjectContainer {

}

interface Scene {
    east: Scene;
    west: Scene;
    north: Scene;
    south: Scene;
}