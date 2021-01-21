// ! ************ VARIABLES **************
// ? js variables
const width = 10
const height = 20
let cellsArray = []
let rowsCleared = 0
let score = 0
let level = 0
let shapeMoving = false
let ableToMoveLeft = true
let ableToMoveRight = true
let hasCollision = false
let inactiveCells = []
let gameActive = false
let currentSpeed = 400
let intervalTime = currentSpeed
let rotation = 0
let playAudio = false

// ? shape objects
const iTet = { coords: ['0_3', '0_4', '0_5', '0_6'], background: ['images/i1.png', 'images/i2.png', 'images/i3.png', 'images/i4.png'], audio: '1.wav', pivot: 1, canRotate: true }
const jTet = { coords: ['0_4', '1_4', '1_5', '1_6'], background: ['images/j1.png', 'images/j2.png', 'images/j3.png', 'images/j4.png'], audio: '2.wav', pivot: 2, canRotate: true }
const lTet = { coords: ['0_5', '1_3', '1_4', '1_5'], background: ['images/l1.png', 'images/l2.png', 'images/l3.png', 'images/l4.png'], audio: '3.wav', pivot: 2, canRotate: true }
const oTet = { coords: ['0_4', '0_5', '1_4', '1_5'], background: ['images/o1.png', 'images/o2.png', 'images/o3.png', 'images/o4.png'], audio: '4.wav', pivot: 1, canRotate: false }
const sTet = { coords: ['0_4', '0_5', '1_3', '1_4'], background: ['images/s1.png', 'images/s2.png', 'images/s3.png', 'images/s4.png'], audio: '5.wav', pivot: 3, canRotate: true }
const tTet = { coords: ['0_4', '1_3', '1_4', '1_5'], background: ['images/t1.png', 'images/t2.png', 'images/t3.png', 'images/t4.png'], audio: '6.wav', pivot: 2, canRotate: true }
const zTet = { coords: ['0_4', '0_5', '1_5', '1_6'], background: ['images/z1.png', 'images/z2.png', 'images/z3.png', 'images/z4.png'], audio: '7.wav', pivot: 2, canRotate: true }
let randomShape = {}
let activeShapeCoords = []

let playerScores = []

// ?  dom elements
const grid = document.querySelector('.grid')
const startScreen = document.querySelector('.start-screen')
const gameoverScreen = document.querySelector('.gameover-screen')
const gameoverModal1 = document.querySelector('.modal-gameover1')
const gameoverModal2 = document.querySelector('.modal-gameover2')
const settingsScreen = document.querySelector('.settings-screen')
const submitScoreButton = document.querySelector('.submit-score-button')
const startButton = document.querySelector('.start-button')
const pauseButton = document.querySelector('.pause-button')
const settingsButton = document.querySelector('.settings-button')
const resetButton = document.querySelector('.reset-button')
const audioButton = document.querySelector('.audio-button')
const resumeButton = document.querySelector('.resume-button')
const newGameButton = document.querySelector('.new-game-button')
const nameInput = document.querySelector('input')
const scoreDisplay = document.getElementById('score-num')
const gameOverScoreDisplay = document.getElementById('gameover-score')
const linesDisplay = document.getElementById('lines-num')
const levelDisplay = document.getElementById('level-num')
const gridLeft = document.querySelector('.grid-left-buttons')
const gridRight = document.querySelector('.grid-right-scores')
const audioPlayer = document.querySelector('audio')
const leaderboard = Array.from(document.querySelectorAll('.leaderboard'))
// ! **************************


// ! ************ INIT **************
// ? collect localstorage scores
if (localStorage) {
  playerScores = JSON.parse(localStorage.getItem('highscores')) || []
  orderAndDisplayScores()
}
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
  if (gameActive) {
    intervalTime = currentSpeed
    rotation = 0
    const shapesArray = [iTet, jTet, lTet, oTet, sTet, tTet, zTet]
    // const shapesArray = [oTet]
    const randomShapeIndex = Math.floor(Math.random() * shapesArray.length) 
    randomShape = shapesArray[randomShapeIndex]
    
    randomShape.coords.forEach(coord => {
      const y = Number(coord.toString().split('_')[0])
      setTimeout(() => {
        if(y === 0 && document.getElementById(coord).classList.contains('active-shape')) {
          gameOver()
        }
      }, intervalTime + 10)
    })
  
    // ? below adds the background images to the cells
    randomShape.coords.forEach((coord, index) => {
      const coordBG = document.getElementById(coord)
      coordBG.style.backgroundImage = `url('${randomShape.background[index]}')`
      coordBG.style.transform = 'rotate(0deg)'
    })
  
    activeShapeCoords = randomShape.coords
    shapeMoving = true
    activeShapeCoords.forEach(coord => {
      const shape = document.getElementById(coord)
      shape.classList.add('active-shape')  
    })
    audioPlayer.src =  `./audio/${randomShape.audio}`
    if(playAudio) audioPlayer.play()
  }
}

function checkCollision() {
  hasCollision = false
  activeShapeCoords.forEach(coord => {
    const y = Number(coord.toString().split('_')[0])
    const x = Number(coord.toString().split('_')[1])
    if (y === height - 1 || inactiveCells.includes(`${y + 1}_${x}`)) { //? maybe add || statement here
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
  // gameOver()
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
    coordBG.style.transform = `rotate(${rotation}deg)`
  })
}

function rotateShape() {
  if(randomShape.canRotate) {
    rotation = rotation === -270 ? 0 : rotation - 90
  let newCoords = []
  let newCoords2 = []
  activeShapeCoords.forEach((coord, index) => {
    const coordBG = document.getElementById(coord)
    coordBG.classList.remove('active-shape')
    coordBG.style.backgroundImage = ''
    let x = Number(coord.toString().split('_')[1])
    let y = Number(coord.toString().split('_')[0])
    const pivotIndex = randomShape.pivot
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
    if (x < 0) {
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
    if (y < 0) {
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
    coordBG.style.transform = `rotate(${rotation}deg)`
  })
  }
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
        document.getElementById(`${key}_${i}`).style.backgroundImage = ''
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
          newCells.push({ coord: `${y + 1}_${x}`, image: document.getElementById(coord).style.backgroundImage })
          return `${y + 1}_${x}`
        } else return coord
      })
      oldCells.forEach(cell => {
        document.getElementById(cell).classList.remove('inactive-shape')
        document.getElementById(cell).style.backgroundImage = ''
      })
      newCells.forEach(cell => {
        document.getElementById(cell.coord).classList.add('inactive-shape')
        document.getElementById(cell.coord).style.backgroundImage = cell.image
      })
    }
  }
}

function resetGame() {
  shapeMoving = false
  gameActive = false
  inactiveCells = []
  rowsCleared = 0
  score = 0
  level = 0
  currentSpeed = 400
  intervalTime = currentSpeed
  // playAudio = true

  pauseButton.innerHTML = 'Pause'
  scoreDisplay.innerHTML = score
  linesDisplay.innerHTML = rowsCleared
  levelDisplay.innerHTML = level


  cellsArray.forEach(cell => {
    cell.classList.remove('shape')
    cell.classList.remove('active-shape')
    cell.classList.remove('inactive-shape')
    cell.style.backgroundImage = ''
    rotation = 0
  })
}


function gameOver() {
  inactiveCells.forEach(coord => {
    const y = Number(coord.toString().split('_')[0])
    
    // if (y <= 0) {
      gameOverScoreDisplay.innerHTML = score
      gameoverScreen.style.display = 'flex'
      gridLeft.style.display = 'none'
      gridRight.style.display = 'none'

      // playAudio = false
      shapeMoving = false
      ableToMoveLeft = false
      ableToMoveRight = false
      gameActive = false
    // }
  })
}

function pauseGame() {
  shapeMoving = false
  ableToMoveLeft = false
  ableToMoveRight = false
  pauseButton.innerHTML = 'Resume'
}

function resumeGame() {
  shapeMoving = true
  ableToMoveLeft = true
  ableToMoveRight = true
  pauseButton.innerHTML = 'Pause'
}

function orderAndDisplayScores() {
  const array = playerScores
    .sort((playerA, playerB) => playerB.score - playerA.score)
    .map((player, index) => {
      return `<li>
        <span>${index + 1}.  ${player.name}</span> <span>${player.score}</span>
      </li>`
    })
    while (array.length > 5) {
      array.pop()
    }
  leaderboard.forEach(board => {
    board.innerHTML = array.join('')
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
  if (rowsCleared === 5) { 
    intervalTime = 350
    currentSpeed = intervalTime
    level++
  } else if (rowsCleared === 10) {
    intervalTime = 300
    currentSpeed = intervalTime
    level++
  } else if (rowsCleared === 15) {
    intervalTime = 250
    currentSpeed = intervalTime
    level++
  } else if (rowsCleared === 20) {
    intervalTime = 200
    currentSpeed = intervalTime
    level++
  } else if (rowsCleared === 25) {
    intervalTime = 150
    currentSpeed = intervalTime
    level++
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
  gameActive = true
  startScreen.style.display = 'none'
  gridLeft.style.display = 'block'
  gridRight.style.display = 'block'

  setTimeout(addShape, 500)
}) 



pauseButton.addEventListener('click', () => {
  if (shapeMoving && gameActive) {
    pauseGame()
  } else if (!shapeMoving && gameActive) {
    resumeGame()
  }
}) 

resetButton.addEventListener('click', () => {
  resetGame()
  gameActive = true
  setTimeout(() => {
    addShape()
  }, intervalTime)
})

newGameButton.addEventListener('click', () => {
  resetGame()
  gameoverScreen.style.display = 'none'
  gameoverModal1.style.display = 'flex'
  gameoverModal2.style.display = 'none'

  gridLeft.style.display = 'block'
  gridRight.style.display = 'block'
  gameActive = true
  setTimeout(() => {
    addShape()
  }, intervalTime)
})

submitScoreButton.addEventListener('click', () => {
  // push score to object & to local storage
  if(nameInput.value === '') {
    submitScoreButton.classList.add('shake')
    setTimeout(() => {
      submitScoreButton.classList.remove('shake')
    }, 500)
  } else {
    const newName = nameInput.value
    const newScore = score
    const player = { name: newName, score: newScore }
    playerScores.push(player)
    // ? Set the new player score in localStorage with the old ones
    if (localStorage) {
      localStorage.setItem('highscores', JSON.stringify(playerScores))
    }
    orderAndDisplayScores()
    gameoverModal1.style.display = 'none'
    gameoverModal2.style.display = 'flex'
  }
})

settingsButton.addEventListener('click', () => {
  pauseGame()
  gridLeft.style.display = 'none'
  settingsScreen.style.display = 'flex'
})

resumeButton.addEventListener('click', () => {
  settingsScreen.style.display = 'none'
  gridLeft.style.display = 'block'
  setTimeout(resumeGame, 500)
})

audioButton.addEventListener('click', () => {
  if(playAudio) {
    playAudio = false
    audioButton.innerHTML = '&#128263;'
  } else {
    playAudio = true
    audioButton.innerHTML = '&#128264;'
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