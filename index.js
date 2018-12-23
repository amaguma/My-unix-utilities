#!/usr/bin/node

'use strict'

const fs = require('fs');
const path = require('path');
const util = require('util');

const supportedFlagsMap = new Map();
const SUPPORTED_FLAG = {
    ALL: 'a',
    DIR_ONLY: 'd',
    FULL_PATH: 'f',
    OUTPUT: 'o',
    LEVEL: 'L',
    HELP: 'h'
};
const NOT_DIR_CHAR = '-';

const description = 'tree - list contents of directories in a tree-like format.';

supportedFlagsMap.set(SUPPORTED_FLAG.ALL,
    `All  files are printed.  By default tree does not print hidden files (those beginning` +
    ` with a dot \`.\').  In no event does tree print the file system constructs \`.\' (current` +
    ` directory) and \`..\' (previous directory).`
);
supportedFlagsMap.set(SUPPORTED_FLAG.DIR_ONLY, `List directories only`);
supportedFlagsMap.set(SUPPORTED_FLAG.FULL_PATH, 'Prints the full path prefix for each file.');
supportedFlagsMap.set(SUPPORTED_FLAG.OUTPUT, 'Send output to filename.');
supportedFlagsMap.set(SUPPORTED_FLAG.LEVEL, 'Max display depth of the directory tree.');
supportedFlagsMap.set(SUPPORTED_FLAG.HELP, 'Help.');

let DEPTH_LEVEL = null;


const printHelp = () => {
    console.log(description, '\n');
    const flagInterator = supportedFlagsMap.keys();
    supportedFlagsMap.forEach(flagDescription => {
        const flag = flagInterator.next().value;
        console.log(`\t-${flag}\t\t${supportedFlagsMap.get(flag)}\n`);
    });
};

const isNotEmpty = (obj) => {
    return Boolean(Object.keys(obj).length);
}
 
const getFsUnitName = (unitName, unitPaht) => {
    return cmd.has(SUPPORTED_FLAG.FULL_PATH) ? unitPaht : unitName;
}

const isHiddenUnit = (unitName) => {
    if (!cmd.has(SUPPORTED_FLAG.ALL)) {
        return (/(^|\/)\.[^\/\.]/g).test(unitName);
    } else {
        return false;
    }
}

const readDir = (pathToDir) => {
    let dirObject = {};
    try {
        fs.readdirSync(pathToDir)
        .filter(element => !isHiddenUnit(element))
        .forEach(element => {
            const elementPath = path.resolve(pathToDir, element);
            const elementName = getFsUnitName(element, elementPath);

            if (cmd.has(SUPPORTED_FLAG.DIR_ONLY)) {
                if (fs.statSync(elementPath).isDirectory()) {
                    dirObject[elementName] = NOT_DIR_CHAR;
                }
            } else {
                dirObject[elementName] = NOT_DIR_CHAR;
            }
        });
    } catch (error) {
        dirObject = {};
    }
    return dirObject;
}

const readDirRecursive = (currentDirContent, dirPath, depth) => {
    if (!depth) {
        depth = 0;
    }
    depth++;
    Object.keys(currentDirContent)
        .filter(element => !isHiddenUnit(element))
        .forEach(element => {
            const elementPath = path.resolve(dirPath, element);
            const elementName = getFsUnitName(element, elementPath);
            currentDirContent[elementName] = {};    
            if (fs.statSync(elementPath).isDirectory()) {
                let innerDirContent = readDir(elementPath);

                if (DEPTH_LEVEL !== null && DEPTH_LEVEL == depth) {
                    return;
                } 
                if (isNotEmpty(innerDirContent)) {
                    readDirRecursive(innerDirContent, elementPath, depth);
                    currentDirContent[elementName] = innerDirContent;
                } else {
                    currentDirContent[elementName] = innerDirContent;
                }
            } else {
                currentDirContent[elementName] = NOT_DIR_CHAR;
            }
        });
};

const getDepthStr = (depth) => {
    let depthStr = '';
    for (let i = depth - 1; i; i--) {
        depthStr = depthStr + '    ';
    }
    return depthStr;
};

const printResult = (dirContent, depth) => {
    if (!depth) {
        depth = 0;
    }
    depth++;


    Object.keys(dirContent).forEach(element => {
        const depthStr = getDepthStr(depth);
        if (util.isObject(dirContent[element])) {
            if (depth === 1) {
                console.log('├── \x1b[36m%s\x1b[0m', element);
            } else {
                console.log('│%s└── \x1b[36m%s\x1b[0m', depthStr, element);
            }

            printResult(dirContent[element], depth);
        } else {
            if (depth === 1) {
                console.log(`├── ${element}`);
            } else {
                console.log(`│${depthStr}└── ${element}`);
            }

        }
    });
}

const targetDir = process.cwd();

const cmd = new Set(
    process.argv
    .slice(2)
    .filter(option => option.indexOf('-') === 0)
    .map(option => option.replace('-', ''))
    .join('')
    .split('')
    .filter(option => supportedFlagsMap.has(option))
);

if (cmd.has(SUPPORTED_FLAG.LEVEL)) {
    process.argv
        .slice(2)
        .forEach((element, index, array) => {
            if (element.indexOf('-') === 0 && element.indexOf(SUPPORTED_FLAG.Level)) {
                DEPTH_LEVEL = array[index + 1];
                if (DEPTH_LEVEL.indexOf('-') === 0 && !(/\d+/g).test(DEPTH_LEVEL)) {
                    console.error('tree: Invalid level, must be greater than 0');
                    process.exit(1);
                }
            }
        });        
    if (!DEPTH_LEVEL || DEPTH_LEVEL == 0) {
        console.error('tree: Invalid level, must be greater than 0');
        process.exit(1);
    }
}

if (cmd.has(SUPPORTED_FLAG.HELP)) {
    printHelp(supportedFlagsMap);
    process.exit(0);
}

const targetDirContent = readDir(targetDir);

readDirRecursive(targetDirContent, targetDir)

// OUTPUT
if (cmd.has(SUPPORTED_FLAG.OUTPUT)) {
    let filepath;
    const argv = process.argv;
    process.argv
    .slice(2)
    .forEach((element, index, array) => {
        if (element.indexOf('-') === 0 && element.indexOf(SUPPORTED_FLAG.OUTPUT)) {
            filepath = array[index + 1];
            if (filepath.indexOf('-') === 0) {
                console.error('Error')
                process.exit(1);
            }
        }
    });
    if (filepath.indexOf('/') !== 0) {
        filepath = path.resolve(process.cwd(), filepath);
    }
    fs.writeFileSync(filepath, JSON.stringify(targetDirContent, null, 2));
} else {
    printResult(targetDirContent);
}
