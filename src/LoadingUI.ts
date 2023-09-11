import { ILoadingScreen } from "@babylonjs/core";


export class CustomLoadingScreen implements ILoadingScreen {

    public loadingUIBackgroundColor: string;
    public loadingUIText: string;

    private loadingDiv;

    constructor(loadingUIText: string){
        this.loadingUIText = loadingUIText;
        this.loadingDiv = this.createLoadingScreen();
    }

    public displayLoadingUI() {
        if (this.loadingDiv) {
            this.loadingDiv.classList.remove("hidden");
        }
    }

    public hideLoadingUI() {
        this.loadingDiv && this.loadingDiv.classList.add("hidden");
    }

    private createLoadingScreen() : HTMLElement {
        let groundTextureUrl: String = "../img/loading.gif";

        this.loadingDiv = document.createElement("div");
        this.loadingDiv.id = "loading";
        this.loadingDiv.style.position = "absolute";
        this.loadingDiv.style.top = "50%";
        this.loadingDiv.style.left = "50%";
        this.loadingDiv.style.transform = "translate(-50%, -50%)";

        const div = document.createElement("div");
        div.innerHTML = `<div id="loadingContainer">
                            <img src="${groundTextureUrl}" />
                        </div>`;
        this.loadingDiv.appendChild(div);

        document.body.appendChild(this.loadingDiv);

        return this.loadingDiv;
    }
}