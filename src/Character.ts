import { AbstractMesh, AnimationGroup, Axis, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, SceneLoader, UniversalCamera, Vector3 } from "@babylonjs/core";
import { CharacterInput } from "./CharacterInput";

export class Character {

    private _scene: Scene;
    private _camera: UniversalCamera;

    private _input: CharacterInput;

    private _walkingSpeed: number = 1;
    private _rotationSpeed: number = 0.5;
    private _dampling: number = 500;

    private _root: AbstractMesh;
    private _aggregate: PhysicsAggregate;
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
        this._root.position = new Vector3(0, -1, 0);
        this._root.rotation = new Vector3(0, 0, 0);

        // lock the camera to the character.
        this._camera.lockedTarget = this._root;

        this._walkAnim = this._scene.getAnimationGroupByName("Walk");

        // collision box.
        // TODO: change it to capsule.
        var box = MeshBuilder.CreateBox("character_cb", {size: 1, height: 2, width: 1}, this._scene);
        box.addChild(this._root);
        box.visibility = 0.0;
        box.position.y = 1;

        this._aggregate = new PhysicsAggregate(box,
            PhysicsShapeType.BOX,
            { mass: 10, restitution: 0.01 },
            this._scene
        );
        this._aggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

        this._scene.onBeforeRenderObservable.add(() => {
            this._controlMovement();
        });
    }

    private _controlMovement() {

        if (this._input.inputMap["w"]) {
            var frontVector = this._aggregate.transformNode.getDirection(Axis.Z);
            this._aggregate.body.setLinearVelocity(frontVector.scale(this._walkingSpeed));
        }

        if (this._input.inputMap["s"]) {
            var frontVector = this._aggregate.transformNode.getDirection(Axis.Z);
            this._aggregate.body.setLinearVelocity(frontVector.scale(-this._walkingSpeed));
        }

        if (this._input.inputMap["a"]) {
            var rotationAxis = new Vector3(0, -1, 0);
            this._aggregate.body.setAngularDamping(this._dampling);
            this._aggregate.body.setAngularVelocity(rotationAxis.scale(this._rotationSpeed));
        }
        
        if (this._input.inputMap["d"]) {
            var rotationAxis = new Vector3(0, 1, 0);
            this._aggregate.body.setAngularDamping(this._dampling);
            this._aggregate.body.setAngularVelocity(rotationAxis.scale(this._rotationSpeed));
        }

        if (this._input.keydown && this._walkAnim) {
            // Walk
            this._walkAnim.start(true, 1.0, this._walkAnim.from, this._walkAnim.to, false);
        } else {
            this._walkAnim.stop();
        }

        if(this._input.rotating == false) {
            var rotationAxis = new Vector3(0, 0, 0);
            this._aggregate.body.setAngularVelocity(rotationAxis.scale(0));
        }
    }
}