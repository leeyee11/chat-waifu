"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cubismmatrix44 = require("@framework/math/cubismmatrix44");
var csmvector = require("@framework/type/csmvector");
var Csm_csmVector = csmvector.Live2DCubismFramework.csmVector;
var Csm_CubismMatrix44 = cubismmatrix44.Live2DCubismFramework.CubismMatrix44;
var AppModal = require("./AppModal");
var AppPal = require("./AppPal");
var AppDelegate = require("./AppDelegate");
var AppDefine = __importStar(require("./AppDefine"));
exports.s_instance = null;
var LAppLive2DManager = (function () {
    function LAppLive2DManager() {
        this._finishedMotion = function (self) {
            AppPal.LAppPal.printMessage('Motion Finished:');
            console.log(self);
        };
        this._viewMatrix = new Csm_CubismMatrix44();
        this._models = new Csm_csmVector();
        this._sceneIndex = 0;
        this.changeScene(this._sceneIndex);
    }
    LAppLive2DManager.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppLive2DManager();
        }
        return exports.s_instance;
    };
    LAppLive2DManager.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance = void 0;
        }
        exports.s_instance = null;
    };
    LAppLive2DManager.prototype.getModel = function (no) {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }
        return null;
    };
    LAppLive2DManager.prototype.releaseAllModel = function () {
        for (var i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }
        this._models.clear();
    };
    LAppLive2DManager.prototype.onDrag = function (x, y) {
        for (var i = 0; i < this._models.getSize(); i++) {
            var model = this.getModel(i);
            if (model) {
                model.setDragging(x, y);
            }
        }
    };
    LAppLive2DManager.prototype.onMessage = function (message) {
        AppPal.LAppPal.printMessage("[APP]received message: " + message + ".");
        for (var i = 0; i < this._models.getSize(); i++) {
            var model = this.getModel(i);
            model.setDragging(1, 0);
            model.setRandomExpression();
        }
    }
    LAppLive2DManager.prototype.onTap = function (x, y) {

        if (AppDefine.DebugLogEnable) {
            AppPal.LAppPal.printMessage("[APP]tap point: {x: " + x.toFixed(2) + " y: " + y.toFixed(2) + "}");
        }
        for (var i = 0; i < this._models.getSize(); i++) {
            const [sx, sy] = [x / AppDefine.scaleFactor, y / AppDefine.scaleFactor];

            if (this._models.at(i).hitTest(AppDefine.HitAreaNameHead, sx, sy)) {
                if (AppDefine.DebugLogEnable) {
                    AppPal.LAppPal.printMessage("[APP]hit area: [" + AppDefine.HitAreaNameHead + "]");
                }
                AppPal.LAppPal.emit(`hit:${AppDefine.HitAreaNameHead}`, { x, y })
                this._models.at(i).setDragging(1, -2);
                this._models.at(i).setRandomExpression();
            }
            else if (this._models.at(i).hitTest(AppDefine.HitAreaNameBody, sx, sy)) {
                if (AppDefine.DebugLogEnable) {
                    AppPal.LAppPal.printMessage("[APP]hit area: [" + AppDefine.HitAreaNameBody + "]");
                }
                AppPal.LAppPal.emit(`hit${AppDefine.HitAreaNameBody}`, { x, y })
                this._models.at(i).setDragging(0, 0);
                this._models
                    .at(i)
                    .startRandomMotion(AppDefine.MotionGroupTapBody, AppDefine.PriorityNormal, this._finishedMotion);
            }
        }
    };
    LAppLive2DManager.prototype.onUpdate = function () {
        var projection = new Csm_CubismMatrix44();
        var width = AppDelegate.canvas.width, height = AppDelegate.canvas.height;
        projection.scale(1.0 * AppDefine.scaleFactor, AppDefine.scaleFactor * width / height);
        if (this._viewMatrix != null) {
            projection.multiplyByMatrix(this._viewMatrix);
        }
        var saveProjection = projection.clone();
        var modelCount = this._models.getSize();
        for (var i = 0; i < modelCount; ++i) {
            var model = this.getModel(i);
            projection = saveProjection.clone();
            model.update();
            model.draw(projection);
        }
    };
    LAppLive2DManager.prototype.nextScene = function () {
        var no = (this._sceneIndex + 1) % AppDefine.ModelDirSize;
        this.changeScene(no);
    };
    LAppLive2DManager.prototype.changeScene = function (index) {
        this._sceneIndex = index;
        if (AppDefine.DebugLogEnable) {
            AppPal.LAppPal.printMessage("[APP]model index: " + this._sceneIndex);
        }
        var model = AppDefine.ModelDir[index];
        var modelPath = AppDefine.ResourcesPath + model + '/';
        var modelJsonName = AppDefine.ModelDir[index];
        modelJsonName += '.model3.json';
        this.releaseAllModel();
        this._models.pushBack(new AppModal.LAppModel());
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    };
    return LAppLive2DManager;
}());
exports.LAppLive2DManager = LAppLive2DManager;