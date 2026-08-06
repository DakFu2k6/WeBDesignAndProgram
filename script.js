const button = document.getElementById('myBtn');
const message = document.getElementById('message');

button.addEventListener('click', () => {
  
  message.textContent = '🎉 Bạn vừa bấm nút thành công! JavaScript đã hoạt động mượt mà.';
  
  button.style.backgroundColor = '#2e7d32';
  button.textContent = 'Đã bấm!';
});