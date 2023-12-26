import * as fs from 'fs';
import * as stream from 'stream';
import * as process from 'process';
import {TransformCallback} from "node:stream";


const OUTPUT_FILE = 'output.txt';


const rs = fs.createReadStream(process.argv[2]);

function processChunkData(chunk: { toString: () => string; }): string[] {
    return chunk.toString().toLowerCase().split(/\W+/);
}

function transformFunc(chunk: any, _encoding: BufferEncoding, cb: TransformCallback) {
    this.push(processChunkData(chunk));
    cb();
}

const split = new stream.Transform({
    objectMode: true,
    transform: transformFunc
});

function incrementWordCount(obj: Record<string, number>, word: string) {
    obj[word] = (obj[word] || 0) + 1;
}

const wordCountTransformer = new stream.Transform({
    objectMode: true,
    transform(chunk, _encoding, cb) {
        const wordCounts: Record<string, number> = {};
        for (let word of chunk) {
            if (word) {
                incrementWordCount(wordCounts, word);
            }
        }
        this.push(wordCounts);
        cb();
    }
});


const ws = new stream.Writable({
    objectMode: true,
    write: processObjectStream
});

function sortObjectKeysToArray(object: any): string[] {
    const arr: string[] = [];
    Object.keys(object).sort().forEach(k => arr.push(object[k]));
    return arr;
}

function processObjectStream(streamObject: any, _encoding: any, cb: any) {
    const sortedArray: string[] = sortObjectKeysToArray(streamObject);
    const writeStream = fs.createWriteStream(OUTPUT_FILE);
    writeStream.write(sortedArray.toString(), cb);
}

rs.pipe(split).pipe(wordCountTransformer).pipe(ws);