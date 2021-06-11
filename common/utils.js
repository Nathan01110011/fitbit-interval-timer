export { zeroPad, addDecimalPoint }

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function addDecimalPoint(number) {
  const size = number.length;
  return zeroPad(number.slice(0, size - 1) + "." + number.slice(size - 1));
}
