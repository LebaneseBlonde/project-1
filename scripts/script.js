// ! ************ VARIABLES **************
// ? js variables
const width = 11
const height = 20
const numCells = width * height
let cellsArray = []
// ? object with arrays of shapes starting coords
const shapeArrays = {
  squareShape: [4, 5, 14, 15],
  l1Shape: [4, 5, 6, 14],
  l2Shape: [4, 5, 6, 16],
  lineShape: [3, 4, 5, 6],
  tShape: [4, 5, 6, 15],
  s1Shape: [4, 5, 15, 16],
  s2Shape: [4, 5, 13, 14]
}

// ?  dom variables
const grid = document.querySelector('.grid')
const startButton = document.querySelector('.start-button')
const resetButton = document.querySelector('.reset-button')
// ! **************************

// ! ************ INIT **************
// ? create grid & cells - apply styling/classes
for (let i = 0; i < numCells; i++) {
  const cell = document.createElement('div')
  cell.classList.add('cells')
  cell.id = i
  cell.innerHTML = i
  cellsArray.push(cell)
  grid.appendChild(cell)
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / height}%`
  if (i % width === 0) {
    cell.classList.add('walls')
  } else if (i % width === width - 1) {
    cell.classList.add('walls')
  } else if (i + width >= width * height) {
    cell.classList.add('walls')
  }
}
// ! **************************


// ! ************ FUNCTIONS **************
function addShape() {
  const shapeKeys = Object.keys(shapeArrays)
  const randomShapeIndex = Math.floor(Math.random() * shapeKeys.length) 
  const randomShapeKey = shapeKeys[randomShapeIndex] 
  const randomShape = shapeArrays[randomShapeKey]
  console.log(randomShape);
  randomShape.forEach(element => {
    cellsArray[element].classList.add('shape')        
  });
}
addShape()

function startGame() {
  resetGame()
  addObject()
}

function checkCollusion() {
  
}

function rotateShape() {
  
}

function clearRow() {
  
}

function resetGame() {
  
}


function gameOver() {
  
}
// ! **************************


// ! ************ EVENT LISTENERS **************

// ! **************************