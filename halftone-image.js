
class HalftoneImage {
    constructor(width, height, num_w, num_h, dots_scale, ca=105, ma=75, ya=90, ba=15, alpha) {
        this.width = width;
        this.height = height;
        this.num_w = num_w;
        this.num_h = num_h;
        this.dots_scale = dots_scale;
        this.alpha = alpha;

        this.cyan = Array(num_w*num_h);
        this.cyan_angle = ca;

        this.magenta = Array(num_w*num_h);
        this.magenta_angle = ma;

        this.yellow = Array(num_w*num_h);
        this.yellow_angle = ya;

        this.black = Array(num_w*num_h);
        this.black_angle = ba;

    }

    _render(color, arr, angle) {
        push();
        fill(color);
        noStroke();
        // translate(angle, angle);
        // translate(width/2, height/2);
        // rotate(angle);
        // translate(-width/2, -height/2);
        for (let i=0; i <= this.num_w; i++) {
            for (let j=0; j <= this.num_h; j++) {
                let dot_size = arr[i*this.num_w+j];
                let dx = this.dots_scale*cos(angle);
                let dy = this.dots_scale*sin(angle);
                ellipse(i*this.width/this.num_w + dx, j*this.height/this.num_h + dy, this.dots_scale*dot_size, this.dots_scale*dot_size);
            }
        }
        pop();
    }

    render() {
        this._render(color(0, 255, 255, this.alpha), this.cyan, this.cyan_angle);
        this._render(color(255, 0, 255, this.alpha), this.magenta, this.magenta_angle);
        this._render(color(255, 255, 0, this.alpha), this.yellow, this.yellow_angle);
        this._render(color(0, 0, 0, this.alpha), this.black, this.black_angle);
    }

}