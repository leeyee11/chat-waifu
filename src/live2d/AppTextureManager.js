"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var csmvector = require("@framework/type/csmvector");
var Csm_csmVector = csmvector.Live2DCubismFramework.csmVector;
var AppDelegate = require("./AppDelegate");
var LAppTextureManager = (function () {
    function LAppTextureManager() {
        this._textures = new Csm_csmVector();
    }
    LAppTextureManager.prototype.release = function () {
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            AppDelegate.gl.deleteTexture(ite.ptr().id);
        }
        this._textures = null;
    };
    LAppTextureManager.prototype.createTextureFromPngFile = function (fileName, usePremultiply, callback) {
        var _this = this;
        var _loop = function (ite) {
            if (ite.ptr().fileName == fileName &&
                ite.ptr().usePremultply == usePremultiply) {
                ite.ptr().img = new Image();
                ite.ptr().img.onload = function () { return callback(ite.ptr()); };
                ite.ptr().img.src = fileName;
                return { value: void 0 };
            }
        };
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            var state = _loop(ite);
            if (typeof state === "object")
                return state.value;
        }
        var img = new Image();
        img.onload = function () {
            var tex = AppDelegate.gl.createTexture();
            AppDelegate.gl.bindTexture(AppDelegate.gl.TEXTURE_2D, tex);
            AppDelegate.gl.texParameteri(AppDelegate.gl.TEXTURE_2D, AppDelegate.gl.TEXTURE_MIN_FILTER, AppDelegate.gl.LINEAR_MIPMAP_LINEAR);
            AppDelegate.gl.texParameteri(AppDelegate.gl.TEXTURE_2D, AppDelegate.gl.TEXTURE_MAG_FILTER, AppDelegate.gl.LINEAR);
            if (usePremultiply) {
                AppDelegate.gl.pixelStorei(AppDelegate.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            }
            AppDelegate.gl.texImage2D(AppDelegate.gl.TEXTURE_2D, 0, AppDelegate.gl.RGBA, AppDelegate.gl.RGBA, AppDelegate.gl.UNSIGNED_BYTE, img);
            AppDelegate.gl.generateMipmap(AppDelegate.gl.TEXTURE_2D);
            AppDelegate.gl.bindTexture(AppDelegate.gl.TEXTURE_2D, null);
            var textureInfo = new TextureInfo();
            if (textureInfo != null) {
                textureInfo.fileName = fileName;
                textureInfo.width = img.width;
                textureInfo.height = img.height;
                textureInfo.id = tex;
                textureInfo.img = img;
                textureInfo.usePremultply = usePremultiply;
                _this._textures.pushBack(textureInfo);
            }
            callback(textureInfo);
        };
        img.src = fileName;
    };
    LAppTextureManager.prototype.releaseTextures = function () {
        for (var i = 0; i < this._textures.getSize(); i++) {
            this._textures.set(i, null);
        }
        this._textures.clear();
    };
    LAppTextureManager.prototype.releaseTextureByTexture = function (texture) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).id != texture) {
                continue;
            }
            this._textures.set(i, null);
            this._textures.remove(i);
            break;
        }
    };
    LAppTextureManager.prototype.releaseTextureByFilePath = function (fileName) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).fileName == fileName) {
                this._textures.set(i, null);
                this._textures.remove(i);
                break;
            }
        }
    };
    return LAppTextureManager;
}());
exports.LAppTextureManager = LAppTextureManager;
var TextureInfo = (function () {
    function TextureInfo() {
        this.id = null;
        this.width = 0;
        this.height = 0;
    }
    return TextureInfo;
}());
exports.TextureInfo = TextureInfo;