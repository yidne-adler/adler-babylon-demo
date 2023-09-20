import { AnimationGroup, Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { CharacterInput } from "./CharacterInput";

export class Character {

    private _input: CharacterInput;

    private _walkingSpeed = 0.1;
    private _backwardsWalkingSpeed = 0.01;
    private _rotationSpeed = 0.05;

    private _mesh: Mesh;
    private _aggregate: PhysicsAggregate;
    private _walkAnim: AnimationGroup;

    constructor(scene: Scene, camera: UniversalCamera, mesh: Mesh, walkAnim: AnimationGroup, input: CharacterInput){
        this._input = input;

        this._mesh = mesh;
        this._mesh.checkCollisions = true;
        this._mesh.scaling.setAll(0.8);

        // lock the camera to the character.
        camera.lockedTarget = this._mesh;

        this._walkAnim = walkAnim;

        // Create a static box shape.
        this._aggregate = new PhysicsAggregate(mesh, 
            PhysicsShapeType.CONVEX_HULL, 
            { mass: 1, startAsleep: true, restitution: 0.75 }, 
            scene
        );

        this._aggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

        scene.onBeforeRenderObservable.add(() => {
            this._controlMovement();
        });
    }

    private _controlMovement() {

        if (this._input.inputMap["w"]) {
            this._mesh.moveWithCollisions(this._mesh.forward.scaleInPlace(this._walkingSpeed));
        }

        if (this._input.inputMap["s"]) {
            this._mesh.moveWithCollisions(this._mesh.forward.scaleInPlace(-this._backwardsWalkingSpeed));
        }

        if (this._input.inputMap["a"]) {
            this._mesh.rotate(Vector3.Up(), -this._rotationSpeed);
        }
        
        if (this._input.inputMap["d"]) {
            this._mesh.rotate(Vector3.Up(), this._rotationSpeed);
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