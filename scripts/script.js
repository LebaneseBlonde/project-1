// ! ************ VARIABLES **************
// ? js variables
const width = 12
const height = 21
const numCells = width * height
let cellsArray = []
let rowsCleared = 0
let score = 0
let shapeMoving = false
let ableToMove = true
let hasCollision = false
let blockedCells = []
let inactiveCells = []
let newCoords = []
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
  hasCollision = false
  activeShapeCoords.forEach(num => {
    if(blockedCells.includes(num + width) || inactiveCells.includes(num + width)) {
      shapeMoving = false
      hasCollision = true
    }
  })
  if (hasCollision) {
    activeShapeCoords.forEach(element => {
      cellsArray[element].classList.remove('active-shape')
      cellsArray[element].classList.add('inactive-shape')
    })
    inactiveCells.push(activeShapeCoords)
    inactiveCells = inactiveCells.flat()
    addShape()
  }
}

function checkShapeMove() {
  activeShapeCoords.forEach(num => {
    if((blockedCells.includes(num -= 1) || inactiveCells.includes(num -= 1)) ||
      (blockedCells.includes(num += 1) || inactiveCells.includes(num += 1))) {
        ableToMove = false
    }
  })
}

// function moveShape(numToMove) {
//   newCoords = []
//     activeShapeCoords.forEach(num => {
//       cellsArray[num].classList.remove('active-shape')
//       newCoords.push(num += numToMove)
//     })
//     activeShapeCoords = newCoords
//     activeShapeCoords.forEach(num => {
//       cellsArray[num].classList.add('active-shape')
//     })
//   checkCollision()
// }

function rotateShape() {
  
}

function clearRow() {
  
}

function resetGame() {
    shapeMoving = false
    gameActive = 0
    inactiveCells = []
    rowsCleared = 0
    score = 0
    pauseButton.innerHTML = 'Pause'
    cellsArray.forEach(cell => {
      cell.classList.remove('shape')
      cell.classList.remove('active-shape')
      cell.classList.remove('inactive-shape')
    })
}


function gameOver() {
  
}
// ! **************************

// ! ************ SET INTERVALS **************
const shapeMovementInterval = setInterval(() => {
  if(shapeMoving) {  
    newCoords = []
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
}, 200);

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
    resetGame()
  }
})

document.addEventListener('keyup', (event) => {
  const key = event.key

  if (key === 'w' && !hasCollision) {
    console.log('rotate');
  } else if (key === 'a' && !hasCollision && ableToMove) {
     -= 1
  } else if (key === 's' && !hasCollision && ableToMove) {
    console.log('im fast as fuck boiiii!');
  } else if (key === 'd' && !hasCollision && ableToMove) {
    harry += 1
  }
})

// ! **************************