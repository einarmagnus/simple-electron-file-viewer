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

}