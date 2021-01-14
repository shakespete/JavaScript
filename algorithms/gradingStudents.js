function gradingStudents(grades) {
  return grades.map((e) => {
    if (e < 38) return e;
    else {
      const ceil = Math.floor(e / 5) * 5 + 5;
      const diff = ceil - e;
      if (diff < 3) return ceil;
      else return e;
    }
  });
}

// 4
// 73
// 67
// 38
// 33

// 75
// 67
// 40
// 33
