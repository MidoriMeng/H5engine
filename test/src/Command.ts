interface Command {
    _hasBeenCancelled: boolean;
    execute(callback: Function): void;

    cancel(callback: Function): void;

}

class WalkCommand implements Command {
    private x;
    private y;
    _hasBeenCancelled = false;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    execute(callback: Function): void {
        var service = MAP.MapService.getInstance();

        Player.getInstance().Move(service.gameStateMachine, new Vector2(this.x, this.y), () => {
            callback();
        });
    }

    cancel(callback: Function) {
        /* GameScene.getCurrentScene().stopMove(function () {
             callback();
         })*/
         Player.getInstance().searchAgent._path.slice(0);
         callback();
    }
}

class FightCommand implements Command {
    _hasBeenCancelled = false;

    execute(callback: Function): void {
        //get monster
        var mservice = MonsterService.getInstance();
        var monster = mservice.addMonster();
        //kill monster
        engine.setTimeout(() => {
            engine.click(mservice.x + monster.x + monster.width / 2,
            mservice.y + monster.y + monster.width / 2)//执行monster上的listener，即monsterService.onTap
        }, 200);

        engine.setTimeout(() => {
            if (!this._hasBeenCancelled) {
                callback();
            }
        }, 500);

    }

    cancel(callback: Function) {
        console.log("脱离战斗")
        this._hasBeenCancelled = true;
        engine.setTimeout(function () {
            callback();
        }, 100)

    }
}

class TalkCommand implements Command {
    _hasBeenCancelled = false;
    npc: NPC;

    constructor(npcid: string) {
        this.npc = MAP.MapService.getInstance().getNPC(npcid);
    }

    execute(callback: Function): void {
        this.npc.showDialog();
        var service = UIService.getInstance();
        var key = engine.setInterval(()=> {
            if(service.nextDialog()){
                this.npc.isTalking = false;
                callback();
                engine.clearInterval(key);
            }
        }, 1000);
    }

    cancel(callback: Function) {
        console.log("关闭对话框");
    }
}

//------------------------------------------------------------------

class CommandList {
    private _list: Command[] = [];
    private currentCommand: Command;
    private _frozen = false;

    addCommand(command: Command) {
        this._list.push(command);
    }

    cancel() {
        this._frozen = true;
        var command = this.currentCommand;
        engine.setTimeout(() => {
            if (this._frozen) {
                this._frozen = false;
                console.log("时间过长，自动解除frozen");
            }

        }, 5000);
        if (command) {
            command.cancel(() => {
                this._frozen = false;
            });
            this._list = [];
        } else {
            this._frozen = false;
            this._list = [];
        }

    }

    execute() {
        if (this._frozen) {
            engine.setTimeout(this.execute, 100);
            console.log("frozen");
            return;
        }

        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command);
            command.execute(() => {
                this.execute()
            })

        }
        else {
            //console.log("全部命令执行完毕")
        }
    }

}
