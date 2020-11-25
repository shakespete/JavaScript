function decentNumber(n) {
  let ans = "";

  const str3 = "555";
  const str5 = "33333";

  let mod3 = n % 3;
  let mod5 = n % 5;

  let qty3 = Math.floor(n / 3);
  let qty5 = Math.floor(n / 5);

  if (mod3 === 0) {
    console.log(qty3, mod3);
    for (let i = 1; i <= qty3; ++i) {
      ans += str3;
    }
  } else if (mod5 === 0) {
    console.log(qty5, mod5);
    for (let i = 1; i <= qty5; ++i) {
      ans += str5;
    }
  } else {
  }
  console.log(ans);
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
