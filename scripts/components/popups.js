export function yesNoPopup(innerText, successFunc, defaultFunc) {
  let popup = document.createElement("div");
  popup.classList.add("popup", "yesNo");
  popup.innerHTML = `
  <div class="popup-body">
  <div class="popup-main">
    <h2>Підтвердіть</h2>
    <p>${innerText}</p>
  </div>
  <div class="popup-body__buttons">
    <button class="button buttons__button-yes">Так</button>
    <button class="button buttons__button-no">Ні</button>
  </div>
</div>
    `;

  let yesButton = popup.querySelector(".buttons__button-yes");
  let noButton = popup.querySelector(".buttons__button-no");

  return { popup, noButton, yesButton };
}