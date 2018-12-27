const container = document.querySelector('.container');
const sliceCount = 11;
const clampAngle = 0;
const stopAngle = 70;
const foldAngle = -6;
const stepAngle = 5;

let sliceHeight = 0;
let height = 0;
let width = 0;
let current;
let slices;
let angle = -140;
let count = 0;

const sliceImage = (source) => {
  for (let i = 0; i < sliceCount; i++) {
    const div = document.createElement('div');
    div.classList.add('slice')
    div.classList.add('image')
    div.style.backgroundImage = 'url(' + source + ')';
    current.appendChild(div);
  }
  slices = Array.from(current.querySelectorAll('.slice')).reverse();

  slices.forEach((slice, i) => {
    slice.style.height = `${sliceHeight}px`
    slice.style.width = `${width}px`
    slice.style.backgroundPosition = `0 ${(slices.length - i - 1) / (slices.length - 1) * 100}%`;
  });
};

function fold(startAngle, fold, clampAngle) {
  let angle = startAngle, accY = 0, accZ = 0, newAngle = 0;
  slices.forEach((slice, i) => {
    newAngle = angle;
    if (newAngle < -90) newAngle = -90;
    if (newAngle > 0) newAngle = 0;
    slice.style.transform = `translateY(${accY}px) translateZ(${accZ}px) rotateX(${newAngle}deg) translateX(-50%)`
    const moveZ = Math.sin(newAngle * Math.PI / 180) * sliceHeight;
    const moveY = (1 - Math.cos(newAngle * Math.PI / 180)) * sliceHeight;
    angle += fold;
    accZ -= moveZ;
    accY += moveY;
  })
}

const resetAngle = () => {
  angle = -140;
}

function step(timestamp) {
  fold(angle, foldAngle, clampAngle);

  if (angle < stopAngle) {
    window.requestAnimationFrame(step);
  }
  angle += stepAngle;
}

const setupFold = (loadedImage) => {
  height = 330;
  width = loadedImage.width * 330 / loadedImage.height;
  sliceHeight = height / sliceCount;
  current = document.createElement('div');
  current.classList.add('hidden');
  current.classList.add('perspective');
  current.classList.add('collapsed');
  container.appendChild(current);
  sliceImage(loadedImage.src);
};

const removeOld = () => {
  if (container.children.length > 10) {
    container.removeChild(container.children[0]);
  }
};

const startFold = () => {
  setTimeout(() => {
    current.classList.remove('collapsed');
    current.classList.add('expanded');
    setTimeout(() => {
      current.classList.remove('hidden');
      resetAngle();
      window.requestAnimationFrame(step);
    }, 600);
  });
};

const loadAnImage = () => {
  const loadedImage = new Image();
  loadedImage.onload = () => {
    setupFold(loadedImage);
    removeOld()
    startFold();
  };
  loadedImage.src = `https://source.unsplash.com/random?${++count}`;
}

setInterval(loadAnImage, 5000);
loadAnImage();

