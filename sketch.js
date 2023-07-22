
let width = 1280;
let height = 857;

let halftone_img;
let img;
let num_x;
let num_y;
let dots_size;
let save_botton;
let cyan_angle;
let magenta_angle;
let yellow_angle;
let black_angle;
let img_loader;

let img_canvas;

function build_arrays() {

  halftone_img = new HalftoneImage(width, height,
                                   num_x.value(), num_y.value(),
                                   dots_size.value(),
                                   cyan_angle.value(), magenta_angle.value(), yellow_angle.value(), black_angle.value());
  // img.loadPixels();

  // Black
  img_canvas.push();
  img_canvas.translate(width/2, height/2);
  img_canvas.rotate(-halftone_img.black_angle);
  img_canvas.translate(-width/2, -height/2);
  img_canvas.image(img, 0, 0);
  for (let i=0; i <= halftone_img.num_w; i++) {
    for (let j=0; j <= halftone_img.num_h; j++) {
      let c = img_canvas.get(i*width/halftone_img.num_w, j*height/halftone_img.num_h);
      // print(c);
      let K = 1-Math.max(c[0]/255, c[1]/255, c[2]/255)
      halftone_img.black[i*halftone_img.num_w+j] = K;
    }
  }
  img_canvas.pop();

  // Cyan
  img_canvas.push();
  img_canvas.translate(width/2, height/2);
  img_canvas.rotate(-halftone_img.cyan_angle);
  img_canvas.translate(-width/2, -height/2);
  img_canvas.image(img, 0, 0);
  for (let i=0; i <= halftone_img.num_w; i++) {
    for (let j=0; j <= halftone_img.num_h; j++) {
      let c = img_canvas.get(i*width/halftone_img.num_w, j*height/halftone_img.num_h);
      // print(c);
      let K = 1-Math.max(c[0]/255, c[1]/255, c[2]/255)
      halftone_img.cyan[i*halftone_img.num_w+j] = (1 - c[0]/255 - K) / (1 - K) ;
    }
  }
  img_canvas.pop();

  // Magenta
  img_canvas.push();
  img_canvas.translate(width/2, height/2);
  img_canvas.rotate(-halftone_img.magenta_angle);
  img_canvas.translate(-width/2, -height/2);
  img_canvas.image(img, 0, 0);
  for (let i=0; i <= halftone_img.num_w; i++) {
    for (let j=0; j <= halftone_img.num_h; j++) {
      let c = img_canvas.get(i*width/halftone_img.num_w, j*height/halftone_img.num_h);
      // print(c);
      let K = 1-Math.max(c[0]/255, c[1]/255, c[2]/255)
      halftone_img.magenta[i*halftone_img.num_w+j] = (1 - c[1]/255 - K) / (1 - K) ;
    }
  }
  img_canvas.pop();

  // Yellow
  img_canvas.push();
  img_canvas.translate(width/2, height/2);
  img_canvas.rotate(-halftone_img.yellow_angle);
  img_canvas.translate(-width/2, -height/2);
  img_canvas.image(img, 0, 0);
  for (let i=0; i <= halftone_img.num_w; i++) {
    for (let j=0; j <= halftone_img.num_h; j++) {
      let c = img_canvas.get(i*width/halftone_img.num_w, j*height/halftone_img.num_h);
      // print(c);
      let K = 1-Math.max(c[0]/255, c[1]/255, c[2]/255)
      halftone_img.yellow[i*halftone_img.num_w+j] = (1 - c[2]/255 - K) / (1 - K) ;
    }
  }
  img_canvas.pop();


  draw();

}

function preload() {
  img = loadImage('A-Cat.jpg');
}

function setup() {

  // createCanvas(width, height, SVG);
  createCanvas(width, height);
  img_canvas = createGraphics(width, height);

  num_x = select('#num_x');
  num_x.mouseReleased(build_arrays);
  num_y = select('#num_y');
  num_y.mouseReleased(build_arrays);
  dots_size = select('#size');
  dots_size.mouseReleased(build_arrays);
  cyan_angle = select('#cyan_angle');
  cyan_angle.mouseReleased(build_arrays);
  magenta_angle = select('#magenta_angle');
  magenta_angle.mouseReleased(build_arrays);
  yellow_angle = select('#yellow_angle');
  yellow_angle.mouseReleased(build_arrays);
  black_angle = select('#black_angle');
  black_angle.mouseReleased(build_arrays);

  save_botton = select('#save');
  save_botton.mouseClicked(() => save('frame.jpg'));


  build_arrays();

  noLoop();

}

function draw() {

  // background(255);

  // blendMode(ADD);

  background(255);
  // image(img, 0, 0);

  halftone_img.render();
}

function load_new_img(event) {
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.onload = () => {
    // console.log(reader.result);
    loadImage(reader.result, (img_local) => {
      img = img_local;
      console.log("loaded");
      width = img.width;
      height = img.height;
      resizeCanvas(width, height);
      setup();
    });
  }

  reader.readAsDataURL(file);

}

