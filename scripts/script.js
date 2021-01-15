// ! ************ VARIABLES **************
// ? js variables
const width = 12
const height = 21
const numCells = width * height
let cellsArray = []
let rowsCleared = 0
let score = 0
let shapeMoving = false
let blockedCells = []
// ? object with arrays of shapes starting coords
const shapeArrays = {
  squareShape: [5, 6, 17, 18],
  l1Shape: [5, 6, 7, 17],
  l2Shape: [5, 6, 7, 18],
  lineShape: [4, 5, 6, 7],
  tShape: [5, 6, 7, 18],
  s1Shape: [5, 6, 16, 17],
  s2Shape: [5, 6, 18, 19]
}
let activeShapeCoords = []
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
    blockedCells.push(cell.id)
  } else if (i % width === width - 1) {
    cell.classList.add('walls')
    blockedCells.push(cell.id)
  } else if (i + width >= width * height) {
    cell.classList.add('walls')
    blockedCells.push(cell.id)
  }
}
// ! **************************


// ! ************ FUNCTIONS **************
function addShape() {
  // ? below selects random shape from object and inserts into onto the grid
  const shapeKeys = Object.keys(shapeArrays)
  const randomShapeIndex = Math.floor(Math.random() * shapeKeys.length) 
  const randomShapeKey = shapeKeys[randomShapeIndex] 
  const randomShape = shapeArrays[randomShapeKey]
  activeShapeCoords = randomShape
  // console.log(activeShapeCoords)
  randomShape.forEach(element => {
    cellsArray[element].classList.add('shape')        
    cellsArray[element].classList.add('active-shape')  
  })
  
  // ? below starts set interval moving shape down the grid
  const shapeMovementInterval = setInterval(() => {
    // console.log(activeShapeCoords)
    for(let i = 0; i < activeShapeCoords.length; i++) {
      // console.log(cellsArray[activeShapeCoords[i]].id);
      if(cellsArray[activeShapeCoords[i]] > width && cellsArray[activeShapeCoords[i - width]].classList.contains('active-shape')) {
        console.log('hi');
        cellsArray[activeShapeCoords[i]].classList.remove('active-shape')
      }
      activeShapeCoords[i] += width
      cellsArray[activeShapeCoords[i]].classList.add('active-shape')
      // console.log(activeShapeCoords);
    }
  }, 1000);
}
addShape()

function startGame() {
  resetGame()
  addObject()
}

function checkCollusion() {
  activeShapeCoords.forEach(num => {
    if(blockedCells.includes(num + width)) {
      shapeMoving = false
      blockedCells.push(activeShapeCoords)
      document.getElementById(num).classList.remove('active-shape')
      document.getElementById(num).classList.add('inactive-shape')
      addShape()
    }

  })
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