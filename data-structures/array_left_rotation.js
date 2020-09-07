'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.replace(/\s*$/, '')
        .split('\n')
        .map(str => str.replace(/\s*$/, ''));

    main();
});

function readLine() {
    return inputString[currentLine++];
}



function main() {
    const nd = readLine().split(' ');
    const n = parseInt(nd[0], 10);
    const d = parseInt(nd[1], 10);
    const a = readLine().split(' ').map(aTemp => parseInt(aTemp, 10));

    let ctr = 0;
    let idx = d;
    let ans = [];
    while (ctr < n) {
        if (idx === n) idx = 0;
        ans[ctr++] = a[idx++];
    }
    console.log(ans.toString().split(',').join(' '));
}

/**
 Sample Input:
 
  5 4
  1 2 3 4 5

  Expected Output:
  5 1 2 3 4
  
 */