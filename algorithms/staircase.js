function staircase(n) {
  let level = n;
  while (level > 0) {
    let str = "";
    for (let col = 1; col <= n; ++col) {
      if (level - col > 0) str = str.concat(" ");
      else str = str.concat("#");
    }
    console.log(str);
    level--;
  }
}
