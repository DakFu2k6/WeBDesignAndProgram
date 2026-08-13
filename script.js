document.addEventListener('DOMContentLoaded', () => {
  const myBtn = document.getElementById('myBtn');
  const messageElement = document.getElementById('message');
  if (myBtn && messageElement) {
    let clickCount = 0;
    const messages = [
      "🎉 Bạn đã kích hoạt phép thuật thành công!",
      "🚀 Tiếp tục khám phá các kỹ năng ở trên nhé!",
      "💡 HTML5 + CSS3 + JS = Sự kết hợp hoàn hảo!",
      "⭐ Bạn là một lập trình viên tuyệt vời!"
    ];
    myBtn.addEventListener('click', () => {
      clickCount++;
      const currentMessage = messages[(clickCount - 1) % messages.length];
      messageElement.textContent = `${currentMessage} (Đã bấm ${clickCount} lần)`;
      messageElement.style.color = '#059669';
      messageElement.style.fontWeight = '600';
      myBtn.textContent = 'Bấm tiếp đi! ✨';
    });
  }
  const navLinks = document.querySelectorAll('.site-nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

});