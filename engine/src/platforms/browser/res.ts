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

        export function loadJSON(url: string, callback: (loadedObj) => void) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', url, true);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                // 通信成功时，状态值为4
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        //成功读取，生成obj
                        var obj = eval('(' + xmlhttp.responseText + ')');
                        callback(obj);
                    } else {
                        console.error(xmlhttp.statusText);
                    }
                }
            };
            xmlhttp.onerror = function (e) {
                console.error(xmlhttp.statusText);
            };
        }
        
        export function getRes(path: string, onload?: Function): Texture {
            var result = preloadedResources.get(path);
            if (!result) {
                console.log("wrong path of image: " + path);
                return null;
            }

            result.data = new Image();
            result.data.src = RESOURCE_PATH + path;

            if (onload)
                result.data.onload = onload;
            return result;
        }

        export function loadConfig(onCompleted: Function) {
            type a = {};
            loadJSON("././Resources/resources.json", (obj) => { 
                var loadedObj = obj as preloadJsonType;
                var length = loadedObj.images.length;
                preloadedResources = new Map<string, Texture>();
                var completed = 0;
                //按照json内容生成texture
                loadedObj.images.forEach((config) => {
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
            });

        }

        type preloadJsonType = { "images": { "name": string, "width": number, "height": number }[] };
    }

}