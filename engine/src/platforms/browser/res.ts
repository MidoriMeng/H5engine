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
            var result = preloadedResources.get(path);
            if (!result) {
                console.log("wrong path of image: " + path);
                return null;
            }

            result.data = new Image();
            result.data.src = RESOURCE_PATH + path;
            return result;
        }

        export function loadConfig(onCompleted: Function) {
            var length = preloadJson.images.length;
            preloadedResources = new Map<string, Texture>();
            var completed = 0;
            //按照json内容生成texture
            preloadJson.images.forEach((config) => {
                //生成的texture只有宽高信息，没有data信息
                var texture = new Texture();
                texture.width = config.width;
                texture.height = config.height;
                preloadedResources.set(config.name, texture);
                //生成真实texture
                /*getResAsync(config.name).then((value) => {
                    preloadedResources.set(config.name, value as Texture);
                    completed++;
                    if (completed == length)
                        onCompleted();
                });*/
            });
            onCompleted();
        }

        var preloadJson = {
            "images": [
                {
                    "name": "Actor1.jpg",
                    "width": 144, "height": 144
                },
                {
                    "name": "Actor1_01.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_02.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_03.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "actor1_05.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "actor1_06.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_07.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_08.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_09.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_10.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_11.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_12.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor1_13.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Actor2_1.png",
                    "width": 182, "height": 202
                },
                {
                    "name": "atk_up.png",
                    "width": 32, "height": 32
                },
                {
                    "name": "Balloon_exclamation.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Balloon_exclamation_gray.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Balloon_questionMark.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "Balloon_questionMark_gray.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "cloth.png",
                    "width": 32, "height": 32
                },
                {
                    "name": "empty.png",
                    "width": 1, "height": 1
                },
                {
                    "name": "emptyEquip.png",
                    "width": 32, "height": 32
                },
                {
                    "name": "error.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "jewel_blue.png",
                    "width": 32, "height": 32
                },
                {
                    "name": "jewel_green.png",
                    "width": 32, "height": 32
                },
                {
                    "name": "mhp_up.png",
                    "width": 32, "height": 32
                },
                {
                    "name": "outside_bg_grass.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "outside_sc_shrub.png",
                    "width": 48, "height": 48
                },
                {
                    "name": "skill_blizzard.png",
                    "width": 32, "height": 32
                },
                {
                    "name": "skill_chop.png",
                    "width": 32, "height": 3248
                },
                {
                    "name": "Slash.png",
                    "width": 121, "height": 132
                },
                {
                    "name": "Slime.png",
                    "width": 102, "height": 85
                },
                {
                    "name": "sword.png",
                    "width": 32, "height": 32
                }
            ]
        }
    }

}