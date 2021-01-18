function swap(x, y, A) {
  let temp = A[x];
  A[x] = A[y];
  A[y] = temp;
}
function partition(start, end, A) {
  let pivot = A[end];
  let x = start - 1;
  for (let i = start; i <= end; ++i) {
    if (A[i] < pivot) swap(i, ++x, A);
  }
  swap(end, ++x, A);
  return x;
}
function quick_sort(start, end, A) {
  if (start < end) {
    let p = partition(start, end, A);
    quick_sort(start, p - 1, A);
    quick_sort(p + 1, end, A);
  }
}

function toys(w) {
  const N = w.length;
  let containers = 0;
  let max = 0;
  quick_sort(0, N - 1, w);

  for (let i = 0; i < N; ++i) {
    if (max === 0) {
      max = w[i] + 4;
      containers++;
    } else if (w[i] > max) {
      max = w[i] + 4;
      containers++;
    }
  }
  return containers;
}

// 8
// 1 2 3 21 7 12 14 21

// 4
