import { AbstractMesh, AnimationGroup, Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, SceneLoader, UniversalCamera, Vector3 } from "@babylonjs/core";
import { CharacterInput } from "./CharacterInput";

export class Character {

    private _scene: Scene;
    private _camera: UniversalCamera;

    private _input: CharacterInput;

    private _walkingSpeed = 0.1;
    private _backwardsWalkingSpeed = 0.01;
    private _rotationSpeed = 0.05;

    private _root: AbstractMesh;
    private _walkAnim: AnimationGroup;

    constructor(scene: Scene, camera: UniversalCamera, input: CharacterInput){
        this._scene = scene;
        this._input = input;
        this._camera = camera;
    }

    public async load(): Promise<void> {

        const res = await SceneLoader.ImportMeshAsync("", "./models/", "character.glb", this._scene);

        this._root = res.meshes[0];
        this._root.checkCollisions = true;
        this._root.scaling.setAll(0.8);

        // lock the camera to the character.
        this._camera.lockedTarget = this._root;

        this._walkAnim = this._scene.getAnimationGroupByName("Walk");

        this._root.getChildMeshes().forEach(m => {
            var agg = new PhysicsAggregate(m, 
                PhysicsShapeType.CONVEX_HULL, 
                { mass: 0, startAsleep: true, restitution: 0.75 }, 
                this._scene
            );

            agg.body.setMotionType(PhysicsMotionType.ANIMATED);
        });

        this._scene.onBeforeRenderObservable.add(() => {
            this._controlMovement();
        });
    }

    private _controlMovement() {

        if (this._input.inputMap["w"]) {
            this._root.moveWithCollisions(this._root.forward.scaleInPlace(this._walkingSpeed));
        }

        if (this._input.inputMap["s"]) {
            this._root.moveWithCollisions(this._root.forward.scaleInPlace(-this._backwardsWalkingSpeed));
        }

        if (this._input.inputMap["a"]) {
            this._root.rotate(Vector3.Up(), -this._rotationSpeed);
        }
        
        if (this._input.inputMap["d"]) {
            this._root.rotate(Vector3.Up(), this._rotationSpeed);
        }
        
        if (this._input.inputMap["b"]) {}

        if (this._input.keydown && this._walkAnim) {
            // Walk
            this._walkAnim.start(true, 1.0, this._walkAnim.from, this._walkAnim.to, false);
        } else {
            this._walkAnim.stop();
        }
    }
}