const prompt = require('prompt-sync')({sigint: true});

const hat = '^';

const hole = 'O';

const fieldCharacter = '░';

const pathCharacter = '*';


class Field {
  static staticGrid = [];

  static print() {
    for (let a = 0; a < this.staticGrid.length; a++) {
      console.log(`${this.staticGrid[a].join(" ")} \n`);
    }
  }

  static generateRandomGrid(x, y, percent) {
    let holeCounter = Math.floor(x * y *  (percent / 100));
    for (let i = 0; i < y; i++) {
      const row = [];
      for (let j = 0; j < x; j++) {
        row.push(fieldCharacter)
      }
      this.staticGrid.push(row);
    }
    
    this.staticGrid[Math.floor(Math.random() * y)][Math.floor(Math.random() * x)] = pathCharacter;

    let hatLocX = Math.floor(Math.random() * x);

    let hatLocY = Math.floor(Math.random() * y);

    while (this.staticGrid[hatLocY][hatLocX] === pathCharacter) {
      hatLocX = Math.floor(Math.random() * x);
      hatLocY = Math.floor(Math.random() * y);
    }

    this.staticGrid[hatLocY][hatLocX] = hat;

    for (let k = 0; k < holeCounter; k++) {
      const holeX = Math.floor(Math.random() * x);
      const holeY = Math.floor(Math.random() * y);
      if (this.staticGrid[holeY][holeX] === fieldCharacter) {
        this.staticGrid[holeY][holeX] = hole;
      }
    }
  }

  static clearGrid() {
    this.staticGrid = [];
  }
  
  static findStartingLocation() {
    let startX = 0;
    let startY = 0;
    for (let b = 0; b < this.staticGrid.length; b++) {
      for (let c = 0; c < this.staticGrid[b].length; c++) {
        if (this.staticGrid[b][c] === pathCharacter) {
          startX = c;
          startY = b;
        }
      }
    }
    return [startX, startY];
  }

  static findHatLocation() {
    let hatX = 0;
    let hatY = 0;
    for (let d = 0; d < this.staticGrid.length; d++) {
      for (let e = 0; e < this.staticGrid[b].length; e++) {
        if (this.staticGrid[b][c] === hat) {
          startX = e;
          startY = d;
        }
      }
    }
    return [hatX, hatY];
  }

  static moveCharacter(location, direction) {

    switch (direction) {
      case 'u':
        location[1] -= 1;
        break;
      case 'd':
        location[1] += 1;
        break;
      case 'l':
        location[0] -= 1;
        break;
      case 'r':
        location[0] += 1;
        break;
    };

    if (location[0] < 0 || location[0] > this.staticGrid[0].length || location[1] < 0 || location[1] > this.staticGrid.length) {
      console.log('Oleg has fallen into the abyss. Farewell, Oleg!')
      charInAbyss = true;
    } else if (this.staticGrid[location[1]][location[0]] === hole) {
      console.log('A sudden hole under Oleg\'s feet had taken him into an deep bottomless trip. We will miss you, Oleg.');
      charInHole = true;
    } else if (this.staticGrid[location[1]][location[0]] === fieldCharacter) {
      this.staticGrid[location[1]][location[0]] = pathCharacter;
    } else if (this.staticGrid[location[1]][location[0]] === hat) {
      this.staticGrid[location[1]][location[0]] = pathCharacter;
      console.log('Hurray! You have helped Oleg to find his hat! Now he will be able to come back home with his beloved hat!');
      hatFound = true;
    };

    return location;
  }

  static hardMode(count) {
    if (count % 5 === 0) {
      let newHoleX = Math.floor(Math.random() * this.staticGrid[0].length);
      let newHoleY = Math.floor(Math.random() * this.staticGrid.length);
      while (this.staticGrid[newHoleY][newHoleX] !== fieldCharacter) {
        newHoleX = Math.floor(Math.random() * this.staticGrid[0].length);
        newHoleY = Math.floor(Math.random() * this.staticGrid.length);
      }

      this.staticGrid[newHoleY][newHoleX] = hole;
    }
  }

  static fieldValidator() {

    let isHatFound = false;

    let pointOfStart = this.findStartingLocation();

    let pointOfEnd = this.findHatLocation();

    let testMoveX = pointOfStart[0];

    let testMoveY = pointOfStart[1]

    let testPath = [];

    function randomMoveGenerator() {
      let randomMove = Math.floor(Math.random() * 4);
      if (randomMove === 0) {
        return 'u'
      } else if (randomMove === 1) {
        return 'd';
      } else if (randomMove === 2) {
        return 'l';
      } else if (randomMove === 3) {
        return 'r';
      };
    }

    while (isHatFound === false) {
      let testMove = randomMoveGenerator;

      switch (testMove) {
        case 'u':
          testMoveY -= 1;
          break;
        case 'd':
          testMoveY += 1;
          break;
        case 'l':
          testMoveX -= 1;
          break;
        case 'r':
          testMoveX += 1;
          break;
      };


    }
  }

}

const welcome = () => {
  console.log('During a sunny day Oleg was walking down a nice field, when out of a sudden a wind blew and had taken away his amazing hat and left it somewhere in the field. As Oleg looks around, he sees that the field is full of holes! But do not fear, Oleg, we will help you to get back your hat!');
}
let currentlyPlaying = true;

let hatFound = false;

let charInHole = false;

let charInAbyss = false;

let moveCount = 0;

while (currentlyPlaying === true) {
  welcome();

  let userX = prompt('How wide the field will be? ');

  let userY = prompt('How long the field will be? ');

  let userPercent = prompt('What % of the field will be filled with holes? ');

  let mode = prompt('Do you want to enable hard mode? (y/n) ')

  Field.generateRandomGrid(userX, userY, userPercent);

  Field.print();

  let startingLocation = Field.findStartingLocation();

  console.log('Oleg\'s location is marked with "*" sign and hat is marked with "^" sign.')

  console.log('To move up, down, left or right use the following commands: u, d, l, r')

  while (hatFound === false) {
    let moveDirection = prompt('Where will you go? ');
    console.clear();
    Field.moveCharacter(startingLocation, moveDirection);
    moveCount++;
    if (mode === 'y') {
      Field.hardMode(moveCount);
    };
    Field.print();
    if (charInHole === true || charInAbyss === true) {
      break;
    }
  }

  let ask = prompt('Do you want to play again? (y/n)')
  if (ask === 'n') {
    currentlyPlaying = false;
  } else if (ask === 'y') {
    Field.clearGrid();
    charInAbyss = false;
    charInHole = false;
    hatFound = false;
    moveCount = 0;
  }
  console.clear();
}



