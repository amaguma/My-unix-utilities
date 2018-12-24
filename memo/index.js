'use strict'

let memoize = (func) => {
    const cache ={};
    return (...args) => {
        const key = JSON.stringify(args);
        return key in cache ? cache[key] : (cache[key] = func(...args));
    }
};


const factorial = (n)=> {
    return (n <= 1) ? 1 : n * factorial(n - 1);
};

const memFactorial = memoize(factorial);

const facParam = 150;

console.time(`factorial-${facParam}`);
factorial(facParam);
console.timeEnd(`factorial-${facParam}`);

console.time(`memfactorial-${facParam}`);
memFactorial(facParam);
console.timeEnd(`memfactorial-${facParam}`);
console.log(memFactorial(facParam) + '\n');



const fibbonachi = (n) => {
    let value;
    if (n <= 1) {
        return n;
    } else {
        value = fibbonachi(n-2) + fibbonachi(n - 1);
        return value;
    }
};

const memFibbonachi = memoize(fibbonachi);

const fibParam = 30;


console.time(`fibbonachi-${fibParam}`);
fibbonachi(fibParam);
console.timeEnd(`fibbonachi-${fibParam}`);

console.time(`memfibbonachi-${fibParam}`);
memFibbonachi(fibParam);
console.timeEnd(`memfibbonachi-${fibParam}`);
console.log(memFibbonachi(fibParam) +'\n');


const tribbonachi = (n) => {
    let value;
    if (n < 2) {
        return 0;
    } else if (n === 2) {
            return 1; 
    } else {
        value = tribbonachi(n - 3) + tribbonachi(n - 2) + tribbonachi(n - 1);
        return value;
    }
};

const memTribbonachi = memoize(tribbonachi);

const tribParam = 30;

console.time(`tribbonachi-${tribParam}`);
tribbonachi(tribParam);
console.timeEnd(`tribbonachi-${tribParam}`);

console.time(`memtribbonachi-${tribParam}`);
memTribbonachi(tribParam);
console.timeEnd(`memtribbonachi-${tribParam}`);
console.log(memTribbonachi(tribParam) +'\n');

const akkerman = (m, n) => {
    let stepResult = 0;
    if (m == 0) {
        stepResult = n + 1;
    } else if (n == 0) {
        stepResult = akkerman(m - 1, 1);
    } else {
        stepResult = akkerman(m - 1, akkerman(m, n - 1));
    }
    return stepResult;
    
};

const memAkkerman = memoize(akkerman);

const akkerParam = { m: 3, n: 6 };

console.time(`akkerman-${akkerParam.m}-${akkerParam.n}`);
akkerman(akkerParam.m, akkerParam.n); 
console.timeEnd(`akkerman-${akkerParam.m}-${akkerParam.n}`);

console.time(`memakkerman-${akkerParam.m}-${akkerParam.n}`);
memAkkerman(akkerParam.m, akkerParam.n); 
console.timeEnd(`memakkerman-${akkerParam.m}-${akkerParam.n}`);
console.log(memAkkerman(akkerParam.m, akkerParam.n) +'\n');
