export function dropdownMenu(dropdown) {
  dropdown.addEventListener("click", function () {
    if (dropdown.classList.contains("opened")) {
      dropdown.classList.remove("opened");
    } else {
      dropdown.classList.add("opened");
    }
  });
}
