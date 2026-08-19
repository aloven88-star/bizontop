const fs = require('fs');
const path = require('path');

const posts = {
  post1: { emoji: '📋', cat: '정책자금', title: '2026년 소상공인 정책자금, 무엇이 달라졌나', excerpt: '매년 개편되는 소상공인 정책자금, 신청 전 꼭 확인해야 할 변화의 포인트를 정리했습니다.', date: '2026.07' },
  post2: { emoji: '🏆', cat: '인증컨설팅', title: '벤처기업인증, 정책자금 심사에 정말 도움이 될까?', excerpt: '벤처기업인증이 자금 조달과 세제 혜택에 어떤 영향을 주는지 짚어봅니다.', date: '2026.07' },
  post3: { emoji: '💰', cat: '수수료 안내', title: '정책자금 대행 수수료, 선불과 후불 무엇이 다를까', excerpt: '선수수료 요구에 주의해야 하는 이유와 후불제의 장점을 안내합니다.', date: '2026.06' },
  post4: { emoji: '📑', cat: '정책자금', title: '정책자금 신청 전 꼭 확인해야 할 서류 체크리스트', excerpt: '신청 전 미리 준비해두면 진행 속도를 크게 앞당길 수 있는 서류들을 정리했습니다.', date: '2026.06' },
  post5: { emoji: '🏭', cat: '제조업', title: '제조업 정책자금, 설비자금과 운전자금 어떻게 나눠 준비할까', excerpt: '설비 투자와 원자재 매입, 목적이 다른 두 자금을 함께 준비할 때 유의할 점을 정리했습니다.', date: '2026.05' },
  post6: { emoji: '🍽️', cat: '외식업', title: '폐업 이력이 있어도 재도전자금, 받을 수 있을까', excerpt: '외식업 재창업을 준비하는 사장님들이 가장 많이 묻는 재도전 지원자금 이야기입니다.', date: '2026.05' },
  post7: { emoji: '🏙️', cat: '서울', title: '서울 자치구별 소상공인 특례보증, 신청 전 체크포인트', excerpt: '서울신용보증재단 보증과 별개로 자치구가 운영하는 이차보전 사업을 짚어봅니다.', date: '2026.05' },
};

const targets = [
  ['content-manufacturing.html', ['post5', 'post2']],
  ['content-food-service.html', ['post6', 'post3']],
  ['content-it-startup.html', ['post2', 'post1']],
  ['content-retail.html', ['post4', 'post1']],
  ['content-construction-interior.html', ['post4', 'post3']],
  ['content-service.html', ['post3', 'post1']],
  ['content-seoul.html', ['post7', 'post1']],
  ['content-gyeonggi-incheon.html', ['post1', 'post4']],
  ['content-busan-gyeongnam.html', ['post1', 'post3']],
  ['content-daegu-gyeongbuk.html', ['post1', 'post4']],
  ['content-gwangju-jeolla.html', ['post1', 'post3']],
  ['content-daejeon-gangwon-jeju.html', ['post1', 'post4']],
];

const root = __dirname;

function block(keys) {
  const cards = keys.map(k => {
    const p = posts[k];
    return `      <a href="__BASE__blog.html#${k}" class="post-card">
        <div class="post-thumb">${p.emoji}</div>
        <div class="post-body">
          <div class="post-cat">${p.cat}</div>
          <h4>${p.title}</h4>
          <p>${p.excerpt}</p>
          <div class="post-meta"><span>비즈온탑 컨설팅팀</span><span>·</span><span>${p.date}</span></div>
        </div>
      </a>`;
  }).join('\n');

  return `<section class="section">
  <div class="container">
    <div class="section-head">
      <div class="eyebrow">COLUMN</div>
      <h2 class="section-title">관련 컬럼</h2>
    </div>
    <div class="post-grid" style="grid-template-columns: repeat(2, 1fr);">
${cards}
    </div>
  </div>
</section>

`;
}

let changed = 0;
for (const [file, keys] of targets) {
  const full = path.join(root, file);
  let content = fs.readFileSync(full, 'utf-8');
  if (content.includes('관련 컬럼')) {
    console.log('SKIP (already has related column): ' + file);
    continue;
  }
  const marker = '<section class="section section--alt">\n  <div class="container">\n    <div class="cta-banner">';
  if (!content.includes(marker)) {
    console.log('MARKER NOT FOUND: ' + file);
    continue;
  }
  content = content.replace(marker, block(keys) + marker);
  fs.writeFileSync(full, content, 'utf-8');
  changed++;
  console.log('Updated: ' + file);
}
console.log(`Done. ${changed} files updated.`);
