class Mission {
    /**from+to+count，三位+三位+两位 */
    constructor(id, name, description, acceptCondition, submitCondition) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = MissionStatus.UNACCEPTABLE;
        this.acceptCondition = acceptCondition;
        this.submitCondition = submitCondition;
        var acceptFunc = () => {
            MissionService.getInstance().toAcceptable(this.id);
        };
        if (this.acceptCondition)
            this.acceptCondition.fatherFunc = acceptFunc;
        var submitFunc = () => {
            MissionService.getInstance().toSubmittable(this.id);
        };
        if (this.submitCondition)
            this.submitCondition.fatherFunc = submitFunc;
        //this.toAcceptable();
    }
    toAcceptable() {
        if (this.status == MissionStatus.UNACCEPTABLE)
            if (this.acceptCondition) {
                if (this.acceptCondition.meetDemand()) {
                    this.status = MissionStatus.ACCEPTABLE;
                    return true;
                }
            }
            else {
                this.status = MissionStatus.ACCEPTABLE;
                return true;
            }
        return false;
    }
    accept() {
        if (this.status == MissionStatus.ACCEPTABLE) {
            this.status = MissionStatus.DURING;
            return true;
        }
        return false;
    }
    toSubmittable() {
        if (this.status == MissionStatus.DURING)
            if (this.submitCondition) {
                if (this.submitCondition.meetDemand()) {
                    this.status = MissionStatus.SUBMITTABLE;
                    return true;
                }
            }
            else {
                this.status = MissionStatus.SUBMITTABLE;
                return true;
            }
        return false;
    }
    submit() {
        if (this.status == MissionStatus.SUBMITTABLE) {
            this.status = MissionStatus.SUBMITTED;
            return true;
        }
        return false;
    }
    getFromID() {
        return this.id.substring(0, 3);
    }
    getToID() {
        return this.id.substring(3, 6);
    }
    getCountID() {
        return this.id.substring(6);
    }
    getStatusString() {
        switch (this.status) {
            case MissionStatus.ACCEPTABLE:
                return "可接受";
            case MissionStatus.DURING:
                return "进行中";
            case MissionStatus.SUBMITTABLE:
                return "可提交";
            case MissionStatus.SUBMITTED:
                return "已提交";
            case MissionStatus.UNACCEPTABLE:
                return "不可接受";
            default:
                console.error("no such status");
                return null;
        }
    }
    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getStatus() {
        return this.status;
    }
}
