try {
    ; (function () {
        var setAttribute = Image.prototype.setAttribute;
        Image.prototype.setAttribute = function () {
            if (arguments[0] == "role" && arguments[1] == "presentation") {
                this.crossOrigin = "Anonymous";
            }
            setAttribute.apply(this, arguments);
        }
    })();
} catch (e) {
    console.log(e)
}
; (function () {
    let PrintMap = {};
    let LAYER_COUNT = 0;
    let LAYER_LENGTH = 0;
    window.MapToImg = PrintMap;

    PrintMap.excute = function (map, mime, callback) {
        let canvas = document.createElement("canvas");
        // document.body.appendChild(canvas)
        let broz = SuperMap.Browser.name;
        if (!canvas.getContext || (broz == 'msie' && !canvas.msToBlob)) {
            alert("您的浏览器版本太低，请升级。");
            return;
        }
        if (document.location.toString().match(/file:\/\//)) {
            alert("该功能需要在服务器中发布出来后，方可使用");
            return;
        }
        LAYER_COUNT = 0;

        let layers = map.layers.concat([]);

        //layers排序，将markers放到最上边
        let layers1 = [];
        for (let i = 0; i < layers.length;) {
            if (layers[i].CLASS_NAME == "SuperMap.Layer.Markers") {
                let templayer = layers.splice(i, 1);
                layers1.push(templayer[0]);
            } else if (layers[i].CLASS_NAME == "SuperMap.Layer.GOAnimationLayer" ||
                layers[i].CLASS_NAME == "SuperMap.Layer.PlottingLayer.Temporary" ||
                (layers[i].CLASS_NAME == "SuperMap.Layer.PlottingLayer" && !layers[i].getVisibility()) ||
                layers[i].CLASS_NAME == "SuperMap.Layer.PlottingLayer.RootContainer") {
                //处理标绘图层的动画图层和图层不显示
                layers.splice(i, 1);
            } else {
                i++;
            }
        }
        layers = layers.concat(layers1);

        layers.forEach(layer => {
            console.log(layer.CLASS_NAME, "layer", layer)
        });

        LAYER_LENGTH = layers.length;
        let imgUrls = [];
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            if (layer.CLASS_NAME === "SuperMap.Layer.Google") {
                draw(getGoogleLayerData(layer, map), i, imgUrls, map, mime, callback);
            }
            if (layer.CLASS_NAME === "SuperMap.Layer.TiledDynamicRESTLayer") {
                if (!layer.useCanvas) {
                    draw(getImgLayerData(layer, map), i, imgUrls, map, mime, callback);
                }
                else {
                    draw(getCanvasLayerData(layer), i, imgUrls, map, mime, callback);
                }
            }
            else if (layer.CLASS_NAME === "SuperMap.Layer.Markers") {
                draw(getImgLayerData(layer, map), i, imgUrls, map, mime, callback);
            }
            else if (layer.CLASS_NAME === "SuperMap.Layer.Vector") {
                getVectorLayerData(layer, map, function (imgUrls, i) {
                    return function (img) {
                        draw(img, i, imgUrls, map, mime, callback);
                    }
                }(imgUrls, i))
            }
            else if (layer.CLASS_NAME === "SuperMap.Layer.PlottingLayer") {
                getPlottingLayerData(layer, map, function (imgUrls, i) {
                    return function (img) {
                        draw(img, i, imgUrls, map, mime, callback);
                    }
                }(imgUrls, i))
            }
        }
    };

    function draw(img, i, imgUrls, map, mime, callback) {
        imgUrls[i] = img;
        LAYER_COUNT++;

        console.log(LAYER_COUNT >= LAYER_LENGTH);
        if (LAYER_COUNT >= LAYER_LENGTH) {
            let canvas = document.createElement("canvas");
            let size = map.getSize();
            canvas.height = size.h;
            canvas.width = size.w;
            let ctx = canvas.getContext("2d");

            canvas.style.position = "relative";
            canvas.style.border = "1px solid #4c4c4c";

            //document.body.appendChild(canvas);

            let panel = document.createElement("div");

            // panel.style.position = "absolute";
            panel.style.left = "0px";
            panel.style.top = "0px";
            panel.style.height = "100%";
            panel.style.width = "100%";
            // panel.style.visibility = 'hidden';
            // panel.style.background = "#e6e8eb";
            panel.style.background = "#ffffff";
            // document.body.appendChild(panel);


            let buttonPanel = document.createElement("div");
            buttonPanel.style.position = "relative";
            panel.appendChild(buttonPanel);
            panel.appendChild(canvas);

            window.setTimeout(function () {
                if (mime.indexOf("jpg") >= 0 || mime.indexOf("jpeg") >= 0) {
                    ctx.fillStyle = "#e5e3df";
                    ctx.fillRect(0, 0, size.w, size.h);
                }
                for (let i = 0; i < imgUrls.length; i++) {
                    ctx.drawImage(imgUrls[i], 0, 0);
                }

                callback(canvas.toDataURL(mime));
            }, 30);
        }
    }

    window.getGoogleLayerDataFn = function () {
        getGoogleLayerData(mapData.layers[0], mapData,);
    }

    function getGoogleLayerData(layer, map) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let size = map.getSize();
        canvas.height = size.h;
        canvas.width = size.w;

        var box = document.getElementsByClassName("gm-style")[0]
        var list = [];
        if (box) {
            list = box.getElementsByTagName("img");
        }
        var item = null;
        var parentNode = null;
        var width = 256;
        var height = 256;
        var middleX = canvas.width / 2;
        var middleY = canvas.height / 2;

        var parentParent = null;
        var PPtransform = [];
        var translateX = 0;
        var translateY = 0;
        if (list[0]) {
            parentParent = list[0].parentNode.parentNode
            if (parentParent) {
                PPtransform = (parentParent.style.transform || "").replace(/\)/g, "").split(",");
                if (PPtransform.length == 6) {
                    translateX = PPtransform[4] * 1 || 0;
                    translateY = PPtransform[5] * 1 || 0;;
                }
            }
        }

        // console.log("google img", list.length, box.innerHTML.replace(/position/g, "").replace(/absolute/g, "").replace(/left/g, "").replace(/top/g, "").replace(/height/g, "").replace(/width/g, "").replace(/\d*px/g, ""));
        for (var i = 0; i < list.length; i++) {
            item = list[i];
            parentNode = item.parentNode;
            // console.log(item.complete)
            if (item.complete == false) {
                // console.log("onerror")
            }
            item.onload = function () {
                // console.log("onload")
            }
            ctx.drawImage(item, parseInt(parentNode.style.left) + middleX + translateX, parseInt(parentNode.style.top) + middleY + translateY, width, height);
        }

        var outputDOM = document.getElementById("MapToImgOutput");
        if (!!outputDOM == false) {
            outputDOM = document.createElement("div");
            outputDOM.id = "MapToImgOutput";
            document.body.appendChild(outputDOM);
        }
        outputDOM.innerHTML = "";
        // outputDOM.appendChild(canvas);

        console.log(layer)
        let imageUrl = canvas.toDataURL("image/png");
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        // console.log(imageUrl, "imageUrl") // ??
        return img;
    }

    //截取图片图层
    function getImgLayerData(layer, map) {
        let div = layer.div;
        let pdiv = div.parentNode;
        let offsetX = parseInt(pdiv.style.left.replace(/px/, ""));
        let offsetY = parseInt(pdiv.style.top.replace(/px/, ""));

        let canvas = document.createElement("canvas");
        let size = map.getSize();
        canvas.height = size.h;
        canvas.width = size.w;
        // console.log(size.h, size.w, offsetX, offsetY);
        let ctx = canvas.getContext("2d");

        canvas.style.position = "absolute";
        canvas.style.left = "5px";
        canvas.style.top = "600px";
        canvas.style.border = "1px solid #f00";

        // document.body.appendChild(canvas);

        let divs = div.getElementsByTagName("div");
        // console.log(layer.CLASS_NAME, divs.length)
        for (let i = 0; i < divs.length; i++) {
            let div1 = divs[i];
            if (div1.style.display !== "none") {
                let left = parseInt(div1.style.left.replace(/px/, ""));
                let top = parseInt(div1.style.top.replace(/px/, ""));
                let img = div1.getElementsByTagName("img")[0];
                // console.log(img, "img------")
                let imgWidth = img.style.width;
                let imgHeight = img.style.height;
                let imgW = null, imgH = null;
                if (imgWidth != null || imgWidth !== "") {
                    imgW = parseInt(imgWidth.replace(/px/, ""));
                }
                if (imgHeight != null || imgHeight !== "") {
                    imgH = parseInt(imgHeight.replace(/px/, ""));
                }
                try {
                    if (imgW != null && imgH != null) {
                        ctx.drawImage(img, left + offsetX, top + offsetY, imgW, imgH);
                    }
                    else {
                        ctx.drawImage(img, left + offsetX, top + offsetY);
                    }
                } catch (e) { console.error(e) }
            }
        }

        let imageUrl = canvas.toDataURL("image/png");
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        return img;
    }
    //截取canvas图层
    function getCanvasLayerData(layer) {
        let div = layer.div;
        let canvas0 = div.getElementsByTagName("canvas")[0];
        let imageUrl = canvas0.toDataURL("image/png");
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;

        return img;
    }
    //截取Vector图层
    function getVectorLayerData(layer, map, callback) {
        let printLayer,
            strategies = [],
            features1 = [],
            features = layer.features,
            layerStrategies = layer.strategies;
        //GeoText无法截图问题修复
        if (layerStrategies) {
            for (let i = 0; i < layerStrategies.length; i++) {
                if (layerStrategies[i].CLASS_NAME === "SuperMap.Strategy.GeoText") {
                    strategies.push(layerStrategies[i].clone());
                } else {
                    strategies.push(layerStrategies[i]);
                }
            }
            printLayer = new SuperMap.Layer.Vector("PRINT_LAYER", { strategies: strategies, visibility: true, renderers: ["Canvas"] });
        } else {
            printLayer = new SuperMap.Layer.Vector("PRINT_LAYER", { visibility: true, renderers: ["Canvas"] });
        }
        map.addLayer(printLayer);
        for (let j = 0; j < features.length; j++) {
            let feature = features[j];
            let feature1 = new SuperMap.Feature.Vector();
            feature1.geometry = feature.geometry.clone();
            feature1.style = feature.style;

            features1.push(feature1);
        }
        if (layer.style) {
            printLayer.style = layer.style;
        }

        printLayer.setOpacity(0);
        printLayer.addFeatures(features1);

        window.setTimeout(function (printLayer, map, callback) {
            return function () {
                let div = printLayer.div;
                let canvas1 = div.getElementsByTagName("canvas")[0];
                let cxt1 = canvas1.getContext("2d");
                let imageUrl = canvas1.toDataURL("image/png");

                map.removeLayer(printLayer);
                printLayer.destroy();

                let img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = imageUrl;

                callback(img);
            }
        }(printLayer, map, callback), 30);
    }

    //截取Plotting图层
    function getPlottingLayerData(layer, map, callback) {
        let printLayer,
            features1 = [],
            features = layer.features;

        printLayer = new SuperMap.Layer.PlottingLayer("PRINT_LAYER", layer.serverUrl, { visibility: true, renderers: ["Canvas"] });
        printLayer.spatialAnalystUrl = layer.spatialAnalystUrl;

        map.addLayer(printLayer);
        for (let j = 0; j < features.length; j++) {
            if (features[j].geometry instanceof SuperMap.Geometry.PlottingGeometry) {
                let feature = features[j];
                let feature1 = SuperMap.Plot.PlottingUtil.copyFeature(feature);
                features1.push(feature1);
            } else {
                let feature1 = new SuperMap.Feature.Vector();
                feature1.geometry = features[j].geometry.clone();
                feature1.style = features[j].style;
                features1.push(feature1);
            }
        }
        if (layer.style) {
            printLayer.style = layer.style;
        }

        printLayer.setOpacity(0);
        printLayer.addFeatures(features1);

        window.setTimeout(function (printLayer, map, callback) {
            return function () {
                let div = printLayer.div;
                let canvas1 = div.getElementsByTagName("canvas")[0];
                let cxt1 = canvas1.getContext("2d");
                let imageUrl = canvas1.toDataURL("image/png");

                map.removeLayer(printLayer);
                printLayer.destroy();

                let img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = imageUrl;


                callback(img);
            }
        }(printLayer, map, callback), 30);
    }
})();
