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
let inactiveCells = []
let gameActive = 0
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
const pauseButton = document.querySelector('.pause-button')
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
  if ((i % width === 0) || (i % width === width - 1) || (i + width >= width * height)) {
    cell.classList.add('walls')
    blockedCells.push(Number(cell.id))
  }
}
// ! **************************


// ! ************ FUNCTIONS **************
function addShape() {
  // ? below selects random shape from object and inserts into onto the grid
  gameActive =+ 1
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

function startGame() {
  resetGame()
  addObject()
}

function checkCollision() {
  let hasCollision = false
  activeShapeCoords.forEach(num => {
    if(blockedCells.includes(num + width)) {
      shapeMoving = false
      hasCollision = true
    }
  })
  if (hasCollision) {
    activeShapeCoords.forEach(element => {
      cellsArray[element].classList.remove('active-shape')
      cellsArray[element].classList.add('inactive-shape')
      inactiveCells.push(element)
    })
    blockedCells.push(activeShapeCoords)
    blockedCells = blockedCells.flat()
    addShape()
  }
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

// ! ************ SET INTERVALS **************
const shapeMovementInterval = setInterval(() => {
  if(shapeMoving) {  
    let newCoords = []
    activeShapeCoords.forEach(num => {
      cellsArray[num].classList.remove('active-shape')
      newCoords.push(num += width)
    })
    activeShapeCoords = newCoords
    activeShapeCoords.forEach(num => {
      cellsArray[num].classList.add('active-shape')
    })
  }
  checkCollision()
}, 500);

// ! **************************

// ! ************ EVENT LISTENERS **************
startButton.addEventListener('click', () => {
  if (gameActive) return 
  addShape()
}) 

pauseButton.addEventListener('click', () => {
  if (shapeMoving && gameActive) {
    shapeMoving = false
    pauseButton.innerHTML = 'Resume'
  } else if (!shapeMoving && gameActive) {
    shapeMoving = true
    pauseButton.innerHTML = 'Pause'
  }
}) 

resetButton.addEventListener('click', () => {
  if(gameActive) {
    cellsArray.forEach
  }
})


// ! **************************