/*
class StateMachine {
    curState: State;
    constructor(firstState: State) {
        this.curState = firstState;
        this.curState.onInit();
    }
    public runMachine(...a): boolean {
        this.curState.onRun();
        var newState: State = this.curState.onCheck();
        if (newState != this.curState) {
            // console.log("switch to new state");
            this.curState.onExit();
            this.curState = newState;
            this.curState.onInit();
        }
        return false;
    }
    public switchState(target: State) {
        this.curState.onExit();
        target.onInit();
        this.curState = target;
    }
}*/
class GameStateMachine {
    constructor() {
        this.stateList = [];
        this.runMachine = (deltaTime) => {
            if (this.stateList) {
                for (var index in this.stateList) {
                    this.stateList[index].onRun(deltaTime);
                    var newState = this.stateList[index].onCheck();
                    if (newState != this.stateList[index]) {
                        // console.log("switch to new state");
                        this.stateList[index].onExit();
                        this.stateList[index] = newState;
                        this.stateList[index].onInit();
                    }
                }
            }
            return false;
        };
        //initialize all state machines
        //this.stateLists[0] =
        //this.curState.onInit();
    }
    addState(state) {
        this.stateList[this.stateList.length] = state;
        state.onInit();
    }
    switchState(current, target) {
        //console.log("switch state");
        for (var index in this.stateList) {
            if (this.stateList[index] == current) {
                this.stateList[index].onExit();
                target.onInit();
                this.stateList[index] = target;
            }
        }
    }
}
