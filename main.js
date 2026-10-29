
/* DEXLEVO Patent Technology - JavaScript & jQuery */

(function () {
  'use strict';

  function ready() {

    // 메인 영상: 페이지를 열거나 새로고침할 때 1회 재생, 마지막 프레임 정지
    const heroVideo = document.getElementById('hero-background-video');
    if (heroVideo) {
      heroVideo.loop = true;
      heroVideo.muted = true;
     
      // 페이지 방문·새로고침마다 영상의 처음부터 재생 시도
      heroVideo.currentTime = 0;
      const playPromise = heroVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => { /* 자동재생 제한 시 첫 프레임 노출 */ });
      }
    }

    // 1. 필요한 HTML 요소 가져오기
    const nav = document.getElementById('site-nav');
    const toggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('.site-header');
    const topButton = document.querySelector('.back-to-top');
    const links = [...document.querySelectorAll('.nav a')];

    // 사용자의 애니메이션 설정 확인
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';


    // 2. 모바일 메뉴 닫기
    const closeMenu = () => {
      nav.classList.remove('open');

      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '메뉴 열기');
    };


    // 3. 모바일 햄버거 메뉴 열기/닫기
    toggle.addEventListener('click', () => {

      const isOpen = nav.classList.toggle('open');

      toggle.setAttribute('aria-expanded', String(isOpen));

      toggle.setAttribute(
        'aria-label',
        isOpen ? '메뉴 닫기' : '메뉴 열기'
      );

    });


    // ESC 키를 누르면 메뉴 닫기
    document.addEventListener('keydown', (event) => {

      if (event.key === 'Escape') {
        closeMenu();
      }

    });


    // 메뉴 바깥을 클릭하면 닫기
    document.addEventListener('click', (event) => {

      if (!event.target.closest('.header-inner')) {
        closeMenu();
      }

    });


    // 4. 스크롤에 따른 헤더와 TOP 버튼 변경
    const changeScrollState = () => {

      header.classList.toggle(
        'scrolled',
        window.scrollY > 10
      );

      topButton.classList.toggle(
        'show',
        window.scrollY > 360
      );

    };

    window.addEventListener('scroll', changeScrollState, {
      passive: true
    });

    changeScrollState();


    // 5. 맨 위로 이동하는 버튼
    topButton.addEventListener('click', () => {

      window.scrollTo({
        top: 0,
        behavior: scrollBehavior
      });

    });


    // 6. jQuery를 사용한 부드러운 페이지 이동
    if (window.jQuery) {

      const $ = window.jQuery;

      $('.nav a, .text-link, .brand').on(
        'click',
        function (event) {

          const id = $(this).attr('href');

          if (!id || !id.startsWith('#')) {
            return;
          }

          const target = document.querySelector(id);

          if (!target) {
            return;
          }

          event.preventDefault();

          closeMenu();

          if (prefersReducedMotion) {

            target.scrollIntoView();

          } else {

            
            $('html, body')
            .stop()
            .animate(
        {
            scrollTop: Math.max(
                0,
                $(target).offset().top - 76
            )
        },
        650,
        'linear'
    );

          }

        }
      );

    } else {

      // jQuery 연결 실패 시 기본 JavaScript 사용
      document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener('click', event => {

          const target = document.querySelector(
            link.getAttribute('href')
          );

          if (!target) {
            return;
          }

          event.preventDefault();

          closeMenu();

          target.scrollIntoView({
            behavior: scrollBehavior
          });

        });

      });

    }


    // 7. 스크롤 등장 애니메이션
    if (
      'IntersectionObserver' in window &&
      !prefersReducedMotion
    ) {

      
const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                // 화면에 들어오면 나타남
                entry.target.classList.add('visible');

            } else {

                // 화면에서 벗어나면 초기 상태로 복귀
                entry.target.classList.remove('visible');

            }

        });

    },
    {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    }
);

document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
});


      // 8. 현재 보고 있는 섹션에 따라 메뉴 강조
      const sections = document.querySelectorAll(
        'main section[id]'
      );

      const sectionObserver = new IntersectionObserver(
        entries => {

          for (const entry of entries) {

            if (entry.isIntersecting) {

              links.forEach(a => {

                a.classList.toggle(
                  'active',
                  a.getAttribute('href') === '#' + entry.target.id
                );

              });

            }

          }

        },
        {
          rootMargin: '-25% 0px -55% 0px'
        }
      );

      sections.forEach(section => {
        sectionObserver.observe(section);
      });

    } else {

      // 스크롤 애니메이션을 지원하지 않는 환경
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
      });

    }

  }


  // 9. HTML 로딩이 끝나면 JavaScript 실행
  if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', ready);

  } else {

    ready();

  }

})();
