import * as testpage from "../testPage.js";

export function chooseOneAnswerOf4(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return `erorr`;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
        <tr>
          <td>
            <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
          </td>
          <td>
          <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
          </td>
          <td>
          <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
          </td>
          <td>
          <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
          </td>
        </tr>
        <tr class = 'answers-options-row'>
          <td>
            <input answer = "А" class="answers-table__option" type="checkbox" ${
              thisQuestion.answer.includes("А") ? "checked" : ""
            } name="" id="" />
          </td>
          <td>
            <input answer = "Б" class="answers-table__option" type="checkbox"  ${
              thisQuestion.answer.includes("Б") ? "checked" : ""
            } name="" id="" />
          </td>
          <td>
            <input answer = "В" class="answers-table__option" type="checkbox"  ${
              thisQuestion.answer.includes("В") ? "checked" : ""
            } name="" id="" />
          </td>
          <td>
            <input answer = "Г" class="answers-table__option" type="checkbox" ${
              thisQuestion.answer.includes("Г") ? "checked" : ""
            } name="" id="" />
          </td>
        </tr>
        `;

  let optionRow = answerTable.querySelector(".answers-options-row");
  let options = optionRow.querySelectorAll(".answers-table__option");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((option) => {
        option.checked = false;
      });
      option.checked = true;
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let optionRow = answerTable.querySelector(".answers-options-row");
    let options = optionRow.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      if (option.checked) {
        let localAnswers = localStorage.getItem(questionId);
        localAnswers = JSON.parse(localAnswers);
        if (!localAnswers) {
          return console.error("Error, cannot save your answer");
        }
        localAnswers[questionNumber].answer = [option.getAttribute("answer")];
        localAnswers[questionNumber].submitted = true;
        localStorage.setItem(questionId, JSON.stringify(localAnswers));
        testpage.showAnsweredInNav(localAnswers);
        testpage.openQuestion(questionsArr, +questionNumber + 1);
      }
    });
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function chooseOneAnswerOf5(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
        <tr>
          <td>
            <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
          </td>
          <td>
          <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
          </td>
          <td>
          <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
          </td>
          <td>
          <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
          </td>
          <td>
          <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
          </td>
        </tr>
        <tr class = 'answers-options-row'>
          <td>
            <input answer = "А" ${
              thisQuestion.answer.includes("А") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Б" ${
              thisQuestion.answer.includes("Б") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "В" ${
              thisQuestion.answer.includes("В") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Г" ${
              thisQuestion.answer.includes("Г") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
          <input answer = "Д" ${
            thisQuestion.answer.includes("Д") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        </tr>
        `;

  let optionRow = answerTable.querySelector(".answers-options-row");
  let options = optionRow.querySelectorAll(".answers-table__option");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((option) => {
        option.checked = false;
      });
      option.checked = true;
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let optionRow = answerTable.querySelector(".answers-options-row");
    let options = optionRow.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      if (option.checked) {
        let localAnswers = localStorage.getItem(questionId);
        localAnswers = JSON.parse(localAnswers);
        if (!localAnswers) {
          return console.error("Error, cannot save your answer");
        }
        localAnswers[questionNumber].answer = [option.getAttribute("answer")];
        localAnswers[questionNumber].submitted = true;
        localStorage.setItem(questionId, JSON.stringify(localAnswers));
        testpage.showAnsweredInNav(localAnswers);
        testpage.openQuestion(questionsArr, +questionNumber + 1);
      }
    });
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}

export function chooseOneAnswerOf8(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
        <tr>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "F" : "Е"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "G" : "Є"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "H" : "Ж"}</p>
        </td>
        </tr>
        <tr class = 'answers-options-row'>
          <td>
            <input answer = "А" ${
              thisQuestion.answer.includes("А") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Б" ${
              thisQuestion.answer.includes("Б") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "В" ${
              thisQuestion.answer.includes("В") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Г" ${
              thisQuestion.answer.includes("Г") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Д" ${
              thisQuestion.answer.includes("Д") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Е" ${
              thisQuestion.answer.includes("Е") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Є" ${
              thisQuestion.answer.includes("Є") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
          <td>
            <input answer = "Ж" ${
              thisQuestion.answer.includes("Ж") ? "checked" : ""
            } class="answers-table__option" type="checkbox" name="" id="" />
          </td>
        </tr>
        `;

  let optionRow = answerTable.querySelector(".answers-options-row");
  let options = optionRow.querySelectorAll(".answers-table__option");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((option) => {
        option.checked = false;
      });
      option.checked = true;
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let optionRow = answerTable.querySelector(".answers-options-row");
    let options = optionRow.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      if (option.checked) {
        let localAnswers = localStorage.getItem(questionId);
        localAnswers = JSON.parse(localAnswers);
        if (!localAnswers) {
          return console.error("Error, cannot save your answer");
        }
        localAnswers[questionNumber].answer = [option.getAttribute("answer")];
        localAnswers[questionNumber].submitted = true;
        localStorage.setItem(questionId, JSON.stringify(localAnswers));
        testpage.showAnsweredInNav(localAnswers);
        testpage.openQuestion(questionsArr, +questionNumber + 1);
      }
    });
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function chooseMany4x4(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
   
    <tr>
    <td>
    <p class="answers-table__option"></p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">1</p>
      </td>
       <td>
          <input answer = "А" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "А" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "Б" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "Б" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "В" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "В" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "Г" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "Г" ? "checked" : ""
          } name="" id="" />
        </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">2</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">3</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">4</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
  
        `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function chooseMany3x5(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
    
    <tr>
    <td>
    <p class="answers-table__option"></p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">1</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "А" ? "checked" : ""
        } name="" id="" />
        </td>
        <td>
          <input answer = "Б" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "Б" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "В" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "В" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "Г" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "Г" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">2</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "А" ? "checked" : ""
      } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">3</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "А" ? "checked" : ""
      } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
  
        `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function chooseMany4x5(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
    
    <tr>
    <td>
    <p class="answers-table__option"></p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">1</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "А" ? "checked" : ""
      } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td> 
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">2</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "А" ? "checked" : ""
      } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td> 
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">3</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "А" ? "checked" : ""
      } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td> 
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">4</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "А" ? "checked" : ""
      } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td> 
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
        `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function chooseMany5x4(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
   
    <tr>
    <td>
    <p class="answers-table__option"></p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">1</p>
      </td>
       <td>
          <input answer = "А" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "А" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "Б" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "Б" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "В" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "В" ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "Г" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer[0] == "Г" ? "checked" : ""
          } name="" id="" />
        </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">2</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">3</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">4</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">5</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[4] == "А" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Б" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[4] == "Б" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "В" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[4] == "В" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Г" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[4] == "Г" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
  
        `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function chooseMany5x8(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
   
    <tr>
    <td>
    <p class="answers-table__option"></p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "F" : "Е"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "G" : "Є"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "H" : "Ж"}</p>
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">1</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">2</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">3</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">4</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">5</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Е" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Е" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Є" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Є" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Ж" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Ж" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
  
        `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function chooseMany6x8(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
   
    <tr>
    <td>
    <p class="answers-table__option"></p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "F" : "Е"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "G" : "Є"}</p>
    </td>
    <td>
    <p class="answers-table__option">${subject == "eng" ? "H" : "Ж"}</p>
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">1</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">2</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[1] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">3</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[2] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">4</p>
      </td>
      <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Д" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Д" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Е" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Е" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Є" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Є" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Ж" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[3] == "Ж" ? "checked" : ""
        } name="" id="" />
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">5</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Е" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Е" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Є" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Є" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Ж" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[4] == "Ж" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <p class="answers-table__option">6</p>
      </td>
      <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Е" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "Е" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Є" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "Є" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Ж" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[5] == "Ж" ? "checked" : ""
      } name="" id="" />
    </td>
    </tr>
  
        `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function enter1digit(questionId, questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table", "enter-digit");
  answerTable.innerHTML = `
    <tr>
      <td>
        <p class="answers-table__option">${
          subject == "eng" ? "Enter answer" : "Впишіть відповідь"
        }</p>
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <input type="text" value = ${
          thisQuestion.answer[0] != null ? thisQuestion.answer[0] : ""
        } >
      </td>
    </tr>
        `;

  let digitInput = answerTable.querySelector(".answers-options-row input");
  digitInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue.startsWith("0")) {
      event.target.value = inputValue.slice(1);
      return;
    }
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (char == "-" && i == 0) {
        filteredValue += char;
      }
      if (!isNaN(char) && char !== "," && char !== "." && char !== " ") {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let digitInput = answerTable.querySelector(".answers-options-row input");
    if (!digitInput) {
      return console.error("Error, cannot save your answer");
    }
    let value = digitInput.value;

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = [value];
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function enter2digits(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table", "enter-digit-2");
  answerTable.innerHTML = `
    <tr>
      <td colspan="3">
      <p class="answers-table__option">${
        subject == "eng" ? "Enter answer" : "Впишіть відповідь"
      }</p>
      </td>
    </tr>
    <tr class="answers-options-row">
      <td>
        <input class="whole" type="text" value = ${
          thisQuestion.answer[0] != null ? thisQuestion.answer[0] : ""
        } >
      </td>
      <td>
        <p class="answers-table__option">,</p>
      </td>
      <td>
        <input class="fractional" type="text" ${
          thisQuestion.answer[1] != null ? thisQuestion.answer[1] : ""
        } >
      </td>
    </tr>
        `;

  // перевірка на ціле число
  let digitInput1 = answerTable.querySelector(
    ".answers-options-row input.whole"
  );
  digitInput1.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue.startsWith("0")) {
      event.target.value = inputValue.slice(1);
      return;
    }
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (char == "-" && i == 0) {
        filteredValue += char;
      }
      if (!isNaN(char) && char !== "," && char !== "." && char !== " ") {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  });

  // перевірка на дробове число
  let digitInput2 = answerTable.querySelector(
    ".answers-options-row input.fractional"
  );
  digitInput2.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (char == 0 && i == 0) {
        filteredValue += char;
      }
      if (
        !isNaN(char) &&
        char !== "," &&
        char !== "." &&
        char !== " " &&
        char != "-" &&
        char != 0
      ) {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let digitInput1 = answerTable.querySelector(
      ".answers-options-row input.whole"
    );
    let digitInput2 = answerTable.querySelector(
      ".answers-options-row input.fractional"
    );
    if (!digitInput1 || !digitInput2) {
      return console.error("Error, cannot save your answer");
    }
    let whole = digitInput1.value;
    let fractional = digitInput2.value;
    if (fractional == "") {
      fractional = 0;
    }
    if (whole == "") {
      whole = 0;
    }

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = [whole, fractional];
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
export function enter3digits(
  questionId,
  questionsArr,
  questionNumber,
  subject
) {
  let answersArr = localStorage.getItem(questionId);

  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table", "enter-digit-2");
  answerTable.innerHTML = `
    <tr>
    <td colspan="3">
    <p class="answers-table__option">${
      subject == "eng" ? "Enter answer" : "Впишіть відповідь"
    }</p>
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <input class="digit-1" type="number" value = ${
        thisQuestion.answer[0] != null ? thisQuestion.answer[0] : ""
      } />
    </td>
    <td>
      <input class="digit-2" type="number" value = ${
        thisQuestion.answer[0] != null ? thisQuestion.answer[1] : ""
      } />
    </td>
    <td>
      <input class="digit-3" type="number" value = ${
        thisQuestion.answer[0] != null ? thisQuestion.answer[2] : ""
      } />
    </td>
  </tr>
        `;

  // перевірка на ціле число
  let digitInput1 = answerTable.querySelector(
    ".answers-options-row input.digit-1"
  );
  digitInput1.addEventListener("input", function (e) {
    validateInput(e);
  });
  let digitInput2 = answerTable.querySelector(
    ".answers-options-row input.digit-2"
  );
  digitInput2.addEventListener("input", function (e) {
    validateInput(e);
  });
  let digitInput3 = answerTable.querySelector(
    ".answers-options-row input.digit-3"
  );
  digitInput3.addEventListener("input", function (e) {
    validateInput(e);
  });

  function validateInput(event) {
    let inputValue = event.target.value;
    if (inputValue.startsWith("0")) {
      event.target.value = inputValue.slice(1);
      return;
    }
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (
        !isNaN(char) &&
        char !== "," &&
        char !== "." &&
        char !== " " &&
        char !== "-"
      ) {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  }

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let digitInput1 = answerTable.querySelector(
      ".answers-options-row input.digit-1"
    );
    let digitInput2 = answerTable.querySelector(
      ".answers-options-row input.digit-2"
    );
    let digitInput3 = answerTable.querySelector(
      ".answers-options-row input.digit-3"
    );
    if (!digitInput1 || !digitInput2 || !digitInput3) {
      return console.error("Error, cannot save your answer");
    }

    digitInput1 = digitInput1.value;
    digitInput2 = digitInput2.value;
    digitInput3 = digitInput3.value;

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = [
      digitInput1,
      digitInput2,
      digitInput3,
    ];
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
