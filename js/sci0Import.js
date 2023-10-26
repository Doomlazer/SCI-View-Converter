var loopPointers = []; //offsets to loop starts
var celPointers = []; //offsets to cel starts

function processSCI0(data) {
  // Use x.length = 0 to clear arrays...
  loopPointers.length = 0;
  celPointers.length = 0;
  cels.length = 0;
  loops.length = 0;
  sciPalette.length = 0;

  // 0x00-0x01 number of loops in view
  var numLoop = to16Bit(data.slice(0,2));

  // 0x02-0x03 "mirrored" bitmask, LSB is for loop 0
  mirrorMask = to16Bit(data.slice(2,4));

  ////to16Bit(data.slice(4,6)); // 0x04-0x05 version (unused)
  ////to16Bit(data.slice(6,8)); // 0x06-0x07 palette Offset (might exsist, but don't use for SCI0)

  // set SCI0 16 color palette data
  var palOffset = to16Bit(data.slice(6,8));
  for (let i = 0; i < 16; i++) {
    sciPalette.push(getSCI0PColor(i));
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
    //console.log("Loop " + i + " Total Cels: " + data.slice(loopPointers[i], loopPointers[i]+1) + " celPointers: " + celPointers[i]);
    var loopCelPointers = celPointers[i]
    for (let k = 0; k < loopCelPointers.length; k++) {
      getSCI0CelData(data, loopCelPointers[k]);
    }
    loops.push(cels);
    cels = [];
  }
}

function getSCI0CelData(data, offset) {
  var theCel = [];
  // 0x00 - 0x01 Cel width
  theCel.push(to16Bit(data.slice(offset, offset+2)));
  // 0x02 - 0x03 Cel height
  theCel.push(to16Bit(data.slice(offset+2, offset+4)));
  // 0x04 x offset (origin)
  theCel.push(data.slice(offset+4, offset+5));
  // 0x05 y offset (origin)
  theCel.push(data.slice(offset+5, offset+6));
  // 0x06 - 0x07 transparency color
  theCel.push(to16Bit(data.slice(offset+6, offset+8)));

  // Decode color and repeat data 
  var decodeLenght = theCel[0] * theCel[1];
  var c = 0;
  for (let i = 0; c < decodeLenght; i++) {
    var pxl = data.slice(offset+8+i, offset+9+i)
    // pixel byte is repeat count (high nibble) and color (low nibble).
    // TODO: change this to use bit shifting instead?
    var color = pxl % 16;
    var repeat = (pxl - color) / 16;
    for (let k = 0; k < repeat; k++) {
      theCel.push(color);
    }
    c += repeat;
  }
  cels.push(theCel);
};