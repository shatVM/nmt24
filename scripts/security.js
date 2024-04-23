export let enterPassCode = 56;
export let timeoutPassCode = null;
// export let enterPassCode = "1234";
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
