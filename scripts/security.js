export function checkSecurityCode(code) {
  // код на вхід на сайт
  let passCode = "24";
  if (passCode == code) {
    return true;
  } else return false;
}

export function checkPauseCode(code) {
  let passCode = "42";
  if (passCode == code) {
    return true;
  } else return false;
}
