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
	    		if (this.cell.state == "empty" || this.cell.state == "hovered") {
					this.cell.state = "player_wall";
	        		this.setTint(0x77bb88);
				} else if (this.cell.state == "player_wall") {
					this.cell.state = "hovered";
	        		this.setTint(0xffeeee);
				}
			});
			grid.squares[x][y] = cell;
			cell.sprite.cell = cell;
		}
	}
	grid.squares[7][10].state = "start"
	grid.squares[7][10].sprite.setTint(0xddbb77);

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
}

function update() {
	for (let x in grid.squares) {
		for (let y in grid.squares[x]) {
			// loop
		}
	}
}