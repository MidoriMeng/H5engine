class MissionCondition {
    constructor() {
        this._meetDemand = false;
    }
    meetDemand() {
        return this._meetDemand;
    }
    onChange(...a) { }
}
class LevelMissionCondition extends MissionCondition {
    constructor(targetLevel) {
        super();
        this.targetLevel = targetLevel;
        Player.getInstance().addObserver(this);
    }
    meetDemand() {
        if (!this._meetDemand)
            this.onChange(Player.getInstance());
        return this._meetDemand;
    }
    onChange(player) {
        if (!this._meetDemand)
            if (player.level >= this.targetLevel) {
                this._meetDemand = true;
                if (this.fatherFunc)
                    this.fatherFunc();
            }
    }
}
class TalkMissionCondition extends MissionCondition {
}
class KillMonsterMissionCondition extends MissionCondition {
    constructor(datas) {
        super();
        this._meetDemand = false;
        this.request = {};
        for (var index in datas) {
            this.request[index] = { current: 0, total: Number(datas[index]) };
        }
        MonsterService.getInstance().addObserver(this);
    }
    onChange(monster) {
        if (monster.status == MonsterStatus.DEAD) {
            var m = this.request[monster.name];
            if (m == null)
                return false;
            m.current++;
            //console.log("kill " + monster.name + " " + m.current);
            if (!this._meetDemand) {
                this._meetDemand = true;
                for (var name in this.request)
                    if (this.request[name].current < this.request[name].total)
                        this._meetDemand = false;
            }
            if (this._meetDemand)
                if (this.fatherFunc) {
                    this.fatherFunc();
                }
                else
                    console.error("no father function");
            return true;
        }
        return false;
    }
}
