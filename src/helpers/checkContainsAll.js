// This function checks that every letter in 'substring' is found in 'string'
function checkContainsAll(string, substring) {
  const letters = [...string];
  return [...substring].every((x) => {
    const index = letters.indexOf(x);
    if (index !== -1) {
      letters.splice(index, 1);
      return true;
    }
    return false;
  });
}

module.exports = checkContainsAll;
