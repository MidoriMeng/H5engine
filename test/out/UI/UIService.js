class UIService extends engine.DisplayObjectContainer {
    static getInstance() {
        if (UIService.instance == null)
            UIService.instance = new UIService();
        return UIService.instance;
    }
    constructor() {
        super();
        //this.dialog = new Dialog();
    }
    displayDialog(dialog) {
        this.dialog = dialog;
        this.addChild(this.dialog);
        //this.dialog.addEventListener(engine.TouchEvent.CLICK, this.nextDialog, this);
    }
    /**对话结束返回true */
    nextDialog() {
        if (!this.dialog.nextDialog()) {
            this.removeDialog();
            return true;
        }
        return false;
    }
    removeDialog() {
        this.removeChild(this.dialog);
        //todo delete
        MissionService.getInstance().submitMission(this.dialog.mission.getID());
        MissionService.getInstance().acceptMission(this.dialog.mission.getID());
    }
}
