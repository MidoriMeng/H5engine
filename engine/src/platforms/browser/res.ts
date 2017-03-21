namespace engine {
    export namespace RES {
        var RESOURCE_PATH = "././Resources/";
        var preloadedResources: Map<string, Texture>;

        function loadTexture(path: string) {
            return new Promise(function (resolve, reject) {
                try {
                    var result = new Image();
                    result.src = RESOURCE_PATH + path;
                    console.log(RESOURCE_PATH + path);
                    result.onload = () => {
                        resolve(result);
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }

        export async function getResAsync(path: string) {
            return await loadTexture(path);
        }

        export function getRes(path: string): Texture {
            if (path != null) {
                var result = new Texture();
                result.data = new Image();
                result.data.src = RESOURCE_PATH + path;
                console.log(RESOURCE_PATH + path);
                return result;
            }
            else
                console.log("null path");
        }

        export function loadConfig(onCompleted: Function) {
            var length = preloadJson.resources.length;
            preloadedResources = new Map<string, Texture>();
            var completed = 0;
            preloadJson.resources.forEach((config) => {
                getResAsync(config.name).then((value) => {
                    preloadedResources.set(config.name, value as Texture);
                    completed++;
                    console.log(completed);
                    if (completed == length)
                        onCompleted();
                });
            });
            // return;
        }

        var preloadJson = {
            "resources": [
                {
                    "name": "Actor1.jpg",
                    "type": "image"
                },
                {
                    "name": "Actor1_01.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_02.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_03.png",
                    "type": "image"
                },
                {
                    "name": "actor1_05.png",
                    "type": "image"
                },
                {
                    "name": "actor1_06.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_07.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_08.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_09.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_10.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_11.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_12.png",
                    "type": "image"
                },
                {
                    "name": "Actor1_13.png",
                    "type": "image"
                },
                {
                    "name": "Actor2_1.png",
                    "type": "image"
                },
                {
                    "name": "atk_up.png",
                    "type": "image"
                },
                {
                    "name": "Balloon_exclamation.png",
                    "type": "image"
                },
                {
                    "name": "Balloon_exclamation_gray.png",
                    "type": "image"
                },
                {
                    "name": "Balloon_questionMark.png",
                    "type": "image"
                },
                {
                    "name": "Balloon_questionMark_gray.png",
                    "type": "image"
                },
                {
                    "name": "cloth.png",
                    "type": "image"
                },
                {
                    "name": "empty.png",
                    "type": "image"
                },
                {
                    "name": "emptyEquip.png",
                    "type": "image"
                },
                {
                    "name": "error.png",
                    "type": "image"
                },
                {
                    "name": "jewel_blue.png",
                    "type": "image"
                },
                {
                    "name": "jewel_green.png",
                    "type": "image"
                },
                {
                    "name": "mhp_up.png",
                    "type": "image"
                },
                {
                    "name": "outside_bg_grass.png",
                    "type": "image"
                },
                {
                    "name": "outside_sc_shrub.png",
                    "type": "image"
                },
                {
                    "name": "skill_blizzard.png",
                    "type": "image"
                },
                {
                    "name": "skill_chop.png",
                    "type": "image"
                },
                {
                    "name": "Slash.png",
                    "type": "image"
                },
                {
                    "name": "Slime.png",
                    "type": "image"
                },
                {
                    "name": "sword.png",
                    "type": "image"
                }
            ]
        }
    }

}