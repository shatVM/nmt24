export function checkSecurityCode(code) {
  // код на вхід на сайт
  let passCode = "37";
  if (passCode == code) {
    return true;
  } else return false;
}

export function checkPauseCode(code) {
  let passCode = "73";
  if (passCode == code) {
    return true;
  } else return false;
}
