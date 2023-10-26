var loopPointers = []; //offsets to loop starts
var celPointers = []; //offsets to cel starts

function processSCI1(data) {
  // Use x.length = 0 to clear arrays...
  loopPointers.length = 0;
  celPointers.length = 0;
  cels.length = 0;
  loops.length = 0;
  sciPalette.length = 0;

  // 0x02 number of loops in view
  var numLoop = data.slice(0,1);
  
  //what is at 0x03? Unused

  // 0x02-0x03 "mirrored" bitmask, LSB is for loop 0
  mirrorMask = to16Bit(data.slice(2,4));
  
  ////to16Bit(data.slice(4,6)); // 0x04-0x05 version (unused)
  
  // get palette data
  // 0x06-0x07 palette Offset (Should be ignored in SCI0)
  var palOffset = to16Bit(data.slice(6,8));
  //console.log("full sci1 palette: " + data.slice(palOffset,palOffset + 261 + 1024));
  // strip everything but the 1024 bits of color data
  var rawPal = data.slice(palOffset + 260,palOffset + 261 + 1024);
  for (let i = 0; i < 256; i++) {
    var colEntry = [];
    colEntry[0] = rawPal[i * 4]; //used flag
    colEntry[1] = rawPal[i * 4 + 1]; // r
    colEntry[2] = rawPal[i * 4 + 2]; // g
    colEntry[3] = rawPal[i * 4 + 3]; // b

    sciPalette.push(colEntry);
  }

  // get loop pointers
  var c = 0;
  for (let i = 0; i < numLoop; i++) {
    // loop offsets start at 0x08
    loopPointers.push(to16Bit(data.slice(c+8,c+10)));
    c += 2;
  }
  for (let i = 0; i < loopPointers.length; i++) {
    var numCel = data.slice(loopPointers[i], loopPointers[i]+1);
    c = 0;
    var temp = [];
    for (let k = 0; k < numCel; k++) {
      temp.push(to16Bit(data.slice(loopPointers[i]+c+4,loopPointers[i]+c+6)));
      c += 2;
    }
    celPointers.push(temp);
  }

  // pack loop/cel data into 'loops' array
  for (let i = 0; i < celPointers.length; i++) {
    var loopCelPointers = celPointers[i]
    for (let k = 0; k < loopCelPointers.length; k++) {
      getSCI1CelData(data, loopCelPointers[k]);
    }
    loops.push(cels);
    cels = [];
  }
}

function getSCI1CelData(data, offset) {
  var theCel = [];
  // 0x00 - 0x01 Cel width
  theCel.push(to16Bit(data.slice(offset, offset+2)));
  // 0x02 - 0x03 Cel height
  theCel.push(to16Bit(data.slice(offset+2, offset+4)));
  // 0x04 x cel displacement (origin)
  theCel.push(data.slice(offset+4, offset+5));
  // 0x05 y cel displacement (origin)
  theCel.push(data.slice(offset+5, offset+6)); 
  // 0x06 - 0x07 transparency color
  theCel.push(to16Bit(data.slice(offset+6, offset+8)));

  // SCI1 Run Lenght Encoding 
  // taken from https://github.com/scummvm/scummvm/blob/master/engines/sci/graphics/view.cpp
  // Each byte is like XXYYYYYY (YYYYY: 0 - 63)
	// - Case A: XX == 00 (binary)
	//   Copy next YYYYYY bytes as-is
	// - Case B: XX == 01 (binary)
	//   Same as above, copy YYYYYY + 64 bytes as-is
	// - Case C: XX == 10 (binary)
	//   Set the next YYYYY pixels to the next byte value
	// - Case D: XX == 11 (binary)
	//   Skip the next YYYYY pixels (i.e. transparency)

  // decode RLE
  var celDataLenght = theCel[0] * theCel[1];
  var c = 0;
  for (let k = 0; c < celDataLenght; k++) {
    var theByte = data.slice(offset+8+k, offset+9+k)
    var rep; // the repeat or count
    switch(theByte >>> 6) {
      case 0: 
        // Copy next YYYYYY bytes as-is
        rep = (theByte & 255);
        //console.log("As-IS, for next: " + rep + " bytes .");
        for (let j = 0; j < rep; j++) {
          var palNum = data.slice(offset+8+k+1+j, offset+9+k+1+j)
          theCel.push(palNum);
        }
        k += rep; 
        c += rep;
        break;
      case 1:
        // Same as above, copy YYYYYY + 64 bytes as-is
        rep = (theByte & 191) + 64;
        //console.log("As-IS (+64), for next: " + (rep + 64) + " bytes .");
        for (let j = 0; j < (rep + 64); j++) {
          var palNum = data.slice(offset+8+k+1+j, offset+9+k+1+j)
          theCel.push(palNum);
        }
        k += rep;
        c += rep + 64;
        break;
      case 2: 
        // Set the next YYYYY pixels to the next byte value
        rep = (theByte & 127);
        //console.log("Repeat, for next: " + rep + " bytes.");
        for (let j = 0; j < rep; j++) {
          theCel.push(data.slice(offset+8+k+1, offset+9+k+1));
        }
        k += 1;
        c += rep;
        break;
      case 3:
        // Skip the next YYYYY pixels (i.e. transparency)
        rep = (theByte & 63);
        //console.log("tansparency, for next: " + rep + " bytes.");
        for (let j = 0; j < rep; j++) {
          theCel.push(to16Bit(data.slice(offset+6, offset+8)));
        }
        c += rep;
        break;
      default:
        console.log("RLE error");
    }
  }
  cels.push(theCel);
  //console.log("the cell data: " + theCel);
};