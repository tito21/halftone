
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
let alpha;
let dither_elm;
let num_colors;
let img_loader;

let img_canvas;

function dither() {

  img_canvas.image(img, 0, 0);
  img_canvas.loadPixels();

  let d = img_canvas.pixelDensity();
  let c = num_colors.value();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {

      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          // loop over
          index = 4 * ((y * d + j) * width * d + (x * d + i));
          let r = img_canvas.pixels[index];
          let g = img_canvas.pixels[index+1];
          let b = img_canvas.pixels[index+2];
          // console.log(255/8*Math.round(8*(r / 255)));
          let nr = (255/c)*(Math.round(c*(r / 255)));
          let ng = (255/c)*(Math.round(c*(g / 255)));
          let nb = (255/c)*(Math.round(c*(b / 255)));
          img_canvas.pixels[index] = nr;
          img_canvas.pixels[index+1] = ng;
          img_canvas.pixels[index+2] = nb;
          img_canvas.pixels[index+3] = 255;

          index_right = 4 * ((y * d + j) * width * d + ((x + 1) * d + i));
          img_canvas.pixels[index_right] += (r - nr) * (7/16);
          img_canvas.pixels[index_right+1] += (g - ng) * (7/16);
          img_canvas.pixels[index_right+2] += (b - nb) * (7/16);

          index_left_down = 4 * (((y + 1) * d + j) * width * d + ((x - 1) * d + i));
          img_canvas.pixels[index_left_down] += (r - nr) * (3/16);
          img_canvas.pixels[index_left_down+1] += (g - ng) * (3/16);
          img_canvas.pixels[index_left_down+2] += (b - nb) * (3/16);

          index_down = 4 * (((y + 1) * d + j) * width * d + ((x) * d + i));
          img_canvas.pixels[index_down] += (r - nr) * (5/16);
          img_canvas.pixels[index_down+1] += (g - ng) * (5/16);
          img_canvas.pixels[index_down+2] += (b - nb) * (5/16);

          index_right_down = 4 * (((y + 1) * d + j) * width * d + ((x + 1) * d + i));
          img_canvas.pixels[index_right_down] += (r - nr) * (1/16);
          img_canvas.pixels[index_right_down+1] += (g - ng) * (1/16);
          img_canvas.pixels[index_right_down+2] += (b - nb) * (1/16);

        }
      }
    }
  }
  img_canvas.updatePixels();
}

function build_arrays() {

  img_canvas.width = width;
  img_canvas.height = height;

  halftone_img = new HalftoneImage(width, height,
                                   num_x.value(), num_y.value(),
                                   dots_size.value(),
                                   cyan_angle.value(), magenta_angle.value(), yellow_angle.value(), black_angle.value(),
                                   alpha.value());

  img_canvas.background(255);

  if (dither_elm.checked()) {
    dither();
  }
  else {
    img_canvas.image(img, 0, 0);
  }
  for (let i=0; i <= halftone_img.num_w; i++) {
    for (let j=0; j <= halftone_img.num_h; j++) {
      let c = img_canvas.get(i*width/halftone_img.num_w, j*height/halftone_img.num_h);

      // let c = img_canvas.get(i*(width + width/2)/halftone_img.num_w, j*(height + height/2)/halftone_img.num_h);
      // print(c);
      let K = 1-Math.max(c[0]/255, c[1]/255, c[2]/255);
      halftone_img.black[i*halftone_img.num_w+j] = K;
      halftone_img.cyan[i*halftone_img.num_w+j] = (1 - c[0]/255 - K) / (1 - K) ;
      halftone_img.magenta[i*halftone_img.num_w+j] = (1 - c[1]/255 - K) / (1 - K) ;
      halftone_img.yellow[i*halftone_img.num_w+j] = (1 - c[2]/255 - K) / (1 - K) ;

    }
  }

  draw();

}

function preload() {
  img = loadImage('A-Cat.jpg');
}

function setup() {

  // createCanvas(width, height, SVG);
  createCanvas(width, height);
  img_canvas = createGraphics(width, height);
  angleMode(DEGREES);
  ellipseMode(CENTER);

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
  alpha = select('#alpha');
  alpha.mouseReleased(build_arrays);
  num_colors = select('#num_color');
  num_colors.mouseReleased(build_arrays);
  dither_elm = select('#dither');
  dither_elm.mouseReleased(build_arrays);

  save_botton = select('#save');
  save_botton.mouseClicked(() => save('frame.jpg'));

  img_canvas.canvas.style.display = "block";

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
      img_canvas.background(255);
      img_canvas.resizeCanvas(width, height);
      build_arrays();
    });
  }

  reader.readAsDataURL(file);

}

