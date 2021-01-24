const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector("input");
const pendingList = document.querySelector(".pendingList");
const completeList = document.querySelector(".completeList");

const PENDING = "PENDING";
const COMPLETE = "COMPLETE";

let pendingArray = [];
let completeArray = [];

function getTaskObject(text) {
  return {
    id: String(Date.now()),
    text: text,
  };
}

function updatePendingArray(taskId) {
  pendingArray = pendingArray.filter(function (task) {
    return task.id !== taskId;
  });
}

function updateCompleteArray(taskId) {
  completeArray = completeArray.filter(function (task) {
    return task.id !== taskId;
  });
}

function findPendingClick(taskId) {
  return pendingArray.find(function (task) {
    return task.id === taskId;
  });
}

function findCompleteClick(taskId) {
  return completeArray.find(function (task) {
    return task.id === taskId;
  });
}

function handleDelBtnClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  updatePendingArray(li.id);
  updateCompleteArray(li.id);
  saveState();
}

function handleComBtnClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  const task = findPendingClick(li.id);
  updatePendingArray(li.id);
  pushCompleteArrayFromPending(task);
  paintCompleteTask(task);
  saveState();
}

function handleBackBtnClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  const task = findCompleteClick(li.id);
  updateCompleteArray(li.id);
  pushPendingArrayFromComplete(task);
  paintPendingTask(task);
  saveState();
}

function buildRootLi(task) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  span.innerText = task.text;
  delBtn.innerText = "Delete";
  delBtn.addEventListener("click", handleDelBtnClick);
  li.append(span, delBtn);
  li.id = task.id;
  return li;
}

function paintPendingTask(task) {
  const rootLi = buildRootLi(task);
  const comBtn = document.createElement("button");
  comBtn.innerText = "Done";
  comBtn.addEventListener("click", handleComBtnClick);
  rootLi.append(comBtn);
  pendingList.append(rootLi);
}

function paintCompleteTask(task) {
  const rootLi = buildRootLi(task);
  rootLi.style.textDecoration = "line-through";
  rootLi.style.textDecorationColor = "red";
  const backBtn = document.createElement("button");
  backBtn.innerText = "restoration";
  backBtn.addEventListener("click", handleBackBtnClick);
  rootLi.append(backBtn);
  completeList.append(rootLi);
}

function saveState() {
  localStorage.setItem(PENDING, JSON.stringify(pendingArray));
  localStorage.setItem(COMPLETE, JSON.stringify(completeArray));
}

function pushPendingArrayFromInput(task) {
  pendingArray.push(task);
}

function pushCompleteArrayFromPending(task) {
  completeArray.push(task);
}

function pushPendingArrayFromComplete(task) {
  pendingArray.push(task);
}

function handleFormSubmit(e) {
  e.preventDefault();
  const taskObj = getTaskObject(toDoInput.value);
  toDoInput.value = "";
  paintPendingTask(taskObj);
  pushPendingArrayFromInput(taskObj);
  saveState();
}

function loadState() {
  pendingArray = JSON.parse(localStorage.getItem(PENDING)) || [];
  completeArray = JSON.parse(localStorage.getItem(COMPLETE)) || [];
}

function restoreState() {
  pendingArray.forEach(function (task) {
    paintPendingTask(task);
  });
  completeArray.forEach(function (task) {
    paintCompleteTask(task);
  });
}

function init() {
  toDoForm.addEventListener("submit", handleFormSubmit);
  loadState();
  restoreState();
}
init();
