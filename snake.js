const readline = require('readline')

let direction = 'right'

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

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const draw = () => {
	for(let y = 0; y <= map.height; y++) {
		let line = "";
		for(let x = 0; x <= map.width; x++) {
			if(tail.find(part => part.x == x && part.y == y)) {
				line += '🟩'
			} 
			else if(fruit.x == x && fruit.y == y) {
				line += '💎'
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
}

const update = () => {
	console.clear();
	move();
	draw();
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
	setInterval(update, 100)
}

main();