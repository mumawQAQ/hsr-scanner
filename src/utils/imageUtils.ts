import cv, { Mat } from '@techstark/opencv-js';

const img2MatHSV = (image: string): Promise<Mat> => {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.src = image;

    imgElement.onload = () => {
      try {
        const imgHSV = new cv.Mat();
        cv.cvtColor(cv.imread(imgElement), imgHSV, cv.COLOR_RGBA2RGB);
        cv.cvtColor(imgHSV, imgHSV, cv.COLOR_RGB2HSV);
        resolve(imgHSV);
      } catch (e) {
        reject(e);
      }
    };

    imgElement.onerror = e => {
      reject(e);
    };
  });
};

const img2MatGray = (image: string): Promise<Mat> => {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.src = image;

    imgElement.onload = () => {
      try {
        const imgGray = new cv.Mat();
        cv.cvtColor(cv.imread(imgElement), imgGray, cv.COLOR_RGBA2GRAY);
        resolve(imgGray);
      } catch (e) {
        reject(e);
      }
    };

    imgElement.onerror = e => {
      reject(e);
    };
  });
};

const img2MatRGB = (image: string): Promise<Mat> => {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.src = image;

    imgElement.onload = () => {
      try {
        const imgRGB = new cv.Mat();
        cv.cvtColor(cv.imread(imgElement), imgRGB, cv.COLOR_RGBA2RGB);
        resolve(imgRGB);
      } catch (e) {
        reject(e);
      }
    };

    imgElement.onerror = e => {
      reject(e);
    };
  });
};

const matCrop = (srcMat: Mat, x: number, y: number, width: number, height: number): Mat => {
  const roi = new cv.Rect(x, y, width, height);

  // make sure the roi is within the image boundaries
  roi.x = Math.max(0, roi.x);
  roi.y = Math.max(0, roi.y);
  roi.width = Math.min(roi.width, srcMat.cols - roi.x);
  roi.height = Math.min(roi.height, srcMat.rows - roi.y);

  return srcMat.roi(roi);
};

const applyFilter = (srcHSVMat: Mat, srcRGBMat: Mat): Mat => {
  // Mask for orange color
  const orangeLower = new cv.Mat(srcHSVMat.rows, srcHSVMat.cols, srcHSVMat.type(), [0, 100, 100, 0]);
  const orangeUpper = new cv.Mat(srcHSVMat.rows, srcHSVMat.cols, srcHSVMat.type(), [20, 255, 255, 255]);
  const orangeMask = new cv.Mat();
  cv.inRange(srcHSVMat, orangeLower, orangeUpper, orangeMask);

  // Mask for white color
  const whiteLower = new cv.Mat(srcHSVMat.rows, srcHSVMat.cols, srcHSVMat.type(), [0, 0, 200, 0]);
  const whiteUpper = new cv.Mat(srcHSVMat.rows, srcHSVMat.cols, srcHSVMat.type(), [180, 255, 255, 255]);
  const whiteMask = new cv.Mat();
  cv.inRange(srcHSVMat, whiteLower, whiteUpper, whiteMask);

  // Combine masks for orange and white
  const combinedMask = new cv.Mat();
  cv.bitwise_or(orangeMask, whiteMask, combinedMask);

  // Apply mask to keep only the orange and white parts visible
  const imgMasked = new cv.Mat();
  cv.bitwise_and(srcRGBMat, srcRGBMat, imgMasked, combinedMask);

  // invert the mask to turn filtered-out areas white
  const invertedMask = new cv.Mat();
  cv.bitwise_not(combinedMask, invertedMask);
  cv.bitwise_or(imgMasked, imgMasked, imgMasked, invertedMask);

  // turn the image to gray
  cv.cvtColor(imgMasked, imgMasked, cv.COLOR_RGBA2GRAY);

  // apply threshold to make the image binary
  cv.threshold(imgMasked, imgMasked, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

  // invert the image to make the text black
  cv.bitwise_not(imgMasked, imgMasked);

  // release the memory
  orangeLower.delete();
  orangeUpper.delete();
  orangeMask.delete();
  whiteLower.delete();
  whiteUpper.delete();
  whiteMask.delete();
  combinedMask.delete();
  invertedMask.delete();

  return imgMasked;
};

export default {
  img2MatHSV,
  img2MatGray,
  img2MatRGB,
  matCrop,
  applyFilter,
};
