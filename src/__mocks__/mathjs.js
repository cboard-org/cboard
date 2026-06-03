module.exports = {
  resize: (arr, [rows, cols]) => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );
  }
};
