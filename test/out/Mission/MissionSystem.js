var MissionStatus;
(function (MissionStatus) {
    MissionStatus[MissionStatus["SUBMITTED"] = 0] = "SUBMITTED";
    MissionStatus[MissionStatus["UNACCEPTABLE"] = 1] = "UNACCEPTABLE";
    MissionStatus[MissionStatus["DURING"] = 2] = "DURING";
    MissionStatus[MissionStatus["ACCEPTABLE"] = 3] = "ACCEPTABLE";
    MissionStatus[MissionStatus["SUBMITTABLE"] = 4] = "SUBMITTABLE";
})(MissionStatus || (MissionStatus = {}));
//防御式
class MissionService {
    constructor() {
        //储存所有任务，待优化
        this.observerList = new Array();
        //init all missions
        if (MissionService.instance)
            throw new Error("don't use constructor of MissionSystem");
        MissionService.instance = this;
    }
    static getInstance() {
        if (MissionService.instance == null)
            MissionService.instance = new MissionService();
        return MissionService.instance;
    }
    loadMissions() {
        this.missionList = {};
        this.missionList = createMissionsFactory();
    }
    getMissionById(missionID) {
        return this.missionList[missionID];
    }
    getMissionByCustomRule(rule, self) {
        rule(this.missionList, self);
    }
    notify(mission) {
        for (let i in this.observerList) {
            this.observerList[i].onChange(mission);
        }
    }
    toAcceptable(missionID) {
        var m = this.missionList[missionID];
        if (m.toAcceptable()) {
            this.notify(m);
            return true;
        }
        console.error("can't to acceptable" + missionID);
        return false;
    }
    toAcceptable_all() {
        for (var index in this.missionList) {
            this.toAcceptable(index);
        }
    }
    acceptMission(missionID) {
        var m = this.missionList[missionID];
        if (m.accept()) {
            this.toSubmittable(missionID);
            this.notify(m);
            return true;
        }
        return false;
    }
    toSubmittable(missionID) {
        var m = this.missionList[missionID];
        if (m.toSubmittable()) {
            this.notify(m);
            return true;
        }
        return false;
    }
    submitMission(missionID, player) {
        var m = this.missionList[missionID];
        if (m.submit()) {
            this.notify(m);
            return true;
        }
        return false;
    }
    addObserver(observer) {
        this.observerList.push(observer);
    }
    haveID(id) {
        if (this.missionList[id])
            return true;
        else
            return false;
    }
}
MissionService.instance = new MissionService();
