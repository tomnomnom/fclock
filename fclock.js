function fclock(elem, conf){

    // Config
    var padding  = conf.rimPadding || 5;
    var bgColor  = conf.bgColor || 'rgb(32, 32, 32)';
    var barColor = conf.barColor || '#ecf0f1';

    // Derived values
    var width = elem.width;
    var height = elem.height;
    var radius = (width/2) - padding;
    if (height < width) {
        radius = (height/2) - padding;
    }
    var barThickness = radius * 0.2;
    var barGap = radius * 0.07;

    var secondsOuter = radius - barGap;
    var minutesOuter = secondsOuter - barThickness - barGap;
    var hoursOuter = minutesOuter - barThickness - barGap;

    // Canvas starting state
    var c = elem.getContext('2d');
    c.translate(width/2, height/2);

    // Work from 12 o'clock
    c.rotate(-Math.PI/2);

    c.strokeStyle = 'rgb(0,255,255)';

    // Main draw loop
    var draw = function(){

        var date = new Date();
        var hours = date.getHours();
        if (hours > 12) {
            hours -= 12;
        }
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var millis = date.getMilliseconds();

        drawBg(c);
        // Using floats to make for smoother movement
        drawSeconds(c, seconds + (millis/1000));
        drawMinutes(c, minutes + (seconds/60));
        drawHours(c, hours + (minutes/60));

        // Next frame
        requestAnimationFrame(draw);
    };

    function drawBg(c){
        c.save();
        c.beginPath();
        c.arc(0, 0, radius, 0, 2 * Math.PI); // x, y, r, start, end
        c.closePath();

        c.fillStyle = bgColor;
        c.fill();
        c.restore();
    }

    function drawSeconds(c, val){
        var endPoint = ((2*Math.PI) / 60) * val;
        drawBar(c, endPoint, secondsOuter);
    }

    function drawMinutes(c, val){
        var endPoint = ((2*Math.PI) / 60) * val;
        drawBar(c, endPoint, minutesOuter);
    }

    function drawHours(c, val){
        var endPoint = ((2*Math.PI) / 12) * val;
        drawBar(c, endPoint, hoursOuter);
    }

    function drawBar(c, endPoint, outer){
        c.save(); 
        c.beginPath();

        var inner = outer - barThickness;
    
        // Outer arc
        c.arc(0, 0, outer, 0, endPoint);

        // End cap
        c.save();
            c.rotate(endPoint);
            c.translate(outer, 0);
            c.lineTo(-barThickness, 0);
        c.restore();

        // Back up to 12 o'clock
        c.arc(0, 0, inner, endPoint, 0, true);

        // Top cap
        c.lineTo(outer, 0);

        c.fillStyle = barColor;
        c.fill();

        c.closePath();
        c.restore();
    }

    // Trigger the animation
    draw();
}

