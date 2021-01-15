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
  shapeMoving = true
  
  randomShape.forEach(element => {
    cellsArray[element].classList.add('shape')        
    cellsArray[element].classList.add('active-shape')  
  })
}
addShape()

function startGame() {
  resetGame()
  addObject()
}

function checkCollision() {
  activeShapeCoords.forEach(num => {
    // console.log(blockedCells);
    if(blockedCells.includes(String(num + width))) {
      shapeMoving = false
      // blockedCells.push(String(nu))
      blockedCells = [].concat.apply([], blockedCells)
      // console.log(blockedCells);
      // rather than just num remove active for all and add inactive for all active coords
      activeShapeCoords.forEach(element => {
        cellsArray[element].classList.remove('active-shape')
        cellsArray[element].classList.add('inactive-shape')
        blockedCells.push(String(element))
      })
      

      // document.getElementById(num).classList.remove('active-shape')
      // document.getElementById(num).classList.add('inactive-shape')
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


const shapeMovementInterval = setInterval(() => {
  if(shapeMoving === true) {  
    for (let i = 0; i < activeShapeCoords.length; i++) {
      cellsArray[activeShapeCoords[i]].classList.remove('active-shape')
      activeShapeCoords[i] += width
    }
    activeShapeCoords.forEach(num => {
        cellsArray[num].classList.add('active-shape')
    })
    checkCollision()
  }
}, 500);


// ! ************ EVENT LISTENERS **************

// ! **************************