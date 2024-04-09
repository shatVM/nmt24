export function checkSecurityCode(code) {
  // код на вхід на сайт
  let passCode = "123456";
  if (passCode == code) {
    return true;
  } else return false;
}

export function checkPauseCode(code) {
  let passCode = "654321";
  if (passCode == code) {
    return true;
  } else return false;
}
