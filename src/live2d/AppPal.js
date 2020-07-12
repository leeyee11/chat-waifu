"use strict";
var LAppPal = (function () {
    function LAppPal() {
    }
    LAppPal.loadFileAsBytes = function (filePath, callback) {
        fetch(filePath)
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) { return callback(arrayBuffer, arrayBuffer.byteLength); });
    };
    LAppPal.getDeltaTime = function () {
        return this.s_deltaTime;
    };
    LAppPal.updateTime = function () {
        this.s_currentFrame = Date.now();
        this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
        this.s_lastFrame = this.s_currentFrame;
    };
    LAppPal.printMessage = function (message) {
        console.log(message);
    };
    LAppPal.emit = function(eventName, data = {}) {
        window.dispatchEvent(new Event(eventName, data));
    }
    LAppPal.lastUpdate = Date.now();
    LAppPal.s_currentFrame = 0.0;
    LAppPal.s_lastFrame = 0.0;
    LAppPal.s_deltaTime = 0.0;
    return LAppPal;
}());
exports.LAppPal = LAppPal;