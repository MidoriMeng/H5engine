var PLAYER_VELOCITY = 0.2;
var ANIMATION_FRAMESPEED = 24; //动画播放帧速
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["NORTH"] = 0] = "NORTH";
    DIRECTION[DIRECTION["SOUTH"] = 1] = "SOUTH";
    DIRECTION[DIRECTION["WEST"] = 2] = "WEST";
    DIRECTION[DIRECTION["EAST"] = 3] = "EAST";
})(DIRECTION || (DIRECTION = {}));
class Player extends engine.DisplayObjectContainer {
    constructor() {
        super();
        this.level = 1;
        this.hp = 200;
        this.velocity = PLAYER_VELOCITY; //pixel per frame
        this.curState = new PLAYER.IdleState(this, null);
        this.orientation = DIRECTION.EAST;
        this.missionList = [];
        this.appearance = new engine.Bitmap(engine.RES.getRes("actor1_05.png"));
        this.animationList = {
            "idle_west": ["actor1_06.png"],
            "idle_east": ["Actor1_09.png"],
            "idle_north": ["Actor1_12.png"],
            "idle_south": ["Actor1_02.png"],
            "walk_west": ["actor1_05.png", "actor1_06.png", "Actor1_07.png", "actor1_06.png"],
            "walk_east": ["Actor1_08.png", "Actor1_09.png", "Actor1_10.png", "Actor1_09.png"],
            "walk_north": ["Actor1_11.png", "Actor1_12.png", "Actor1_13.png", "Actor1_12.png"],
            "walk_south": ["Actor1_01.png", "Actor1_02.png", "Actor1_03.png", "Actor1_02.png"]
        };
        this.curAnimation = new PlayerAnimation(this
            .animationList["idle_east"], this.appearance, ANIMATION_FRAMESPEED);
        //this.observerList = new Array<Observer>();
        this.addChild(this.appearance);
        this.observerList = new Array();
        this.commandList = new CommandList();
    }
    static getInstance() {
        if (Player.instance == null)
            Player.instance = new Player();
        return Player.instance;
    }
    acceptMission(missionID) {
        var mission = MissionService.getInstance().getMissionById(missionID);
        if (MissionService.getInstance().acceptMission(missionID))
            this.missionList.push(mission);
    }
    finishMission(missionID) {
        MissionService.getInstance().submitMission(missionID);
    }
    addObserver(o) {
        this.observerList.push(o);
        this.notify();
    }
    notify() {
        for (var index in this.observerList) {
            this.observerList[index].onChange(this);
        }
    }
    addCommand(commands) {
        if (commands) {
            this.commandList.cancel();
            commands.forEach((value) => { this.commandList.addCommand(value); });
            this.commandList.execute();
        }
    }
    setCurHero(hero) {
        this.curHero = hero;
    }
    /*notify() {
        if (this.observerList.length)
            for (let i in this.observerList) {
                this.observerList[i].onChange(this);
            }
    }

    addObserver(observer: Observer) {
        this.observerList.push(observer);
        this.notify();
    }*/
    Move(stateMachine, target, callback) {
        //获取vec2_p48格式的当前点、目标点
        var position_48 = new Vector2_p48(0, 0);
        position_48.x = this.x;
        position_48.y = this.y;
        var target_48 = new Vector2_p48(0, 0);
        target_48.x = target.x;
        target_48.y = target.y;
        if (target_48.x < MAP.MapService.getInstance().width &&
            target_48.x > 0 &&
            target_48.y < MAP.MapService.getInstance().height &&
            target_48.y > 0) {
            //寻路
            this.searchAgent.setStartNode(position_48.indexX, position_48.indexY); //更新agent start, end node
            this.searchAgent.setEndNode(target_48.indexX, target_48.indexY);
            var find = this.searchAgent.search(); //寻路,建立路径
            stateMachine.switchState(this.curState, new PLAYER.WalkState(this, callback));
        }
        else
            console.log("can't walk there");
    }
    updateOrientation(target) {
        if (target.x - this.x > 0) {
            this.orientation = DIRECTION.EAST;
            this.curAnimation = new PlayerAnimation(this
                .animationList["idle_east"], this.appearance, ANIMATION_FRAMESPEED);
        }
        else if (target.x - this.x < 0) {
            this.orientation = DIRECTION.WEST;
            this.curAnimation = new PlayerAnimation(this
                .animationList["idle_west"], this.appearance, ANIMATION_FRAMESPEED);
        }
        if (target.y - this.y > 0) {
            this.orientation = DIRECTION.SOUTH;
            this.curAnimation = new PlayerAnimation(this
                .animationList["idle_south"], this.appearance, ANIMATION_FRAMESPEED);
        }
        else if (target.y - this.y < 0) {
            this.orientation = DIRECTION.NORTH;
            this.curAnimation = new PlayerAnimation(this
                .animationList["idle_north"], this.appearance, ANIMATION_FRAMESPEED);
        }
    }
    updateWalkAnimationClip() {
        switch (this.orientation) {
            case DIRECTION.NORTH:
                this.curAnimation = new PlayerAnimation(this
                    .animationList["walk_north"], this.appearance, ANIMATION_FRAMESPEED);
                break;
            case DIRECTION.EAST:
                this.curAnimation = new PlayerAnimation(this
                    .animationList["walk_east"], this.appearance, ANIMATION_FRAMESPEED);
                break;
            case DIRECTION.SOUTH:
                this.curAnimation = new PlayerAnimation(this
                    .animationList["walk_south"], this.appearance, ANIMATION_FRAMESPEED);
                break;
            case DIRECTION.WEST:
                this.curAnimation = new PlayerAnimation(this
                    .animationList["walk_west"], this.appearance, ANIMATION_FRAMESPEED);
                break;
        }
    }
}
