function exportPng(loop, cel) {
    var theLoop = loops[loop];
    var theCel = theLoop[cel];
    var cWidth = theCel[0];
    var cHeight = theCel[1];
    const imgData = ctx.createImageData(cWidth, cHeight);
    var c = 0;

    // Mirrored loop setup
    var mirrored = 0;
    if (((2 ** loop) & mirrorMask) === (2 ** loop)) {
        mirrored = 1;
        console.log("cWidth: " + cWidth);
        c = (cWidth * 4) - 4;
        console.log("exporting mirror, C is: " + c);
    }

    var mirrorRow = 0;
    for (let i = 5; i < theCel.length; i++) {
        var curCol = sciPalette[theCel[i]];
        imgData.data[c+0] = Math.floor(curCol[1]);
        imgData.data[c+1] = Math.floor(curCol[2]);
        imgData.data[c+2] = Math.floor(curCol[3]);
        imgData.data[c+3] = 255;
        if (mirrored) {
            if (c % (cWidth*4) == 0) {
                mirrorRow += 1;
                c = (cWidth * 4 * mirrorRow) - 4;
            } else {
                c-=4;
            }
        } else {
            c+=4;
        }
    }

    // finally, export the image
    var canvas = document.createElement('canvas');
    var ctx2 = canvas.getContext('2d');
    canvas.width = cWidth;
    canvas.height = cHeight;
    ctx2.putImageData(imgData, 0, 0);

    const link = document.createElement('a');
    link.download = "Loop" + loop + "_Cel" + cel + ".png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
    canvas.delete;
}

function exportCel() {
    var sLoop = document.getElementById("selLoop").value;
    var sCel = document.getElementById("selCel").value;
    exportPng(sLoop, sCel);
  }

  function exportLoop() {
    var sLoop = document.getElementById("selLoop").value;
    var tempCels = loops[sLoop];
    for (let i = 0; i < tempCels.length; i++) {
      exportPng(sLoop, i);
    }
  }

  function exportAll() {
    for (let i = 0; i < loops.length; i++) {
      console.log("Exporting loop: " + i + ", contains " + loops[i].length + " cels.");
      for (let k = 0; k < loops[i].length; k++) {
        exportPng(i, k);
      }
    }
  }