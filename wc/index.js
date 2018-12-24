'use strict'

const fs = require('fs');
const path = require('path');
const handlers = require('./handlers');

const supportedFlagsMap = new Map();
const SUPPORTED_FLAG = {
    LINES : 'l',
    BYTE: 'c',
    SYMBOL: 'm',
    MAX_ROW_SIZE: 'L',
    WORD: 'w',
    HELP: 'h'
};

const description = 'wc  is a command in Unix-like operating systems. The program reads either standard input or a list of files and generates one or more of the following statistics.'; 

supportedFlagsMap.set(SUPPORTED_FLAG.LINES,`Display the number of lines`);
supportedFlagsMap.set(SUPPORTED_FLAG.BYTE, `Display the number of bytes`);
supportedFlagsMap.set(SUPPORTED_FLAG.SYMBOL, 'Display the number of characters.');
supportedFlagsMap.set(SUPPORTED_FLAG.MAX_ROW_SIZE, 'Display the length of the longest string.');
supportedFlagsMap.set(SUPPORTED_FLAG.WORD, 'Display the number of words.');
supportedFlagsMap.set(SUPPORTED_FLAG.HELP, 'Help.');

const defaultFlags = [ SUPPORTED_FLAG.LINES, SUPPORTED_FLAG.WORD, SUPPORTED_FLAG.SYMBOL ];

const printHelp = () => {
    console.log(description, '\n');
    const flagInterator = supportedFlagsMap.keys();
    supportedFlagsMap.forEach(flagDescription => {
        const flag = flagInterator.next().value;
        console.log(`\t-${flag}\t\t${supportedFlagsMap.get(flag)}\n`);
    });
};

// =================== Flag parse ===============
const input = process.argv.slice(2);
let cmd = new Set(
    input
    .filter(option => option.indexOf('-') === 0)
    .map(option => option.replace('-', ''))
    .join('')
    .split('')
    .filter(option => supportedFlagsMap.has(option))
);
if (!cmd.size) {
    cmd = new Set(defaultFlags);
}

// ================== Payload prepare ===============
let fileInput = '';
let fileContent = ''; 
input
    .forEach((element) => {
        if (element.indexOf('-') !== 0) {
            fileInput = element;
        }
    });
if (fileInput.length) {
    let filePath = fileInput;
    if (filePath.indexOf('/') !== 0) {
        filePath = path.resolve(process.cwd(), filePath);
    }
    fileContent = fs.readFileSync(filePath, 'utf8');
}

// ==================== Handling ====================

if (cmd.has(SUPPORTED_FLAG.HELP)) {
    printHelp(supportedFlagsMap);
    process.exit(0);
}

const result = 
    Array.from(cmd)
    .map(flag => {
        let result = 0;
        switch (flag) {
            case SUPPORTED_FLAG.BYTE:
                result = handlers.getByteAmount(fileContent);
                break;
            case SUPPORTED_FLAG.LINES:
                result = handlers.getLineAmout(fileContent);
                break;
            case SUPPORTED_FLAG.MAX_ROW_SIZE:
                result = handlers.getMaxRow(fileContent);
                break;
            case SUPPORTED_FLAG.SYMBOL:
                result = handlers.getCharAmount(fileContent);
                break;
            case SUPPORTED_FLAG.WORD:
                result = handlers.getWordAmount(fileContent);
                break;
            default:
                result = null;
                break;
        }
        return result;
    })
    .filter(flagHandleResult => flagHandleResult !== null);


// ===================== Output ======================
console.log(` ${result.join('  ')} ${fileInput}`);