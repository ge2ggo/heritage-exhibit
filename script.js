'use strict';

(() => {
  const museumSource = 'https://iksan.museum.go.kr/kor/html/sub02/0201.html?d_mng_no=144&mng_no=215&mode=V';
  const researchSource = 'https://www.nrich.go.kr/kor/page.do?menuIdx=340';
  // Progressive enhancement: without JavaScript every story remains readable.
  const stories = [...document.querySelectorAll('.chapter')];
  function openStory(id) {
    const section = stories.find(item => item.id === id);
    if (!section) return;
    section.querySelector('.chapter-layout').hidden = false;
    section.querySelector('.story-toggle')?.setAttribute('aria-expanded', 'true');
  }
  stories.forEach((section, index) => {
    const heading = section.querySelector('.section-heading');
    const layout = section.querySelector('.chapter-layout');
    const title = section.querySelector('h2').textContent.replace(/\.$/, '');
    layout.id = `story-panel-${index + 1}`;
    const toggle = document.createElement('button');
    toggle.className = 'story-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', layout.id);
    toggle.setAttribute('aria-expanded', String(index === 0));
    const number = document.createElement('span');
    number.className = 'story-toggle-number';
    number.textContent = `0${index + 1}.`;
    const text = document.createElement('span');
    text.textContent = title;
    const mark = document.createElement('span');
    mark.className = 'story-toggle-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '↗';
    toggle.append(number, text, mark);
    heading.replaceChildren(toggle);
    layout.hidden = index !== 0;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      layout.hidden = expanded;
    });
  });
  document.querySelectorAll('a[href^="#chapter-"]').forEach(link => {
    link.addEventListener('click', () => openStory(link.hash.slice(1)));
  });
  window.addEventListener('hashchange', () => openStory(location.hash.slice(1)));
  openStory(location.hash.slice(1));
  const commonsBase = 'https://commons.wikimedia.org/wiki/File:';
  const art = {
    pagoda: {
      src: './assets/pagoda.jpg', title: '미륵사지 석탑',
      alt: '2019년 미륵사지 석탑 남동측면. 여러 층의 지붕돌과 돌기둥이 이어진 모습.',
      description: '수리 후 석탑의 모습입니다. 멀리서 탑 전체를 본 뒤, 서로 다른 돌이 만나 있는 곳으로 눈을 옮겨보세요. 이 탑을 통해 우리는 남기는 마음, 만드는 손길, 이어가는 행동을 따라갑니다.',
      question: '지금의 당신에게는 작게 느껴지는 일이 있나요?',
      credit: '사진 문화재청 · 공공누리 제1유형 · 원본 비율 유지',
      source: commonsBase + '익산_미륵사지_석탑(2019년)_남동측면.jpg'
    },
    inscription: {
      src: './assets/inscription.jpg', title: '금제사리봉영기',
      alt: '금제사리봉영기 앞면. 금판에 글자가 줄지어 새겨져 있다.',
      description: '639년 사리를 모신 일과 백제 왕후의 발원이 기록된 금판입니다. 금판의 글은 사리를 봉안한 경위와 왕실의 안녕을 바라는 뜻을 전합니다. 기록의 의미는 당시의 불교 신앙 안에서 살펴봅니다.',
      question: '나는 어떤 마음이 오래 남기를 바라나요?',
      credit: '국립익산박물관 · 공공누리 제1유형 · 원본 비율 유지', source: museumSource
    },
    detail: {
      src: './assets/stone-detail.jpg', title: '석탑 1층 십자통로 내부',
      alt: '미륵사지 석탑 1층 내부의 십자형 통로와 돌기둥, 위를 받치는 부재.',
      description: '석탑 내부에는 십자형 공간과 중심 기둥이 있습니다. 기둥과 위를 받치는 돌의 관계를 살펴보세요. 석탑의 여러 부분에는 목조건축의 형식이 반영되어 있습니다. 사진 속 돌을 통해 개별 부재가 전체를 이루는 모습을 관찰합니다.',
      question: '오늘 내가 들인 마음을 작다고만 생각하고 있지는 않나요?',
      credit: '사진 문화재청 · 공공누리 제1유형 · 원본 비율 유지',
      source: commonsBase + '익산_미륵사지_석탑_1층_십자통로_내부.jpg'
    },
    before: {
      src: './assets/pagoda-before.jpg', title: '해체 수리 전 미륵사지 석탑',
      alt: '2000년 미륵사지 석탑 남동측면. 해체 수리 전 상태를 보여주는 기록 사진.',
      description: '2000년의 기록 사진입니다. 이후 2001년부터 해체조사와 보수정비가 진행되었고, 2017년 6층까지 조립을 마쳤습니다. 부재를 조사하고 기록하며 원래 돌을 최대한 다시 사용하는 것이 중요한 기준이었습니다. 이 사진은 수리 작업 중의 장면이 아닙니다.',
      question: '내가 이어받은 마음 중 곁에 두고 싶은 것은 무엇인가요?',
      credit: '사진 문화재청 · 공공누리 제1유형 · 원본 비율 유지',
      source: commonsBase + '익산_미륵사지_석탑(2000년)_남동측면.jpg'
    }
  };

  const dialog = document.querySelector('#art-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const dialogFallback = document.querySelector('#dialog-fallback');
  let opener = null;
  let savedScroll = 0;

  // A failed photo is never replaced with another work. Its caption stays visible.
  document.querySelectorAll('.tile-image img').forEach(image => {
    const updateTile = () => {
      const ready = image.complete && image.naturalWidth > 0;
      image.hidden = !ready;
      let fallback = image.parentElement.querySelector('.tile-fallback');
      if (!ready && !fallback) {
        fallback = document.createElement('p');
        fallback.className = 'tile-fallback';
        fallback.textContent = '자료 이미지 준비 중';
        image.parentElement.append(fallback);
      }
      if (fallback) fallback.hidden = ready;
    };
    image.addEventListener('load', updateTile);
    image.addEventListener('error', updateTile);
    if (image.complete) updateTile();
  });
  document.querySelectorAll('.artwork').forEach(figure => {
    const image = figure.querySelector('img');
    const button = figure.querySelector('[data-open]');
    const fallback = figure.querySelector('.image-fallback');
    const updateAvailability = () => {
      const ready = image.complete && image.naturalWidth > 0;
      image.hidden = !ready;
      fallback.hidden = ready;
      button.disabled = !ready;
      button.title = ready ? '사진, 해설과 질문을 크게 봅니다.' : '자료 이미지가 준비되지 않았습니다.';
    };
    image.addEventListener('load', updateAvailability);
    image.addEventListener('error', updateAvailability);
    if (image.complete) updateAvailability();
  });

  dialogImage.addEventListener('load', () => {
    dialogImage.hidden = false;
    dialogFallback.hidden = true;
  });
  dialogImage.addEventListener('error', () => {
    dialogImage.hidden = true;
    dialogFallback.hidden = false;
  });

  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => {
      const item = art[button.dataset.open];
      if (!item || button.disabled) return;
      opener = button;
      savedScroll = window.scrollY;
      dialogImage.hidden = false;
      dialogFallback.hidden = true;
      dialogImage.alt = item.alt;
      dialogImage.src = item.src;
      document.querySelector('#dialog-title').textContent = item.title;
      document.querySelector('#dialog-description').textContent = item.description;
      document.querySelector('#dialog-question').textContent = item.question;
      document.querySelector('#dialog-credit').textContent = item.credit;
      document.querySelector('#dialog-source').href = item.source;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('modal-open');
      document.querySelector('#close-dialog').focus({ preventScroll: true });
    });
  });
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  const navLinks = [...document.querySelectorAll('.chapter-nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('.chapter, .personal').forEach(section => observer.observe(section));
  }

  const form = document.querySelector('#mind-form');
  const message = document.querySelector('#message');
  const counter = document.querySelector('#char-count');
  const card = document.querySelector('#mind-card');
  const cardMessage = document.querySelector('#card-message');
  const cardRecipient = document.querySelector('#card-recipient');
  const downloadButton = document.querySelector('#download-card');
  const removeButton = document.querySelector('#remove-stone');
  const placeButton = document.querySelector('#place-stone');
  const status = document.querySelector('#card-status');
  let placed = null;

  message.addEventListener('input', () => {
    // maxlength and counter intentionally use the same UTF-16 length convention.
    if (message.value.length > 60) message.value = message.value.slice(0, 60);
    counter.textContent = `${message.value.length} / 60`;
    if (placed) status.textContent = '수정한 문장은 ‘마음 다시 놓기’를 누르면 카드에 반영됩니다.';
  });
  form.addEventListener('change', () => {
    if (placed) status.textContent = '바꾼 대상은 ‘마음 다시 놓기’를 누르면 카드에 반영됩니다.';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    placed = { recipient: new FormData(form).get('recipient'), message: message.value.trim() };
    cardRecipient.textContent = placed.recipient;
    cardMessage.textContent = placed.message || '말없이 놓아둔 마음';
    card.classList.remove('is-placed');
    void card.offsetWidth;
    card.classList.add('is-placed');
    downloadButton.disabled = false;
    removeButton.disabled = false;
    placeButton.firstChild.textContent = '마음 다시 놓기 ';
    status.textContent = '당신의 마음을 놓았습니다. 원하면 카드로 가져가세요.';
  });
  removeButton.addEventListener('click', () => {
    placed = null;
    card.classList.remove('is-placed');
    cardRecipient.textContent = '당신의 마음이 머물 자리';
    cardMessage.textContent = '잠시, 이곳에 머물러도 좋습니다.';
    downloadButton.disabled = true;
    removeButton.disabled = true;
    form.reset();
    counter.textContent = '0 / 60';
    placeButton.firstChild.textContent = '마음 놓기 ';
    status.textContent = '돌을 거두었습니다. 다시 놓아도, 빈자리로 두어도 괜찮아요.';
    message.focus({ preventScroll: true });
  });

  function wrapText(ctx, value, width) {
    const result = [];
    for (const paragraph of value.split('\n')) {
      let line = '';
      for (const character of Array.from(paragraph)) {
        if (line && ctx.measureText(line + character).width > width) {
          result.push(line); line = character;
        } else line += character;
      }
      result.push(line);
    }
    return result;
  }

  downloadButton.addEventListener('click', async () => {
    if (!placed || downloadButton.disabled) return;
    const snapshot = { ...placed };
    downloadButton.disabled = true;
    status.textContent = '카드를 준비하고 있습니다.';
    try {
      await document.fonts.ready;
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.font = '500 42px "SUIT", "Malgun Gothic", sans-serif';
      const lines = wrapText(ctx, snapshot.message || '말없이 놓아둔 마음', 920);
      canvas.height = Math.max(1450, 1080 + lines.length * 76);
      const h = canvas.height;
      ctx.fillStyle = '#eeeddf'; ctx.fillRect(0, 0, 1200, h);
      ctx.strokeStyle = '#b8bfa6'; ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, 1104, h - 96);
      ctx.beginPath(); ctx.moveTo(110, 190); ctx.lineTo(1090, 190); ctx.stroke();
      ctx.textAlign = 'left'; ctx.fillStyle = '#30342d';
      ctx.font = '700 34px "SUIT", "Malgun Gothic", sans-serif'; ctx.fillText('누군가의 다음', 110, 143);
      ctx.fillStyle = '#725a49'; ctx.textAlign = 'right'; ctx.fillText('·', 1090, 143);
      ctx.textAlign = 'center'; ctx.fillStyle = '#686b5f';
      ctx.font = '26px "SUIT", "Malgun Gothic", sans-serif'; ctx.fillText(snapshot.recipient, 600, 330);
      const halo = ctx.createRadialGradient(600, 600, 10, 600, 600, 270);
      halo.addColorStop(0, '#e4dfc9'); halo.addColorStop(1, '#eeeddf');
      ctx.fillStyle = halo; ctx.fillRect(300, 350, 600, 500);
      const stone = new Image();
      stone.src = './assets/stone.svg';
      await stone.decode();
      ctx.save(); ctx.fillStyle = '#c5c7b9'; ctx.filter = 'blur(12px)';
      ctx.beginPath(); ctx.ellipse(600, 737, 145, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.drawImage(stone, 390, 470, 420, 280);
      ctx.fillStyle = '#30342d'; ctx.font = '500 42px "SUIT", "Malgun Gothic", sans-serif';
      lines.forEach((line, index) => ctx.fillText(line, 600, 890 + index * 76));
      ctx.strokeStyle = '#b8bfa6'; ctx.beginPath(); ctx.moveTo(110, h - 220); ctx.lineTo(1090, h - 220); ctx.stroke();
      ctx.fillStyle = '#686b5f'; ctx.font = '23px "SUIT", "Malgun Gothic", sans-serif';
      ctx.fillText('미륵사지 석탑에 이어진 마음들', 600, h - 150);
      ctx.font = '20px "SUIT", "Malgun Gothic", sans-serif'; ctx.fillText('나의 마음을 놓다 · 개인의 기록', 600, h - 100);
      const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('PNG failed')), 'image/png'));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = '누군가의-다음-나의-마음.png';
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      status.textContent = '카드 내려받기를 요청했습니다. 브라우저의 다운로드 목록을 확인해주세요.';
    } catch (error) {
      status.textContent = '카드를 만들지 못했습니다. 브라우저에서 다시 시도해주세요. 문장은 이 화면에 남아 있습니다.';
    } finally {
      downloadButton.disabled = !placed;
    }
  });
})();
