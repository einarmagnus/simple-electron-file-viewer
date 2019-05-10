
import FileView from "./fileview";



let views = [
    new FileView("Left", ".", "#left", "#file-viewer", "#file-list-item"),
    new FileView("Right", ".", "#right", "#file-viewer", "#file-list-item"),
];

let leftRightMapping: {[key: string]: number} = {
    left: 0,
    right: 1
};


const Commands: {[cmd: string]: (from: FileView, to: FileView) => void } = {
    copy(from: FileView, to: FileView): void {
        let filesToCopy = from.getSelected();
        let dest = to.pwd;
        filesToCopy.forEach(file => {
            try {
                file.copyTo(dest);
            } catch (err) {
                console.log(`Error copying file ${file} to ${dest}: ${err}`);
            }
        })
    },
    async makeDir(main: FileView) {
        const dirName = await prompt("Create directory", "Name of dir: ");
        main.pwd.mkDir(dirName);
    }
}

document.querySelectorAll(".controls button").forEach(button => {
    button.addEventListener("click", async evt => {
        let button = evt.target as HTMLButtonElement;
        let leftRight = button.closest(".controls") as HTMLElement;
        let main = views[leftRightMapping[leftRight.dataset.controlsFor]];
        let other = views[(views.indexOf(main) + 1) % 2];
        console.log(`command: ${button.dataset.command}, from: ${main.title} to: ${other.title})`);
        await Commands[button.dataset.command](main, other);
        // refresh views!
        main.list();
        other.list();
    });
});

/**
 * A replacement for the built-in `prompt` that electron has chosen to exclude.
 * @param title The title of the prompt dialog
 * @param prompt The label next to the input
 */
function prompt(title: string = "Input", prompt: string = "Enter value") : Promise<string|null>{
    // return a promise that will be fullfilled when `done` is called.
    return new Promise(done => {
        // get the dialog
        const dialog = document.querySelector("#prompt") as HTMLDialogElement;
        // set the title and the label
        dialog.querySelector("#prompt-title").textContent = title;
        dialog.querySelector("#prompt-label").textContent = prompt;

        // set up handlers for pressing enter and clicking the buttons
        function ok() {
            const answer = dialog.querySelector("#prompt-input") as HTMLInputElement;
            // we now have an answer, close the dialog and fullfill the promise!
            dialog.close();
            done(answer.value);
        }
        dialog.querySelector("#prompt-ok").addEventListener("click", ok);
        dialog.querySelector("#prompt-input").addEventListener("keypress", (evt: KeyboardEvent) => {
            if (evt.key === "Enter") {
                ok();
            }
        });
        dialog.querySelector("#prompt-cancel").addEventListener("click", () => {
            // user clicked cancel, close the dialog and fullfill the promise with `null`
            dialog.close();
            done(null);
        });

        // show the dialog
        dialog.showModal();
    });
}