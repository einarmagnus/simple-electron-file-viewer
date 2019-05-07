import { stat, statSync } from "fs";
import Directory from "./directory";

import * as path from "path";

export default abstract class DirEntry {
    /**
     * Copy a file into a directory
     * @param target the directory tocopy this file to
     */
    public abstract copyTo(dest: Directory, overwrite?: boolean): void;

    public constructor(protected _path: string){};


    public size() : number {
        return statSync(this._path).size;
    }

    public get name(): string {
        return path.basename(this._path);
    }

    public get path(): string {
        return this._path;
    }

    toString(): string {
        // this.constructor ger klassnamnet på objektet,
        // så "Directory" om det är ett Directory-objekt och "File" om det är ett File-object
        return `${this.constructor.name}[${this.path}]`
    }

}