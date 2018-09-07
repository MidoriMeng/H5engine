class PlayerAnimation {
    constructor(anim, self, FPS = 24) {
        this.FPS = 24;
        this.textureList = [];
        this.textureList = anim;
        this.self = self;
        this.FPS = FPS;
        this.timePassed = 0;
        this.curFrame = 0;
        //    console.log("new animation,"+anim[0]);
    }
    playCurcularly(timePassed) {
        this.timePassed += timePassed;
        if (this.timePassed >= 1000 / this.FPS) {
            this.timePassed -= (1000 / this.FPS);
            this.curFrame = (++this.curFrame) % this.textureList.length;
            this.self.texture = engine.RES.getRes(this.textureList[this.curFrame]);
            //    console.log("current frame:"+this.textureList[this.curFrame]);
        }
    }
    playOnce(order, timePassed) {
        this.timePassed += timePassed;
        if (this.timePassed >= 1000 / this.FPS) {
            this.timePassed -= (1000 / this.FPS);
            var list = this.textureList[order];
            if (this.curFrame < list.length) {
                this.self.texture = engine.RES.getRes(list[this.curFrame]);
                this.curFrame++;
            }
        }
    }
}
