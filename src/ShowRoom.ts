import { AbstractMesh, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, SceneLoader, Vector3 } from "@babylonjs/core";

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

        this._root.rotation = new Vector3(0, 0, 0);
        this._root.position = new Vector3(0, -5, 0);
        this._root.scaling.setAll(1);

        // 10*10*10 collision box for the showroom.
        var box = MeshBuilder.CreateBox("showroom_cb", {size: 10, height: 10, width: 10}, this._scene);
        box.addChild(this._root);
        box.visibility = 0.0;
        box.position.y = 5;

        this._aggregate = new PhysicsAggregate(box, 
            PhysicsShapeType.BOX, 
            {mass: 100, startAsleep: true}, 
            this._scene);

        this._aggregate.body.setMotionType(PhysicsMotionType.STATIC);
    }
}