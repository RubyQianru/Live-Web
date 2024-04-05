class Bubble {
    constructor(x, y, color) {
        this.r = 20;
        this.color = color;
        let options = { restitution: 0.8 };
        this.body = Bodies.circle(x, y, this.r, options);
        Body.setVelocity(this.body, Vector.create(-1, 0));
        Body.setAngularVelocity(this.body, 0.1);

    }
  
    show() {
        let pos = this.body.position;
        fill(this.color);
        push();
        translate(pos.x, pos.y);
        circle(0, 0, this.r * 2); // Use ellipse with diameter
        pop();
    }
  }
  