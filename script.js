document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SCREEN LOADING HANDLER
       ========================================================================== */
    const loader = document.getElementById('loading-screen');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 600);
            }, 1000); // Đảm bảo hiệu ứng chạy mượt tối thiểu 1 giây
        });
    }

    /* ==========================================================================
       2. STICKY NAVBAR & NAVIGATION LINK HIGH LIGHT
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
        handleBackToTopButtonVisibility();
    });

    /* ==========================================================================
       3. MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
            // Biến đổi hamburger icon
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            if(mobileMenuBtn.classList.contains('open')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Đóng menu khi click vào các liên kết điều hướng
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('open');
                mobileMenuBtn.querySelectorAll('.bar').forEach(b => b.style.transform = 'none');
                mobileMenuBtn.querySelectorAll('.bar')[1].style.opacity = '1';
            });
        });
    }

    /* ==========================================================================
       4. SCROLL REVEAL (FADE IN EFFECTS ANIMATION)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
                // Tích hợp kích hoạt đếm số nếu là khối Dashboard Infographic
                if (el.contains(el.querySelector('.counter'))) {
                    startCounterAnimation(el);
                }
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Chạy ngay khi tải xong kiểm tra các thành phần đầu trang

    /* ==========================================================================
       5. COUNTER ANIMATION (DASHBOARD EFFECT)
       ========================================================================== */
    let counterStarted = false;
    
    const startCounterAnimation = (parentContainer) => {
        if (counterStarted) return;
        const counters = parentContainer.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // Đếm trong 2 giây
            const increment = target / (duration / 16); // ~60fps
            
            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString() + (target === 2018 ? '' : '+');
                }
            };
            updateCount();
        });
        counterStarted = true;
    };

    /* ==========================================================================
       6. HERO PARALLAX EFFECT
       ========================================================================== */
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        if (!heroSection) return;
        let scrollPosition = window.scrollY;
        // Di chuyển background chậm hơn tốc độ cuộn thực tế
        const bgWrapper = heroSection.querySelector('.hero-bg-wrapper');
        if (bgWrapper) {
            bgWrapper.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });

    /* ==========================================================================
       7. VIDEO EMBED INTERACTIVE PLACEHOLDER
       ========================================================================== */
    const videoPlaceholder = document.querySelector('.video-overlay-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            videoPlaceholder.classList.add('hide');
            const iframe = videoPlaceholder.parentElement.querySelector('iframe');
            if (iframe) {
                // Tự động kích hoạt phát video thông qua Youtube API postMessage
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
        });
    }

    /* ==========================================================================
       8. PRODUCT CAROUSEL SLIDER
       ========================================================================== */
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (carouselTrack && prevBtn && nextBtn) {
        let index = 0;
        const items = document.querySelectorAll('.carousel-item');
        const maxItemsVisible = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const maxIndex = items.length - maxItemsVisible;

        const updateCarouselPosition = () => {
            const itemWidth = items[0].getBoundingClientRect().width + 20; // cộng phần gap 20px
            carouselTrack.style.transform = `translateX(${-index * itemWidth}px)`;
        };

        nextBtn.addEventListener('click', () => {
            if (index < maxIndex) { index++; } else { index = 0; }
            updateCarouselPosition();
        });

        prevBtn.addEventListener('click', () => {
            if (index > 0) { index--; } else { index = maxIndex; }
            updateCarouselPosition();
        });

        window.addEventListener('resize', updateCarouselPosition);
    }

    /* ==========================================================================
       9. BEFORE / AFTER COMPARISON SLIDER
       ========================================================================== */
    const comparisonSlider = document.getElementById('comparison-slider');
    const foregroundImg = document.querySelector('.foreground-img');
    const sliderButton = document.querySelector('.slider-button');

    if (comparisonSlider && foregroundImg && sliderButton) {
        comparisonSlider.addEventListener('input', (e) => {
            const sliderValue = e.target.value;
            foregroundImg.style.width = `${sliderValue}%`;
            sliderButton.style.left = `${sliderValue}%`;
        });
    }

    /* ==========================================================================
       10. MASONRY GALLERY FILTER & LIGHTBOX MODAL
       ========================================================================== */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxText = document.getElementById('lightbox-text');
    const closeLightbox = document.querySelector('.close-lightbox');

    // Filter Logic
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filterValue = tab.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Logic
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const textContent = item.querySelector('.gallery-box').innerText;
            if (lightbox && lightboxText) {
                lightboxText.innerText = `Đang Phóng To Trực Quan: ${textContent}`;
                lightbox.style.display = 'flex';
            }
        });
    });

    if (closeLightbox && lightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });
    }

    /* ==========================================================================
       11. TESTIMONIALS AUTOMATIC SLIDER WITH DOTS
       ========================================================================== */
    const testimonialTrack = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('dots-container');

    if (testimonialTrack && slides.length > 0 && dotsContainer) {
        let currentSlide = 0;
        const slideCount = slides.length;

        // Tạo các nút chấm tròn tự động dựa trên số lượng slide thực tế
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        const goToSlide = (n) => {
            testimonialTrack.style.transform = `translateX(${-n * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[n].classList.add('active');
            currentSlide = n;
        };

        const nextSlide = () => {
            let next = (currentSlide + 1) % slideCount;
            goToSlide(next);
        };

        // Chạy tự động chuyển đổi chu kỳ 5 giây
        let autoSlideInterval = setInterval(nextSlide, 5000);

        // Dừng tự động cuộn khi người dùng click tương tác trực tiếp
        dotsContainer.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
        });
    }

    /* ==========================================================================
       12. INTERACTIVE AGENCY SEARCH SIMULATION
       ========================================================================== */
    const searchBtn = document.querySelector('.btn-search-agency');
    const agencyInput = document.getElementById('agency-input');
    const agencyItems = document.querySelectorAll('.agency-item-card');

    if (searchBtn && agencyInput) {
        searchBtn.addEventListener('click', () => {
            const query = agencyInput.value.toLowerCase().trim();
            if(!query) return;
            
            agencyItems.forEach(item => {
                const text = item.innerText.toLowerCase();
                if(text.includes(query)) {
                    item.style.display = 'block';
                    item.classList.add('active');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                }
            });
        });
    }

    /* ==========================================================================
       13. LEAD GENERATION FORM TRANSACTION
       ========================================================================== */
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullname').value;
            alert(`Cảm ơn đối tác ${name}. Hệ thống Fujiwa Việt Nam đã ghi nhận thông tin yêu cầu của doanh nghiệp thành công. Đội ngũ chuyên viên sẽ liên hệ lại trong vòng 15 phút.`);
            leadForm.reset();
        });
    }

    /* ==========================================================================
       14. BACK TO TOP BUTTON LOGIC
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    function handleBackToTopButtonVisibility() {
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});