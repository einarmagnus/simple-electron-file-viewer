import { stat, statSync } from "fs";

import * as path from "path";

export default abstract class DirEntry {

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