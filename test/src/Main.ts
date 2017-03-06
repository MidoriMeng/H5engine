let TIME = 0;
let machine:GameStateMachine = null;

class Main implements EventEmitter{
    stage;
    stateMachine: GameStateMachine;
    missionPanel: MissionPanel;
    mapService: MAP.MapService;
    player: Player;
    user: User;
    observerList:Array<Observer>;
    commandList:CommandList;

    constructor(stage:engine.DisplayObjectContainer){
        this.stage = stage;
    }

    createGameScene(canvas): void {
        //加载命令
        this.commandList = new CommandList();

        //加载点击事件类
        this.observerList = new Array<Observer>();
        ClickEvent.getInstance().registerObserver(this);
        ClickEvent.getInstance().loadCommand(this.commandList);

        //加载任务系统
        var stageW = canvas.Width;
        this.missionPanel = new MissionPanel();
        this.missionPanel.x = stageW - this.missionPanel.width;
        MissionService.getInstance().loadMissions();

        //加载状态机
        this.stateMachine = new GameStateMachine();
        machine = this.stateMachine;

        //加载地图
        this.mapService = MAP.MapService.getInstance();
        this.mapService.loadNPCs();
        this.mapService.loadMap();
        this.mapService.loadMachine(this.stateMachine);

        //加载用户
        var jewel_blue = new Jewel("湛蓝宝石", "jewel_blue_png", 3, 2);
        var jewel_green = new Jewel("碧绿宝石", "jewel_green", 1, 1);

        var skill_beat = new Skill("挥砍", "skill_chop_png", 1);
        var skill_blizzard = new Skill("暴风雪", "skill_blizzard_png", 1);
        var scroll_atkup = new Scroll("秘籍-攻击力上升", "atk_up_png");
        var scroll_hpup = new Scroll("秘籍-体力上升", "mhp_up_png");

        var sword = new Equipment("wood sword", equipmentType.WEAPON, 1, "sword_png");
        sword.addJewelery([jewel_blue]);

        var coat = new Equipment("cotton cloth", equipmentType.COAT, 1, "cloth_png");
        coat.addJewelery([jewel_green]);

        var hero1 = new Hero("Hero1", "Actor2_1_png");
        hero1.addEquip(sword);
        hero1.addEquip(coat);
        hero1.addSkill(skill_beat);
        hero1.addSkill(skill_blizzard);

        var hero2 = new Hero("Hero2", "Actor2_1_png");
        this.user = new User();
        var title = new Title("新手");
        this.user.heroes.push(hero1);
        this.user.heroes.push(hero2);
        this.user.changeTitle(title);
        this.user.heroes[0].inParty = true;

        //加载当前人物
        this.player = Player.getInstance();
        this.stateMachine.addState(this.player.curState);
        this.player.y = SIZE48;
        this.player.setCurHero(this.user.heroes[0]);
        this.player.searchAgent = new AStarSearch(this.mapService.curMap.objGrid,
            this.mapService.curMap.creatureGrid);
        this.player.addEventListener(engine.TouchEvent.CLICK, this.showHeroPanel);
        this.player.touchEnabled = true;
        //this.player.addObserver(MissionService.getInstance());
        //add other people here

        //engine.startTick(this.stateMachine.runMachine, this.stateMachine);
        engine.Ticker.getInstance().register(this.stateMachine.runMachine);

        //加载怪物
        MonsterService.getInstance().x = 0;
        MonsterService.getInstance().y = 680;
        MonsterService.getInstance().loadMonsters();

        var autoButton = new engine.Shape();
        //autoButton.beginFill(0x000000);
        autoButton.drawRect(200, 600, 80, 35);
        //autoButton.endFill();
        this.stage.addChild(autoButton);
        var text = new engine.TextField(200,600,"auto");
        this.stage.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(engine.TouchEvent.CLICK, this.autoButton);


        this.stage.touchEnabled = true;
        //this.addEventListener(engine.TouchEvent.CLICK, this.onTap, this);

        this.stage.addChild(this.mapService);
        this.stage.addChild(this.player);
        this.stage.addChild(this.missionPanel);
        this.stage.addChild(MonsterService.getInstance());
        this.stage.addChild(UIService.getInstance());

        this.stage.addEventListener(engine.TouchEvent.CLICK,this.onTap);

        //test here
    }

    addObserver(o:Observer) {
        this.observerList.push(o);
    }

    notify(event:any){
        this.observerList.forEach((observer)=>{observer.onChange(event)});
    }

    autoButton() {
        var l = this.commandList;
        l.cancel();
        l.addCommand(new WalkCommand(281,280));
        l.addCommand(new TalkCommand("001"));
        l.addCommand(new WalkCommand(430,430));
        l.addCommand(new TalkCommand("002"));
        l.addCommand(new TalkCommand("002"));
        l.addCommand(new TalkCommand("002"));
        l.addCommand(new FightCommand());
        l.addCommand(new FightCommand());
        l.addCommand(new FightCommand());
        l.addCommand(new FightCommand());
        l.addCommand(new FightCommand());
        l.addCommand(new WalkCommand(281,280));
        l.addCommand(new TalkCommand("001"));
        l.execute();
    }
    showHeroPanel() {
        var userPanel = new HeroPanel(this.player.curHero);
        this.stage.addChild(userPanel);
        this.player.touchEnabled = false;
        userPanel.close.addEventListener(engine.TouchEvent.CLICK, () => {
            this.stage.removeChild(userPanel);
            this.player.touchEnabled = true;
        });
    }

    onTap(event: engine.TouchEvent) {
        this.notify(event);
    }    
}


