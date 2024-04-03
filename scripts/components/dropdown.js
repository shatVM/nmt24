export function dropdownMenu(dropdown, button = null) {
  if (button) {
    button.addEventListener("click", function (e) {
      if (dropdown.classList.contains("opened")) {
        dropdown.classList.remove("opened");
      } else {
        dropdown.classList.add("opened");
      }
    });
  } else {
    dropdown.addEventListener("click", function (e) {
      if (dropdown.classList.contains("opened")) {
        dropdown.classList.remove("opened");
      } else {
        dropdown.classList.add("opened");
      }
    });
  }
}
