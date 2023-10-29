var data = [];

function exportSCI0() {
    if (isSCI1 || isSCI11) {
        UseDefaultSCI0()
    }

    data = [];
    var loopsCount = loops.length;
    var offsetCounter = 10;
    var lpOffsets = [];
    var forMirrors = [];

    data.push(128); // 0x80
    data.push(0); // 0x00

    push16toLE(loopsCount);

    push16toLE(mirrorMask); //mirror mask

    push16toLE(0); // version
    push16toLE(0); // palette offset (should be unused in SCI0)

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
                
                for (let j = 5; j < theCel.length; 0) {
                    var currentColor = theCel[j];
                    var rCount = 1;
                    while ((currentColor == theCel[j+rCount]) && (rCount < 15)) {
                        rCount++;
                    }
                    var colByte = (rCount * 16) + currentColor;
                    //console.log("colorByte: " + colByte);
                    data.push(colByte);
                    j += rCount;
                    offsetCounter++;
                }
            }
        }
    }

    //console.log(data);

    var ab = new ArrayBuffer(data.length); //bytes is the array with the integer
    var ia = new Uint8Array(ab);

    for (var i = 0; i < data.length; i++) {
    ia[i] = data[i];
    }
    download(ia, "view." + viewName, "application/octet-stream"); 

}

//function convert(integer) {
//    var str = Number(integer).toString(16);
//    return str.length % 2 == 1 ? "0" + str : str;
//};

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