(function()
{

    // the maze game code

    var canvas;
    var ctx;
    var dx = 5;
    var dy = 5;
    var x = 200;
    var y = 5;
    var WIDTH = 482;
    var HEIGHT = 482;
    var img = new Image();
    var collision = 0;

    // the prize coordinates
    var prize = {
        x : 442,
        y : 445
    }

    function rect(x,y,w,h) {
        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.drawImage(img, 0, 0);
    }

    function init() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        img.src = "maze.gif";
        return setInterval(draw, 10);
    }

    function doKeyDown(evt){
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
                if (y - dy > 0){
                    y -= dy;
                    clear();
                    check_collision();
                    if (collision == 1){
                        y += dy;
                        collision = 0;
                    }
                }

                break;
            case 40:  /* Down arrow was pressed */
                if (y + dy < HEIGHT ){
                    y += dy;
                    clear();
                    check_collision();
                    if (collision == 1){
                        y -= dy;
                        collision = 0;
                    }
                }

                break;
            case 37:  /* Left arrow was pressed */
                if (x - dx > 0){
                    x -= dx;
                    clear();
                    check_collision();
                    if (collision == 1){
                        x += dx;
                        collision = 0;
                    }
                }
                break;
            case 39:  /* Right arrow was pressed */
                if ((x + dx < WIDTH)){
                    x += dx;
                    clear();
                    check_collision();
                    if (collision == 1){
                        x -= dx;
                        collision = 0;
                    }
                }
                break;
        }
    }

    // movement functions
    function move_player( axis , vector )
    {
        // get an axis and a vector from the accelerometer and away we go
       
        // calculate a suitable movement increment
        // we need to invert the controls because we are simulating tilt 
        var increment = vector * -1;

        /*
        if( vector > 0 ){
            var increment = -1;
        } else {
            var increment = 1;
        }
        */

        // move player horizontally
        if( axis === 'x' )
        {
            // ensure that the player moves within the bounds
            if( x + increment < 0 || x + increment > WIDTH ){
                return;
            }

            // move the x position of the player by x units
            x += increment;

            // redraw the canvas
            clear();

            // check for collisions
            check_collision();

            // check if there is a collision
            if( collision == 1 )
            {
                // reverse the increment
                x -= increment;

                // reset the collision
                collision = 0;
            }
        }

        // move player vertically
        if( axis === 'y' )
        {
            // ensure that the player moves within the bounds
            if( y + increment < 0 || y + increment > HEIGHT ){
                return;
            }

            // move the y position of the player by y units
            y += increment;

            // redraw the canvas
            clear();

            // check for collisions
            check_collision();

            // check if there is a collision
            if( collision == 1 )
            {
                // reverse the increment
                y -= increment;

                // reset the collision
                collision = 0;
            }
        }

    }


    function check_collision() {

        var imgd = ctx.getImageData(x, y, 15, 15);
        var pix = imgd.data;
        for (var i = 0; n = pix.length, i < n; i += 4) {
            if (pix[i] == 0) {
                collision = 1;
            }
        }

        // check if player won
        if( (x + 15) > prize.x && x < (prize.x + 15) && (y + 15) > prize.y && y < prize.y + 15 ){
            win_game();
        } 

    }

    function draw() 
    {
        // clear the canvas
        clear();

        // draw the player
        ctx.fillStyle = "purple";
        rect(x, y, 15,15);

        ctx.fillStyle = "red";
        rect( prize.x , prize.y , 15 , 15 );

    }

    function win_game() {
        alert( "you win!");
        x = 50;
        y = 0;
    }

    init();
    window.addEventListener('keydown',doKeyDown,true);


    // 
    // the accelerometer code

    // do things when the body is loaded
    $(document).ready(function()
    {

        // calculate the window width and height
        // var window_width = window.innerWidth;
        // var window_height = window.innerHeight;

        // setup the player object in the center
        // var midpoint = window_width / 2;
        // $('#player').css({ 'left' : midpoint });

        window.ondevicemotion = function(event) {

            var x = event.accelerationIncludingGravity.x;
            var y = event.accelerationIncludingGravity.y;
            // var z = event.accelerationIncludingGravity.z;

            // var output = x + "\n" + y + "\n" + z; 
            // $('#output-acceleration').html( output );

            // move the player
            // $('#player').css({ 'left' : midpoint + y * 20 });

            // along the x axis
            // this is weird because the orientation doesn't line up with the display
            // so the x value is translatet to y
            move_player( 'y' , x );
            move_player( 'x' , y );

        }

    });

})();

