namespace engine {
    export namespace RES {
        var RESOURCE_PATH = "././Resources/";

        export function getResAsync(path: string) {
            return new Promise(function (resolve, reject) {
                var result = new Image();
                result.src = RESOURCE_PATH + path;
                result.onload = () => {
                    resolve(result);
                }
            });
        }

        export function getRes(path: string): Texture {
            var result = new Texture();
            result.data = new Image();
            result.data.src = RESOURCE_PATH + path;
            return result;
        }

        export function loadConfig(json: { resources: { name, type }[] }) {
            json.resources[0].name
            var tex = new Texture();
            tex.data = new Image();
            getResAsync(json.resources[0].name).then((value) => {
                tex.width = value.width;
            })

        }
    }

}