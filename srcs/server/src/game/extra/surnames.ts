export const nickName = (): string => {
  const animal = [
    'donkey',
    'leopard',
    'tiger',
    'polar bear',
    'rabbit',
    'cheetah',
    'turtle',
    'porcupine',
    'lion',
    'bear',
    'turtle',
    'hare',
  ];

  const location = [
    'Beijing',
    'Kinshasa',
    'Moscow',
    'Jakarta',
    'Cairo',
    'Seoul',
    'Mexico City',
    'London',
    'Dhaka',
    'Lima',
    'Tehran',
    'Bangkok',
    'Hanoi',
    'Baghdad',
    'Riyadh',
    'Hong Kong',
    'Bogotá',
    'Santiago',
    'Ankara',
  ];

  const iAnimal = Math.floor(Math.random() * (animal.length - 1));
  const iLocation = Math.floor(Math.random() * (location.length - 1));
  return `the ${animal[iAnimal]} of ${location[iLocation]}`;
};
