class HeroPanel extends engine.DisplayObjectContainer {
    static DIALOG_WIDTH = 251;
    static DIALOG_HEIGHT = 290;
    static ALIGN = 8;
    static EQUIPX = 200;

    hero: Hero;
    bg: engine.Shape;
    heroEquips;
    heroSkills;
    close: engine.Bitmap;

    constructor(hero: Hero) {
        super();
        this.hero = hero;

        this.bg = new engine.Shape();
        this.bg.graphics.beginFill(0x000000);
        this.bg.graphics.drawRect(0, 0, HeroPanel.DIALOG_WIDTH, HeroPanel.DIALOG_HEIGHT);
        this.bg.graphics.endFill();
        this.bg.alpha = 0.5;
        this.addChild(this.bg);

        var heroName = new engine.TextField();
        heroName.text = this.hero.name;
        heroName.x = HeroPanel.ALIGN;
        heroName.y = HeroPanel.ALIGN;
        this.addChild(heroName);

        var appearance = this.hero;
        appearance.x = HeroPanel.ALIGN;
        appearance.y = HeroPanel.ALIGN * 2 + heroName.size;
        this.addChild(appearance);

        //closePanel
        this.close = new engine.Bitmap(RES.getRes("error_png"));
        this.close.scaleX = 0.63;
        this.close.scaleY = 0.63;
        this.close.x = HeroPanel.DIALOG_WIDTH - this.close.width;
        this.close.touchEnabled = true;
        this.addChild(this.close);

        //show equipments
        var equipY = HeroPanel.ALIGN * 2 + heroName.size;
        this.heroEquips = new Array(equipmentType.length);
        for (var i = 0; i < this.heroEquips.length; i++) {
            var e = this.heroEquips[i];
            if (this.hero.equipment[i])
                e = this.hero.equipment[i];
            else {
                e = new engine.Bitmap(RES.getRes("emptyEquip_png"));
            }
            e.x = HeroPanel.EQUIPX;
            e.y = equipY;
            equipY += (e.height + HeroPanel.ALIGN);
            this.addChild(e);
            e.touchEnabled = true;
            /*e.addEventListener(engine.TouchEvent.CLICK,(evt,context)=>{
                this.showEquipment(this.hero.equipment[context],evt);
            },this);*/
            e.addEventListener(engine.TouchEvent.CLICK, this.showDetail, this);

        }

        //show skills
        var skillY = HeroPanel.ALIGN * 2 + heroName.size + appearance.height;
        var skillX = HeroPanel.ALIGN;
        this.heroSkills = new Array();
        for (var i = 0; i < this.hero.skills.length; i++) {
            var skill = this.heroSkills[i];
            if (this.hero.skills[i])
                skill = this.hero.skills[i];
            else {
                skill = new engine.Bitmap(RES.getRes("emptyEquip_png"));
            }
            skill.x = skillX;
            skill.y = skillY;
            skillX += (skill.width + HeroPanel.ALIGN);
            this.addChild(skill);
        }


    }

    showDetail(evt: engine.TouchEvent) {
        evt.target;
        var equipPanel = new DetailPanel(evt.target);
        equipPanel.x = evt.stageX;
        equipPanel.y = evt.stageY;
        this.addChild(equipPanel);
        equipPanel.touchEnabled = true;
        equipPanel.addEventListener(engine.TouchEvent.CLICK,()=> {
            this.removeChild(equipPanel);
        },this);
    }


}

class DetailPanel extends engine.DisplayObjectContainer {
    static WIDTH = 268;
    static HEIGHT = 300;
    static ALIGN = 8;
    obj: GeneralEquip;
    constructor(equip: Equipment) {
        super();
        this.obj = equip;

        var bg = new engine.Shape();
        bg.graphics.beginFill(0x000000);
        bg.graphics.drawRect(0, 0, DetailPanel.WIDTH, DetailPanel.HEIGHT);
        bg.graphics.endFill();
        //bg.alpha = 0.5;
        this.addChild(bg);

        var equipName = new engine.TextField();
        equipName.text = this.obj.name;
        equipName.x = DetailPanel.ALIGN;
        equipName.y = DetailPanel.ALIGN;
        this.addChild(equipName);

        //var appearance = this.equip;
        var appearance = new engine.Bitmap(RES.getRes(this.obj.appearance));
        //var appearance = JSON.parse(JSON.stringify(this.equip));
        appearance.x = DetailPanel.ALIGN;
        appearance.y = DetailPanel.ALIGN * 2 + equipName.size;
        this.addChild(appearance);

        //show properties
        var atk = this.obj.atk;
        var def = this.obj.def;
        var power = this.obj.powerPoint;
        if (atk) {
            var atkp = new engine.TextField;
            atkp.text = "attack + " + atk;
            atkp.x = DetailPanel.ALIGN * 2 + appearance.width;
            atkp.y = DetailPanel.ALIGN * 2 + equipName.size;
            this.addChild(atkp);
        }
        if (def) {
            var defp = new engine.TextField;
            defp.text = "defence + " + def;
            defp.x = DetailPanel.ALIGN * 2 + appearance.width;
            defp.y = DetailPanel.ALIGN * 3 + equipName.size * 2;
            this.addChild(defp);
        }
        if (power) {
            var powp = new engine.TextField;
            powp.text = "power   " + power;
            powp.x = DetailPanel.ALIGN * 2 + appearance.width;
            powp.y = DetailPanel.ALIGN * 4 + equipName.size * 3;
            this.addChild(powp);

        }
    }

}