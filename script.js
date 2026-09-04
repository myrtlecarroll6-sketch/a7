/* ==========================================================================
   ClassNotebook - Cognitive Study Simulator & Academic Laboratory Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('classnotebook-theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.textContent = 'Scholar Light';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('classnotebook-theme', 'light');
        themeToggleBtn.textContent = 'Oxford Dark';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('classnotebook-theme', 'dark');
        themeToggleBtn.textContent = 'Scholar Light';
      }
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileMenuBtn.innerHTML = navMenu.classList.contains('open') ? '&times;' : '&#9776;';
    });
  }

  // Reading Progress Bar
  const progressBar = document.getElementById('readingProgressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = progress + '%';
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const body = item.querySelector('.faq-body');
    if (trigger && body) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => {
          i.classList.remove('active');
          const b = i.querySelector('.faq-body');
          if (b) b.style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // Spaced Repetition Schedule Generator
  const subjectInput = document.getElementById('subjectInput');
  const difficultySelect = document.getElementById('difficultySelect');
  const generateScheduleBtn = document.getElementById('generateScheduleBtn');
  const timelineOutput = document.getElementById('timelineOutput');

  function calculateIntervals() {
    const subject = subjectInput ? (subjectInput.value.trim() || 'Organic Chemistry') : 'Organic Chemistry';
    const diff = difficultySelect ? difficultySelect.value : 'medium';
    
    let intervals = [
      { day: "Day 1", task: `Initial Acquisition & Cornell Summary for ${subject}`, focus: "Immediate consolidation within 24 hours (80% retention baseline)" },
      { day: "Day 3", task: `Active Recall & Cue Column Self-Testing`, focus: "First retrieval interruption to reset Ebbinghaus decay curve" },
      { day: "Day 7", task: `Feynman Simplification & Concept Mapping`, focus: "Identify blindspots and restructure conceptual mental models" },
      { day: "Day 14", task: `Mixed Practice & Problem Set Application`, focus: "Interleaved testing across adjacent curriculum units" },
      { day: "Day 30", task: `Long-Term Mastery & Final Schema Lock`, focus: "Consolidate to permanent semantic long-term memory" }
    ];

    if (diff === 'hard') {
      intervals.splice(2, 0, { day: "Day 5", task: `Mid-Interval Flashcard Drill for ${subject}`, focus: "Extra retrieval booster for high-entropy conceptual content" });
    }

    if (timelineOutput) {
      timelineOutput.innerHTML = '';
      intervals.forEach(step => {
        const div = document.createElement('div');
        div.className = 'timeline-step-item';
        div.innerHTML = `
          <span class="timeline-step-badge">${step.day}</span>
          <div class="timeline-step-text">
            <h4>${step.task}</h4>
            <p>${step.focus}</p>
          </div>
        `;
        timelineOutput.appendChild(div);
      });
    }
  }

  if (generateScheduleBtn) {
    generateScheduleBtn.addEventListener('click', calculateIntervals);
  }

  // Initial calculation
  calculateIntervals();

  // Blog Live Search & Category Filter
  const blogSearchInput = document.getElementById('blogSearchInput');
  const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');
  const blogCards = document.querySelectorAll('.journal-post-card');

  function filterPosts() {
    const query = blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : '';
    const activeCatBtn = document.querySelector('.category-filter-btn.active');
    const selectedCategory = activeCatBtn ? activeCatBtn.getAttribute('data-category') : 'all';

    blogCards.forEach(card => {
      const cardTitle = card.querySelector('.post-card-title')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.post-card-excerpt')?.textContent.toLowerCase() || '';
      const cardCat = card.getAttribute('data-category') || '';

      const matchesQuery = !query || cardTitle.includes(query) || cardDesc.includes(query);
      const matchesCategory = selectedCategory === 'all' || cardCat === selectedCategory;

      if (matchesQuery && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', filterPosts);
  }

  if (categoryFilterBtns.length > 0) {
    categoryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterPosts();
      });
    });
  }
});
