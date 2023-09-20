import { Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene } from "@babylonjs/core";

export class ShowRoom {

    private _mesh: Mesh;
    private _aggregate: PhysicsAggregate;

    constructor(scene: Scene, mesh: Mesh){
        this._mesh = mesh;

        this._aggregate = new PhysicsAggregate(mesh, 
            PhysicsShapeType.CONVEX_HULL, 
            {mass: 10, startAsleep: true}, 
            scene
        );

        this._aggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
    }
}