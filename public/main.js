const fontSize = 0.50;
const main = document.querySelector(".main");
main.style.fontSize = `${fontSize}em`;
let canRotateSide = true;
let canRotateCube = true;
const screen = document.querySelector(".screen");
screen.style['-webkit-transform'] = "matrix3d(0.85, 0.20, 0.45, 0, 0, 0.9, -0.4, 0, -0.5, 0.4, 0.8, 0, 0, 0, 0, 1)";
const cube = document.querySelector(".cube");
let back = [];

/* if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  alert("К сожалению, пока не доделал обраотку тачскина для мобильных устройств\n Воспользуйтесь настольной версией браузера");
} */

prevent = function () {
  event.preventDefault();
};

let target1 = "";
let target2 = "";

touchMove = (event) => {
  x1 = event.touches[0].clientX;
  y1 = event.touches[0].clientY;
  if (canRotateCube === false) {
    return;
  }
  setTimeout(() => {
    x2 = event.touches[0].clientX;
    y2 = event.touches[0].clientY;
    const y = -(x2 - x1) / 5;
    const x = (y2 - y1) / 5;
    cubeRotate(x, y);
  }, 50);
};

move = (event) => {
  x1 = event.pageX;
  y1 = event.pageY;
  if (canRotateCube === false) {
    return;
  }
  setTimeout(() => {
    x2 = event.pageX;
    y2 = event.pageY;
    const y = -(x2 - x1) / 20;
    const x = (y2 - y1) / 20;
    cubeRotate(x, y);
  }, 50);
};

touchElem = function (event) {
  if (target1 !== "") {
    target2 = event.touches[0].target;
  } else {
    target1 = event.touches[0].target;
  }
  if (target1 !== target2 && target1 !== "" && target2 !== "") {
    getRotationData(target1, target2);
    target1 = "";
    target2 = "";
  } else {
    return;
  }
};

document.addEventListener("touchstart", touchElem);
document.addEventListener("touchmove", touchMove);

getRotationData = function (targ1, targ2) {
  let rot;
  let direction;

  let prevTarget = targ1;
  let nextTarget = targ2;

  if (prevTarget.className.slice("side", 12) !== nextTarget.className.slice("side", 12) && prevTarget.children[0].classList.contains("color") === true && nextTarget.children[0].classList.contains("color") === true) {
    canRotate = false;
    string1 = prevTarget.parentNode.className.slice(prevTarget.parentNode.className.indexOf("x")).replace(/[ ^-d]/g, '');
    string2 = nextTarget.parentNode.className.slice(nextTarget.parentNode.className.indexOf("x")).replace(/[ ^-d]/g, '');

    for (let i = 0; i < 6; i++) {
      if (string2[i] !== string1[i]) {
        direction = +string1[i] - string2[i];
        rot = string1[i - 1];
        i = 5;
      }
    }
    side = prevTarget.className[prevTarget.className.length - 2] + prevTarget.className[prevTarget.className.length - 1];
    className = string1[0] + string1[1] + "." + string1[2] + string1[3] + "." + string1[4] + string1[5];

    checkAngle(className, side, rot, direction);

  } else {
    return;
  }
};

mouseDown = function (event) {
  if (event.which === 1) {
    mouseUp = function () {
      cube.removeEventListener("mouseover", mouseOver);
    };
    mouseOver = function (event) {
      if (canRotateSide === false) {
        return;
      }
      cube.removeEventListener("mouseover", mouseOver);
      prevTarget = event.relatedTarget;
      nextTarget = event.target;
      getRotationData(prevTarget, nextTarget);
    };
    document.addEventListener("mouseup", mouseUp);
    cube.addEventListener("mouseover", mouseOver);

  } else {
    if (event.which === 3) {
      mouseUp = function () {
        document.removeEventListener("mousedown", move);
        document.removeEventListener("mousemove", move);
      };
      window.addEventListener("onblur", mouseUp);
      document.addEventListener("mouseup", mouseUp);
      document.addEventListener("mousemove", move);
    } else {
      return;
    }
  }
};
document.addEventListener("mousedown", mouseDown);
document.addEventListener("contextmenu", prevent);

cubeRotate = function (x, y) {
  const node = document.querySelector(".screen");
  let finalMatrix = "";
  let matrixString = "";

  XYMatrix = multiplyMatrix(xRot(x), yRot(y));
  finalMatrix = [].concat(...multiplyMatrix(getMatrix(".screen"), XYMatrix));
  for (let i = 0; i < 15; i++) {
    matrixString = matrixString + finalMatrix[i] + ", ";
  }
  matrixString = "matrix3d" + ("(") + matrixString + finalMatrix[15] + ")";
  node.style['-webkit-transform'] = matrixString;
};

createArray = function (length) {
  let arr = new Array(length || 0),
    i = length;
  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) {
      arr[length - 1 - i] = createArray.apply(this, args);
    }
  }
  return arr;
};

newMatrix = function () {
  const newMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  return newMatrix;
};

const coords = createArray(28, 8);
for (i = 1; i < 28; i++) {
  for (j = 0; j < 8; j++) {
    coords[i][j] = newMatrix();
  }
}

createCubes = function () {
  const colors = ["white", "blue", "green", "yellow", "orange", "red"];
  const classes = ["fc", "tp", "bk", "bm", "lt", "rt"];

  createDiv = function (idTag, divName) {
    newDiv = document.createElement("div");
    document.querySelector(idTag).appendChild(newDiv);
    newDiv.className = divName;
    return divName;
  };

  setColors = function () {
    const edges = ["z3", "y1", "z1", "y3", "x1", "x3"];
    const faceTemp = [];
    for (let j = 0; j < 6; j++) {
      const face = document.querySelectorAll("." + edges[j]);
      for (let i = 0; i < 9; i++) {
        faceTemp[i] = face[i].children[j].firstChild;
        faceTemp[i].classList.add("color", colors[j], `f${j}`, `r${i}`);
      }
    }
  };

  for (let z = 0; z < 3; z++) {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        let index = 9 * z + 3 * y + x + 1;
        createDiv(".cube", `cub cub-${index} x${x + 1} y${y + 1} z${z + 1}`);
        newDiv.style['-webkit-transform'] = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${10 *  (x - 1) * 16* fontSize}, ${10 * (y - 1) * 16 * fontSize}, ${10 * (z - 1) * 16 * fontSize}, 1)`;

        let count = 0;
        for (a = -1; a < 2; a += 2) {
          for (b = -1; b < 2; b += 2) {
            for (c = -1; c < 2; c += 2) {
              coords[index][count][3][0] = (((x - 1) + c * 1 / 2) * 10 * 16 * fontSize);
              coords[index][count][3][1] = (((y - 1) + b * 1 / 2) * 10 * 16 * fontSize);
              coords[index][count][3][2] = (((z - 1) - a * 1 / 2) * 10 * 16 * fontSize);
              count++;
            }
          }
        }

        for (let m = 0; m < classes.length; m++) {
          createDiv(`.cub-${index}`, `side side-${index} ${classes[m]}`);
          createDiv(`.side.side-${index}.${classes[m]}`, `${index}-${m}`);
        }
      }
    }
  }
  setColors();
};
createCubes();

getMatrix = function (elem) {
  node = getNode(elem);
  const currentMatrix = createArray(4, 4);
  let matrixString = node.style['-webkit-transform'];
  let matrix3d = matrixString.slice(matrixString.indexOf("matrix3d") + 9, matrixString.indexOf(")")).split(",");
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      currentMatrix[j][i] = +matrix3d[j * 4 + i];
    }
  }
  return currentMatrix;
};

setClasses = function (sides, matrix) {
  for (let j = 0; j < 9; j++) {
    sides[j].classList.remove("x1", "x2", "x3", "y1", "y2", "y3", "z1", "z2", "z3");
    sides[j].classList.add(`x${Math.round(matrix[j][12] / (10 * 16 * fontSize)) + 2}`, `y${Math.round(matrix[j][13] / (10 * 16 * fontSize)) + 2}`, `z${Math.round(matrix[j][14] / (10 * 16 * fontSize)) + 2}`);
    clearMatrix(sides[j]);
    setMatrix(sides[j]);
  }
  setTimeout(() => {
    canRotateSide = true;
  }, 50);
  return;
};

sideRotate = function (name, angle, speed) {
  if (canRotateSide === false) {
    return;
  }
  canRotateSide = false;
  const sides = document.querySelectorAll("." + name);
  let method = window[name[0] + "Rot"];
  const finalMatrix = [];
  const index = [];
  for (k = 0; k < 9; k++) {
    index[k] = +sides[k].children[0].className.slice(10, sides[k].children[0].className.indexOf("x") - 1);
    for (l = 0; l < 8; l++) {
      coords[index[k]][l] = multiplyMatrix(coords[index[k]][l], method(angle * 30));
    }
  }
  for (let t = 0; t < 30; t++) {
    const matrixString = ["", "", "", "", "", "", "", "", ""];
    ((t) => {
      setTimeout(() => {
        for (let j = 0; j < 9; j++) {
          finalMatrix[j] = [].concat(...multiplyMatrix(getMatrix(sides[j]), method(angle)));
          for (let i = 0; i < 15; i++) {
            matrixString[j] = matrixString[j] + finalMatrix[j][i] + ", ";
          }
          matrixString[j] = "matrix3d" + ("(") + matrixString[j] + finalMatrix[j][15] + ")";
          sides[j].style['-webkit-transform'] = matrixString[j];
        }
      }, speed * t);
    })(t);
  }
  setTimeout(() => {
    setClasses(sides, finalMatrix);
  }, speed * 35);
};

multiplyMatrix = function (matrixA, matrixB) {
  let result = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  for (let k = 0; k < 4; k++) {
    for (let l = 0; l < 4; l++) {
      for (let m = 0; m < 4; m++) {
        result[k][l] = result[k][l] + matrixA[k][m] * matrixB[m][l];
      }
    }
  }
  return result;
};


cos = function (a) {
  return +Math.cos(-a).toFixed(10);
};
sin = function (a) {
  return +Math.sin(a).toFixed(10);
};

xRot = function (angle) {
  let x = angle * (Math.PI / 180),
    matrix = newMatrix();
  matrix[1][1] = cos(-x);
  matrix[1][2] = sin(x);
  matrix[2][1] = sin(-x);
  matrix[2][2] = cos(-x);
  return matrix;
};

yRot = function (angle) {
  let x = angle * (Math.PI / 180),
    matrix = newMatrix();
  matrix[0][0] = cos(-x);
  matrix[0][2] = sin(-x);
  matrix[2][0] = sin(x);
  matrix[2][2] = cos(-x);
  return matrix;
};

zRot = function (angle) {
  let x = angle * (Math.PI / 180),
    matrix = newMatrix();
  matrix[0][0] = cos(x);
  matrix[0][1] = sin(x);
  matrix[1][0] = sin(-x);
  matrix[1][1] = cos(x);
  return matrix;
};

clearMatrix = function (elem) {
  const cub = getMatrix(elem);
  let cube = [];
  for (j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      cube[j * 4 + i] = Math.round(cub[j][i]);
    }
  }
  return cube;
};

setMatrix = function (elem) {
  node = getNode(elem);
  let matrixString = "";
  cub = clearMatrix(elem);
  for (let i = 0; i < 15; i++) {
    matrixString = matrixString + cub[i] + ", ";
  }
  matrixString = "matrix3d" + ("(") + matrixString + cub[15] + ")";
  node.style['-webkit-transform'] = matrixString;
};

getNode = function (elem) {
  if (!elem.style) {
    if (elem[0] !== ".") {
      node = document.querySelector("." + elem);
    } else {
      node = document.querySelector(elem);
    }
  } else {
    node = elem;
  }
  return node;
};

rotateBack = function () {
  let options = document.querySelector(".options");
  options.style.display = "none";
  for (let t = 0; t < back.length; t++) {
    ((t) => {
      setTimeout(() => {
        sideRotate(back[back.length - t - 1][0], +(-back[back.length - t - 1][1]), 2);
      }, 200 * t);
    })(t);
  }
  setTimeout(() => {
    options.style.display = "block";
    back = [];
  }, back.length * 200);
};

shuffle = function () {
  let options = document.querySelector(".options");
  options.style.display = "none";
  let name = "";
  let axe = "";
  let edge = 0;
  let angle = 0;
  for (let t = 0; t < 25; t++) {
    ((t) => {
      setTimeout(() => {
        angle = Math.round(Math.random());
        if (angle === 0) {
          angle = -1;
        }
        angle = angle * 3;
        edge = Math.round(Math.random() * 2 + 1);
        axe = Math.round(Math.random() * 2 + 1).toString();

        switch (axe) {
          case "1":
            name = "x" + edge;
            break;
          case "2":
            name = "y" + edge;
            break;
          case "3":
            name = "z" + edge;
            break;
        }
        back.push([name, angle]);
        sideRotate(name, angle, 2);
      }, 200 * t);
    })(t);
  }
  setTimeout(() => {
    options.style.display = "block";
  }, 5000);
};

checkAngle = function (className, side, rot, direction) {
  let axe = "";
  let name = "";
  let angle = "";

  node = getNode(className);
  index = +node.children[0].className.slice(10, node.children[0].className.indexOf("x") - 1);
  axe = checkSide(index, side);

  switch (rot) {
    case "x":
      if (axe === "z") {
        name = className[3] + className[4];
        angle = -3 * direction;
        if (+className[7] === 1) {
          angle = -angle;
        }
      } else {
        name = className[6] + className[7];
        angle = -3 * direction;
        if (+className[4] === 3) {
          angle = -angle;
        }
      }
      break;
    case "y":
      if (axe === "z") {
        name = className[0] + className[1];
        angle = 3 * direction;
        if (+className[7] === 1) {
          angle = -angle;
        }
      } else {
        name = className[6] + className[7];
        angle = -3 * direction;
        if (+className[1] === 1) {
          angle = -angle;
        }
      }
      break;
    case "z":
      if (axe === "y") {
        name = className[0] + className[1];
        angle = 3 * direction;
        if (+className[4] === 3) {
          angle = -angle;
        }
      } else {
        name = className[3] + className[4];
        angle = 3 * direction;
        if (+className[1] === 1) {
          angle = -angle;
        }
      }
      break;
  }

  back.push([name, angle]);
  canRotate = true;
  sideRotate(name, angle, 6);
};

checkSide = function (index, side) {
  let countX = 0;
  let countY = 0;
  let countZ = 0;
  let axe = "";
  ids = [];

  switch (side) {
    case "fc":
      ids = [0, 1, 2, 3];
      break;
    case "bk":
      ids = [4, 5, 6, 7];
      break;
    case "tp":
      ids = [0, 1, 4, 5];
      break;
    case "bm":
      ids = [2, 3, 6, 7];
      break;
    case "lt":
      ids = [0, 2, 4, 6];
      break;
    case "rt":
      ids = [1, 3, 5, 7];
      break;
  }
  for (i = 0; i < 3; i++) {
    if (coords[index][ids[i]][3][0] === coords[index][ids[i + 1]][3][0]) {
      countX++;
      if (countX === 3) {
        axe = "x";
      }
    }
    if (coords[index][ids[i]][3][1] === coords[index][ids[i + 1]][3][1]) {
      countY++;
      if (countY === 3) {
        axe = "y";
      }
    }
    if (coords[index][ids[i]][3][2] === coords[index][ids[i + 1]][3][2]) {
      countZ++;
      if (countZ === 3) {
        axe = "z";
      }
    }

  }
  return axe;
};