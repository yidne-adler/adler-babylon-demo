import { ActionManager, ExecuteCodeAction, Scene } from "@babylonjs/core";

export class CharacterInput {

    public inputMap: any;
    public keydown: boolean = false;

    constructor(scene: Scene){

        scene.actionManager = new ActionManager(scene);

        this.inputMap = {};
        
        scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
                this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            })
        );

        scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
                this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }),
        );

        scene.onBeforeRenderObservable.add(() => {
            if (this.inputMap["w"] || this.inputMap["s"] || this.inputMap["a"] || this.inputMap["d"]){
                this.keydown = true;
            } else {
                this.keydown = false;
            }
        })
    }
}