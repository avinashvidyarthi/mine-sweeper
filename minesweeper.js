console.log('Init App');
const boardArea = document.getElementById('board');
const coulmnsSlider = document.getElementById('coulmnsControlRange');
const randomnessSlider = document.getElementById('randomControlRange');
const coulmnsSliderOutput = document.getElementById('column-value');
const randomnessSliderOutput = document.getElementById('randomness-value');
const playBtn = document.getElementById('playBtn');
// Variables for the game
let boardDimention = 9;
const cellDimention = '35px';
let bombProbablity = 0.8;
const dataArray = [];

// controls functions
const setBoardDimentions = () => {
	boardDimention = coulmnsSlider.value;
	coulmnsSliderOutput.innerText = boardDimention;
};

const setbombProbablity = () => {
	console.log('AAAA');
	bombProbablity = randomnessSlider.value;
	randomnessSliderOutput.innerText = bombProbablity;
};

coulmnsSlider.addEventListener('input', setBoardDimentions);
coulmnsSlider.addEventListener('change', setBoardDimentions);
randomnessSlider.addEventListener('input', setbombProbablity);
randomnessSlider.addEventListener('change', setbombProbablity);
playBtn.onclick = () => {
	document.getElementById('game-inputs').remove();
	boardArea.style.visibility = 'visible';
    initializeGame();
};
// end controls functions

const generateDataArray = () => {
	for (let i = 0; i < boardDimention; i++) {
		const oneRow = [];
		for (let j = 0; j < boardDimention; j++) {
			const randomNumber = Math.random();
			const isBomb = randomNumber > bombProbablity;
			oneRow.push({
				isVisible: false,
				isBomb,
				adjacentBombNumber: -1,
			});
		}
		dataArray.push(oneRow);
	}
};

const generateAdjacentBombNumber = () => {
	for (let i = 0; i < boardDimention; i++) {
		for (let j = 0; j < boardDimention; j++) {
			let adjacentBombCount = 0;
			// checking if above cell is a bomb
			if (i !== 0 && dataArray[i - 1][j].isBomb) {
				adjacentBombCount++;
			}
			// checking if down cell is a bomb
			if (i !== boardDimention - 1 && dataArray[i + 1][j].isBomb) {
				adjacentBombCount++;
			}
			// checking if left cell is a bomb
			if (j !== 0 && dataArray[i][j - 1].isBomb) {
				adjacentBombCount++;
			}
			// checking if down cell is a bomb
			if (j !== boardDimention - 1 && dataArray[i][j + 1].isBomb) {
				adjacentBombCount++;
			}
			// checking if left corner is a bomb
			if (i !== 0 && j !== 0 && dataArray[i - 1][j - 1].isBomb) {
				adjacentBombCount++;
			}
			// checking if bottom left corner is bomb
			if (
				i !== boardDimention - 1 &&
				j !== 0 &&
				dataArray[i + 1][j - 1].isBomb
			) {
				adjacentBombCount++;
			}
			// checking if right corner is a bomb
			if (
				i !== 0 &&
				j !== boardDimention - 1 &&
				dataArray[i - 1][j + 1].isBomb
			) {
				adjacentBombCount++;
			}
			// checking if bottom right corner is bomb
			if (
				i !== boardDimention - 1 &&
				j !== boardDimention - 1 &&
				dataArray[i + 1][j + 1].isBomb
			) {
				adjacentBombCount++;
			}
			dataArray[i][j].adjacentBombNumber = adjacentBombCount;
		}
	}
};

const updateBoard = () => {
	console.log('Update Board');
	boardArea.innerHTML = '';
	const table = document.createElement('table');
	for (let i = 0; i < boardDimention; i++) {
		const row = document.createElement('tr');
		for (let j = 0; j < boardDimention; j++) {
			const cell = document.createElement('td');
			cell.style.border = '1px solid white';
			cell.style.height = cellDimention;
			cell.style.width = cellDimention;
			cell.style.cursor = 'pointer';
			cell.onclick = () => {
				cellClicked(i, j);
			};
			if (dataArray[i][j].isVisible) {
				cell.classList.add('cell-visible');
				if (!dataArray[i][j].isBomb) {
					const cellText = document.createTextNode(
						dataArray[i][j].adjacentBombNumber === 0
							? ' '
							: dataArray[i][j].adjacentBombNumber
					);
					cell.appendChild(cellText);
				} else {
					const bombImage = document.createElement('img');
					bombImage.src = './assets/bomb1.png';
					bombImage.style.height = cellDimention;
					bombImage.style.width = cellDimention;
					cell.appendChild(bombImage);
				}
			} else {
				cell.classList.add('cell-not-visible');
			}
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	table.style.margin = '0 auto';
	boardArea.appendChild(table);
};

const recursivelyShowCells = (i, j) => {
	dataArray[i][j].isVisible = true;
	if (i < 0 && j >= boardDimention) {
		return;
	}
	if (dataArray[i][j].adjacentBombNumber > 0) {
		return;
	}
	// checking if above cell has no adjacent bomb
	if (i !== 0 && !dataArray[i - 1][j].isVisible) {
		recursivelyShowCells(i - 1, j);
	}
	// checking if down cell has no adjacent bomb
	if (i !== boardDimention - 1 && !dataArray[i + 1][j].isVisible) {
		recursivelyShowCells(i + 1, j);
	}
	// checking if left cell has no adjacent bomb
	if (j !== 0 && !dataArray[i][j - 1].isVisible) {
		recursivelyShowCells(i, j - 1);
	}
	// checking if down cell has no adjacent bomb
	if (j !== boardDimention - 1 && !dataArray[i][j + 1].isVisible) {
		recursivelyShowCells(i, j + 1);
	}
	// checking if left corner has no adjacent bomb
	if (i !== 0 && j !== 0 && !dataArray[i - 1][j - 1].isVisible) {
		recursivelyShowCells(i - 1, j - 1);
	}
	// checking if bottom left cornehas no adjacent bomb
	if (
		i !== boardDimention - 1 &&
		j !== 0 &&
		!dataArray[i + 1][j - 1].isVisible
	) {
		recursivelyShowCells(i + 1, j - 1);
	}
	// checking if right corner has no adjacent bomb
	if (
		i !== 0 &&
		j !== boardDimention - 1 &&
		!dataArray[i - 1][j + 1].isVisible
	) {
		recursivelyShowCells(i - 1, j + 1);
	}
	// checking if bottom right cornehas no adjacent bomb
	if (
		i !== boardDimention - 1 &&
		j !== boardDimention - 1 &&
		!dataArray[i + 1][j + 1].isVisible
	) {
		recursivelyShowCells(i + 1, j + 1);
	}
};

const clickedOnBomb = () => {
	for (let i = 0; i < boardDimention; i++) {
		for (let j = 0; j < boardDimention; j++) {
			dataArray[i][j].isVisible = true;
		}
	}
	updateBoard();
	setTimeout(() => {
		alert('Game Over');
		window.location.reload();
	}, 500);
};

const checkForWin = () => {
	let isAllNonBombCellVisilbe = true;
	for (let i = 0; i < boardDimention; i++) {
		for (let j = 0; j < boardDimention; j++) {
			if (!dataArray[i][j].isBomb && !dataArray[i][j].isVisible) {
				isAllNonBombCellVisilbe = false;
			}
		}
	}
	if (!isAllNonBombCellVisilbe) {
		return;
	} else {
		setTimeout(() => {
			alert('You Won!');
			window.location.reload();
		}, 500);
	}
};

const cellClicked = (i, j) => {
	console.log('Cell Clicked: ', i, j);
	// If already visible
	if (dataArray[i][j].isVisible) {
		return;
	}
	// If clicked cell is bomb
	if (dataArray[i][j].isBomb) {
		clickedOnBomb();
		return;
	}
	// If clicked cell is adjacent to a bomb (means cell contains a number other than 0 and -1)
	if (dataArray[i][j].adjacentBombNumber > 0) {
		dataArray[i][j].isVisible = true;
	}
	// If clicked cell has no adjcent bomb
	if (dataArray[i][j].adjacentBombNumber === 0) {
		// recursively show all cells till a cell with adjacent bomb is reached
		recursivelyShowCells(i, j);
	}
	updateBoard();
	checkForWin();
};

const initializeGame = () => {
	generateDataArray();
	generateAdjacentBombNumber();
	updateBoard();
};
