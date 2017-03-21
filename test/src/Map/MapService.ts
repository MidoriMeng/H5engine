
namespace MAP {
    export class MapService extends engine.DisplayObjectContainer {
        private static instance;
        maps: Map[];
        curMap: Map;
        curNPCList: Array<NPC>;
        gameStateMachine: GameStateMachine;
        constructor() {
            super();
            this.touchEnabled = true;
            //map 01

            this.curNPCList = new Array<NPC>();
            this.addEventListener(engine.TouchEvent.CLICK, (e)=>this.onTap(e));
        }

        static getInstance(): MapService {
            if (MapService.instance == null)
                MapService.instance = new MapService();
            return MapService.instance;
        }

        loadMachine(machine) {
            this.gameStateMachine = machine;
        }

        onTap(event: engine.TouchEvent) {
            if (! (event.target.parent instanceof NPC)) {
                console.log("tap@mapservice" + event.target.parent);
                Player.getInstance().Move(this.gameStateMachine, new Vector2(event.stageX, event.stageY), null);
            }
        }

        loadNPCs() {
            var appearances = {
                NORTH: engine.RES.getRes("Actor1_12.png"), SOUTH: engine.RES.getRes("Actor1_02.png"),
                EAST: engine.RES.getRes("Actor1_09.png"), WEST: engine.RES.getRes("actor1_06.png")
            };
            var npc_001 = new NPC("001", "npc1",
                appearances,
                DIRECTION.SOUTH, "Actor1.jpg");
            npc_001.setPosition(new Vector2_p48(5, 5));
            var npc_002 = new NPC("002", "npc2",
                appearances,
                DIRECTION.SOUTH, "Actor1.jpg");
            npc_002.setPosition(new Vector2_p48(8, 8));
            this.curNPCList.push(npc_001);
            this.curNPCList.push(npc_002);
        }

        loadMap() {
            this.curMap = new Map(tilemapJson[SCENE_TYPE.outside][0], this.curNPCList);
            this.addChild(this.curMap);
        }

        public getNPC(id: string): NPC {
            for (var index in this.curNPCList) {
                if (this.curNPCList[index].NPCid == id)
                    return this.curNPCList[index];
            }
        }
    }
}