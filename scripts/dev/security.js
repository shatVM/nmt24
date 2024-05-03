export let timeoutPassCode = 123;
export let enterPassCode = null;
// export let timeoutPassCode = "1453";

export function checkSecurityCode(code) {
  // код на вхід на сайт
  if (enterPassCode == code) {
    return true;
  } else return false;
}

export function checkPauseCode(code) {
  if (timeoutPassCode == code) {
    return true;
  } else return false;
}
