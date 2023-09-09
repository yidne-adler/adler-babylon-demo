import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, Vector3, HemisphericLight, SceneLoader, CubeTexture, Mesh, UniversalCamera, AbstractMesh } from "@babylonjs/core";

class App {

    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;

    private _camera: UniversalCamera;
    private _light: HemisphericLight;

    private _showroom;
    private _character: Mesh;

    constructor() {
        this._canvas = this._createCanvas();
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

        // show loading screen
        this._engine.displayLoadingUI();

        this._setCamera();
        this._setLight();

        this._loadAssets();

        this._showInspector();

        // run the main render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }
    
    private _createCanvas(): HTMLCanvasElement{
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        return canvas;
    }

    private _setCamera(): void {
        // selected universal cam because I want to move around the showroom.
        this._camera = new UniversalCamera("camera", new Vector3(0,5,3), this._scene)
        this._camera.attachControl(this._canvas);
        
    }

    private _setLight(): void {
        this._light = new HemisphericLight("light1", new Vector3(0, 1, 0), this._scene);
    }

    private async _loadAssets() {

        // load showroom
        this._showroom = await this._loadShowRoom();
        console.log(this._showroom);

        // load character
        SceneLoader.ImportMeshAsync(null, "./models/", "character.glb", this._scene).then((res) => {
            this._character = res.meshes[0][0];
        });

        // show sky
        var skyTexture = new CubeTexture("./textures/skybox/", this._scene);
        this._scene.createDefaultSkybox(skyTexture, true, 1000);

        this._engine.hideLoadingUI();
    }

    private async _loadShowRoom(): Promise<any> {

        const result = await SceneLoader.ImportMeshAsync(null, "./models/atoms/", "classic-room.glb", this._scene);

        return result.meshes[0];
    }

    private _showInspector(): void {
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });
    }
}

new App();