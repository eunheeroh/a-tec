// ─── Supabase 설정 ───
const SUPABASE_URL = 'https://ktxjnnlmgobqtohiilrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eGpubmxtZ29icXRvaGlpbHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTExNTAsImV4cCI6MjA5Nzc2NzE1MH0.EVovC6l8gqW-ZLqU1kxTZtwulA-a6UcMY__2klGnRIA';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── 탭 전환 ───
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
  });
});

// ─── 비밀번호 보기 토글 ───
document.querySelectorAll('.password-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

function showMessage(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'auth-message ' + type;
}

// ─── 회원가입 ───
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const passwordConfirm = document.getElementById('regPasswordConfirm').value;
  const phone = document.getElementById('regPhone').value.trim();

  if (!name || !email || !password) {
    showMessage('registerMessage', '필수 항목을 모두 입력해주세요.', 'error');
    return;
  }
  if (password.length < 6) {
    showMessage('registerMessage', '비밀번호는 6자 이상이어야 합니다.', 'error');
    return;
  }
  if (password !== passwordConfirm) {
    showMessage('registerMessage', '비밀번호가 일치하지 않습니다.', 'error');
    return;
  }

  const btn = e.target.querySelector('.btn-auth');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: name,
        phone: phone
      }
    }
  });

  if (error) {
    showMessage('registerMessage', error.message, 'error');
  } else {
    showMessage('registerMessage', '회원가입이 완료되었습니다! 이메일 인증 후 로그인해주세요.', 'success');
    e.target.reset();
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-user-plus"></i> 회원가입';
});

// ─── 로그인 ───
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showMessage('loginMessage', '이메일과 비밀번호를 입력해주세요.', 'error');
    return;
  }

  const btn = e.target.querySelector('.btn-auth');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    showMessage('loginMessage', '이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
  } else {
    showMessage('loginMessage', '로그인 성공! 홈으로 이동합니다.', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
});

// ─── Google OAuth 소셜 로그인 ───
async function signInWithGoogle(messageId) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/index.html'
    }
  });

  if (error) {
    showMessage(messageId, 'Google 로그인에 실패했습니다. 다시 시도해주세요.', 'error');
  }
  // 성공 시 Supabase가 Google 인증 페이지로 자동 리다이렉트합니다.
}

document.getElementById('googleLoginBtn').addEventListener('click', () => {
  signInWithGoogle('loginMessage');
});

document.getElementById('googleRegisterBtn').addEventListener('click', () => {
  signInWithGoogle('registerMessage');
});
