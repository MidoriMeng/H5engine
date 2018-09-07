class ClickEvent {
    //main:Main;
    constructor() {
    }
    static getInstance() {
        if (ClickEvent.instance == null)
            ClickEvent.instance = new ClickEvent();
        return ClickEvent.instance;
    }
    registerObserver(m) {
        m.addObserver(this);
    }
    loadCommand(c) {
        this.commandList = c;
    }
    onChange(event) {
        console.log(event.target);
        if (event.target instanceof NPC) { //click NPC
            var npc = event.target;
            if (!npc.isTalking) {
                this.commandList.cancel();
                this.commandList.addCommand(new WalkCommand(npc.x, npc.y));
                this.commandList.addCommand(new TalkCommand(npc.NPCid));
                this.commandList.execute();
            }
        }
        else if (event.target instanceof Dialog) {
        }
    }
}
ClickEvent.instance = new ClickEvent();
