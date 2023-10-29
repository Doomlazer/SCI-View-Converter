var data = [];
var fullPal = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,
    34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,
    68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,
    102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,
    128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,
    154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,
    180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,
    206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,
    232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,0,0,0,0,
    1,0,0,0,1,24,24,24,1,56,56,56,1,95,95,95,1,120,120,120,1,159,159,159,1,191,191,191,1,223,223,223,1,86,15,
    15,1,119,21,21,1,151,26,26,1,184,32,32,1,216,38,38,1,222,70,70,1,228,103,103,1,233,135,135,0,86,51,15,1,
    119,70,21,0,151,89,26,1,184,104,32,1,216,120,32,0,222,146,70,0,228,165,103,0,233,184,135,0,86,86,15,0,119,
    119,21,0,151,151,26,1,184,184,32,1,216,216,38,0,222,222,70,0,228,228,103,0,233,233,135,0,15,86,15,0,21,119,
    21,1,26,151,26,0,32,184,32,0,38,216,38,0,70,222,70,0,103,228,103,0,135,233,135,1,15,86,86,1,21,119,119,1,
    26,151,151,1,32,184,184,1,38,216,216,1,70,222,222,1,103,228,228,1,135,233,233,0,15,15,86,1,21,21,119,1,26,
    26,151,1,32,32,184,1,38,38,216,1,70,70,222,0,103,103,228,0,135,135,233,0,86,15,86,0,119,21,119,1,151,26,151,
    0,184,32,184,0,216,38,216,1,222,70,222,0,228,103,228,0,233,135,233,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,255,255,255];

function exportSCI1() {
    if (!isSCI1) {
        if (!isSCI11) {
            alert("You must import a SCI1 .pal file before exporting SCI0 to SCI1+.");
            return;  
        } 
    }

    data = [];
    var loopsCount = loops.length;
    var offsetCounter = 10;
    var lpOffsets = [];
    var forMirrors = [];

    data.push(128); // 0x80
    data.push(0); // 0x00

    data.push(loopsCount);
    data.push(128); // 0x80 from scummvm: bit 0x80 means palette is set

    push16toLE(mirrorMask); //mirror mask

    push16toLE(0); // version
    push16toLE(0); // palette offset placeholder

    // 0x0A (0x08 + two byte header) is start of loop pointer WORDs
    for (let i = 0; i < loopsCount; i++) {
        push16toLE(0); //set to zero for now
        offsetCounter += 2;
    }

    // pack loops
    for (let i = 0; i < loopsCount; i++) {
        if (((2 ** i) & mirrorMask) === (2 ** i)) {
            // set the previous loop for mirroring.
            // this might not be the case all the time, compare against orignal data to find the true mirror offset
            replace16toLE(forMirrors[i-1], 10 + (i * 2));
            forMirrors.push(forMirrors[i-1]);
            lpOffsets.push(forMirrors[i-1]);
        } else {
            replace16toLE((offsetCounter - 2), 10 + (i * 2)); // insert loop offset adjusted for header
            forMirrors.push(offsetCounter - 2);
            //console.log("mirorsarray: " + forMirrors);
            lpOffsets.push(offsetCounter - 2);
            var theLoop = loops[i];
            var celCount = theLoop.length;
            //console.log("celcount: " + celCount);
            push16toLE(celCount); // cel count
            offsetCounter += 2;
            push16toLE(0); // unknown word
            offsetCounter += 2;

            for (let k = 0; k < celCount; k++) {
                push16toLE(0); //set celOffsets to zero for now
                offsetCounter += 2;
            }

            // pack cels
            console.log("lpOffsets: " + lpOffsets);
            for (let k = 0; k < celCount; k++) {
                replace16toLE((offsetCounter - 2), lpOffsets[i] + 6 + (k * 2)); // insert cel offset
                var theCel = theLoop[k];

                push16toLE(theCel[0]) // width
                push16toLE(theCel[1]) // height
                data.push(theCel[2]) // displace x byte
                data.push(theCel[3]) // displace y byte
                data.push(theCel[4]) // trans byte
                data.push(0) // padding byte or trans color is a word?
                // add the number of bytes we just pushed
                offsetCounter += 8;
                //console.log("TheCel: " + theCel);
                for (let j = 5; j < theCel.length; 0) {
                    var currentColor = theCel[j];
                    var rCount = 1;

                    //console.log("currentColor: " + currentColor + ", next color: " + theCel[j+1] + ", pixel number: " + (j - 4));
                    if (currentColor == parseInt(theCel[j+1], 10)) {
                        // color is repeating
                        while ((currentColor == theCel[j+rCount]) && (rCount < 64)) {
                            rCount++;
                        }
                        //console.log("currentColor: " + currentColor + ", is eqaul to (transcol): " + theCel[4])
                        var rCase;
                        if (currentColor == theCel[4]) {
                            // Case D: XX == 11 (binary)
	                        // Skip the next YYYYY pixels (i.e. transparency)
                            rCase = rCount + 192;
                            data.push(rCase);
                            offsetCounter ++;
                            //console.log("Transparency repeat: rCase =  " + rCase.toString(16) + ", rCase dec: " + rCase);
                        } else {
                            // Case C: XX == 10 (binary)
	                        // Set the next YYYYY pixels to the next byte value
                            rCase = rCount + 128;
                            data.push(rCase);
                            data.push(currentColor);
                            offsetCounter += 2;
                            //console.log("Standard repeat: rCase =  " + rCase.toString(16));
                            //console.log("Standard repeat: currentColor =  " + currentColor.toString(16) + ", currentColor  dec: " + currentColor);
                        }
                    } else {
                        // copy data as-is until a color repeats, or the rCount is >= 127
                        //console.log("theCel[j]: " + theCel[j] + ", ");
                        while ((theCel[j+rCount] != theCel[j+rCount+1]) && (rCount < 127)) {
                            rCount++;
                        }
                        data.push(rCount);
                        //console.log("ASIS rCount: " + rCount.toString(16) + ", rCount dec: " + rCount);
                        for (let l = 0; l < rCount; l++) {
                            data.push(theCel[j+l]);
                            var t = theCel[j+l];
                            //console.log("color: " + t.toString(16) + ", color dec: " + t);
                        }
                        offsetCounter += (rCount + 1);
                    }
                    j += rCount;
                    //console.log("data: " + data);
                }
            }
        }
    }

    //add Palette 
    replace16toLE((offsetCounter - 2), 8); // set palette offset
    // add generic palette header
    for (let i = 0; i < 260; i++) {
        data.push(fullPal[i]);
    }
    // add current SCI1 colors
    for (let i = 0; i < sciPalette.length; i++) {
        var temp = sciPalette[i];
        data.push(temp[0]);
        data.push(temp[1]);
        data.push(temp[2]);
        data.push(temp[3]);
    }
    //console.log(data);

    var ab = new ArrayBuffer(data.length); //bytes is the array with the integer
    var ia = new Uint8Array(ab);

    for (var i = 0; i < data.length; i++) {
    ia[i] = data[i];
    }
    download(ia, viewName + ".v56", "application/octet-stream"); 

}

function push16toLE(num) {
    var high = num >>> 8;
    var low = ((~(high << 8)) & num);
    data.push(low);
    data.push(high);
}

function replace16toLE(num, offset) {
    var high = num >>> 8;
    var low = ((~(high << 8)) & num);
    data[offset] = low;
    data[offset + 1] = high;
}