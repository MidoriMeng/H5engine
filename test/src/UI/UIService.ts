class UIService extends engine.DisplayObjectContainer {
    dialog: Dialog;
    private static instance;
    static getInstance(): UIService {
        if (UIService.instance == null)
            UIService.instance = new UIService();
        return UIService.instance;
    }

    constructor() {
        super();
        //this.dialog = new Dialog();
    }

    displayDialog(dialog: Dialog) {
        this.dialog = dialog;
        this.addChild(this.dialog);
        //this.dialog.addEventListener(engine.TouchEvent.CLICK, this.nextDialog, this);
    }

    /**对话结束返回true */
    nextDialog(): boolean {
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