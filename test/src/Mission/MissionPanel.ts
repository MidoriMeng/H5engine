const MISSIONPANEL_WIDTH = 300;
const MISSIONPANEL_HEIGHT = 150;
const LINE_SPACE = 10;

class MissionPanel extends engine.DisplayObjectContainer implements Observer {
    missionList: IMissionBO[] = [];
    bg: engine.Shape;
    textFieldList: engine.TextField[];
    constructor() {
        super();
        var service = MissionService.getInstance();
        service.addObserver(this);
        var missionList = service.getMissionByCustomRule(this.rule_interactable, this);
        this.textFieldList = [];

        this.bg = new engine.Shape();
        this.bg.beginFill("#000000");
        this.bg.drawRect(0, 0, MISSIONPANEL_WIDTH, MISSIONPANEL_HEIGHT);
        this.bg.endFill();
        this.bg.alpha = 0.5;
        this.addChild(this.bg);
    }

    /**include  during, submittable */
    rule_interactable(missions: missionList, self: MissionPanel) {
        for (var index in missions) {
            var status = missions[index].status;
            if (status == MissionStatus.DURING ||
                status == MissionStatus.SUBMITTABLE) {
                self.missionList.push(missions[index]);
            }
        }
        self.updateAll();
    }

    addMission(mission: Mission) {
        if (this.missionList.indexOf(mission) < 0) {
            this.missionList.push(mission);
            this.updateAll();
        }
        else {
            console.log("mission already in missionPanel");
            return;
        }
    }

    deleteMission(mission: Mission) {
        var index = this.missionList.indexOf(mission);
        if (index != -1) {
            this.missionList.splice(index, 1);
            this.updateAll();
        } else
            console.error("nothing to delete");
    }

    onChange(mission: Mission) {
        var shouldDisplay = (mission.status == MissionStatus.DURING || mission.status == MissionStatus.SUBMITTABLE);
        var newElement = Boolean(this.missionList.indexOf(mission) == -1);
        if (newElement && shouldDisplay)
            this.addMission(mission);
        if (shouldDisplay)
            this.updateAll();
        else if (!newElement && !shouldDisplay)
            this.deleteMission(mission);
    }

    /**sort list and update view */
    updateAll() {
        //sort
        this.missionList.sort(
            function (a, b) {
                var valueA, valueB;
                var result = 0;
                return b.getStatus() - a.getStatus() +
                    0.01 * (Number(b.getFromID()) - Number(a.getFromID()));//降序
            }
        );

        //update view
        if (this.missionList.length > 0) {
            this.removeChildren();
            this.addChild(this.bg);
            this.textFieldList.splice(0);//delete all
            for (var index in this.missionList) {
                var mission = this.missionList[index];
                var newText = new engine.TextField();
                newText.text = mission.getName() + " (" + mission.getStatusString() + ")";
                this.textFieldList.push(newText);
                newText.x = LINE_SPACE;
                newText.y = LINE_SPACE + Number(index) * newText.fontSize * 1.1;
                this.addChild(newText);
            }
        }
    }


}