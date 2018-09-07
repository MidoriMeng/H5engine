let logger = (target, name, descriptor) => {
    let delegate = descriptor.value;
    descriptor.value = function () {
        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        console.log(`${name} in: ${args.join()}`);
        let result = delegate.apply(this, arguments);
        console.log(`${name} out: ${result}`);
        return result;
    };
    return descriptor;
};
/**用户，一级 */
class User {
    constructor() {
        this.heroes = [];
    }
    get heroesInTeam() {
        return this.heroes.filter((value) => {
            return (value.inParty);
        });
    }
    changeTitle(title) {
        this.title = title;
        if (this.heroes) {
            this.heroes.forEach((value) => {
                value.title = title;
            });
        }
    }
    get powerPoint() {
        var result = 0;
        var heroes = this.heroesInTeam;
        if (heroes) {
            heroes.forEach((value) => {
                result += value.powerPoint;
            });
        }
        if (this.title)
            result += this.title.powerPoint;
        return result;
    }
}
/**基本数值 */
class GeneralFigures extends engine.Bitmap {
    constructor(name, appearance) {
        super();
        this.name = appearance;
        this.appearance = appearance;
        this.texture = engine.RES.getRes(appearance);
    }
    get atk() {
        return 0;
    }
    get def() {
        return 0;
    }
    get hp() {
        return 0;
    }
    get mp() {
        return 0;
    }
    get mag() {
        return 0;
    }
}
/**基本装备 */
class GeneralEquip extends GeneralFigures {
    constructor(name, appearance, level = 0, quality = 0) {
        super(name, appearance);
        this.level = 0;
        this.quality = 0;
        this.level = level;
        this.quality = quality;
    }
    get powerPoint() {
        return 0;
    }
}
/**称号，二级 */
class Title extends GeneralEquip {
    constructor(name, quality = 1) {
        super(name, null, 0, quality);
    }
    get atk() {
        return this.quality * 6.5;
    }
    get def() {
        return this.quality * 4.5;
    }
    get powerPoint() {
        return this.quality * 5;
    }
    show() {
        return ` ` +
            ` quality ${this.quality} power ${this.powerPoint}`;
    }
}
/**英雄，二级 */
class Hero extends GeneralEquip {
    constructor(name, appearance, level = 1, quality = 1) {
        super(name, appearance, level, quality);
        this.inParty = false;
        this.title;
        this.inParty = false;
        this.equipment = new Array(equipmentType.length);
        this.skills = new Array(Hero.SKILL_NUMBER);
    }
    //@logger
    addEquip(equip) {
        this.equipment[equip.type] = equip;
    }
    removeEquip(index) {
        this.equipment[index] = null;
    }
    addSkill(skill) {
        for (var i = 0; i < this.skills.length; i++) {
            if (!this.skills[i]) {
                this.skills[i] = skill;
                return;
            }
        }
    }
    removeSkill(skill) {
        var index = this.skills.indexOf(skill);
        this.skills.slice(index, 1);
    }
    get atk() {
        var result = 50 * this.quality * this.level;
        this.equipment.forEach((value) => { result += value.def; });
        if (this.title)
            result += this.title.def;
        return result;
    }
    get def() {
        var result = 50 * this.quality * this.level;
        this.skills.forEach((value) => { result += value.atk; });
        this.equipment.forEach((value) => { result += value.atk; });
        if (this.title)
            result += this.title.atk;
        return result;
    }
    get powerPoint() {
        var result = 0;
        if (this.equipment) {
            this.equipment.forEach((value) => { result += value.powerPoint; });
        }
        if (this.title)
            result += this.title.powerPoint;
        if (this.skills) {
            this.skills.forEach((value) => { result += value.powerPoint; });
        }
        return result + this.quality * 28 + this.level * 5;
    }
    show() {
        return ` level ${this.level},` +
            ` quality ${this.quality} power ${this.powerPoint}`;
    }
}
Hero.SKILL_NUMBER = 5;
var equipmentType;
(function (equipmentType) {
    equipmentType[equipmentType["HAT"] = 0] = "HAT";
    equipmentType[equipmentType["COAT"] = 1] = "COAT";
    equipmentType[equipmentType["PANTS"] = 2] = "PANTS";
    equipmentType[equipmentType["SHOES"] = 3] = "SHOES";
    equipmentType[equipmentType["WEAPON"] = 4] = "WEAPON";
    equipmentType[equipmentType["length"] = 5] = "length";
})(equipmentType || (equipmentType = {}));
/**装备，三级 */
class Equipment extends GeneralEquip {
    constructor(name, type, quality = 1, appearance, jewelery) {
        super(name, appearance, 0, quality);
        this.jewelery = [];
        this.type = type;
        if (jewelery)
            this.jewelery = jewelery;
        else
            this.jewelery = [];
    }
    addJewelery(jewelery) {
        this.jewelery = this.jewelery.concat(jewelery);
    }
    get atk() {
        var result = 0;
        if (this.jewelery)
            this.jewelery.forEach((value, index, array) => { result += value.atk; });
        return this.quality * 5.5 + result;
    }
    get def() {
        var result = 0;
        if (this.jewelery)
            this.jewelery.forEach((value, index, array) => { result += value.atk; });
        return this.quality * 1.5 + result;
    }
    get powerPoint() {
        var result = 0;
        if (this.jewelery)
            this.jewelery.forEach((value) => { result += value.powerPoint; });
        return result + this.quality * 5;
    }
    show() {
        return ` ` +
            ` quality ${this.quality} power ${this.powerPoint}`;
    }
}
/**宝石，四级 */
class Jewel extends GeneralEquip {
    constructor(name, appearance, type, quality = 1, level = 1) {
        super(name, appearance, level, quality);
    }
    get atk() {
        return this.level * 0.5 + this.quality * 2.4;
    }
    get def() {
        return this.level + this.quality * 0.4;
    }
    get powerPoint() {
        return this.level * 2 + this.quality * 4;
    }
    show() {
        return ` level ${this.level},` +
            ` quality ${this.quality} power ${this.powerPoint}`;
    }
}
/**武将装备的技能，三级 */
class Skill extends GeneralEquip {
    constructor(name, appearance, type, level = 1, scroll) {
        super(name, appearance, level, 0);
        if (scroll)
            this.scroll = scroll;
    }
    levelup() {
        this.level++;
    }
    get atk() {
        var result = 0;
        if (this.scroll)
            result += this.scroll.atk;
        return this.level * 5 + result;
    }
    get powerPoint() {
        var result = 0;
        if (this.scroll)
            result += this.scroll.powerPoint;
        return this.level * 8 + result;
    }
    show() {
        return ` level ${this.level},` +
            ` power ${this.powerPoint}`;
    }
}
/** 技能装备的秘籍，四级 */
class Scroll extends GeneralEquip {
    constructor(name, appearance, level = 1) {
        super(name, appearance, level, 0);
    }
    get atk() {
        return this.level * this.quality * 1.2;
    }
    get def() {
        return this.level * this.quality * 0.3;
    }
    get powerPoint() {
        return this.level * 2 + this.quality * 5;
    }
    show() {
        return ` level ${this.level},` +
            ` quality ${this.quality} power ${this.powerPoint}`;
    }
}
/*
var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
    const getter = desc.get;
    desc.get = function () {
        console.log("wow");
        return getter.apply(this);
    }
    return desc;
}
*/
