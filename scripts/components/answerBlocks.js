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

    if (inputValue.startsWith(",")) {
      inputValue = "";
    }
    if (inputValue.startsWith("-")) {
      inputValue = inputValue.replace(/-/g, (_, i) => (i === 0 ? "-" : ""));
    }

    let commaCount = 0;
    let filteredValue = "";

    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (char === "-") {
        if (i === 0) {
          filteredValue += char;
        }
      } else if (char === ",") {
        if (commaCount < 1) {
          filteredValue += char;
          commaCount++;
        }
      } else if (!isNaN(char) && char !== " ") {
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
  answerTable.classList.add("answers-table", "enter-digit-3");
  answerTable.innerHTML = `
    <tr>
    <td colspan="3">
    <p class="answers-table__option">${
      subject == "eng" ? "Enter answer" : "Впишіть 3 відповіді"
    }</p>
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <input class="digit" type="number" />
    </td>
  </tr>
        `;

  let input = answerTable.querySelector(".digit");
  thisQuestion.answer.forEach((answer) => {
    if (answer && input) {
      input.value += answer;
    }
  });

  // перевірка на ціле число
  let digitInput = answerTable.querySelector(
    ".answers-options-row input.digit"
  );
  digitInput.addEventListener("input", function (e) {
    validateInput(e);
  });

  function validateInput(event) {
    let inputValue = event.target.value;

    if (inputValue.startsWith("0")) {
      event.target.value = inputValue.slice(1);
      return;
    }

    let filteredValue = "";
    let encounteredNumbers = [];
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (
        !isNaN(char) &&
        char !== "," &&
        char !== "." &&
        char !== " " &&
        char !== "-" &&
        filteredValue.length < 3
      ) {
        filteredValue += char;
        encounteredNumbers.push(char);
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
    let digitInput = answerTable.querySelector(
      ".answers-options-row input.digit"
    );
    if (!digitInput) {
      return console.error("Error, cannot save your answer");
    }

    digitInput = digitInput.value;
    digitInput = digitInput.split("");

    while (digitInput.length < 3) {
      digitInput.push(null);
    }

    let localAnswers = localStorage.getItem(questionId);
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = digitInput;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem(questionId, JSON.stringify(localAnswers));
    testpage.showAnsweredInNav(localAnswers);
    testpage.openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
