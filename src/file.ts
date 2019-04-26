import DirEntry from "./direntry";

export default class File extends DirEntry {
    constructor(path: string) {
        super(path);
    }
}