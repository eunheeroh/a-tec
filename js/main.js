/* ════════════════════════════════════════════════
   A-Tec 연구소 | Main JavaScript
   AI로 가르치고, 디지털로 출판하다.
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── LOADER ───
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });

  // Fallback: hide loader after 3 seconds
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 3000);

  // ─── NAVBAR SCROLL ───
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);
    
    // Back to top button
    backToTop.classList.toggle('visible', scrollY > 400);
    
    // Active nav link
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ─── ACTIVE NAV LINK ───
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        
        // Close mobile menu
        const navLinksEl = document.getElementById('navLinks');
        const mobileToggle = document.getElementById('mobileToggle');
        navLinksEl.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  });

  // ─── BACK TO TOP ───
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── MOBILE MENU ───
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksEl = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinksEl.classList.toggle('active');
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      mobileToggle.classList.remove('active');
      navLinksEl.classList.remove('active');
    }
  });

  // ─── SCROLL REVEAL ───
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation based on data-delay or index
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ─── COUNTER ANIMATION ───
  const counterElements = document.querySelectorAll('.about-stat-num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
      current += step;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ─── TYPING EFFECT ───
  const typingText = document.getElementById('typingText');
  const isEnglish = document.documentElement.lang === 'en';
  const phrases = isEnglish
    ? ['Publish Digitally.', 'Create Content.', 'Innovate Education.']
    : ['디지털로 출판하다.', '콘텐츠로 혁신하다.', '세상을 연결하다.'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Add cursor element
    if (!typingText.querySelector('.typing-cursor')) {
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      typingText.appendChild(cursor);
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 300; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Start typing after a delay
  setTimeout(typeEffect, 1500);

  // ─── HERO PARTICLES ───
  const canvas = document.getElementById('heroParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.opacityDir = Math.random() > 0.5 ? 0.003 : -0.003;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.opacityDir;
        
        if (this.opacity <= 0.1 || this.opacity >= 0.6) {
          this.opacityDir *= -1;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(11, 61, 145, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.min(60, Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(11, 61, 145, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause animation when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) animate();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    });

    heroObserver.observe(document.querySelector('.hero'));
  }

  // ─── CONTACT FORM (Formspree) ───
  const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

  const submitBtn = document.getElementById('submitBtn');
  const formResult = document.getElementById('formResult');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !subject) {
        showFormResult('이름, 이메일, 문의 제목은 필수 입력 항목입니다.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormResult('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';

      try {
        const response = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: subject,
            message: message
          })
        });

        if (response.ok) {
          showFormResult('문의가 성공적으로 전송되었습니다. 감사합니다!', 'success');
          document.getElementById('contactName').value = '';
          document.getElementById('contactEmail').value = '';
          document.getElementById('contactSubject').value = '';
          document.getElementById('contactMessage').value = '';
        } else {
          showFormResult('전송에 실패했습니다. 다시 시도해주세요.', 'error');
        }
      } catch (err) {
        console.error('Formspree Error:', err);
        showFormResult('전송에 실패했습니다. 다시 시도해주세요.', 'error');
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 문의 보내기';
    });
  }

  function showFormResult(msg, type) {
    formResult.textContent = msg;
    formResult.className = `form-result ${type}`;
    formResult.style.display = 'block';
    
    setTimeout(() => {
      formResult.style.display = 'none';
    }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ─── SERVICE CARD TILT EFFECT ───
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── CHATBOT ───
  const chatbotFab = document.getElementById('chatbotFab');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotNavBtn = document.getElementById('chatbotNavBtn');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotMessages = document.getElementById('chatbotMessages');

  const botResponses = [
    {
      keywords: ['ai 교육', 'ai교육', '교육 프로그램', '강좌', '수업', '커리큘럼', '학습'],
      reply: 'AI 교육 프로그램은 초보자부터 전문가까지 수준별로 운영됩니다.\n• ChatGPT 활용법\n• 프롬프트 엔지니어링\n• AI 콘텐츠 제작\n\n자세한 일정은 문의하기를 이용해 주세요. 😊'
    },
    {
      keywords: ['디지털 출판', '전자책', 'epub', '출판', '교재', 'e-publishing'],
      reply: '디지털 출판 솔루션을 통해 전자책, 인터랙티브 교재, 멀티미디어 콘텐츠를 제작·유통해 드립니다.\n\n출판 자동화 도구와 함께 워크플로우를 혁신해 드릴게요! 📚'
    },
    {
      keywords: ['컨설팅', '상담', '교육 체계', '기업', '기관'],
      reply: '기관·기업 대상 AI 교육 컨설팅 서비스를 제공합니다.\n• AI 활용 교육 체계 수립\n• 맞춤형 커리큘럼 설계\n• 강사 양성 프로그램\n\n구체적인 내용은 문의하기 섹션을 이용해 주세요!'
    },
    {
      keywords: ['연락처', '전화', '이메일', '연락', '주소', '위치', '어디'],
      reply: '에이텍 연구소 연락처 안내드립니다.\n📍 서울특별시 양천구\n📧 info@a-tec.co.kr\n🌐 a-tec.netlify.app\n\n빠른 문의는 하단 문의하기 섹션을 이용해 주세요!'
    },
    {
      keywords: ['가격', '비용', '견적', '요금', '얼마'],
      reply: '가격 및 견적은 교육 규모와 내용에 따라 다르게 책정됩니다.\n\n하단 문의하기 섹션에서 요청 내용을 남겨주시면 빠르게 안내해 드리겠습니다! 💬'
    },
    {
      keywords: ['안녕', '반갑', '처음', '시작'],
      reply: '안녕하세요! 에이텍 연구소에 오신 것을 환영합니다. 🎉\nAI 교육, 디지털 출판, 컨설팅에 대해 무엇이든 물어보세요!'
    }
  ];

  function openChatbot() {
    chatbotPanel.classList.add('open');
    chatbotPanel.setAttribute('aria-hidden', 'false');
    chatbotFab.classList.add('open');
    chatbotInput.focus();
  }

  function closeChatbot() {
    chatbotPanel.classList.remove('open');
    chatbotPanel.setAttribute('aria-hidden', 'true');
    chatbotFab.classList.remove('open');
  }

  chatbotFab.addEventListener('click', () => {
    chatbotPanel.classList.contains('open') ? closeChatbot() : openChatbot();
  });

  chatbotClose.addEventListener('click', closeChatbot);
  if (chatbotNavBtn) chatbotNavBtn.addEventListener('click', (e) => { e.preventDefault(); openChatbot(); });

  // Quick buttons
  chatbotMessages.querySelectorAll('.chatbot-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      sendUserMessage(btn.textContent);
    });
  });

  function getCurrentTime() {
    return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chatbot-msg ${type}`;
    msg.innerHTML = `
      <div class="chatbot-msg-bubble">${text.replace(/\n/g, '<br>')}</div>
      <div class="chatbot-msg-time">${getCurrentTime()}</div>
    `;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chatbot-msg bot';
    typing.id = 'chatbotTyping';
    typing.innerHTML = `<div class="chatbot-typing"><span></span><span></span><span></span></div>`;
    chatbotMessages.appendChild(typing);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('chatbotTyping');
    if (t) t.remove();
  }

  function getBotReply(text) {
    const lower = text.toLowerCase();
    for (const item of botResponses) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return item.reply;
      }
    }
    return '문의해 주셔서 감사합니다! 담당자가 확인 후 연락드리겠습니다.\n\n더 빠른 응답을 원하신다면 📧 info@a-tec.co.kr로 이메일을 보내주세요.';
  }

  function sendUserMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    appendMessage(trimmed, 'user');
    chatbotInput.value = '';
    showTyping();
    setTimeout(() => {
      removeTyping();
      appendMessage(getBotReply(trimmed), 'bot');
    }, 900);
  }

  chatbotSend.addEventListener('click', () => sendUserMessage(chatbotInput.value));
  chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendUserMessage(chatbotInput.value);
  });

  // ─── BRAND CARD HOVER GLOW ───
  const brandCards = document.querySelectorAll('.brand-card');
  brandCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(11, 61, 145, 0.04), var(--bg-card))`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

});
