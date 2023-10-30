var loopPointers = []; // offsets to loop starts
var celPointers = []; //offsets to cel starts
var celCounts = []; // store loop cel counts
var celSize;


function processSCI11(data) {
  console.log("importing as SCI1.1");
  // Use x.length = 0 to clear arrays...
  loopPointers.length = 0;
  celPointers.length = 0;
  celCounts.length = 0;
  cels.length = 0;
  loops.length = 0;
  sciPalette.length = 0;
  mirrorStorage.length = 0;

  // starting from offset 0x26 of the file view file (which has been removed from data):

  // 0x00 sci1.1 header size WORD
  var headerSize = to16Bit(data.slice(0,2));
  headerSize += 2; // account for the headSize WORD at the beginning of data
  //console.log("total headerSize: " + headerSize);

  // 0x02 number of loops in view BYTE
  var loopCount = data.slice(2,3);
  //console.log("loopCount: " + loopCount);
  
  // 0x03 sci1.1 flags BYTE, just store this for posible export for now. 
  // from scummvm view.cpp:
        // flags is actually a bit-mask
        // it seems it was only used for some early sci1.1 games (or even just laura bow 2)
        // later interpreters dont support it at all anymore
        // we assume that if flags is 0h the view does not support flags and default to scaleable
        // if it's 1h then we assume that the view is not to be scaled
        // if it's 40h then we assume that the view is scaleable
  sci11Flags = data.slice(3,4);

  // 0x04 version WORD
  // 0x06  unknown WORD

  // 0x08 palette offset WORD
  var palOffset = to16Bit(data.slice(8,10));

  console.log("sci1.1 palette header: " + data.slice(palOffset,palOffset + 37));
  // strip everything but the 1024 bits of color data
  var rawPal = data.slice(palOffset + 37, palOffset + 38 + 1024);
  for (let i = 0; i < 256; i++) {
    var colEntry = [];
    colEntry[0] = rawPal[i * 4]; //used flag
    colEntry[1] = rawPal[i * 4 + 1]; // r
    colEntry[2] = rawPal[i * 4 + 2]; // g
    colEntry[3] = rawPal[i * 4 + 3]; // b

    sciPalette.push(colEntry);
  }

  // 0x10 loop size BYTE
  var loopSize = parseInt(data.slice(12,13), 10);
  //console.log("loopSize: " + loopSize);
  
  // 0x11 cel size	BYTE
  celSize = parseInt(data.slice(13,14), 10);
  //console.log("celSize: " + celSize);

  // collect celPointers for each loop
  for (let i = 0; i < loopCount; i++) {
    var offSet = headerSize + (i * loopSize);
    var loopData = data.slice(offSet, offSet + loopSize);
    //console.log("loopData for loop " + i + ": " + loopData);

    // 0x00 mirror flag WORD
    var seekEntry = to16Bit(loopData.slice(0,2));
    //console.log("loop: " + i + ", seekEntry: " + seekEntry);
    if (seekEntry != 255) {
      // use the root loop for mirroring. this handles rare loops that
      //  mirror loops that mirror loops. (FPFP view 844, bug #10953)
      var tempLD;
      var tempSeek = seekEntry;
      do {
        tempSeek -= 256;
        var tempOffSet = headerSize + (tempSeek * loopSize);
        tempLD = data.slice(tempOffSet, tempOffSet + loopSize);
        tempSeek = to16Bit(tempLD.slice(0,2));
        if (tempSeek != 255) {
          seekEntry = tempSeek;
        }
      } while (tempSeek != 255);

      seekEntry -= 256;
      mirrorStorage[i] = seekEntry; //store the loop it references
      addToMirrorMask(i);
      console.log("loop: " + i + " is a mirror of: " + seekEntry);
      offSet = headerSize + (seekEntry * loopSize);
      loopData = data.slice(offSet, offSet+parseInt(loopSize,10));
    } else {
      mirrorStorage[i] = 255;
    }
    // 0x02 celCount BYTE
    var celCount = parseInt(loopData.slice(2,3), 10);
    //console.log("celCount: " + celCount);
    celCounts.push(celCount);

    // 0x12 celDataOffset 4BYTES
    var celDataOffset = to32Bit(loopData.slice(12, 16));
    //console.log("celDataOffset: " + celDataOffset);
    celPointers.push(celDataOffset);
  }


  // pack loop/cel data into 'loops' array
  for (let i = 0; i < celPointers.length; i++) {
    var celDataOffset = celPointers[i]
    for (let j = 0; j < celCounts[i]; j++) {
      var celOffset = celDataOffset + (j * celSize);
      getSCI11CelData(data, celOffset);
    }
    loops.push(cels);
    cels = [];
  }
}

function getSCI11CelData(data, offset) {
  var celData = data.slice(offset, offset+parseInt(celSize,10));
  //console.log("celData at offset " + offset + ": " + celData);

  var theCel = [];
  // 0x00 - 0x01 Cel width
  var w = to16Bit(celData.slice(0, 2));
  theCel.push(w);
  // 0x02 - 0x03 Cel height
  var h = to16Bit(celData.slice(2, 4));
  theCel.push(h);
  
  // 0x04 - 0x05 x cel displacement (origin)
  var a = parseInt(celData.slice(4, 5), 10);
  var b = parseInt(celData.slice(5, 6), 10);
  var xDisplace;
  if (b == 255) {
    xDisplace = a-256;
  } else {
    xDisplace = a;
  }
  //theCel.push(to16Bit(celData.slice(4, 6)));
  theCel.push(xDisplace);
  
  // 0x06 - 0x08 y cel displacement (origin)
  a = parseInt(celData.slice(6, 7), 10);
  b = parseInt(celData.slice(7, 8), 10);
  var yDisplace;
  if (b == 255) {
    yDisplace = a-256;
  } else {
    yDisplace = a;
  }
  //theCel.push(to16Bit(celData.slice(6, 8)));
  theCel.push(yDisplace); 
  
  // 0x08  transparency color
  var tCol = parseInt(celData.slice(8, 9),10);
  theCel.push(tCol);

  // 0x24 offsetRLE 4BYTES
  var offsetRLE = to32Bit(celData.slice(24, 28));
  // 0x28 offsetLiteral (color indexs)  4BYTES
  var offsetLiteral = to32Bit(celData.slice(28, 32));

  /*
  console.log("w: " + w);
  console.log("h: " + h);
  console.log("x displace: " + xDisplace);
  console.log("y displace: " + yDisplace);
  console.log("trans color: " + tCol);
  console.log("offsetRLE: " + offsetRLE);
  console.log("offsetLiteral: " + offsetLiteral); 
  */

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
  var celDataLenght = w * h;
  var c = 0;
  for (let k = 0; c < celDataLenght; k++) {
    var theByte = data.slice(offsetRLE+k, offsetRLE+k+1);
    var rep; // the repeat or count
    switch(theByte >>> 6) {
      case 0: 
        // Copy next YYYYYY bytes as-is
        rep = (theByte & 255);
        for (let j = 0; j < rep; j++) {
          var palNum = data.slice(offsetLiteral, offsetLiteral+1)
          offsetLiteral++;
          theCel.push(palNum);
          //console.log("case 0 - palNum: " + palNum);
        }
        //k += rep; 
        c += rep;
        break;
      case 1:
        // Same as above, copy YYYYYY + 64 bytes as-is
        rep = (theByte & 191) + 64;
        for (let j = 0; j < (rep + 64); j++) {
          var palNum = data.slice(offsetLiteral, offsetLiteral+1)
          offsetLiteral++;
          theCel.push(palNum);
          //console.log("case 1 - palNum: " + palNum);
        }
        //k += rep;
        c += rep + 64;
        break;
      case 2: 
        // Set the next YYYYY pixels to the next byte value
        rep = (theByte & 127);
        var repeatedColor = data.slice(offsetLiteral, offsetLiteral+1);
        offsetLiteral++;
        for (let j = 0; j < rep; j++) {
          theCel.push(repeatedColor);
          //console.log("case 2 - repeatedColor: " + repeatedColor);
        }
        c += rep;
        break;
      case 3:
        // Skip the next YYYYY pixels (i.e. transparency)
        rep = (theByte & 63);
        for (let j = 0; j < rep; j++) {
          theCel.push(tCol);
          //console.log("case 3 - tCol: " + tCol);
        }
        c += rep;
        break;
      default:
        console.log("RLE error");
    }
  }
  cels.push(theCel);
  //console.log("w: " + w + ", h: " + h + ", w*h: " + (w*h));
  //console.log("the cell data: " + theCel);
};

function addToMirrorMask(l) {
  switch(l) {
    case 0:
      mirrorMask += 1;
      break;
    case 1:
      mirrorMask += 2;
      break;
    case 2:
      mirrorMask += 4;
      break;
    case 3:
      mirrorMask += 8;
      break;
    case 4:
      mirrorMask += 16;
      break;
    case 5:
      mirrorMask += 32;
      break;
    case 6:
      mirrorMask += 64;
      break;
    case 7:
      mirrorMask += 128;
      break;
    case 8:
      mirrorMask += 256;
      break;
    case 9:
      mirrorMask += 512;
      break;
    case 10:
      mirrorMask += 1024;
      break;
    case 11:
      mirrorMask += 2048;
      break;
    case 12:
      mirrorMask += 4096;
      break;
    case 13:
      mirrorMask += 8192;
      break;
    case 14:
      mirrorMask += 16384;
      break;
    case 15:
      mirrorMask += 32768;
      break;
    default:
      console.error("mirrored loop > than 0 to 15");
  }
}