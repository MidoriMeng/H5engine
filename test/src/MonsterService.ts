class Monster extends engine.DisplayObjectContainer {
    name: string;
    status: MonsterStatus;
    appearance: engine.Bitmap;
    constructor() {
        super();
        this.name = "slime";
        this.status = MonsterStatus.ALIVE;
        this.appearance = new engine.Bitmap(engine.RES.getRes("Slime.png"));
        this.addChild(this.appearance);
        this.touchEnabled = true;
    }

    goDie() {
        console.log(this.name + " die");
        this.status = MonsterStatus.DEAD;
    }

}
enum MonsterStatus {
    ALIVE,
    DEAD
}

class MonsterService extends engine.DisplayObjectContainer implements EventEmitter {
    private static instance;
    monsterList: Array<Monster>;
    observerList: Array<Observer>;

    static getInstance(): MonsterService {
        if (MonsterService.instance == null)
            MonsterService.instance = new MonsterService();
        return MonsterService.instance;
    }

    constructor() {
        super();
        this.observerList = new Array<Observer>();
        this.monsterList = new Array<Monster>();
        this.addEventListener(engine.TouchEvent.CLICK, (e)=>this.onTap(e));
    }

    onTap(e: engine.TouchEvent) {
        console.log("tap @ monsterService");
        var monster = e.target;
        //animation
        var slash = new engine.Bitmap(engine.RES.getRes("Slash.png"));
        slash.x = monster.x + e.localX - slash.width / 2;
        slash.y = monster.y + e.localY - slash.height / 2;
        //console.log(slash.x, slash.y);
        this.addChild(slash);
        engine.setTimeout(() => {
            this.removeChild(slash);
            //kill
            this.killMonster(monster);
        },200);


    }

    killMonster(monster: Monster) {
        monster.goDie();
        this.monsterList.splice(this.monsterList.indexOf(monster), 1);
        this.removeChild(monster);
        this.notify(monster);
    }

    loadMonsters() {
        /*this.monsterList.push(new Monster());
        this.addChild(this.monsterList[0]);
        this.updateView();*/
    }

    addMonster(): Monster {
        console.log("new monster");
        var m = new Monster();
        this.monsterList.push(m);
        this.addChild(m);
        m.x = Math.random() * 105;
        m.y = Math.random() * 45;
        this.updateView();
        return m;
    }

    addObserver(o: Observer) {
        this.observerList.push(o);
    }

    notify(monster: Monster) {
        for (var index in this.observerList)
            this.observerList[index].onChange(monster);
    }

    updateView() {

    }
}