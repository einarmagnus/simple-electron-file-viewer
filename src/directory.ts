import DirEntry from "./direntry";
import { readdirSync, statSync, stat, copyFileSync, mkdirSync, fstat } from "fs";
import { join } from "path";
import File from "./file";
import { FileExistsError } from "./errors";

export default class Directory extends DirEntry {

    constructor(path: string) {
        super(path);
    }

    public list(): DirEntry[] {
        let files = readdirSync(this._path);
        let result: DirEntry[] = [];
        for (let file of files) {
            let fullPath = join(this._path, file);
            let stat = statSync(fullPath);
            if (stat.isFile()) {
                result.push(new File(fullPath));
            } else if (stat.isDirectory()) {
                result.push(new Directory(fullPath));
            }
        }
        return result;
    }


    public get(name: string) {
        const fullPath = join(this.path, name);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            return new Directory(fullPath);
        } else if (stat.isFile()) {
            return new File(fullPath);
        } else {
            console.log("Error: Neither dir nor file: " + fullPath);
            throw new Error("Neither dir nor file: " + fullPath);
        }
    }

    public copyTo(dest: Directory, overwrite: boolean = false): void {
        this.list().forEach(entry => {
            entry.copyTo(dest, overwrite);
        })
    }
}