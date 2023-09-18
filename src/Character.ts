import { AnimationGroup, Mesh, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { CharacterInput } from "./CharacterInput";

export class Character {

    private _input: CharacterInput;

    private _walkingSpeed = 0.01;
    private _backwardsWalkingSpeed = 0.01;
    private _rotationSpeed = 0.01;

    private _avatar: Mesh;
    private _walkAnim: AnimationGroup;

    constructor(scene: Scene, camera: UniversalCamera, character: Mesh, walkAnim: AnimationGroup, input: CharacterInput){
        this._input = input;

        this._avatar = character;
        this._avatar.checkCollisions = true;
        this._avatar.scaling.setAll(0.8);

        // lock the camera to the character.
        camera.lockedTarget = this._avatar;

        this._walkAnim = walkAnim;

        scene.onBeforeRenderObservable.add(() => {
            this._controlMovement();
        })
    }

    private _controlMovement() {

        if (this._input.inputMap["w"]) {
            this._avatar.moveWithCollisions(this._avatar.forward.scaleInPlace(this._walkingSpeed));
        }

        if (this._input.inputMap["s"]) {
            this._avatar.moveWithCollisions(this._avatar.forward.scaleInPlace(-this._backwardsWalkingSpeed));
        }

        if (this._input.inputMap["a"]) {
            this._avatar.rotate(Vector3.Up(), -this._rotationSpeed);
        }
        
        if (this._input.inputMap["d"]) {
            this._avatar.rotate(Vector3.Up(), this._rotationSpeed);
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