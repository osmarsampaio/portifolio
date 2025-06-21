// Botão de voltar ao topo
const btnTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  btnTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});
btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mensagem de agradecimento
function showThankYou(event) {
  event.preventDefault();
  const form = event.target;
  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      form.reset();
      document.getElementById('thank-you').style.display = 'block';
    } else {
      alert("Erro ao enviar. Tente novamente mais tarde.");
    }
  });
}

// Partículas e sombra do mouse
const canvas = document.getElementById('particles-bg');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const particleCount = 300;
let mouse = { x: null, y: null, radius: 120 };

function initCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 1 + Math.random() * 2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = 0.5 + Math.random() * 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;

    if (mouse.x !== null && mouse.y !== null) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        let angle = Math.atan2(dy, dx);
        let force = (mouse.radius - dist) / mouse.radius;
        let repulseX = Math.cos(angle) * force * 2;
        let repulseY = Math.sin(angle) * force * 2;

        this.x += repulseX;
        this.y += repulseY;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(11, 61, 46, ${this.opacity})`;
    ctx.shadowColor = 'rgba(11, 61, 46, 0.6)';
    ctx.shadowBlur = 3;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

const cursorShadow = document.getElementById('cursor-shadow');

window.addEventListener('mousemove', e => {
  cursorShadow.style.left = e.clientX + 'px';
  cursorShadow.style.top = e.clientY + 'px';
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('resize', () => {
  initCanvas();
  createParticles();
});

initCanvas();
createParticles();
animateParticles();
