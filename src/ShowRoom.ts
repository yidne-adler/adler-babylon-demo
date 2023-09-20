import { AbstractMesh, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, SceneLoader } from "@babylonjs/core";

export class ShowRoom {

    private _scene: Scene;
    private _root: AbstractMesh;

    constructor(scene: Scene){
        this._scene = scene;
    }

    public async load(): Promise<void> {
        SceneLoader.ImportMeshAsync("", "./models/atoms/", "classic-room.glb", this._scene).then((res) => {
            this._root = res.meshes[0];

            this._root.getChildMeshes().forEach(_m => {

                var agg = new PhysicsAggregate(_m, 
                    PhysicsShapeType.CONVEX_HULL, 
                    {mass: 10, startAsleep: true}, 
                    this._scene
                );
    
                agg.body.setMotionType(PhysicsMotionType.STATIC);
            });
        }); 
    }
}