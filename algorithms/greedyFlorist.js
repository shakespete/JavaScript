const swap = (x, y, A) => {
  let temp = A[x];
  A[x] = A[y];
  A[y] = temp;
};

const partition = (start, end, A) => {
  const pivot = A[end];
  let x = start - 1;
  for (let i = start; i <= end; ++i) if (A[i] > pivot) swap(++x, i, A);
  swap(++x, end, A);
  return x;
};

const quickSort = (start, end, A) => {
  if (start < end) {
    let p = partition(start, end, A);
    quickSort(start, p - 1, A);
    quickSort(p + 1, end, A);
  }
};

// Complete the getMinimumCost function below.
function getMinimumCost(k, c) {
  const N = c.length;
  quickSort(0, N - 1, c);

  let friends = new Array(k).fill(0);

  let minCost = 0;
  let friendIdx = 0;
  for (let cost = 0; cost < N; ++cost) {
    friendIdx = friendIdx < k ? friendIdx : 0;
    const prevPurch = friends[friendIdx];
    minCost += (prevPurch + 1) * c[cost];

    friends[friendIdx] = prevPurch + 1;
    friendIdx++;
  }
  return minCost;
}

// 5 3
// 1 3 5 7 9

// 29
