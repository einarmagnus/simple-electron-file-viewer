import DirEntry from "./direntry";
import { join } from "path";
import { copyFileSync, constants } from "fs";
import Directory from "./directory";

export default class File extends DirEntry {
    constructor(path: string) {
        super(path);
    }

    public copyTo(dest: Directory, overwrite: boolean = false) {
        copyFileSync(this.path, join(dest.path, this.name), overwrite ? 0 : constants.COPYFILE_EXCL);
    }
}