'use strict'

const fs = require('fs');
const path = require('path');
const { defaultFlags, SUPPORTED_FLAG, supportedFlagsMap } = require('./constants');
const constants = require('./constants');
const handlers = require('./handlers');

const printHelp = (constants) => {
    console.log(constants.description, '\n');
    const flagInterator = constants.supportedFlagsMap.keys();
    constants.supportedFlagsMap.forEach(() => {
        const flag = flagInterator.next().value;
        console.log(`\t-${flag}\t\t${constants.supportedFlagsMap.get(flag)}\n`);
    });
};

const wc = (args, content, filePathInput) => {

    if (!filePathInput) {
        filePathInput = '';
    }
    // =================== Flag parse ===============
    let cmd = new Set(
        args
        .filter(option => option.indexOf('-') === 0)
        .map(option => option.replace('-', ''))
        .join('')
        .split('')
        .filter(option => supportedFlagsMap.has(option))
    );
    if (!cmd.size) {
        cmd = new Set(defaultFlags);
    }

    // ==================== Handling ====================

    if (cmd.has(SUPPORTED_FLAG.HELP)) {
        printHelp(constants);
        process.exit(0);
    }

    const result = 
        Array.from(cmd)
        .map(flag => {
            let result = 0;
            switch (flag) {
                case SUPPORTED_FLAG.BYTE:
                    result = handlers.getByteAmount(content);
                    break;
                case SUPPORTED_FLAG.LINES:
                    result = handlers.getLineAmout(content);
                    break;
                case SUPPORTED_FLAG.MAX_ROW_SIZE:
                    result = handlers.getMaxRow(content);
                    break;
                case SUPPORTED_FLAG.SYMBOL:
                    result = handlers.getCharAmount(content);
                    break;
                case SUPPORTED_FLAG.WORD:
                    result = handlers.getWordAmount(content);
                    break;
                default:
                    result = null;
                    break;
            }
            return result;
        })
        .filter(flagHandleResult => flagHandleResult !== null);


    // ===================== Output ======================
    console.log(` ${result.join('  ')} ${filePathInput}`);
}


const input = process.argv;

if (!process.stdin.isTTY) {
    let content = '';
    
    process.stdin.on('data', function(chunk) {
        content += chunk;
    });
    
    process.stdin.on('end', function() {
        wc(input, content);
    });    
} else {
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
    wc(input, fileContent, fileInput);
}