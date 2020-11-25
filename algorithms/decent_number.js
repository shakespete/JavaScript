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

const greedy = (str = '', N) => {
  if (N === 0) return str;
  else if (N >= 3) {
    let currStr = str;
    let currN = N;

    greedy(currStr += '555', N - 3);
    // Need to backtrack!
    greedy(currStr += '33333', N - 5);
  } else {
    return '-1';
  }
} 

function decentNumber(n) {
  greedy('', n);
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
