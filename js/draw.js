function drawCel(loop, cel, x, y) {
    var cRow = 0;
    var cColumn = 0;
    var theLoop = loops[loop];
    var theCel = theLoop[cel];
    var cWidth = theCel[0];
    var cHeight = theCel[1];
    
    // TODO: switch to bit shifting 
    var xOff = theCel[2];
    if (xOff > 127) {
        xOff -= 256; //signed int
    } else {
        //hack to prevent the value changing to 100 for some reason
        xOff -= 0;
    }
    var yOff = theCel[3];
    if (yOff > 127) {
        yOff -= 256;
    } else {
        yOff -= 0;
    }
    //console.log("xOff: " + xOff + ", yOff: " + yOff);
    
    var tCol = theCel[4];

    var c = 1;
    var adjWidth;
    var mirrored = 0;
    
    // Setup mirroring if needed
    if (((2 ** loop) & mirrorMask) === (2 ** loop)) {
        //Mirror the loop
        cRow = pixelWidth * cWidth;
        mirrored = 1;
        xOff *= -1 //mirror xOffset
        adjWidth = (Math.ceil(cWidth/2)*pixelWidth);
    } else {
        adjWidth = (Math.floor(cWidth/2)*pixelWidth);
    }

    for (let i = 5; i < theCel.length; i++) {

        var color = theCel[i];
        var curCol = sciPalette[color];
        //console.log("color: " + color + ", sciPalette[color]: " + sciPalette[color]);
        ctx.fillStyle = rgb(curCol[1],curCol[2],curCol[3]);
        ctx.font = hexFntSize + "px arial";

        if (color == tCol) {
            // Don't draw transparancy
        } else {
            if (hexFX == 0) {
                var hc = color;
                if (hexCycToggle) {
                    hc += hexCyc;
                }
                ctx.fillText(hexFromCol(((hc) % 16)), x+ (xOff*pixelWidth) + cRow - adjWidth, y + (yOff*pixelHeight) + cColumn - (cHeight*pixelHeight));
            } else {
                ctx.fillRect(x+ (xOff*pixelWidth) + cRow - adjWidth, y + (yOff*pixelHeight) + cColumn - (cHeight*pixelHeight), pixelWidth, pixelHeight);
            }
        }
        if (c == cWidth) {
            cColumn += pixelHeight;
            if (mirrored) {
                cRow = pixelWidth * cWidth;
            } else {
                cRow = 0;
            }
            c = 1;
        } else {
            if (mirrored) {
                cRow -= pixelWidth;
            } else {
                cRow += pixelWidth;
            }
            c++;
        }
    }
    hexCyc++;
}

function animate() {
    var cNumber = parseInt(document.getElementById("selCel").value, 10);
    var cMax = parseInt(document.getElementById("selCel").max, 10);
    if (cNumber == cMax) {
        document.getElementById("selCel").value = 0;
    } else {
        cNumber++;
        document.getElementById("selCel").value = cNumber;
    }
    updateDraw();
}

function startAnimate() {
    animateIntervalID = setInterval(animate, parseInt(animationSpeed, 10));
}

function stopAnimate() {
    clearInterval(animateIntervalID);
}

function hexFromCol(colNum) {
    var hexl = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    return hexl[colNum];
} 