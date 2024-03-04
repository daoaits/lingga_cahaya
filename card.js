let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchMoveX = 0;
  prevTouchMoveY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.touchStartX;
      const dirY = e.clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if(e.button === 0) {
        this.touchStartX = e.clientX;
        this.touchStartY = e.clientY;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.prevTouchMoveX = touch.clientX;
      this.prevTouchMoveY = touch.clientY;

      paper.style.zIndex = highestZ;
      highestZ += 1;
    });

    paper.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;
      const touch = e.touches[0];

      this.touchMoveX = touch.clientX;
      this.touchMoveY = touch.clientY;

      this.velX = this.touchMoveX - this.prevTouchMoveX;
      this.velY = this.touchMoveY - this.prevTouchMoveY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      this.prevTouchMoveX = this.touchMoveX;
      this.prevTouchMoveY = this.touchMoveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    paper.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
