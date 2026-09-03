document.addEventListener('DOMContentLoaded', () => {
  initInteractiveMagicButton();
  initSmoothScroll();
  initUsersTable();
  initPostsLab();
  initMLPredictionLab();
  runLab1PromiseBasics();
});

function initInteractiveMagicButton() {
  const myBtn = document.getElementById('myBtn');
  const messageElement = document.getElementById('message');

  if (!myBtn || !messageElement) return;

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

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

async function initUsersTable() {
  const tableBody = document.getElementById('userTableBody');
  if (!tableBody) return;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    console.log("Fetch users (Table):", users);

    tableBody.innerHTML = users.map(user => `
      <tr>
        <td><strong>#${user.id}</strong></td>
        <td>${user.name}</td>
        <td><code>${user.username}</code></td>
        <td><a href="mailto:${user.email}">${user.email}</a></td>
        <td>${user.address.suite}, ${user.address.street}, ${user.address.city}</td>
        <td>${user.company.name}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Lỗi khi tải bảng users:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #dc2626;">
          Không thể tải dữ liệu: ${error.message}
        </td>
      </tr>
    `;
  }
}

function initPostsLab() {
  const btnLoadPosts = document.getElementById('btnLoadPosts');
  const postsContainer = document.getElementById('postsContainer');
  const postStatus = document.getElementById('postStatus');

  if (!btnLoadPosts || !postsContainer || !postStatus) return;

  btnLoadPosts.addEventListener('click', async () => {
    postStatus.textContent = 'Đang kéo dữ liệu bài viết từ API...';
    postStatus.style.color = '#6b7280';
    postsContainer.innerHTML = '';
    btnLoadPosts.disabled = true;

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=9');
      if (!response.ok) {
        throw new Error(`HTTP error! Mã lỗi: ${response.status}`);
      }

      const posts = await response.json();
      console.log('Lab 2 Posts:', posts);

      postsContainer.innerHTML = posts.map(post => `
        <article class="post-card">
          <span class="post-id">Post #${post.id}</span>
          <h3 class="post-title">${post.title}</h3>
          <p class="post-body">${post.body}</p>
        </article>
      `).join('');

      postStatus.textContent = `Đã tải thành công ${posts.length} bài viết qua DOM.`;
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
      postStatus.textContent = `Lỗi: ${error.message}`;
      postStatus.style.color = '#dc2626';
    } finally {
      btnLoadPosts.disabled = false;
    }
  });
}

function mockMLPredictAPI(candidateData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseSalary = candidateData.role === 'fullstack' ? 1200 : 900;
      const estimatedSalary = baseSalary + (candidateData.experience * 350);
      const matchScore = Math.min(98, 65 + candidateData.experience * 6);

      resolve({
        status: "success",
        model_version: "v2.1-random-forest",
        candidate: candidateData.fullname,
        prediction: {
          salary_estimate_usd: estimatedSalary,
          match_rate: `${matchScore}%`,
          recommendation: candidateData.experience >= 2 ? "Senior Candidate" : "Junior Candidate"
        }
      });
    }, 1200);
  });
}

function initMLPredictionLab() {
  const predictForm = document.querySelector('.entry-form');
  const resultContainer = document.getElementById('predictionResult');

  if (!predictForm || !resultContainer) return;

  predictForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      fullname: document.getElementById('fullname').value,
      experience: Number(document.getElementById('experience').value),
      role: document.getElementById('role').value,
      work_type: document.querySelector('input[name="work_type"]:checked')?.value || 'fulltime'
    };

    resultContainer.style.display = 'block';
    resultContainer.className = 'ml-result-box loading';
    resultContainer.innerHTML = `🤖 Đang gửi dữ liệu đến mô hình ML để phân tích...`;

    const submitBtn = predictForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const output = await mockMLPredictAPI(formData);
      console.log("Lab 3 ML Output:", output);

      resultContainer.className = 'ml-result-box';
      resultContainer.innerHTML = `
        <h3>🎯 Kết Quả Phân Tích Mô Hình ML</h3>
        <p>Ứng viên: <strong>${output.candidate}</strong> | Vị trí: <strong>${formData.role}</strong></p>
        <div class="ml-metrics">
          <div class="ml-metric-item">
            💵 Mức lương dự đoán: <strong>$${output.prediction.salary_estimate_usd} / tháng</strong>
          </div>
          <div class="ml-metric-item">
            📊 Độ phù hợp: <strong>${output.prediction.match_rate}</strong>
          </div>
          <div class="ml-metric-item">
            🏷️ Xếp hạng: <strong>${output.prediction.recommendation}</strong>
          </div>
        </div>
      `;
    } catch (err) {
      resultContainer.className = 'ml-result-box';
      resultContainer.style.borderColor = '#fca5a5';
      resultContainer.style.background = '#fef2f2';
      resultContainer.innerHTML = `❌ Phân tích thất bại: ${err.message}`;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function fakeNetworkRequest(data, delayTime = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data) {
        resolve(`[Thành công] Đã nhận: ${data}`);
      } else {
        reject(new Error("[Thất bại] Không có dữ liệu"));
      }
    }, delayTime);
  });
}

function runLab1PromiseBasics() {
  fakeNetworkRequest("Dữ liệu Lab 1 (dùng .then)", 1500)
    .then(result => console.log("Lab 1 (.then):", result))
    .catch(err => console.error("Lab 1 (.catch):", err.message));

  (async () => {
    try {
      const result = await fakeNetworkRequest("Dữ liệu Lab 1 (dùng async/await)", 2500);
      console.log("Lab 1 (async/await):", result);
    } catch (err) {
      console.error("Lab 1 (async error):", err.message);
    }
  })();
}