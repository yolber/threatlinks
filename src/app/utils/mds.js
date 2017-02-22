// Based On: https://github.com/benfred/mds.js
const numeric = require('numeric');

const mds = (distances, dimensions = 2) => {
  const M = numeric.mul(-0.5, numeric.pow(distances, 2));
  const mean = A => {
    return numeric.div(numeric.add.apply(null, A), A.length);
  };
  const rowMeans = mean(M);
  const colMeans = mean(numeric.transpose(M));
  const totalMean = mean(rowMeans);

  for (const i in M) {
    if (M.hasOwnProperty(i)) {
      for (const j in M[0]) {
        if (M[0].hasOwnProperty(j)) {
          M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
      }
    }
  }
  const ret = numeric.svd(M);
  const eigenValues = numeric.sqrt(ret.S);
  return ret.U.map(row => {
    return numeric.mul(row, eigenValues).splice(0, dimensions);
  });
};

export default mds;
