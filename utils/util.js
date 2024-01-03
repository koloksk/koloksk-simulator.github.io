import { wpscale } from "../controllers/moveController.js";

export function getPointsDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
      );
}

export function getMaxLineLength(x, y, angle) {
  // let intersectionX = x + canvas.width * 1.5 * Math.cos(DegreesToRadians(angle));
  // let intersectionY = y + canvas.height * 1.5 * Math.sin(DegreesToRadians(angle));

  // let lineLength = Math.sqrt(
  //   Math.pow(intersectionX - x, 2) + Math.pow(intersectionY - y, 2)
  // );

  // return lineLength;
  // console.log(canvas.width)
  // console.log(wpscale)

  return canvas.width + canvas.width * Math.abs(1 - wpscale);
}

export function refractiveIndex(wavelength) {
  // Konstanty fizyczne
  const indeksZalamaniaProzni = 1.5;

  // Obliczamy kąt korzystając z równania arcsin
  const katRad = Math.asin(wavelength / 1e4 / indeksZalamaniaProzni);

  // Konwertujemy kąt z radianów na stopnie
  const katStopnie = (katRad * 180) / Math.PI;

  return katStopnie;
}
export function RadiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}

export function DegreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function wavelengthToColor(wavelength, alpha) {
  var R,
      G,
      B,
      colorSpace,
      wl = wavelength,
      alpha = 1;


  if (wl >= 380 && wl < 440) {
      R = -1 * (wl - 440) / (440 - 380);
      G = 0;
      B = 1;
 } else if (wl >= 440 && wl < 490) {
     R = 0;
     G = (wl - 440) / (490 - 440);
     B = 1;  
  } else if (wl >= 490 && wl < 510) {
      R = 0;
      G = 1;
      B = -1 * (wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
      R = (wl - 510) / (580 - 510);
      G = 1;
      B = 0;
  } else if (wl >= 580 && wl < 645) {
      R = 1;
      G = -1 * (wl - 645) / (645 - 580);
      B = 0.0;
  } else if (wl >= 645 && wl <= 780) {
      R = 1;
      G = 0;
      B = 0;
  } else {
      R = 0;
      G = 0;
      B = 0;
  }

  // intensty is lower at the edges of the visible spectrum.
  if (wl > 780 || wl < 380) {
      alpha *= 0;
  } else if (wl > 700) {
      alpha *= (780 - wl) / (780 - 700);
  } else if (wl < 420) {
      alpha *= (wl - 380) / (420 - 380);
  } else {
      alpha *= 1;
  }

  //white color
  if(wl == 0){
    R = 1;
    G = 1;
    B = 1;
    alpha = 1;
  }

  colorSpace = "rgba(" + (R * 100) + "%," + (G * 100) + "%," + (B * 100) + "%, " + alpha + ")";

  // colorSpace is an array with 5 elements.
  // The first element is the complete code as a string.  
  // Use colorSpace[0] as is to display the desired color.  
  // use the last four elements alone or together to access each of the individual r, g, b and a channels.  
  return colorSpace;
 
}