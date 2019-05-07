
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
    }
}

document.querySelectorAll(".controls button").forEach(button => {
    button.addEventListener("click", evt => {
        let button = evt.target as HTMLButtonElement;
        let leftRight = button.closest(".controls") as HTMLElement;
        let main = views[leftRightMapping[leftRight.dataset.controlsFor]];
        let other = views[(views.indexOf(main) + 1) % 2];
        console.log(`command: ${button.dataset.command}, from: ${main.title} to: ${other.title})`);
        Commands[button.dataset.command](main, other);
        // refresh views!
        main.list();
        other.list();
    });
});

