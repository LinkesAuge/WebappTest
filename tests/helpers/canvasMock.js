/**
 * Canvas Mock for Jest
 * 
 * This file mocks the canvas module which is a native dependency
 * that can be difficult to install in some environments.
 */

// Mock the Canvas class
class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  getContext() {
    return {
      canvas: this,
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(),
      putImageData: jest.fn(),
      createImageData: jest.fn(),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn()
    };
  }
  
  toBuffer() {
    return Buffer.from([]);
  }
  
  toDataURL() {
    return '';
  }
}

// Mock the Image class
class Image {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.src = null;
    this.width = 0;
    this.height = 0;
    this.complete = false;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
  }
}

// Export the mocked canvas module
module.exports = {
  Canvas,
  Image,
  createCanvas: (width, height) => new Canvas(width, height),
  loadImage: () => Promise.resolve(new Image()),
  registerFont: jest.fn()
}; 