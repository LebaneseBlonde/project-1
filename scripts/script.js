// ! ************ VARIABLES **************
// ? js variables
const width = 10
const height = 20
let cellsArray = []
let rowsCleared = 0
let score = 0
let shapeMoving = false
let ableToMoveLeft = true
let ableToMoveRight = true
let hasCollision = false
let inactiveCells = []
let gameActive = 0
let currentSpeed = 400
let intervalTime = currentSpeed
// ? object with arrays of shapes starting coords
const iTet = { coords: ['0_3', '0_4', '0_5', '0_6'], background: ['images/i1.png', 'images/i2.png', 'images/i3.png', 'images/i4.png'], pivot: 1 }
const jTet = { coords: ['0_4', '1_4', '1_5', '1_6'], background: ['images/j1.png', 'images/j2.png', 'images/j3.png', 'images/j4.png'], pivot: 2 }
const lTet = { coords: ['0_5', '1_3', '1_4', '1_5'], background: ['images/l1.png', 'images/l2.png', 'images/l3.png', 'images/l4.png'], pivot: 2 }
const oTet = { coords: ['0_4', '0_5', '1_4', '1_5'], background: ['images/o1.png', 'images/o2.png', 'images/o3.png', 'images/o4.png'], pivot: 1 }
const sTet = { coords: ['0_4', '0_5', '1_3', '1_4'], background: ['images/s1.png', 'images/s2.png', 'images/s3.png', 'images/s4.png'], pivot: 3 }
const tTet = { coords: ['0_4', '1_3', '1_4', '1_5'], background: ['images/t1.png', 'images/t2.png', 'images/t3.png', 'images/t4.png'], pivot: 2 }
const zTet = { coords: ['0_4', '0_5', '1_5', '1_6'], background: ['images/z1.png', 'images/z2.png', 'images/z3.png', 'images/z4.png'], pivot: 2 }
let randomShape = {}
let activeShapeCoords = []
// ?  dom variables
const grid = document.querySelector('.grid')
const startButton = document.querySelector('.start-button')
const pauseButton = document.querySelector('.pause-button')
const resetButton = document.querySelector('.reset-button')
const scoreDisplay = document.getElementById('score-num')
const linesDisplay = document.getElementById('lines-num')
scoreDisplay.innerHTML = score
linesDisplay.innerHTML = rowsCleared
// ! **************************


// ! ************ INIT **************
// ? create grid & cells - apply styling/classes
const cell = document.createElement('div')
for (let row = 0; row < height; row++) {
  for (let column = 0; column < width; column++) {
    const cell = document.createElement('div')
    cell.classList.add('cells')
    cell.setAttribute('row', row)
    cell.setAttribute('column', column)
    // cell.innerHTML = `${row}_${column}`
    cell.id = `${row}_${column}`
    cell.style.width = `${100 / width}%`
    cell.style.height = `${100 / height}%`
    grid.appendChild(cell)
    cellsArray.push(cell)
  }
}

// ! **************************

// ! ************ FUNCTIONS **************
function addShape() {
  // ? below selects random shape
  gameActive++
  intervalTime = currentSpeed
  // const shapesArray = [iTet, jTet, lTet, oTet, sTet, tTet, zTet]
  const shapesArray = [iTet]
  const randomShapeIndex = Math.floor(Math.random() * shapesArray.length) 
  randomShape = shapesArray[randomShapeIndex]
  
  // ? below adds the background images to the cells
  randomShape.coords.forEach((coord, index) => {
    const coordBG = document.getElementById(coord)
    coordBG.style.backgroundImage = `url('${randomShape.background[index]}')`
  })

  activeShapeCoords = randomShape.coords
  shapeMoving = true
  activeShapeCoords.forEach(coord => {
    const shape = document.getElementById(coord)
    shape.classList.add('active-shape')  
  })
}

function checkCollision() {
  gameOver()
  hasCollision = false
  activeShapeCoords.forEach(coord => {
    const y = Number(coord.toString().split('_')[0])
    const x = Number(coord.toString().split('_')[1])
    if (y === height - 1 || inactiveCells.includes(`${y + 1}_${x}`)) {
      shapeMoving = false
      hasCollision = true
    }
  })
  if (hasCollision) {
    activeShapeCoords.forEach(coord => {
      const shape = document.getElementById(coord)
      shape.classList.remove('active-shape')
      shape.classList.add('inactive-shape')
    })
    inactiveCells.push(activeShapeCoords)
    inactiveCells = inactiveCells.flat()
    addShape()
  }
}

function checkShapeMove() {
  ableToMoveLeft = true
  ableToMoveRight = true
  activeShapeCoords.forEach(coord => {
    const x = Number(coord.toString().split('_')[1])
    const y = Number(coord.toString().split('_')[0])
    if (x === 0 || inactiveCells.includes(`${y}_${x - 1}`)) {
      ableToMoveLeft = false
    } else if (x === width - 1 || inactiveCells.includes(`${y}_${x + 1}`)) {
      ableToMoveRight = false
    }
  })
}

function moveShape(move, direction) {
  let newCoords = []
  activeShapeCoords.forEach(coord => {
    const coordBG = document.getElementById(coord)
    coordBG.classList.remove('active-shape')
    coordBG.style.backgroundImage = ''

    const y = Number(coord.toString().split('_')[0])
    const x = Number(coord.toString().split('_')[1])
    if (direction === 'vertical') {
      newCoords.push(`${y + move}_${x}`)
    } else if (direction === 'horizontal') {
      newCoords.push(`${y}_${x + move}`)
    }
  })
  activeShapeCoords = newCoords
  activeShapeCoords.forEach((coord, index) => {
    const coordBG = document.getElementById(coord)
    coordBG.classList.add('active-shape')
    coordBG.style.backgroundImage = `url('${randomShape.background[index]}')`
  })
}

function rotateShape() {
  let newCoords = []
  let newCoords2 = []
  activeShapeCoords.forEach((coord, index) => {
    const coordBG = document.getElementById(coord)
    coordBG.classList.remove('active-shape')
    coordBG.style.backgroundImage = ''
    let x = Number(coord.toString().split('_')[1])
    let y = Number(coord.toString().split('_')[0])
    const pivotIndex = 1
    const pivotX = Number(activeShapeCoords[pivotIndex].toString().split('_')[1])
    const pivotY = Number(activeShapeCoords[pivotIndex].toString().split('_')[0])
    const relativeX = x - pivotX
    const relativeY = y - pivotY
    const rotatedX = relativeY
    const rotatedY = -relativeX
    x = pivotX + rotatedX
    y = pivotY + rotatedY
    newCoords.push(`${y}_${x}`)
  }) 
  // ? stops shapes rotating outside the grid on the right side of the x axis
  newCoords.forEach((coord) => {
    let x = Number(coord.toString().split('_')[1])
    let y = Number(coord.toString().split('_')[0])
    if (x > width -1) {
      newCoords2 = newCoords
      newCoords = []
      newCoords2.forEach(coord2 => {
        let x = Number(coord2.toString().split('_')[1])
        let y = Number(coord2.toString().split('_')[0])
        x--
        newCoords.push(`${y}_${x}`)
      })
    }
  })
  // ? stops shapes rotating outside the grid on the left side of the x axis
  newCoords.forEach((coord) => {
    let x = Number(coord.toString().split('_')[1])
    let y = Number(coord.toString().split('_')[0])
    if (x <= 0) {
      newCoords2 = newCoords
      newCoords = []
      newCoords2.forEach(coord2 => {
        let x = Number(coord2.toString().split('_')[1])
        let y = Number(coord2.toString().split('_')[0])
        x++
        newCoords.push(`${y}_${x}`)
      })
    }
  })
  // ? NOT WORKING stops shapes rotating outside the grid on the y axis
  newCoords.forEach((coord) => {
    let x = Number(coord.toString().split('_')[1])
    let y = Number(coord.toString().split('_')[0])
    if (y <= 0) {
      newCoords2 = newCoords
      newCoords = []
      newCoords2.forEach(coord2 => {
        let x = Number(coord2.toString().split('_')[1])
        let y = Number(coord2.toString().split('_')[0])
        y++
        newCoords.push(`${y}_${x}`)
      })
    }
  })
  activeShapeCoords = newCoords
  activeShapeCoords.forEach((coord, index) => {
    const coordBG = document.getElementById(coord)
    coordBG.classList.add('active-shape')
    coordBG.style.backgroundImage = `url('${randomShape.background[index]}')`
    coordBG.style.transform = 'rotate(-90deg)'
  })
  
} 

function clearRow() {
  let rowCounts = {}
  const yCoords = inactiveCells.map(coord => coord.split('_')[0])
  yCoords.forEach(num => rowCounts[num] = (rowCounts[num] || 0) + 1)
  for (const key in rowCounts) {
    if (rowCounts[key] === width) {
      rowsCleared++
      score += 100
      scoreDisplay.innerHTML = score
      linesDisplay.innerHTML = rowsCleared
      for (let i = 0; i < width; i++) {
        document.getElementById(`${key}_${i}`).classList.remove('inactive-shape')
      }
      inactiveCells = inactiveCells.filter(coord => {
        const y = Number(coord.split('_')[0])
        return y !== Number(key)
      })
      let oldCells = []
      let newCells = []
      inactiveCells = inactiveCells.map(coord => {
        const y = Number(coord.split('_')[0])
        const x = Number(coord.split('_')[1])
        if (y < key) {
          oldCells.push(coord)
          newCells.push(`${y + 1}_${x}`)
          return `${y + 1}_${x}`
        } else return coord
      })
      oldCells.forEach(cell => document.getElementById(cell).classList.remove('inactive-shape'))
      newCells.forEach(cell => document.getElementById(cell).classList.add('inactive-shape'))
    }
  }
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
  inactiveCells.forEach(coord => {
    const y = Number(coord.toString().split('_')[0])
    if (y === 0) {
      shapeMoving = false
      ableToMoveLeft = false
      ableToMoveRight = false
      gameActive = 0
      console.log('game over')
    }
  })
}
// ! **************************

// ! ************ SET INTERVALS **************
function shapeMovementTimeout() {
  if (shapeMoving) {
    moveShape(1, 'vertical')
  }
  if (intervalTime === 50) {
    score++
    scoreDisplay.innerHTML = score
  }
  if (rowsCleared === 10) { 
    intervalTime = 325
    currentSpeed = intervalTime
  } else if (rowsCleared === 20) {
    intervalTime = 225
    currentSpeed = intervalTime
  } else if (rowsCleared === 30) {
    intervalTime = 175
    currentSpeed = intervalTime
  }
  checkShapeMove()
  checkCollision()
  clearRow()
  setTimeout(shapeMovementTimeout, intervalTime)
} 
shapeMovementTimeout()
// ! **************************

// ! ************ EVENT LISTENERS **************
startButton.addEventListener('click', () => {
  if (gameActive) return 
  addShape()
}) 

pauseButton.addEventListener('click', () => {
  if (shapeMoving && gameActive) {
    shapeMoving = false
    ableToMoveLeft = false
    ableToMoveRight = false
    pauseButton.innerHTML = 'Resume'
  } else if (!shapeMoving && gameActive) {
    shapeMoving = true
    ableToMoveLeft = true
    ableToMoveRight = false
    pauseButton.innerHTML = 'Pause'
  }
}) 

resetButton.addEventListener('click', () => {
  if(gameActive) {
    resetGame()
  }
})

document.addEventListener('keydown', (event) => {
  checkShapeMove()
  checkCollision()
  const key = event.key
  if (key === 'a' && !hasCollision && ableToMoveLeft && gameActive && shapeMoving) {
     moveShape(-1, 'horizontal')
  } else if (key === 's' && !hasCollision && gameActive && shapeMoving) {
    intervalTime = 50
    // console.log('im fast as fuck boiiii!');
  } else if (key === 'd' && !hasCollision && ableToMoveRight && gameActive && shapeMoving) {
    moveShape(1, 'horizontal')
  }
})

document.addEventListener('keyup', (event) => {
  const key = event.key
  if (key === 's' && !hasCollision && gameActive ) {
    intervalTime = currentSpeed
  } else if (key === 'w' && !hasCollision && gameActive && shapeMoving) {
    rotateShape()
  }
})

// ! **************************