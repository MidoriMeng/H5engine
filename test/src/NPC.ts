
class NPC extends engine.DisplayObjectContainer implements MissionObserver, Dialogable, Displayable {
    NPCid: string;//三位
    name: string;

    appearances: appearance_4;
    appearance: engine.Bitmap;
    orientation: DIRECTION;

    portrait: engine.Bitmap;
    missionList: Mission[] = [];
    emoji: engine.Bitmap;

    isTalking = false;

    /**ID为三位 */
    constructor(id: string, name: string,
        appearances: appearance_4, orientation: DIRECTION,
        portrait: string) {
        super();
        this.NPCid = id;
        this.name = name;

        this.appearances = appearances;
        this.changeOrientation(orientation);

        this.portrait = new engine.Bitmap(engine.RES.getRes(portrait));
        this.touchEnabled = true;

        var service = MissionService.getInstance();
        //regester itself in MissionService
        service.addObserver(this);
        service.getMissionByCustomRule(this.rule_all_interactableFirst, this);

        //show emoji
        this.emoji = new engine.Bitmap(engine.RES.getRes("empty.png"));
        this.showEmoji();
        this.addChild(this.emoji);

        //add listener
        //this.addListener();
        this.addChild(this.appearance);
        //this.appearance.touchEnabled = true;
    }

    setPosition(pos: Vector2) {
        this.x = pos.x;
        this.y = pos.y;
    }

    /**更新orientation和appearance */
    changeOrientation(direction: DIRECTION) {
        this.orientation = direction;
        var str;
        switch (direction) {
            case DIRECTION.SOUTH:
                str = "SOUTH";
                break;
            case DIRECTION.EAST:
                str = "EAST";
                break;
            case DIRECTION.NORTH:
                str = "NORTH";
                break;
            case DIRECTION.WEST:
                str = "WEST";
                break;
        }
        this.appearance = new engine.Bitmap(this.appearances[str]);
    }

    conversation() {
        Player.getInstance().Move(machine, new Vector2(this.x, this.y), this.showDialog);

    }
    /*addListener() {
        this.addEventListener(engine.TouchEvent.CLICK, this.showDialog, this);
    }*/

    showDialog() {
        UIService.getInstance().displayDialog(new Dialog(this, this.missionList[0].description, this.missionList[0], this.NPCid));
        //this.removeEventListener(engine.TouchEvent.CLICK, this.showDialog, this);
    }

    static rule(rule: "interactableFirst" | "all", missions: missionList, self: NPC) {
        var all = () => {
            for (var index in missions) {
                //var pattern = new RegExp(this.id, "\d{3}");
                var fromId = missions[index].getFromID();
                var toId = missions[index].getToID();
                if (self.NPCid == fromId || self.NPCid == toId) {
                    self.missionList.push(missions[index]);
                }
            }
        }
        var interactableFirst = () => {
            self.rule_all(missions, self);
            self.sort();
        }
        switch (rule) {
            case "interactableFirst":
                interactableFirst();
                break;
            case "all":
                all();
                break;
        }
    }
    /**把所有收/发人是自己的任务加到自己的队列中 */
    rule_all(missions: missionList, self: NPC) {
        for (var index in missions) {
            //var pattern = new RegExp(this.id, "\d{3}");
            var fromId = missions[index].getFromID();
            var toId = missions[index].getToID();
            if (self.NPCid == fromId || self.NPCid == toId) {
                self.missionList.push(missions[index]);
            }
        }
    }

    rule_all_interactableFirst(missions: missionList, self: NPC) {
        self.rule_all(missions, self);
        self.sort();
    }

    onChange(mission: Mission) {
        if (mission.getFromID() == this.NPCid || mission.getToID() == this.NPCid) {
            this.missionList[mission.id] = mission;
            this.sort();
            this.showEmoji();
        }

    }

    sort() {
        var id = this.NPCid;
        this.missionList.sort(function (a, b) {
            var valueA, valueB;
            valueB = (
                !b.status
                    || (!(b.status % 2) && b.getFromID() == id)
                    || (b.status % 2 && b.getToID() == id) ?
                    0 : b.status
            )
            valueA = (
                !a.status
                    || (!(a.status % 2) && a.getFromID() == id)
                    || (a.status % 2 && a.getToID() == id) ?
                    0 : a.status
            )
            return valueB - valueA;
        });
    }

    showEmoji() {
        if (this.missionList.length) {
            var fromID = this.missionList[0].getFromID();
            var toID = this.missionList[0].getToID();
            switch (this.missionList[0].status) {
                case MissionStatus.ACCEPTABLE:
                    if (fromID == this.NPCid)
                        this.emoji.texture = engine.RES.getRes("Balloon_exclamation.png");
                    break;
                case MissionStatus.DURING:
                    if (toID == this.NPCid)
                        this.emoji.texture = engine.RES.getRes("Balloon_questionMark_gray.png");
                    else
                        this.emoji.texture = engine.RES.getRes("empty.png");
                    break;
                case MissionStatus.SUBMITTABLE:
                    if (toID == this.NPCid)
                        this.emoji.texture = engine.RES.getRes("Balloon_questionMark.png");
                    else
                        this.emoji.texture = engine.RES.getRes("empty.png");
                    break;
                case MissionStatus.UNACCEPTABLE:
                    if (fromID == this.NPCid)
                        this.emoji.texture = engine.RES.getRes("Balloon_exclamation_gray.png");
                    else
                        this.emoji.texture = engine.RES.getRes("empty.png");
                    break;
                default:
                    this.emoji.texture = engine.RES.getRes("empty.png");
            }
        }
        this.emoji.y = -this.emoji.height;
    }
}
