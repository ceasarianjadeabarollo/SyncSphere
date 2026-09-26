document.addEventListener("DOMContentLoaded", () => {
    // 0. iOS Hamburger Navbar Toggle (Responsive Tablet/Mobile Menu)
    const iosMenuToggle = document.getElementById("ios-menu-toggle");
    const navbarContent = document.getElementById("navbar-content");
    const containerNav = document.getElementById("container-nav");

    function closeMobileMenu() {
        if (iosMenuToggle && navbarContent) {
            iosMenuToggle.classList.remove("active");
            iosMenuToggle.setAttribute("aria-expanded", "false");
            navbarContent.classList.remove("menu_open");
        }
    }

    if (iosMenuToggle && navbarContent) {
        iosMenuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navbarContent.classList.toggle("menu_open");
            iosMenuToggle.classList.toggle("active", isOpen);
            iosMenuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Close menu when clicking any link or button inside the dropdown
        navbarContent.querySelectorAll("a, button").forEach((item) => {
            item.addEventListener("click", () => {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside the navbar
        document.addEventListener("click", (e) => {
            if (containerNav && !containerNav.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Reset menu state when resizing back to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 960) {
                closeMobileMenu();
            }
        });
    }

    // 1. Minimalist Automated Cycle for the 3 Core Pillars ("How it works")
    const hiwCards = document.querySelectorAll(".hiw_card");
    let currentStep = 0;
    let stepInterval = null;
    const STEP_DURATION_MS = 5000;

    function activateStep(index) {
        currentStep = index;
        hiwCards.forEach((card, i) => {
            card.classList.remove("active");
            const fill = card.querySelector(".hiw_progress_fill");
            if (fill) {
                fill.style.animation = "none";
                void fill.offsetWidth;
                fill.style.animation = "";
            }
            if (i === index) {
                card.classList.add("active");
            }
        });
    }

    function startStepAutoCycle() {
        clearInterval(stepInterval);
        stepInterval = setInterval(() => {
            const nextStep = (currentStep + 1) % hiwCards.length;
            activateStep(nextStep);
        }, STEP_DURATION_MS);
    }

    hiwCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            activateStep(index);
            startStepAutoCycle();
        });
        card.addEventListener("mouseenter", () => {
            activateStep(index);
            clearInterval(stepInterval);
        });
        card.addEventListener("mouseleave", () => {
            startStepAutoCycle();
        });
    });

    if (hiwCards.length > 0) {
        activateStep(0);
        startStepAutoCycle();
    }

    // 2. Minimalist Automated Cycle for "How the Flow Connects" (4 cards)
    const flowCards = document.querySelectorAll(".flow_card");
    let currentFlow = 0;
    let flowInterval = null;
    const FLOW_DURATION_MS = 2800;

    function activateFlowCard(index) {
        currentFlow = index;
        flowCards.forEach((card, i) => {
            card.classList.toggle("active", i === index);
        });
    }

    function startFlowAutoCycle() {
        clearInterval(flowInterval);
        flowInterval = setInterval(() => {
            const nextFlow = (currentFlow + 1) % flowCards.length;
            activateFlowCard(nextFlow);
        }, FLOW_DURATION_MS);
    }

    flowCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            activateFlowCard(index);
            startFlowAutoCycle();
        });
        card.addEventListener("mouseenter", () => {
            activateFlowCard(index);
            clearInterval(flowInterval);
        });
        card.addEventListener("mouseleave", () => {
            startFlowAutoCycle();
        });
    });

    if (flowCards.length > 0) {
        activateFlowCard(0);
        startFlowAutoCycle();
    }

    // 3. Share Popup Modal & Dynamic Public URL Sharing (GitHub Pages Ready)
    const shareNavBtn = document.getElementById("share-nav-btn");
    const shareModalOverlay = document.getElementById("share-modal-overlay");
    const shareModalClose = document.getElementById("share-modal-close");
    const shareUrlPill = document.getElementById("share-url-pill");
    const shareUrlInput = document.getElementById("share-url-input");
    const shareCopyBadge = document.getElementById("share-copy-badge");
    const shareFeedbackMsg = document.getElementById("share-feedback-msg");
    const socialBtns = document.querySelectorAll(".share_social_btn");

    function getShareableUrl() {
        return window.location.href.split("#")[0];
    }

    function showShareFeedback(message) {
        if (!shareFeedbackMsg) return;
        shareFeedbackMsg.textContent = message;
        shareFeedbackMsg.classList.add("visible");
        setTimeout(() => {
            shareFeedbackMsg.classList.remove("visible");
        }, 2600);
    }

    async function copyShareUrl(customMessage) {
        const url = getShareableUrl();
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            if (shareUrlInput) {
                shareUrlInput.select();
                document.execCommand("copy");
            }
        }
        if (shareCopyBadge) {
            shareCopyBadge.textContent = "Copied!";
            setTimeout(() => {
                shareCopyBadge.textContent = "Copy";
            }, 2200);
        }
        showShareFeedback(customMessage || "Link copied! Ready to share anywhere.");
    }

    function openShareModal(e) {
        if (e) e.preventDefault();
        if (shareUrlInput) {
            shareUrlInput.value = getShareableUrl();
        }
        if (shareModalOverlay) {
            shareModalOverlay.classList.add("open");
            shareModalOverlay.setAttribute("aria-hidden", "false");
        }
    }

    function closeShareModal() {
        if (shareModalOverlay) {
            shareModalOverlay.classList.remove("open");
            shareModalOverlay.setAttribute("aria-hidden", "true");
        }
    }

    if (shareNavBtn) {
        shareNavBtn.addEventListener("click", openShareModal);
    }

    if (shareModalClose) {
        shareModalClose.addEventListener("click", closeShareModal);
    }

    if (shareModalOverlay) {
        shareModalOverlay.addEventListener("click", (e) => {
            if (e.target === shareModalOverlay) {
                closeShareModal();
            }
        });
    }

    if (shareUrlPill) {
        shareUrlPill.addEventListener("click", () => {
            copyShareUrl("Link copied to clipboard!");
        });
    }

    socialBtns.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const platform = btn.getAttribute("data-platform");
            const url = getShareableUrl();
            const encodedUrl = encodeURIComponent(url);

            await copyShareUrl(`Link copied for ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);

            if (platform === "facebook") {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank", "noopener,noreferrer");
            } else if (platform === "messenger") {
                if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
                    window.location.href = `fb-messenger://share/?link=${encodedUrl}`;
                } else {
                    window.open(`https://www.messenger.com/`, "_blank", "noopener,noreferrer");
                }
            } else if (platform === "tiktok") {
                if (navigator.share) {
                    navigator.share({ title: "SyncSphere", text: "Check out SyncSphere!", url }).catch(() => {});
                } else {
                    window.open("https://www.tiktok.com/", "_blank", "noopener,noreferrer");
                }
            } else if (platform === "instagram") {
                if (navigator.share) {
                    navigator.share({ title: "SyncSphere", text: "Check out SyncSphere!", url }).catch(() => {});
                } else {
                    window.open("https://www.instagram.com/coxsaryan/", "_blank", "noopener,noreferrer");
                }
            }
        });
    });

    // 4. Minimalist FAQ Accordion Function
    const faqItems = document.querySelectorAll(".faq_item");
    faqItems.forEach((item) => {
        const questionBtn = item.querySelector(".faq_question");
        if (!questionBtn) return;

        questionBtn.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            faqItems.forEach((other) => {
                other.classList.remove("active");
                const otherBtn = other.querySelector(".faq_question");
                if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.classList.add("active");
                questionBtn.setAttribute("aria-expanded", "true");
            }
        });
    });

    // 5. Survey Popup Modal ("Survey Here!" on Page 1)
    const surveyOpenBtn = document.getElementById("survey-open-btn");
    const surveyModalOverlay = document.getElementById("survey-modal-overlay");
    const surveyModalClose = document.getElementById("survey-modal-close");

    function openSurveyModal(e) {
        if (e) e.preventDefault();
        if (surveyModalOverlay) {
            surveyModalOverlay.classList.add("open");
            surveyModalOverlay.setAttribute("aria-hidden", "false");
        }
    }

    function closeSurveyModal() {
        if (surveyModalOverlay) {
            surveyModalOverlay.classList.remove("open");
            surveyModalOverlay.setAttribute("aria-hidden", "true");
        }
    }

    if (surveyOpenBtn) {
        surveyOpenBtn.addEventListener("click", openSurveyModal);
    }

    if (surveyModalClose) {
        surveyModalClose.addEventListener("click", closeSurveyModal);
    }

    if (surveyModalOverlay) {
        surveyModalOverlay.addEventListener("click", (e) => {
            if (e.target === surveyModalOverlay) {
                closeSurveyModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMobileMenu();
            closeShareModal();
            closeSurveyModal();
        }
    });

    // 6. Staggered Scroll-Reveal Animations
    const revealGroups = [
        { selector: ".page1 .typography1 > *", stagger: 65, direction: "reveal_left" },
        { selector: ".page1 .image_slider", stagger: 0, direction: "reveal_right", delay: 120 },
        { selector: ".page2_features > *", stagger: 75 },
        { selector: ".feature_row .feature_phone", stagger: 0, direction: "reveal_left" },
        { selector: ".feature_row .feature_content > *", stagger: 70, direction: "reveal_right" },
        { selector: ".more_container .container_extra", stagger: 0 },
        { selector: ".other_features > div", stagger: 80 },
        { selector: ".header3 > *", stagger: 75 },
        { selector: ".hiw_grid .hiw_card", stagger: 95 },
        { selector: ".flow_container .container_extra", stagger: 0 },
        { selector: ".flow_steps_row .flow_card", stagger: 80 },
        { selector: ".header4 > *", stagger: 70 },
        { selector: ".faq_list .faq_item", stagger: 60 },
        { selector: ".ending_header > *", stagger: 75 },
        { selector: ".avatar_creator .creator_id_card", stagger: 80 },
        { selector: ".lastone", stagger: 0 }
    ];

    const allRevealTargets = [];

    revealGroups.forEach((group) => {
        const elements = document.querySelectorAll(group.selector);
        elements.forEach((el, idx) => {
            el.classList.add("scroll_reveal");
            if (group.direction) {
                el.classList.add(group.direction);
            }
            const totalDelay = (group.delay || 0) + idx * (group.stagger || 0);
            el.dataset.revealDelay = `${totalDelay}ms`;
            el.style.setProperty("--reveal-delay", `${totalDelay}ms`);
            allRevealTargets.push(el);
        });
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    el.style.setProperty("--reveal-delay", el.dataset.revealDelay || "0ms");
                    el.classList.add("in_view");
                    setTimeout(() => {
                        el.style.setProperty("--reveal-delay", "0ms");
                    }, 750);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    allRevealTargets.forEach((el) => revealObserver.observe(el));

    // 7. Premium Weighted Smooth Scroll Physics (120fps Frame-Independent Glide)
    const WHEEL_SENSITIVITY = 0.74;
    const SMOOTH_DAMPING = 11.5;
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId = null;
    let lastFrameTime = performance.now();

    function isAnyModalOpen() {
        return (
            (shareModalOverlay && shareModalOverlay.classList.contains("open")) ||
            (surveyModalOverlay && surveyModalOverlay.classList.contains("open"))
        );
    }

    function getMaxScrollY() {
        return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function tickSmoothScroll(now) {
        const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
        lastFrameTime = now;

        const diff = targetY - currentY;
        if (Math.abs(diff) > 0.35) {
            const factor = 1 - Math.exp(-SMOOTH_DAMPING * dt);
            currentY += diff * factor;
            window.scrollTo({ top: currentY, behavior: "instant" });
            rafId = requestAnimationFrame(tickSmoothScroll);
        } else {
            currentY = targetY;
            window.scrollTo({ top: currentY, behavior: "instant" });
            rafId = null;
        }
    }

    function startGlideLoop() {
        if (!rafId) {
            lastFrameTime = performance.now();
            rafId = requestAnimationFrame(tickSmoothScroll);
        }
    }

    window.addEventListener(
        "wheel",
        (e) => {
            if (isAnyModalOpen() || e.ctrlKey) return;
            e.preventDefault();
            if (!rafId) {
                targetY = window.scrollY;
                currentY = window.scrollY;
            }
            const pixelDelta = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaY;
            targetY = Math.max(0, Math.min(getMaxScrollY(), targetY + pixelDelta * WHEEL_SENSITIVITY));
            startGlideLoop();
        },
        { passive: false }
    );

    window.addEventListener(
        "scroll",
        () => {
            if (!rafId) {
                targetY = window.scrollY;
                currentY = window.scrollY;
            }
        },
        { passive: true }
    );

    document.querySelectorAll('.navbar_content a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;
            const destEl = document.querySelector(href);
            if (!destEl) return;
            e.preventDefault();
            if (!rafId) {
                currentY = window.scrollY;
            }
            const rawTop = destEl.getBoundingClientRect().top + window.scrollY - 20;
            targetY = Math.max(0, Math.min(getMaxScrollY(), rawTop));
            startGlideLoop();
        });
    });
});




