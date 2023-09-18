import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, Vector3, HemisphericLight, SceneLoader, CubeTexture, Mesh, UniversalCamera, ArcRotateCamera, ActionManager, ExecuteCodeAction, AnimationGroup } from "@babylonjs/core";
import { CustomLoadingScreen } from "./LoadingUI";
import { CharacterInput } from "./InputController";
import { Character } from "./CharacterController";

class App {

    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;

    private _camera: UniversalCamera;
    private _light: HemisphericLight;

    private _showroom;
    private _character: Character;
    private _characterInput: CharacterInput;


    constructor() {
        // create canvas.
        this._createCanvas();

        // create engine & scene.
        this._engine = new Engine(this._canvas, true);

        // set custom loading screen.
        const loadingScreen = new CustomLoadingScreen("loading");
        this._engine.loadingScreen = loadingScreen;

        // show loading screen
        this._engine.displayLoadingUI();

        this._scene = new Scene(this._engine);

        this._setCamera();
        this._setLight();
        
        this._characterInput = new CharacterInput(this._scene);

        // load assets.
        this._loadAssets().then((done) => {
            if(done) {
                // hide the loading screen when assets are done loading.
                this._engine.hideLoadingUI();
            }
        });

        this._showInspector();

        // run the main render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        })

        // Watch for browser/canvas resize events
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
    
    private _createCanvas(): HTMLCanvasElement {

        //Commented out for development
        document.documentElement.style["overflow"] = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        //create the canvas html element and attach it to the webpage
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "canvas";
        document.body.appendChild(this._canvas);

        return this._canvas;
    }

    private _setCamera(): void {
        // selected universal cam because I want to move around the showroom.
        this._camera = new UniversalCamera("camera", new Vector3(-1.50,7.0,10), this._scene);
        this._camera.target = new Vector3(-1.5, 4, 3.6);
        this._camera.rotation = new Vector3(25/180 * Math.PI, Math.PI, 0);
        this._camera.attachControl(this._canvas);
    }

    private _setLight(): void {
        this._light = new HemisphericLight("light1", new Vector3(0, 1, 0), this._scene);
    }

    private async _loadAssets() : Promise<boolean> {

        // load showroom.
        this._showroom = await this._loadShowRoom();

        // load character.
        this._loadCharacter();
  
        // show sky
        var skyTexture = new CubeTexture("./textures/skybox/", this._scene);
        this._scene.createDefaultSkybox(skyTexture, true, 1000);

        return true;
    }

    private async _loadShowRoom(): Promise<any> {

        const result = await SceneLoader.ImportMeshAsync("", "./models/atoms/", "classic-room.glb", this._scene);
        result.meshes[0].checkCollisions = true;

        return result.meshes[0];
    }

    private async _loadCharacter() {

        const res = await SceneLoader.ImportMeshAsync("", "./models/", "character.glb", this._scene);

        const avatar: Mesh = res.meshes[0] as Mesh;

        this._character = new Character(this._scene, this._camera, avatar, 
            this._scene.getAnimationGroupByName("Walk"), this._characterInput);
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