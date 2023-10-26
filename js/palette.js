function processPal(data, useDefaultSCI0) {
    if (sciPalette.length == 0) {
        alert("You must first load a view before replacing the palette.")
        return;
    }

    targetPalette = [];
    if (useDefaultSCI0 == 1) {
        // Use default SCI0 colors
        for (let i = 0; i < 16; i++) {
            targetPalette.push(getSCI0PColor(i));
        }
        isSCI1 = 0;
    } else {
        // import the palette from pal file.
        var palOff;
        var palStart;
        var colCount;
        var v11 = 0;
        // SCI1 pal offset 260, SCI1.1 offset 37
        // SCI1 pal start 0, SCI1.1 start @ data[25]
        // SCI1 color count 256, SCI1.1 count @ data.slice(29,31)
        if ((data[0] == 0 && data[1] == 1) || (data[0] == 0 && data[1] == 0 && to16Bit(data.slice(29,31)))) {
            // SCI0 or SCI1 palette file detected.
            palOff = 260;
            palStart = 0;
            colCount = 256;
        } else {
            // SCI1.1 palette file
            // TODO: FIX SCI1.1 pal imports
            //alert("warning SCI1.1 .pal are currently buggy. Do not use them.");
            palOff = 21;
            palStart = data[25];
            //colCount = to16Bit(data.slice(29,31)); wth was this??
            colCount = 256;
            v11 = 1;
        }
        for (i = palStart; i < palStart + colCount; i++) {
            var col = [];
            // this may not be correct for all sci1.1 pal files
            // if (v11)
            col.push(data[palOff++]); // "used" flag
            col.push(data[palOff++]); // r
            col.push(data[palOff++]); // g
            col.push(data[palOff++]); // b

            targetPalette.push(col);
        }
        isSCI1 = 1;
    }

    // create remap
    var remappedPal = [];
    for (let i = 0; i < sciPalette.length; i++) {
        var closest = 195076; // 255**2 + 255**2 + 255**2 + 1
        var closetColNum;
        for (let k = 0; k < targetPalette.length; k++) {
            var sCol =  sciPalette[i];
            var tCol = targetPalette[k];
            var rDiff = sCol[1] - tCol[1];
            var gDiff = sCol[2] - tCol[2];
            var bDiff = sCol[3] - tCol[3];
            var distance = Math.pow(rDiff, 2) + Math.pow(gDiff, 2) + Math.pow(bDiff, 2);
            if (distance < closest) {
                closest = distance;
                closetColNum = k;
            }
        }
        remappedPal.push(closetColNum);
    }

    // remap all loops/cels
    var mappedLoops = [];
    for (let i = 0; i < loops.length; i++) {
        var oldLoop = loops[i];
        var newLoop = [];
        for (let k = 0; k < loops[i].length; k++) {
            var oldCel = oldLoop[k];
            var newCel = [];
            newCel.push(oldCel[0]);
            newCel.push(oldCel[1]);
            newCel.push(oldCel[2]);
            newCel.push(oldCel[3]);
            newCel.push(remappedPal[oldCel[4]]); // update transparent color
            for (let j = 5; j < oldCel.length; j++) {
                var oldColor = oldCel[j];
                //console.log("old color: " + oldColor + ", remapped Color: " + remappedPal[oldColor]);
                newCel.push(remappedPal[oldColor]);
            }
            newLoop.push(newCel);
        }
        mappedLoops.push(newLoop);
    }
    //loops.length = 0;
    loops = mappedLoops;
    //sciPalette.length = 0;
    sciPalette = targetPalette;
    targetPalette = [];
    updateDraw();
}

function drawSCIPalette(x, y) {
    ctx.strokeText("Current palette:", x, y-10);
    var cRow = 0;
    var cColumn = 0;
    var c = 0;
    for (let i = 0; i < sciPalette.length; i++) {
        var curCol = sciPalette[i];
        ctx.fillStyle = rgb(curCol[1],curCol[2],curCol[3]);
        ctx.fillRect(x + cColumn, y + cRow, 8, 8);
        if (c == 15) {
        cRow += 8;
        cColumn = 0;
        c = 0;
        } else {
        cColumn += 8;
        c += 1;
        }
    }

    // draw taget palette (currently disabled)
    if (targetPalette.length > 0) {
        ctx.strokeText("target palette:", x, y-210);
        cRow = 0;
        cColumn = 0;
        c = 0;
        for (let i = 0; i < targetPalette.length; i++) {
            var curCol = targetPalette[i];
            ctx.fillStyle = rgb(curCol[1],curCol[2],curCol[3])
            ctx.fillRect(x + cColumn, y + cRow - 200, 8, 8);
            if (c == 15) {
            cRow += 8;
            cColumn = 0;
            c = 0;
            } else {
            cColumn += 8;
            c += 1;
            }
        } 
    }
}

function rgb(r, g, b){
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return ["rgb(",r,",",g,",",b,")"].join("");
}

function getSCI0PColor(num) {
    var c = [];
    switch (num) {
        case 0:
            //black
            c.push(0); // "used" flag
            c.push(0);
            c.push(0);
            c.push(0);
            break;
        case 1:
            //dark blue
            c.push(0);
            c.push(0);
            c.push(0);
            c.push(170);
            break;
        case 2:
            //dark green
            c.push(0);
            c.push(0);
            c.push(170);
            c.push(0);
            break;
        case 3:
            //teal
            c.push(0);
            c.push(0);
            c.push(170);
            c.push(170);
            break;
        case 4:
            //dark red
            c.push(0);
            c.push(170);
            c.push(0);
            c.push(0);
            break;
        case 5:
            //dark purple
            c.push(0);
            c.push(170);
            c.push(0);
            c.push(170);
            break;
        case 6:
            //brown
            c.push(0);
            c.push(170);
            c.push(86);
            c.push(0);
            break;
        case 7:
            //light grey
            c.push(0);
            c.push(170);
            c.push(170);
            c.push(170);
            break;
        case 8:
            c.push(0);
            c.push(85);
            c.push(85);
            c.push(85);
            break;
        case 9:
            //light blue
            c.push(0);
            c.push(85);
            c.push(85);
            c.push(255);
            break;
        case 10:
            //light green
            c.push(0);
            c.push(0);
            c.push(255);
            c.push(85);
            break;
        case 11:
            //cyan
            c.push(0);
            c.push(85);
            c.push(255);
            c.push(255);
            break;
        case 12:
            //light red
            c.push(0);
            c.push(255);
            c.push(85);
            c.push(85);
            break;
        case 13:
            //light purple
            c.push(0);
            c.push(255);
            c.push(85);
            c.push(255);
            break;
        case 14:
            //yellow
            c.push(0);
            c.push(255);
            c.push(255);
            c.push(85);
            break;
        case 15:
            //white
            c.push(0);
            c.push(255);
            c.push(255);
            c.push(255);
            break;
        default:
            console.error(num + " is an invalid SCI0 palette color."); 
    }
    return c;
}