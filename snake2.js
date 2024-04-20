const readline = require('readline')

let direction = 'right'
let speed = 100
let updateInterval = null
let color = '🟩'
let grow = 0
let invincible = false
let blinkInterval = null

const map = {
	width: 64,
	height: 12,
}

let tail = [
	{ x: 32, y: 6 }
]

const fruit = {
	x: 40,
	y: 6
}

const fastFruit = {
	x: random(0, map.width),
	y: random(0, map.height),
	visible: false
}
const generateFastFruit = () => {
	setTimeout(() => {
		fastFruit.visible = true
	}, random(5000, 30000))
}
generateFastFruit()
const fastFruitEaten = () => {
	speed = 50
	clearInterval(updateInterval)
	updateInterval = setInterval(update, speed)
	color = '🟦'
	fastFruit.visible = false
	setTimeout(() => {
		speed = 100
		clearInterval(updateInterval)
		updateInterval = setInterval(update, speed)
		color = '🟩'
		generateFastFruit()
	}, 1000)
}

const slowFruit = {
	x: random(0, map.width),
	y: random(0, map.height),
	visible: false
}
const generateslowFruit = () => {
	setTimeout(() => {
		slowFruit.visible = true
	}, random(5000, 30000))
}
generateslowFruit()
const slowFruitEaten = () => {
	speed = 200
	clearInterval(updateInterval)
	updateInterval = setInterval(update, speed)
	color = '🟨'
	slowFruit.visible = false
	setTimeout(() => {
		speed = 100
		clearInterval(updateInterval)
		updateInterval = setInterval(update, speed)
		color = '🟩'
		generateslowFruit()
	}, 1000)
}

const bigFruit = {
	x: random(0, map.width),
	y: random(0, map.height),
	visible: false
}
const generateBigFruit = () => {
	setTimeout(() => {
		bigFruit.visible = true
	}, random(5000, 30000))
}
generateBigFruit()
const bigFruitEaten = () => {
	bigFruit.visible = false
	grow = 3
	generateBigFruit()
}

const invincibleFruit = {
	x: random(0, map.width),
	y: random(0, map.height),
	visible: false
}
const generateInvincibleFruit = () => {
	setTimeout(() => {
		invincibleFruit.visible = true
	}, random(5000, 30000))
}
generateInvincibleFruit()
const invincibleFruitEaten = () => {
	invincibleFruit.visible = false
	invincible = true
	color = '🟥'
	blinkInterval = setInterval(() => {
		if(color == '⬛') {
			color = '🟥'
		} else {
			color = '⬛'
		}
	}, 100)
	setTimeout(() => {
		invincible = false
		color = '🟩'
		clearInterval(blinkInterval)
		generateInvincibleFruit()
	}, 5000)
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const draw = () => {
	for(let y = -1; y <= map.height + 1; y++) {
		let line = "";
		for(let x = -1; x <= map.width + 1; x++) {
			if(y == -1 || y == map.height + 1 || x == -1 || x == map.width + 1) {
				line += '⬜'
			}
			else if(tail.find(part => part.x == x && part.y == y)) {
				line += color
			} 
			else if(fruit.x == x && fruit.y == y) {
				line += '🍓'
			}
			else if(fastFruit.x == x && fastFruit.y == y && fastFruit.visible) {
				line += '💎'
			}
			else if(slowFruit.x == x && slowFruit.y == y && slowFruit.visible) {
				line += '🍌'
			}
			else if(bigFruit.x == x && bigFruit.y == y && bigFruit.visible) {
				line += '🍪'
			}
			else if(invincibleFruit.x == x && invincibleFruit.y == y && invincibleFruit.visible) {
				line += '⭐'
			}
			else {
				line += '⬛'
			}
		}
		console.log(line)
	}
	console.log('POINTS: ' + tail.length)
}

const die = () => {
	if(invincible) return;
	console.log('You eaten yourself')
	process.exit()
}

const move = () => {
	if(direction == 'right') {
		tail = [{ x: tail[0].x + 1, y: tail[0].y }, ...tail]
	}
	if(direction == 'left') {
		tail = [{ x: tail[0].x - 1, y: tail[0].y }, ...tail]
	}
	if(direction == 'up') {
		tail = [{ x: tail[0].x, y: tail[0].y - 1 }, ...tail]
	}
	if(direction == 'down') {
		tail = [{ x: tail[0].x, y: tail[0].y + 1 }, ...tail]
	}

	if(tail[0].x == fruit.x && tail[0].y == fruit.y) {
		fruit.x = random(0, map.width)
		fruit.y = random(0, map.height)
		grow = 1
	} 
	
	if (grow != 0) {
		grow--
	}
	else {
		tail.pop()
	}

	if(tail[0].x > map.width) {
		tail[0].x = 0
	}
	if(tail[0].y > map.height) {
		tail[0].y = 0
	}
	if(tail[0].x < 0) {
		tail[0].x = map.width
	}
	if(tail[0].y < 0) {
		tail[0].y = map.height
	}

	const tailWithoutHead = [...tail]
	tailWithoutHead.shift()

	tailWithoutHead.forEach(part => {
		if(tail[0].x == part.x && tail[0].y == part.y) {
			die()
		}
	})

	if(tail[0].x == fastFruit.x && tail[0].y == fastFruit.y && fastFruit.visible) {
		fastFruitEaten()
	}
	if(tail[0].x == slowFruit.x && tail[0].y == slowFruit.y && slowFruit.visible) {
		slowFruitEaten()
	}
	if(tail[0].x == bigFruit.x && tail[0].y == bigFruit.y && bigFruit.visible) {
		bigFruitEaten()
	}
	if(tail[0].x == invincibleFruit.x && tail[0].y == invincibleFruit.y && invincibleFruit.visible) {
		invincibleFruitEaten()
	}
}

const update = () => {
	console.clear();
	draw();
	move();
}

const main = () => {
	readline.emitKeypressEvents(process.stdin);

	if (process.stdin.isTTY)
			process.stdin.setRawMode(true);

	process.stdin.on('keypress', (chunk, key) => {
		if(key.name == 'q') {
			process.exit()
		}
		else if(key.name == 'up') {
			direction = 'up'
		}
		else if(key.name == 'down') {
			direction = 'down'
		}
		else if(key.name == 'right') {
			direction = 'right'
		}
		else if(key.name == 'left') {
			direction = 'left'
		}
		
	});
	updateInterval = setInterval(update, speed)
}

main();