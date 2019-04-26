import DirEntry from "./direntry";
import { readdirSync, statSync, stat } from "fs";
import { join } from "path";
import File from "./file";

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
}