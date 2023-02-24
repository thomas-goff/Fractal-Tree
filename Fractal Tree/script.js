const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const branchColor = "#FFA500";
const leafColor = "green";
const startAngle = -90;
const endAngle = -90.1;
const maxLength = 100;
const maxBranches = 500;

class Branch {
  constructor(startX, startY, angle, width, maxLength, parentEndX, parentEndY) {
    this.startX = startX;
    this.startY = startY;
    this.angle = angle;
    this.width = width;
    this.maxLength = maxLength;
    this.length = Math.random() * (maxLength - 0.5) + 0.5;
    this.parentEndX = parentEndX;
    this.parentEndY = parentEndY;
  }

  draw() {
    const endX =
      this.startX + this.length * Math.cos((this.angle * Math.PI) / 180);
    const endY =
      this.startY + this.length * Math.sin((this.angle * Math.PI) / 180);

    ctx.beginPath();
    ctx.moveTo(this.parentEndX, this.parentEndY);
    ctx.lineTo(this.startX, this.startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = this.width;
    ctx.strokeStyle = branchColor;
    ctx.stroke();

    const leafLength = 5;
    if (this.length < this.maxLength) {
      ctx.beginPath();
      ctx.arc(endX, endY, leafLength, 0, 2 * Math.PI);
      ctx.fillStyle = leafColor;
      ctx.fill();
      ctx.stroke();
    }

    if (this.length > this.maxLength * 0.3) {
      const leftBranch = new Branch(
        endX,
        endY,
        this.angle - 20,
        this.width * 0.7,
        this.maxLength,
        endX,
        endY
      );

      const rightBranch = new Branch(
        endX,
        endY,
        this.angle + 20,
        this.width * 0.7,
        this.maxLength,
        endX,
        endY
      );

      return [leftBranch, rightBranch];
    } else {
      return [];
    }
  }
}

function animate() {
  let startBranch = new Branch(
    canvas.width / 2,
    canvas.height - 20,
    startAngle,
    10,
    100
  );

  let branches = [startBranch];

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    let newBranches = [];
    let numBranches = 0; // Initialize counter variable

    for (let i = 0; i < branches.length; i++) {
      let branch = branches[i];
      let result = branch.draw();
      result.forEach((b) => newBranches.push(b));
      branches[i] = branch;

      // Increment counter variable
      numBranches++;

      // Check if the counter has reached the limit
      if (numBranches >= maxBranches) {
        break;
      }
    }
    branches = branches.concat(newBranches);

    if (branches.length > 0 && numBranches < maxBranches) {
      requestAnimationFrame(drawFrame);
    }
  }

  requestAnimationFrame(drawFrame);
}

animate();
