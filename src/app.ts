import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, Vector3, HemisphericLight, CubeTexture, HavokPlugin, PhysicsMotionType, PhysicsAggregate, PhysicsShapeType, UniversalCamera, MeshBuilder } from "@babylonjs/core";
import { HavokPhysicsWithBindings }  from "@babylonjs/havok"
import { CustomLoadingScreen } from "./LoadingUI";
import { CharacterInput } from "./CharacterInput";
import { Character } from "./Character";
import { ShowRoom } from "./ShowRoom";

declare function HavokPhysics(): any;

class App {

    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _havok!: HavokPhysicsWithBindings;

    private _camera: UniversalCamera;
    private _light: HemisphericLight;

    private _showroom: ShowRoom;
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

        this._createScene();
        this._setCamera();
        this._setLight();

        this._enablePhysics().then((enabled) => {
            if(enabled) {
                // load assets.
                this._loadAssets();

                // hide the loading screen when assets are done loading.
                this._engine.hideLoadingUI();
            } else {
                console.log("No Physics Engine available.")
            }
        });
        
        this._characterInput = new CharacterInput(this._scene);

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

    private _createScene(): void {
        this._scene = new Scene(this._engine);
    }

    private _setCamera(): void {
        // selected universal cam because I want to move around the showroom.
        this._camera = new UniversalCamera("camera", new Vector3(-1.50,7.0,10), this._scene);
        this._camera.target = new Vector3(-1.5, 4, 3.6);
        this._camera.rotation = new Vector3(25/180 * Math.PI, Math.PI, 0);
        this._camera.attachControl(this._canvas);
        this._camera.minZ = 0.2;

        // This attaches the camera to the canvas
        this._camera.attachControl(this._canvas, true);
    }

    private _setLight(): void {
        this._light = new HemisphericLight("light1", new Vector3(0, 1, 0), this._scene);
        this._light.intensity = 0.7;
    }

    private async _enablePhysics(): Promise<boolean> {

        this._havok = await HavokPhysics();

        // initialize plugin
        const havokPlugin = new HavokPlugin(true, this._havok);

        this._scene.collisionsEnabled = true;

        // enable physics in the scene with a gravity
        return await this._scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);
    }

    private _loadAssets(): void {

        // create ground.
        this._createGround();

        // show sky
        this._loadSky();

        // load showroom.
        this._showroom = new ShowRoom(this._scene);
        this._showroom.load();

        // load character.
        this._character = new Character(this._scene, this._camera, this._characterInput);
        this._character.load();
    }

    private async _createGround() {
        var ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10}, this._scene);

        var groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX,
            { mass: 0}, this._scene);
        groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);
    }

    private async _loadSky() {
        var skyTexture = new CubeTexture("./textures/skybox/", this._scene);
        this._scene.createDefaultSkybox(skyTexture, true);
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