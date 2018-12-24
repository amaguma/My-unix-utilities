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

module.exports = {
    SUPPORTED_FLAG,
    supportedFlagsMap,
    description,
    defaultFlags
};