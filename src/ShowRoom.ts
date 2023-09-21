import { AbstractMesh, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, SceneLoader, Vector3 } from "@babylonjs/core";

export class ShowRoom {

    private _scene: Scene;
    private _root: AbstractMesh;
    private _aggregate: PhysicsAggregate;

    constructor(scene: Scene){
        this._scene = scene;
    }

    public async load(): Promise<void> {
        const res =  await SceneLoader.ImportMeshAsync("", "./models/atoms/", "classic-room.glb", this._scene)
        this._root = res.meshes[0];

        this._root.position = new Vector3(0, 0, 0);
        this._root.rotation = new Vector3(0, 0, 0);
        this._root.scaling.setAll(1);

        this._aggregate = new PhysicsAggregate(this._root, 
            PhysicsShapeType.BOX, 
            {mass: 100, startAsleep: true}, 
            this._scene);

        this._aggregate.body.setMotionType(PhysicsMotionType.STATIC);
        this._root.position = new Vector3(0, 5, 0);
    }
}