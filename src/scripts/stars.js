/*
  stars.js
  ------------------------
  Responsabilidade:
  - Criar e animar o fundo estrelado do jogo.
  - Controla várias camadas de estrelas com diferentes velocidades e tamanhos.
  - Exporta a função initStars(canvas) que inicializa o efeito de estrelas no canvas passado.
  - Usado tanto no game.html quanto no index.html (para fundo estrelado interativo).
*/
/* stars.js
   Responsabilidade: fundo estrelado animado no canvas
*/
export function initStars(starsCanvas) {
  const starsCtx = starsCanvas.getContext("2d");
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;

  const layers = [
      { count: 80, speed: 0.1, maxR: 1 },
      { count: 50, speed: 0.3, maxR: 1.5 },
      { count: 30, speed: 0.6, maxR: 2 }
  ];

  let stars = [];

  layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
          stars.push({
              x: Math.random() * starsCanvas.width,
              y: Math.random() * starsCanvas.height,
              r: Math.random() * layer.maxR + 0.5,
              alpha: Math.random(),
              flicker: Math.random() * 0.05,
              speed: layer.speed
          });
      }
  });

  function drawStars() {
      starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      stars.forEach(star => {
          const gradient = starsCtx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r);
          gradient.addColorStop(0, `rgba(255,255,255,${star.alpha})`);
          gradient.addColorStop(0.5, `rgba(255,255,255,${star.alpha*0.5})`);
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          starsCtx.fillStyle = gradient;
          starsCtx.beginPath();
          starsCtx.arc(star.x, star.y, star.r, 0, Math.PI*2);
          starsCtx.fill();

          star.alpha += (Math.random() - 0.5) * star.flicker;
          if(star.alpha<0) star.alpha=0;
          if(star.alpha>1) star.alpha=1;
          star.x -= star.speed;
          if(star.x<0) star.x = starsCanvas.width;
      });
      requestAnimationFrame(drawStars);
  }

  drawStars();

  window.addEventListener('resize', () => {
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
  });
}
