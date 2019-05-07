import { statSync } from "fs";
import DirEntry from "./direntry";
import Directory from "./directory";

import { join } from "path";

/**
 * A viewer of files.
 *
 */
export default class FileView {
    private _pwd: Directory;
    private fileList: HTMLUListElement;
    private liTemplate: HTMLTemplateElement

    /**
     * Create a file view
     * @param startDir the directory to start in
     * @param mountPointSelector a selector to the element in which this viewer will be placed
     * @param viewTemplateSelector a selector to find the template to use for this viewer
     * @param liTemplateSelector a selector to find the template to use for a row in the file viewer
     */
    constructor(
            public readonly title: string,
            startDir: string,
            mountPointSelector: string,
            viewTemplateSelector: string,
            liTemplateSelector: string) {
        let stat = statSync(startDir);
        if (!stat.isDirectory()) {
            throw new Error(startDir + " is not a directory");
        }
        this._pwd = new Directory(startDir);
        this.liTemplate = document.querySelector(liTemplateSelector) as HTMLTemplateElement;
        let template = document.querySelector(viewTemplateSelector) as HTMLTemplateElement;

        let clone = document.importNode(template.content, true);
        let target = document.querySelector(mountPointSelector);
        target.appendChild(clone);
        target.querySelector(".title").textContent = this.title;
        this.fileList = target.querySelector(".filelist");
        this.fileList.addEventListener("click", evt => this.listClicked(evt));
        this.fileList.addEventListener("dblclick", evt => this.listDblClicked(evt));
        this.list();
    }

    /** list the files in the current directory */
    public list() {
        this.fileList.innerHTML = "";
        this.fileList.appendChild(this.listItem(".."))
        this._pwd.list().forEach(entry => {
            let element = this.listItem(entry.name);
            this.fileList.appendChild(element);
        })
    }

    /** find the file the user clicked on given the target of the mouse event */
    private findFileClicked(target: HTMLElement) {
        while (target.tagName.toLowerCase() !== "li") {
            target = target.parentElement;
        }
        return target.querySelector(".filename").textContent;
    }

    /** this is called when the user clicks a file */
    private listClicked(evt: MouseEvent) {

    }

    /** this is called when the user double clicks a file */
    private listDblClicked(evt: MouseEvent) {
        this.cd(this.findFileClicked(evt.target as HTMLElement));
    }

    /**
     * Change the current directory.
     * Will not do anything if the file is not a directory within
     * the current working directory
     */
    public cd(file: string) {
        if (this.isDirectory(file)) {
            this._pwd = new Directory(join(this._pwd.path, file));
            this.list();
        }
    }

    /**
     * Check if a file within the curent directory is a directory
     * @param name the name of a file withing the current directory
     */
    private isDirectory(name: string) {
        return statSync(join(this._pwd.path, name)).isDirectory();
    }

    /**
     * Make a listItem from the list item template with the privided fileName
     * @param fileName the name to put in the listitem
     */
    private listItem(fileName: string) : DocumentFragment {
        let clone = document.importNode(this.liTemplate.content, true);
        if (this.isDirectory(fileName)) {
            clone.querySelector("li").classList.add("dir");
            fileName += "/";
        }
        clone.querySelector(".filename").textContent = fileName;
        return clone;
    }

    public getSelected() : DirEntry[] {
        const result : DirEntry[] = [];
        this.fileList.querySelectorAll("li").forEach(li => {
            const isChecked = li.querySelector("input").checked;
            if (isChecked) {
                const el = li.querySelector(".filename");
                const fileName = el.textContent;
                const entry = this._pwd.get(fileName);
                result.push(entry);
            }
        });
        return result;
    }

    public get pwd(): Directory {
        return this._pwd;
    }
}