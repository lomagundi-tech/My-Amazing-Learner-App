const COLOURS = ['#3D1A5E', '#FF6B6B', '#FFB347', '#4ECDC4', '#6B3FA0', '#A8E6CF', '#FFD93D']

export function launchConfetti() {
  const container = document.createElement('div')
  container.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:9999;overflow:hidden;
  `
  document.body.appendChild(container)

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div')
    const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)]
    const size = Math.random() * 10 + 6
    const left = Math.random() * 100
    const delay = Math.random() * 0.8
    const duration = Math.random() * 1.5 + 1.5
    const rotation = Math.random() * 360

    piece.style.cssText = `
      position:absolute;
      top:-20px;
      left:${left}%;
      width:${size}px;
      height:${size * 0.6}px;
      background:${colour};
      border-radius:2px;
      transform:rotate(${rotation}deg);
      animation:confettiFall ${duration}s ease-in ${delay}s forwards;
      opacity:0.9;
    `
    container.appendChild(piece)
  }

  // Inject keyframes once
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style')
    style.id = 'confetti-style'
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity: 0.9; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }

  setTimeout(() => container.remove(), 3500)
}
