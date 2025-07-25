import React from 'react'

function QRCode({url}) {
  return (
     <QRCodeCanvas
      value={url}
      size={128}
      bgColor="#ffffff"
      fgColor="#000000"
      level="H"
    />
  )
}

export default QRCode