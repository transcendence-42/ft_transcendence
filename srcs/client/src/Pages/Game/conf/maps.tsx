// Game modes

export const mapNeon = Object.freeze({
  canvas: { fill: '#05021E', size: { w: 900, h: 500 } },
  paddle: {
    size: { w: 12, h: 54 },
    fill: '#FF87FF',
    shadow: 15,
    shadowColor: '#FF6ADE'
  },
  ball: { size: 12, fill: '#FF87FF', shadow: 15, shadowColor: '#FF6ADE' },
  wall: { size: 5, fill: '#FF87FF', shadow: 15, shadowColor: '#FF6ADE' },
  message: {
    size: 1,
    style: 'bold',
    fill: '#b4e8f1',
    shadow: 15,
    shadowColor: '#60c2c2'
  },
  username: {
    size: 1,
    style: 'bold',
    fill: '#b4e8f1',
    shadow: 15,
    shadowColor: '#60c2c2'
  },
  score: {
    size: 1,
    style: 'bold',
    fill: '#b4e8f1',
    shadow: 15,
    shadowColor: '#60c2c2'
  },
  fontFamily: 'Arial'
});

export const mapOriginal = Object.freeze({
  canvas: { fill: '#05021E', size: { w: 900, h: 500 } },
  paddle: {
    size: { w: 12, h: 54 },
    fill: '#ffffff',
    shadow: 0,
    shadowColor: '#05021E'
  },
  ball: { size: 12, fill: '#ffffff', shadow: 0, shadowColor: '#05021E' },
  wall: { size: 5, fill: '#ffffff', shadow: 0, shadowColor: '#05021E' },
  message: {
    size: 0.7,
    style: 'bold',
    fill: '#ffffff',
    shadow: 0,
    shadowColor: '#05021E'
  },
  username: {
    size: 0.8,
    style: 'bold',
    fill: '#ffffff',
    shadow: 0,
    shadowColor: '#05021E'
  },
  score: {
    size: 0.8,
    style: 'bold',
    fill: '#ffffff',
    shadow: 15,
    shadowColor: '#05021E'
  },
  fontFamily: 'sharpin'
});