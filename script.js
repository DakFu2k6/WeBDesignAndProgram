// Lấy các phần tử từ HTML thông qua ID
const button = document.getElementById('myBtn');
const message = document.getElementById('message');

// Lắng nghe sự kiện "click" trên nút bấm
button.addEventListener('click', () => {
  // Thay đổi nội dung văn bản khi bấm nút
  message.textContent = '🎉 Bạn vừa bấm nút thành công! JavaScript đã hoạt động mượt mà.';
  
  // Bạn cũng có thể dùng JS để đổi style CSS trực tiếp:
  button.style.backgroundColor = '#2e7d32';
  button.textContent = 'Đã bấm!';
});