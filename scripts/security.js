export function checkSecurityCode(code) {
  // код на вхід на сайт
  let passCode = "1234";
  if (passCode == code) {
    return true;
  } else return false;
}

export function checkPauseCode(code) {
  let passCode = "4321";
  if (passCode == code) {
    return true;
  } else return false;
}
