const DIALOG_WIDTH = 500;
const DIALOG_HEIGHT = 200;
const DIALOG_PORTRAIT_SIZE = 144;
const DIALOG_SIZE = 24;
const DIALOG_NAME_SIZE = 30;
const DIALOG_INTERVAL = 28;

/**包含对话和任务 */
class Dialog extends engine.DisplayObjectContainer {
    component: engine.TextField;
    strs: string[];
    curIndex = 0;
    speaker: engine.TextField;
    bg: engine.Shape;
    portrait: engine.Bitmap;
    type: "mission" | "normal";
    //todo delete
    mission: IMissionBO;
    personID:string;

    /**修改头像，名字 */
    setSpeaker(speaker: Dialogable) {
        this.portrait = speaker.portrait;
        this.speaker.text = speaker.name;
    }
    public constructor(obj: Dialogable, dialogComponents: string[], mission: Mission,speakerID:string) {
        super();
        this.touchEnabled = true;
        this.mission = mission;
        this.personID=speakerID;
        //背景
        this.bg = new engine.Shape();
        this.bg.beginFill("#000000");
        this.bg.drawRect(0, 0, DIALOG_WIDTH, DIALOG_HEIGHT);
        this.bg.endFill();
        this.bg.alpha = 0.5;
        this.addChild(this.bg);
        //头像
        this.portrait = obj.portrait;
        this.portrait.width = this.portrait.height = DIALOG_PORTRAIT_SIZE;
        this.portrait.x = this.portrait.y = DIALOG_INTERVAL;
        this.addChild(this.portrait);
        //名字
        this.speaker = new engine.TextField;
        this.speaker.text = obj.name;
        this.speaker.bold = true;
        this.speaker.color = "#FFFFFF";
        this.speaker.fontSize = DIALOG_NAME_SIZE;
        this.speaker.x = DIALOG_INTERVAL * 2 + DIALOG_PORTRAIT_SIZE;
        this.speaker.y = DIALOG_INTERVAL;
        this.addChild(this.speaker);
        //对话内容
        this.strs = dialogComponents;
        this.component = new engine.TextField;
        this.component.text = dialogComponents[this.curIndex];
        this.component.fontSize = DIALOG_SIZE;
        this.component.x = this.speaker.x;
        this.component.y = DIALOG_INTERVAL * 2 + this.speaker.height;
        this.component.width = DIALOG_WIDTH - 3 * DIALOG_INTERVAL - DIALOG_PORTRAIT_SIZE;
        this.component.height = DIALOG_HEIGHT - 3 * DIALOG_INTERVAL - this.speaker.height;
        this.addChild(this.component);

    }

    nextDialog(): boolean {
        if (this.strs.length > this.curIndex + 1) {
            this.component.text = this.strs[++this.curIndex];
            return true;
        }
        return false;
    }
}