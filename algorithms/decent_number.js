function decentNumber(n) {
  let ans = "";

  const str3 = "555";
  const str5 = "33333";

  let mod3 = n % 3;
  let mod5 = n % 5;

  let qty3 = Math.floor(n / 3);
  let qty5 = Math.floor(n / 5);

  if (mod3 === 0) {
    for (let i = 1; i <= qty3; ++i) ans += str3;
  } else if (mod5 === 0) {
    for (let i = 1; i <= qty5; ++i) ans += str5;
  } else if (n >= 3) {
    let decreasingN = n;
    while (decreasingN %)

    ans += str3;
    decreasingN - 3;

  } else {
    ans = '-1';
  }
  console.log(ans);
}

const greedy = (str = '', N, arr) => {
  if (N === 0) {
    if (arr.length) {
        const val = parseInt(str);
        if (val > arr[0]) arr[0] = val;
    } else {
        arr.push(parseInt(str));
    }
  } else if (N < 0) {
    if (arr.indexOf(-1) === -1) arr.push(-1);
  } else {
    let currStr = str;
    let currN = N;
    
    greedy(currStr += '555', N - 3, arr);
    greedy(str += '33333', N - 5, arr);
  }
  return;
} 

function decentNumber(n) {
  let arr = []
  greedy('', n, arr);
  console.log(arr[0]);
}

// 4
// 1
// 3
// 5
// 11

// -1
// 555
// 33333
// 55555533333
