const readline = require('readline');

const map = {
	width: 64,
	height: 12
}

const snake = {
	direction: 'left',
	tail: [
		{ x: 32, y: 6 },
	]
}

const fruit = {
	x: 40,
	y: 8,
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const drawPoint = (x, y) => {
	for (let i = 0; i < snake.tail.length; i++) {
		if(snake.tail[i].x == x && snake.tail[i].y == y)
			return '🟩'
	}

	if(x == fruit.x && y == fruit.y) 
		return '🍎'

	return '⬛';
}

const drawMap = () => {
	for(let i = 0; i <= map.height; i++) {
		let line = '';
		for(let j = 0; j <= map.width; j++) {
			line += drawPoint(j, i)
		}
		console.log(line)
	}
}

const moveSnake = () => {
	const newPart = { x: 0, y: 0 }

	if(snake.direction == 'up') {
		newPart.x = snake.tail[0].x
		newPart.y = snake.tail[0].y - 1
	}
	if(snake.direction == 'down') {
		newPart.x = snake.tail[0].x
		newPart.y = snake.tail[0].y + 1
	}
	if(snake.direction == 'right') {
		newPart.x = snake.tail[0].x + 1
		newPart.y = snake.tail[0].y
	}
	if(snake.direction == 'left') {
		newPart.x = snake.tail[0].x - 1
		newPart.y = snake.tail[0].y
	}

	if(newPart.x > map.width)
		newPart.x = 0
	if(newPart.x < 0)
		newPart.x = map.width
	if(newPart.y > map.height)
		newPart.y = 0
	if(newPart.y < 0)
		newPart.y = map.height


	snake.tail.forEach(part => {
		if(part.x == newPart.x && part.y == newPart.y) {
			console.log('GAME OVER');
			console.log('POINTS: ' + snake.tail.length)
			process.exit();
		}
	})
	
	snake.tail = [ newPart, ...snake.tail]

	if(newPart.x == fruit.x && newPart.y == fruit.y){
		fruit.x = random(0, map.width)
		fruit.y = random(0, map.height)
	} else {
		snake.tail.pop();
	}
}

const changeDirection = (key) => {
	snake.direction = key.name;
}

const update = () => {
	console.clear();
	drawMap();
	moveSnake();
}

const main = () => {
	readline.emitKeypressEvents(process.stdin);

	if (process.stdin.isTTY)
			process.stdin.setRawMode(true);

	process.stdin.on('keypress', (chunk, key) => {
		if (key && key.name == 'q')
			process.exit();

		if(key && (key.name == 'left' || key.name == 'right' || key.name == 'up' || key.name == 'down') )
			changeDirection(key)
	});

	setInterval(update, 100)
}

main();