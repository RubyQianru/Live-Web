class Bubble {
    constructor(x, y, radius = 20, color) {
        this.radius = radius;
        this.color = color;
        this.x = x;
        this.y = y;

        this.vel = createVector(random(-0.5, 0.5), -0.05 * (50 / this.radius));
    }

    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;

        if (this.x > width - this.radius || this.x < this.radius) {
            this.vel.x *= -1;
        }
        if (this.y > height - this.radius || this.y < this.radius) {
            this.vel.y *= -1;
        }
    }
  
    show() {
        fill(this.color);
        push();
        translate(this.x, this.y);
        circle(0, 0, this.radius * 2); // Use ellipse with diameter
        pop();
    }

    bounce(other) {
        let temp = this.vel;
        this.vel = other.vel;
        other.vel = temp;
    }
  }
  