'use strict';

const fs = require('fs');

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

function getSum(arr, row, col) {
    let sum = 0;
    for (let i = 0; i < 3; ++i) {
        sum += arr[row][col + i];
        sum += arr[row + 2][col + i];
    }
    sum += arr[row + 1][col + 1];
    return sum;
}

// Complete the hourglassSum function below.
function hourglassSum(arr) {
    let maxSum = null;

    for (let row = 0; row < 4; ++row) {
        for (let col = 0; col < 4; ++col) {
            let sum = getSum(arr, row, col);
            
            if (maxSum === null) maxSum = sum;
            else if (sum > maxSum) maxSum = sum;
        }
    }
    return maxSum;
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    let arr = Array(6);

    for (let i = 0; i < 6; i++) {
        arr[i] = readLine().split(' ').map(arrTemp => parseInt(arrTemp, 10));
    }

    let result = hourglassSum(arr);

    ws.write(result + "\n");

    ws.end();
}


/**
 Sample Input:
 
  1 1 1 0 0 0
  0 1 0 0 0 0
  1 1 1 0 0 0
  0 0 2 4 4 0
  0 0 0 2 0 0
  0 0 1 2 4 0

  1 1 1 0 0 0
  0 1 0 0 0 0
  1 1 1 0 0 0
  0 9 2 -4 -4 0
  0 0 0 -2 0 0
  0 0 -1 -2 -4 0

  -9 -9 -9 1 1 1
  0 -9 0 4 3 2
  -9 -9 -9 1 2 3
  0 0 8 6 6 0
  0 0 0 -2 0 0
  0 0 1 2 4 0

  Expected Output:
  19
  13
  28
 */