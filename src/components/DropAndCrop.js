import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef,
} from '../utils';

const Cropper = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [imgSrcExt, setImgSrcExt] = useState(null);
  const [crop, setCrop] = useState({});
  // const [completedCrop, setCompletedCrop] = useState(null);


  const imageMaxSize = 1000000000 // bytes
  const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
  const imagePreviewCanvasRef = React.createRef();

  const handleOnDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileReader = new FileReader();
  
    fileReader.addEventListener("load", () => {
      const result = fileReader.result;
      setImgSrc(result);
      setImgSrcExt(extractImageFileExtensionFromBase64(result));
    }, false);

    fileReader.readAsDataURL(file);
  };
 
  const handleOnCropChange = (c) => {
    setCrop(c);
  }

  const handleImageLoad = (event) => {
    // const canvasRef = imagePreviewCanvasRef.current;
    // image64toCanvasRef(canvasRef, imgSrc, crop);

    console.log('loaded');
  }

  // pixelCrop ao usar unit: %
  const handleOnCropComplete = (crop, pixelCrop) => {
    const canvasRef = imagePreviewCanvasRef.current;

    image64toCanvasRef(canvasRef, imgSrc, crop);
  }

  const handleClear = (event) => {
    if (event) event.preventDefault();
    const canvas = imagePreviewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    setImgSrc(null);
    setImgSrcExt(null);
    
  }

  const handleDownloadClick = (event) => {
    event.preventDefault();
    const canvasRef = imagePreviewCanvasRef.current;
    console.log(canvasRef);
    const fileName = `previewFile.${imgSrcExt}`;

    const imgBase64 = canvasRef.toDataURL(`image/${imgSrcExt}`)

    // arquivo para upload
    const newCroppedFile = base64StringtoFile(imgBase64, fileName);

    downloadBase64File(imgBase64, fileName);
    handleClear();
  }

  return (
    <div>
      <h1>Drop and Crop</h1>
      {
        imgSrc !== null ?
        <div className='cropper'>
          <ReactCrop
            crop={crop}
            aspect={1 / 1}
            onChange={handleOnCropChange}
            onComplete={handleOnCropComplete}
          >
            <img
              src={imgSrc}
              alt="crop me"
              onLoad={handleImageLoad}
            />
          </ReactCrop>

          <div className="preview">
            <canvas ref={imagePreviewCanvasRef}></canvas>

            <div className="buttons">
              {
                Object.keys(crop).length > 0 &&
                <button onClick={handleDownloadClick}>
                  Download
                </button>
              }

              <button onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </div>
        : 
        <Dropzone
          onDrop={handleOnDrop}
          accept={acceptedFileTypes}
          multiple={false}
          maxSize={imageMaxSize}
        >
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()} className='dropzone'>
                <input {...getInputProps()} />
                <p>Solte uma imagem aqui</p>
              </div>
            </section>
          )}
        </Dropzone>
      }
    </div>
    // <div className="cropper">
    //     <ReactCrop
    //       src="../assets/images/mgm-promotion@3x.png"
    //       crop={crop}
    //       onChange={c => setCrop(c)}
    //     />
    // </div>
  )
}

export default Cropper;
 