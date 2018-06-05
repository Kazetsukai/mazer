var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 1024,
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);

var squaresGroup;
var grid;

function preload() {
    this.load.image('square', 'square.png');
}

function create() {
  wallsLeftText = this.add.text(20, 935, '', { fontSize: '32px', fill: '#FFF' });
  pathLengthText = this.add.text(20, 975, '', { fontSize: '32px', fill: '#FFF' });

  squaresGroup = this.add.group();
  grid = {
    squares: new Array()
  };
  for (var x = 0; x < 8; x++) {
    grid.squares[x] = new Array();
    for (var y = 0; y < 11; y++) {
      var cell = {
        sprite: squaresGroup.create(x * 73 + 45, y * 73 + 150, 'square').setInteractive(),
        state: "empty"
      };
      cell.sprite.on("pointerdown", function(pointer) {
        if (this.cell.state == "empty" || this.cell.state == "hovered" || this.cell.state == "path") {
          this.cell.state = "player_wall";
          this.setTint(0x77bb88);
        } else if (this.cell.state == "player_wall") {
          this.cell.state = "hovered";
          this.setTint(0xffeeee);
        }
        refreshPath();
      });
      grid.squares[x][y] = cell;
      cell.sprite.cell = cell;
    }
  }
  grid.squares[7][10].state = "start"
  grid.squares[7][10].sprite.setTint(0xcc9944);

  for (var i = 0; i < 2; i++) {
    var cell = {
      sprite: squaresGroup.create((3+i) * 73 + 45, -1 * 73 + 150, 'square').setInteractive(),
      state: "end"
    };
    grid.squares[3+i][-1] = cell;
    cell.sprite.cell = cell;
    cell.sprite.setTint(0x77bbdd);
  }

  var hardWall = function(cell) {
    cell.state = "hard_wall";
    cell.sprite.setTint(0x444444);
  }
  hardWall(grid.squares[1][2]);
  hardWall(grid.squares[2][2]);
  hardWall(grid.squares[3][2]);
  hardWall(grid.squares[4][2]);
  hardWall(grid.squares[5][2]);

  hardWall(grid.squares[2][4]);

  hardWall(grid.squares[6][6]);

  hardWall(grid.squares[1][7]);
  hardWall(grid.squares[2][7]);

  this.input.setPollOnMove();

  this.input.on('gameobjectover', function (pointer, gameObject) {

    var cell = gameObject.cell;
    if (cell) {
      if (cell.state == "empty") {
        cell.state = "hovered";
        gameObject.setTint(0xffeeee);
      }
    }

  });

  this.input.on('gameobjectout', function (pointer, gameObject) {
    
    var cell = gameObject.cell;
    if (cell) {
    if (cell.state == "hovered") {
      cell.state = "empty";
          gameObject.clearTint();
      }
    }

  });

  refreshPath();
}

let wallsUsed = 0;
let pathLength = 0;
function refreshPath() {
  let endCells = [];
  let startCell;
  let explore = [];

  wallsUsed = 0;
  pathLength = Infinity;

  for (let x in grid.squares) {
    for (let y in grid.squares[x]) {
      var cell = grid.squares[x][y];
      if (cell.state == "path") {
        cell.state = "empty";
        cell.sprite.clearTint();
      }

      if (cell.state == "start") {
        startCell = cell;
        explore.push({x: x, y: y, prev: null});
      }
      if (cell.state == "end") {
        endCells.push(cell);
      }

      if (cell.state == "player_wall") {
        wallsUsed++;
      }

      cell.explored = false;
    }
  }

  var path;

  // Basic breadth first
  while (explore.length > 0) {
    var next = explore.shift();

    if (!grid.squares[next.x] || !grid.squares[next.x][next.y])
      continue;

    var cell = grid.squares[next.x][next.y];
    if (cell.explored || (cell.state !== "empty" && cell.state !== "hovered" && cell.state !== "start" && cell.state !== "end"))
      continue;

    cell.explored = true;

    if (cell.state == "end") {
      path = next;
      break;
    }

    explore.push({x:next.x+1, y:next.y, prev:next});
    explore.push({x:next.x-1, y:next.y, prev:next});
    explore.push({x:next.x, y:next.y+1, prev:next});
    explore.push({x:next.x, y:next.y-1, prev:next});
  }

  if (path) pathLength = -1;
  while (path) {
    var cell = grid.squares[path.x][path.y];
    if (cell.state == "empty" || cell.state == "hovered") {
      cell.state = "path";
      cell.sprite.setTint(0xcfcc77);
    }
    path = path.prev;
    pathLength++;
  }

  wallsLeftText.setText("BLOCKS LEFT: " + (12 - wallsUsed));
  pathLengthText.setText("LENGTH: " + pathLength);
  console.log(pathLength);
  console.log(wallsUsed);

}

function update() {
  /*for (let x in grid.squares) {
    for (let y in grid.squares[x]) {
      // loop
    }
  }*/
}