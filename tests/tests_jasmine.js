/* Run local:
* In ../tests/
*
* karma start --single-run
*/

describe("MINESWEEPER'S TESTS", function() {

describe("The Board", function() {

    it("is created from disclosed zones", function(){
        var board = new Board(64);

        for (var z = 0; z < board.zones.length; z++) {
            expect(board.zones[z].isUnveiled).toBeFalsy();
        }

    });

    it("has a defined number of mines", function(){
        var board = new Board(64, 12);
        var mine = 0;

        for (var z = 0; z < board.zones.length; z++) {
            if (board.zones[z].hasMine()){
                mine++;
            }
        }
        expect(mine === board.mineNumber).toBeTruthy();
        expect(mine === 12).toBeTruthy();

    });

    it("unveils the right zones on click", function() {
        var board = new MockBoard();
        var zoneUnveiled54Clicked = [
            2, 3, 4, 10, 11, 12, 16, 17, 18, 19,
            20, 21, 24, 25, 26, 27, 28, 29,
            32, 33, 34, 36, 37, 38, 39,
            40, 41, 42, 44, 45, 46, 47, 48, 49,
            50, 52, 53, 54, 55, 56, 57, 58, 59,
            60, 61, 62, 63
        ];

        board.clicked(54);

        for (var z=0; z < zoneUnveiled54Clicked.length; z++){
            expect(board.zones[zoneUnveiled54Clicked[z]].isUnveiled).toBeTruthy();
        }

    });

    describe("A Zone of the Board", function() {

        it("can be created with a defined set of parameters", function() {
            var zone = new Zone(1, 1, true, 20, 2);

            expect(zone.x).toEqual(1);
            expect(zone.y).toEqual(1);
            expect(zone.mine).toEqual(true);
            expect(zone.size).toEqual(20);
            expect(zone.value).toEqual(2);
        });

        it("has a standard color by default", function(){
            var zone = new Zone();

            expect(zone.color).toEqual(colorDefault);
            expect(colorDefault !== colorUnveiled).toBeTruthy();
        });

        it("is not flagged or unveiled when created", function(){
            var zone = new Zone();

            expect(zone.isUnveiled).toBeFalsy();
            expect(zone.flag).toBeFalsy();
        });

        it("can draw itself on the board", function() {
            var canvas = document.createElement("canvas");
            var blank = document.createElement("canvas");
            document.body.appendChild(canvas);

            var zone = new Zone(1, 1, true, 20, 2);
            zone.draw(canvas);

            // Check that the canvas has something on it
            expect(canvas.toDataURL() !== blank.toDataURL()).toBeTruthy();
            document.body.removeChild(document.body.lastElementChild);
        });

    });
});

describe("The explosion", function() {
    it("is created from particle objects", function() {
        var e = new Explosion();

        expect(e.particles.length).toEqual(20);

    });

    describe("The explosion's particles", function() {
        var e;

        beforeEach(function() {
            e = new Explosion(1, 1);
        });

        it("all start from the same defined x and y position", function () {
            for (var p = 0; p < e.particles.length; p++) {
                expect(e.particles[p].x).toEqual(1);
                expect(e.particles[p].y).toEqual(1);
            }
        });

        it("all have random colors", function(){
            var p = 0;
            var first_particle = e.particles[p];
            var another_particle = first_particle;

            for (var p = 1; p < e.particles.length; p++) {
                var particle = e.particles[p];
                expect(particle.color).toContain('#');

                if (particle.color !== first_particle.color){
                    another_particle = particle;
                    break;
                }
            }

            expect(first_particle.color !== another_particle).toBeTruthy();
        });
    });
});

describe("The timer", function() {
    var timer;

    beforeEach(function() {
        timer = new Timer();
        timer.start();
    });

    it("starts at 00:00 ", function() {
        expect(timer.counter).toEqual("00:00");
    });

    it("saves counter at stop time", function() {
        timer.counter = "00:02";
        timer.stop();

        expect(timer.counter).toEqual("00:02");
    });

    it("can be reset to 00:00 at any time", function() {
        timer.counter = "11:11";
        timer.reset();

        expect(timer.counter).toEqual("00:00");

        timer.counter = "22:22";
        timer.stop();
        timer.reset();

        expect(timer.counter).toEqual("00:00");


    });

});

});

