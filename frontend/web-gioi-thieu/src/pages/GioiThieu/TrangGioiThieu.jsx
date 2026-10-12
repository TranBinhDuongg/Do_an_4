import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PawPrint, Moon, Sun, MapPin, Camera, ChatCircleDots } from '@phosphor-icons/react';
import './gioi-thieu.css';
import { GioiThieuChiTiet, SauKhiBaoTin, CauHoiThuongGap, SectionLabel } from './ThongTinTrungTam';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: 'ket-noi', label: 'Trung tâm' },
  { id: 'su-menh', label: 'Sứ mệnh' },
  { id: 'dong-hanh', label: 'Đồng hành' },
  { id: 'bao-tin', label: 'Báo tin' },
];

const guideSteps = [
  { id: 'vi-tri', title: 'Địa điểm cụ thể', heading: <>Cho trung tâm biết<br /><em>con vật ở đâu.</em></>, description: 'Địa chỉ, vị trí trên bản đồ hoặc mốc dễ nhận biết gần nơi bạn thấy con vật.', note: 'Thông tin giúp xác định địa điểm', items: ['Địa chỉ hoặc vị trí trên bản đồ', 'Mốc nhận biết gần nhất', 'Thời điểm bạn bắt gặp con vật'] },
  { id: 'tinh-trang', title: 'Tình trạng quan sát được', heading: <>Chia sẻ điều<br /><em>bạn quan sát.</em></>, description: 'Loài vật, số lượng, biểu hiện và hình ảnh tại thời điểm bạn bắt gặp.', note: 'Thông tin giúp hiểu tình huống', items: ['Loài vật và số lượng', 'Biểu hiện bạn nhìn thấy', 'Hình ảnh và thời điểm chụp'] },
  { id: 'lien-lac', title: 'Cách liên lạc với bạn', heading: <>Giữ kết nối.<br /><em>Tiếp nối sự giúp đỡ.</em></>, description: 'Thông tin liên hệ để trung tâm hỏi thêm về địa điểm và tình huống khi cần.', note: 'Thông tin giúp tiếp tục trao đổi', items: ['Tên hoặc cách xưng hô', 'Kênh liên lạc thuận tiện', 'Thông tin bổ sung về tình huống'] },
];

const pageSections = [
  { id: 've-trung-tam', label: 'Giới thiệu trung tâm' },
  { id: 'truong-hop', label: 'Các trường hợp báo tin' },
  ...guideSteps.map(step => ({ id: step.id, label: step.title })),
  { id: 'sau-bao-tin', label: 'Quy trình tiếp nhận' },
  { id: 'mau-tin-bao', label: 'Mẫu tin báo' },
  { id: 'dia-diem', label: 'Địa điểm trung tâm' },
  { id: 'cau-hoi', label: 'Câu hỏi thường gặp' },
];

const guideDetails = [
  { icon: MapPin, example: 'Gần cổng chợ, bên cạnh biển tên đường; gửi thêm vị trí trên bản đồ nếu có.' },
  { icon: Camera, example: 'Một chú chó màu nâu, đi lại khó khăn. Ảnh được chụp lúc bạn bắt gặp.' },
  { icon: ChatCircleDots, example: 'Tên của bạn, số điện thoại hoặc kênh có thể nhắn tin và thời gian tiện trao đổi.' },
];

export function TrangGioiThieu() {
  const root = useRef(null);
  const track = useRef(null);
  const trigger = useRef(null);
  const guide = useRef(null);
  const guidePages = useRef(null);
  const page = useRef(null);
  const pageBar = useRef(null);
  const contentPages = useRef(null);
  const [active, setActive] = useState(0);
  const [pageActive, setPageActive] = useState(0);
  const [pageVisible, setPageVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.title = 'Trạm cứu hộ động vật | Kết nối để cứu giúp';
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.current.scrollWidth - root.current.clientWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => `+=${distance()}`,
          pin: true, scrub: 0.35, invalidateOnRefresh: true,
          onUpdate: self => {
            setActive(Math.round(self.progress * (chapters.length - 1)));
            root.current.style.setProperty('--intro-progress', `${self.progress * 100}%`);
          },
        },
      });
      trigger.current = tween.scrollTrigger;
      // Like the reference: wheel gestures advance one screen, with time to read.
      let locked = false;
      let delta = 0;
      let unlock;
      const wheel = event => {
        if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
        const bounds = root.current.getBoundingClientRect();
        if (bounds.top > 1 || bounds.bottom <= 0 || !trigger.current) return;
        const current = Math.round(trigger.current.progress * (chapters.length - 1));
        if (event.deltaY < 0 && current === 0) return;
        const scrollable = event.target.closest('.intro-panel');
        if (scrollable && scrollable.scrollHeight > scrollable.clientHeight + 2 &&
          (event.deltaY > 0 ? scrollable.scrollTop < scrollable.scrollHeight - scrollable.clientHeight - 2 : scrollable.scrollTop > 2)) return;
        event.preventDefault();
        if (locked) return;
        delta += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
        if (Math.abs(delta) < 32) return;
        const direction = Math.sign(delta);
        delta = 0;
        const next = Math.max(0, Math.min(chapters.length - 1, current + direction));
        locked = true;
        window.scrollTo({ top: next === current && direction > 0
          ? document.getElementById('ve-trung-tam').getBoundingClientRect().top + window.scrollY - pageBar.current.offsetHeight + 1
          : trigger.current.start + (trigger.current.end - trigger.current.start) * next / (chapters.length - 1), behavior: 'smooth' });
        unlock = window.setTimeout(() => { locked = false; }, 550);
      };
      root.current.addEventListener('wheel', wheel, { passive: false });
      return () => {
        root.current.removeEventListener('wheel', wheel);
        window.clearTimeout(unlock);
        root.current.style.removeProperty('--intro-progress');
        trigger.current = null;
      };
    });
    media.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = chapters.findIndex(chapter => chapter.id === entry.target.id);
            setActive(index);
          }
        }
      }, { rootMargin: '-20% 0px -45% 0px' });
      root.current.querySelectorAll('.intro-panel').forEach(panel => observer.observe(panel));
      return () => observer.disconnect();
    });

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const panels = guide.current.querySelectorAll('.guide-panel');
      guide.current.classList.add('motion-ready');
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      panels.forEach(panel => {
        reveal.observe(panel);
        gsap.to(panel, {
          '--parallax-offset': '50px', ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      return () => {
        reveal.disconnect();
        guide.current.classList.remove('motion-ready');
        panels.forEach(panel => panel.classList.remove('is-visible'));
      };
    });
    const pageContext = gsap.context(() => {
      ScrollTrigger.create({ trigger: contentPages.current, start: () => `top top+=${pageBar.current.offsetHeight}`, end: () => ScrollTrigger.maxScroll(window),
        onUpdate: self => page.current.style.setProperty('--page-progress', `${self.progress * 100}%`) });
    }, page);
    let sectionObserver;
    let visibilityObserver;
    const observeSections = () => {
      sectionObserver?.disconnect();
      visibilityObserver?.disconnect();
      const barHeight = pageBar.current.offsetHeight;
      visibilityObserver = new IntersectionObserver(([entry]) => setPageVisible(entry.isIntersecting), {
        rootMargin: `-${barHeight}px 0px -${Math.max(0, window.innerHeight - barHeight - 2)}px 0px`,
      });
      visibilityObserver.observe(contentPages.current);
      const center = Math.floor(window.innerHeight / 2);
      sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) setPageActive(pageSections.findIndex(section => section.id === entry.target.id));
      }), { rootMargin: `-${center}px 0px -${Math.max(0, window.innerHeight - center - 2)}px 0px` });
      pageSections.forEach(section => sectionObserver.observe(document.getElementById(section.id)));
    };
    observeSections();
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener('resize', observeSections);
    return () => {
      sectionObserver.disconnect();
      visibilityObserver.disconnect();
      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener('resize', observeSections);
      pageContext.revert(); media.revert();
    };
  }, []);

  function goTo(event, index) {
    if (!trigger.current) return;
    event.preventDefault();
    window.history.replaceState(null, '', `#${chapters[index].id}`);
    window.scrollTo({ top: trigger.current.start + (trigger.current.end - trigger.current.start) * index / (chapters.length - 1), behavior: 'smooth' });
  }

  function skipIntro(event) {
    event.preventDefault();
    window.history.replaceState(null, '', '#huong-dan');
    const barHeight = pageBar.current.offsetHeight;
    window.scrollTo({ top: guidePages.current.getBoundingClientRect().top + window.scrollY - barHeight + 1, behavior: 'instant' });
  }

  function goToGuide(event, id) {
    event.preventDefault();
    const panel = document.getElementById(id);
    const barHeight = pageBar.current.offsetHeight;
    window.history.replaceState(null, '', `#${id}`);
    window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY - barHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <div className="rescue-intro" data-theme={theme} ref={page}>
    <a className="intro-skip" href="#ket-noi">Đến nội dung giới thiệu</a>
    <div className={`page-progress${pageVisible ? ' is-active' : ''}`} ref={pageBar} aria-hidden={!pageVisible}>
      <nav aria-label="Điều hướng các phần của trang">{pageSections.map((section, index) => <a key={section.id} href={`#${section.id}`} title={section.label} aria-label={`Đến phần ${section.label}`} tabIndex={pageVisible ? 0 : -1} aria-current={pageActive === index ? 'location' : undefined} onClick={event => goToGuide(event, section.id)} />)}</nav>
      <a className="page-faq-link" href="#cau-hoi" tabIndex={pageVisible ? 0 : -1} onClick={event => goToGuide(event, 'cau-hoi')}>Câu hỏi thường gặp ↗</a>
      <div className="page-progress-fill" aria-hidden="true" />
    </div>
    <div className="intro-stage" ref={root}>
      <header className="intro-header">
        <a className="intro-brand" href="#ket-noi" onClick={event => goTo(event, 0)} aria-label="Trạm cứu hộ động vật"><span className="intro-monogram" aria-hidden="true"><PawPrint size={24} weight="fill" /></span><span>Trạm cứu hộ<small>ĐỘNG VẬT</small></span></a>
        <nav aria-label="Các phần giới thiệu">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} onClick={event => goTo(event, index)} aria-current={active === index ? 'step' : undefined}>{chapter.label}</a>)}</nav>
        <div className="intro-header-actions"><button className="intro-theme-button" type="button" aria-label={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button><a className="intro-login" href="#huong-dan" onClick={skipIntro}>Cách báo tin <span aria-hidden="true">↗</span></a></div>
      </header>

      <main className="intro-track" ref={track}>
        <section id="ket-noi" className="intro-panel intro-hero" aria-labelledby="intro-title">
          <div className="intro-copy"><p className="intro-kicker">CÙNG GIÚP MỘT SINH LINH</p><h1 id="intro-title">Một kết nối.<br />Một cơ hội<br /><em>được cứu giúp.</em></h1><p>Trạm cứu hộ động vật kết nối cộng đồng để quan tâm những con vật cần giúp đỡ. Một tin báo rõ ràng từ bạn có thể mở đầu cho hành trình cứu hộ và chăm sóc.</p><a className="intro-action" href="#su-menh" onClick={event => goTo(event, 1)}>Tìm hiểu về trung tâm <span aria-hidden="true">→</span></a></div>
          <figure className="intro-photo"><img src="/images/cho-ngoai-vuon.jpg" alt="Chú chó Golden Retriever nằm thư giãn trên cỏ" width="1800" height="1314" fetchPriority="high" /></figure>
        </section>

        <section id="su-menh" className="intro-panel intro-report" aria-labelledby="report-title">
          <div className="intro-copy"><p className="intro-step">VỀ TRUNG TÂM</p><h2 id="report-title">Mỗi sự sống<br />đều xứng đáng<br /><em>được quan tâm.</em></h2><p>Trung tâm hướng đến việc kết nối cộng đồng để hỗ trợ động vật bị bỏ rơi, bị thương hoặc đang gặp khó khăn.</p><a className="intro-text-link" href="#dong-hanh" onClick={event => goTo(event, 2)}>Cùng trung tâm đồng hành <span aria-hidden="true">→</span></a></div>
          <div className="intro-detail"><span className="intro-big-number" aria-hidden="true">01</span><h3>Từ một tin báo đến sự chăm sóc</h3><p>Trung tâm là nơi tiếp nhận thông tin và phối hợp hỗ trợ. Mỗi trường hợp cần được tìm hiểu để chọn cách giúp đỡ phù hợp.</p><div className="intro-note">Điều chúng tôi hướng đến<br /><strong>Cứu giúp · Chăm sóc · Kết nối</strong></div></div>
        </section>

        <section id="dong-hanh" className="intro-panel intro-coordinate" aria-labelledby="coordinate-title">
          <div className="intro-copy"><p className="intro-step">BẠN CÓ THỂ GIÚP</p><h2 id="coordinate-title">Không cần làm<br />tất cả. Bắt đầu<br /><em>từ một tin báo.</em></h2><p>Một địa điểm rõ ràng và một mô tả đúng tình trạng giúp trung tâm hiểu được con vật đang cần gì.</p><a className="intro-text-link" href="#bao-tin" onClick={event => goTo(event, 3)}>Tìm hiểu cách báo tin <span aria-hidden="true">→</span></a></div>
          <div className="intro-detail"><span className="intro-big-number" aria-hidden="true">02</span><h3>Sự quan tâm tạo nên kết nối</h3><p>Bạn có thể cung cấp thông tin, bổ sung hình ảnh và giữ liên lạc để trung tâm tìm hiểu tình huống.</p><div className="intro-note">Đồng hành từ cộng đồng<br /><strong>Quan sát · Chia sẻ thông tin · Kết nối</strong></div></div>
        </section>

        <section id="bao-tin" className="intro-panel intro-rescue" aria-labelledby="rescue-title">
          <div className="intro-copy"><p className="intro-step">KHI BẠN CẦN BÁO TIN</p><h2 id="rescue-title">Cho trung tâm<br />biết <em>điều bạn thấy.</em></h2><p>Chuẩn bị thông tin về vị trí, tình trạng con vật và cách liên lạc với bạn để việc tiếp nhận được thuận lợi.</p><a className="intro-action" href="#huong-dan" onClick={skipIntro}>Xem hướng dẫn báo tin <span aria-hidden="true">↓</span></a></div>
          <div className="intro-detail"><span className="intro-big-number" aria-hidden="true">03</span><h3>Thông tin nhỏ, ý nghĩa lớn</h3><p>Nêu rõ điều bạn đã quan sát. Nếu chưa chắc về tình trạng con vật, bạn có thể ghi lại mô tả thay vì tự đưa ra kết luận.</p><div className="intro-note">Trước khi liên hệ<br /><strong>Vị trí · Tình trạng · Hình ảnh · Liên lạc</strong></div></div>
        </section>
      </main>
      <div className="intro-progress" aria-label="Tiến trình giới thiệu"><span>{String(active + 1).padStart(2, '0')} <span className="intro-progress-total">/ 04</span></span><div className="intro-segments">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} onClick={event => goTo(event, index)} aria-label={`Đến phần ${chapter.label}`} aria-current={active === index ? 'step' : undefined} />)}</div><span className="intro-scroll-hint">Cuộn để khám phá <span aria-hidden="true">↓</span></span></div>
      <div className="intro-progress-fill" aria-hidden="true"><span /></div>
    </div>

    <div ref={contentPages}>
    <GioiThieuChiTiet />
    <section className="intro-guide" id="huong-dan" ref={guide} aria-labelledby="apps-title">
      <div className="guide-step-pages" ref={guidePages}>
      {guideSteps.map((step, index) => <article key={step.id} id={step.id} className={`guide-panel${index === 0 ? ' guide-panel-first' : ''}`} aria-labelledby={`${step.id}-title`}>
        {index === 0 && <header className="guide-intro"><SectionLabel number="03">Chuẩn bị thông tin</SectionLabel><h2 id="apps-title">Hướng dẫn báo tin</h2><p>Chuẩn bị ba nhóm thông tin để trung tâm hiểu rõ tình huống và liên hệ với bạn khi cần.</p></header>}
        <div className="guide-content"><p className="intro-step">{String(index + 1).padStart(2, '0')} / {step.title}</p><h3 id={`${step.id}-title`}>{step.heading}</h3><p>{step.description}</p>{index < guideSteps.length - 1 && <a className="intro-text-link" href={`#${guideSteps[index + 1].id}`} onClick={event => goToGuide(event, guideSteps[index + 1].id)}>Bước tiếp theo <span aria-hidden="true">↓</span></a>}</div>
        <div className="guide-explainer"><span className="intro-big-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h4><span className="guide-detail-icon" aria-hidden="true">{(() => { const Icon = guideDetails[index].icon; return <Icon size={23} />; })()}</span>{step.note}</h4><ul>{step.items.map(item => <li key={item}>{item}</li>)}</ul><div className="guide-example"><span>GỢI Ý CÁCH MÔ TẢ</span><p>{guideDetails[index].example}</p></div></div>
      </article>)}
      </div>
    </section>
    <SauKhiBaoTin />
    <CauHoiThuongGap />
    <footer className="intro-footer"><span>Trạm cứu hộ động vật</span><a href="#dia-diem">Địa điểm trung tâm</a><a href="#ket-noi" onClick={event => goTo(event, 0)}>Về đầu trang ↑</a></footer>
    </div>
  </div>;
}
