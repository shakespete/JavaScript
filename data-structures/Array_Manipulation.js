"use strict";

const fs = require("fs");

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;

process.stdin.on("data", (inputStdin) => {
  inputString += inputStdin;
});

process.stdin.on("end", (_) => {
  inputString = inputString
    .replace(/\s*$/, "")
    .split("\n")
    .map((str) => str.replace(/\s*$/, ""));

  main();
});

function readLine() {
  return inputString[currentLine++];
}

// Complete the arrayManipulation function below.
function arrayManipulation(n, queries) {
  let maxVal = 0;
  let latestRow = Array(n).fill(0);
  for (let i = 0; i < queries.length; ++i) {
    let leftBound = queries[i][0] - 1;
    let rightBound = queries[i][1] - 1;
    let value = queries[i][2];

    for (let j = leftBound; j <= rightBound; ++j) {
      let sum = latestRow[j] + value;
      latestRow[j] = sum;
      if (sum > maxVal) maxVal = sum;
    }
  }
  return maxVal;
}

function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const nm = readLine().split(" ");

  const n = parseInt(nm[0], 10);

  const m = parseInt(nm[1], 10);

  let queries = Array(m);

  for (let i = 0; i < m; i++) {
    queries[i] = readLine()
      .split(" ")
      .map((queriesTemp) => parseInt(queriesTemp, 10));
  }

  let result = arrayManipulation(n, queries);

  ws.write(result + "\n");

  ws.end();
}
