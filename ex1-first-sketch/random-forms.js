function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  let palette = generatePalette();
  drawGradientBackground(palette)
  translate(width / 2, height / 2);

  let slices = int(random(6, 16));
  let angle = 360 / slices;

  for (let i = 0; i < slices; i++) {
    push();
    rotate(i * angle);

    drawPattern(palette, angle);

    push();
    scale(1, -1);
    drawPattern(palette, angle);
    pop();

    pop();
  }
  
  drawNoiseDots(palette);
  drawFloatingShapes(palette);
  drawBrokenCircles(palette);
  drawEnergyLines(palette);
}

function drawPattern(palette, angle) {
  let layers = int(random(5, 12));

  for (let i = 0; i < layers; i++) {
    let r = map(i, 0, layers, 20, width / 2);

    let col = random(palette);
    fill(col);
    stroke(col);
    strokeWeight(random(1, 3));

    let choice = int(random(3));

    if (choice === 0) {
      beginShape();
      vertex(0, 0);
      vertex(r, -r * 0.3);
      vertex(r, r * 0.3);
      endShape(CLOSE);

    } else if (choice === 1) {
      noFill();
      arc(0, 0, r * 2, r * 2, -angle/2, angle/2);

    } else {
      line(0, 0, r, 0);
    }
  }
}

function generatePalette() {
  let baseHue = random(360);
  colorMode(HSB);

  let palette = [];

  for (let i = 0; i < 5; i++) {
    let h = (baseHue + random(-40, 40) + 360) % 360;
    let s = random(60, 100);
    let b = random(60, 100);

    palette.push(color(h, s, b));
  }

  colorMode(RGB);
  return palette;
}
function drawNoiseDots(palette) {
  resetMatrix();

  let total = random(50,250);

  for (let i = 0; i < total; i++) {

    let x = random(width);
    let y = random(height);

    let d = dist(x, y, width/2, height/2);

    if (d < 80 && random() < 0.7) continue;

    let base = random(palette);
    let c = getContrastColor(base);

    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = c;

    fill(red(c), green(c), blue(c), random(120, 220));
    noStroke();

    let size;
    if (random() < 0.8) {
      size = random(2, 5);
    } else {
      size = random(6, 12);
    }

    ellipse(x, y, size);
  }

  drawingContext.shadowBlur = 0;
}

function getContrastColor(c) {
  colorMode(HSB);

  let h = (hue(c) + 180) % 360;
  let s = saturation(c);
  let b = brightness(c);

  let newColor = color(h, s, b);

  colorMode(RGB);
  return newColor;
}

function drawBrokenCircles() {
  resetMatrix();
  translate(width/2, height/2);

  stroke(255, 100);
  noFill();

  for (let r = 50; r < 300; r += random(0, 100)) {
    let start = random(360);
    let end = start + random(30, 180);

    arc(0, 0, r, r, start, end);
  }
}

function drawFloatingShapes(palette) {
  resetMatrix();

  for (let i = 0; i < random(0, 20); i++) {
    let x = random(width);
    let y = random(height);

    let sides = int(random(3, 8));
    let size = random(0, 40);

    fill(random(palette));
    noStroke();

    beginShape();
    for (let a = 0; a < 360; a += 360 / sides) {
      let px = x + cos(a) * size;
      let py = y + sin(a) * size;
      vertex(px, py);
    }
    endShape(CLOSE);
  }
}

function drawEnergyLines(palette) {
  resetMatrix();
  translate(width/2, height/2);

  for (let i = 0; i < random(0, 50); i++) {
    let angle = random(360);
    let len = random(50, 300);

    stroke(palette);
    line(0, 0, cos(angle)*len, sin(angle)*len);
  }
}

function drawGradientBackground(palette) {
  resetMatrix();

  let mode = int(random(3)); // 0, 1 ou 2

  let c1 = random(palette);
  let c2 = getContrastColor(c1);

  // às vezes usa cores mais neutras
  if (random() < 0.4) {
    c1 = color(random(20, 60));
    c2 = color(random(0, 40));
  }

  // intensidade do gradiente
  let strength = random(0.2, 1);

  noStroke();

  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);

    if (mode === 0) {
      // gradiente normal
      t = pow(t, strength);

    } else if (mode === 1) {
      // gradiente bem suave (quase sólido)
      t = pow(t, strength * 0.3);

    } else {
      // quase sem gradiente
      t = 0.1;
    }

    let c = lerpColor(c1, c2, t);

    fill(c);
    rect(0, y, width, 1);
  }
}