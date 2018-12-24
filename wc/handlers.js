const getLineAmout = (text) => {
    return text
        .split('\n')
        .length; 
};


const getCharAmount = (text) => {
    return text
        //.replace(/(\r\n|\r|\n)/g, ' ')
        .length;
};  

const getMaxRow = (text) => {
    return text
        .split('\n')
        .sort((first, second) => first.length < second.length)[0]
        .length;
};
    
const getWordAmount = (text) => {
    return text
        .replace(/(\r\n|\r|\n)/g, ' ')
        .trim()
        .match(/\s+/g)
        .length + 1;   
};

const getByteAmount = (text) => {
    return Buffer.byteLength(text, 'utf8');
}
    
module.exports = {
    getLineAmout,
    getCharAmount,
    getMaxRow,
    getWordAmount,
    getByteAmount
};  


