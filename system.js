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

    // 8. Real-Time View Counter with Phone Brand/Model Analysis & Hardware Serial Duplicate Prevention
    const viewCountEl = document.getElementById("view-count-number");
    const deviceInfoText = document.getElementById("device-info-text");
    const webViewsBadge = document.getElementById("web-views-badge");

    function analyzePhoneDevice() {
        const ua = navigator.userAgent || "";
        let brand = "Generic";
        let model = "Device";

        // Check modern Navigator UserAgentData (Android / Chrome)
        if (navigator.userAgentData) {
            if (navigator.userAgentData.platform) {
                brand = navigator.userAgentData.platform;
            }
        }

        // Comprehensive Phone Brand & Model Detection
        if (/iPhone/i.test(ua)) {
            brand = "Apple";
            model = "iPhone";
            const w = window.screen.width * (window.devicePixelRatio || 1);
            const h = window.screen.height * (window.devicePixelRatio || 1);
            if ((w === 1179 && h === 2556) || (w === 2556 && h === 1179)) model = "iPhone 15/14 Pro";
            else if ((w === 1290 && h === 2796) || (w === 2796 && h === 1290)) model = "iPhone 15/14 Pro Max";
            else if ((w === 1170 && h === 2532) || (w === 2532 && h === 1170)) model = "iPhone 14/13/12";
            else if ((w === 828 && h === 1792) || (w === 1792 && h === 828)) model = "iPhone 11/XR";
            else if ((w === 1242 && h === 2688) || (w === 2688 && h === 1242)) model = "iPhone XS/11 Pro Max";
            else if ((w === 1125 && h === 2436) || (w === 2436 && h === 1125)) model = "iPhone X/XS/11 Pro";
            else if ((w === 750 && h === 1334) || (w === 1334 && h === 750)) model = "iPhone SE/8/7";
        } else if (/iPad/i.test(ua)) {
            brand = "Apple";
            model = "iPad";
        } else if (/Samsung|SM-[A-Z0-9]+/i.test(ua)) {
            brand = "Samsung";
            const m = ua.match(/SM-[A-Z0-9]+/i);
            model = m ? `Galaxy (${m[0]})` : "Galaxy Phone";
        } else if (/Pixel/i.test(ua)) {
            brand = "Google";
            const m = ua.match(/Pixel\s*[0-9a-zA-Z\s]+/i);
            model = m ? m[0].trim() : "Pixel Phone";
        } else if (/Xiaomi|Redmi|POCO/i.test(ua)) {
            brand = "Xiaomi";
            const m = ua.match(/(Redmi|POCO|Mi)\s*[A-Za-z0-9\s]+/i);
            model = m ? m[0].trim() : "Redmi / Xiaomi";
        } else if (/Oppo|CPH[0-9]+/i.test(ua)) {
            brand = "Oppo";
            const m = ua.match(/CPH[0-9]+/i);
            model = m ? `Oppo (${m[0]})` : "Oppo Phone";
        } else if (/Vivo|V[0-9]{4}/i.test(ua)) {
            brand = "Vivo";
            model = "Vivo Phone";
        } else if (/Huawei|Honor/i.test(ua)) {
            brand = "Huawei";
            model = "Huawei / Honor";
        } else if (/OnePlus/i.test(ua)) {
            brand = "OnePlus";
            model = "OnePlus Phone";
        } else if (/Android/i.test(ua)) {
            brand = "Android";
            const m = ua.match(/Android[^;]+;\s*([^;)]+)/i);
            model = m && m[1] ? m[1].trim() : "Smartphone";
        } else if (/Macintosh|Mac OS X/i.test(ua)) {
            brand = "Apple";
            model = "Mac / Desktop";
        } else if (/Windows NT/i.test(ua)) {
            brand = "Windows";
            model = "PC / Desktop";
        } else if (/Linux/i.test(ua)) {
            brand = "Linux";
            model = "Device";
        }

        // Generate or retrieve persistent Hardware Serial ID / Fingerprint
        let hardwareSerial = null;
        try {
            hardwareSerial = localStorage.getItem("syncsphere_device_serial");
        } catch(e) {}

        if (!hardwareSerial) {
            try {
                const matches = document.cookie.match(/(?:^|; )syncsphere_device_serial=([^;]*)/);
                if (matches && matches[1]) hardwareSerial = matches[1];
            } catch(e) {}
        }

        if (!hardwareSerial) {
            let canvasHash = 0;
            try {
                const canvas = document.createElement("canvas");
                canvas.width = 160;
                canvas.height = 40;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.textBaseline = "top";
                    ctx.font = "14px 'Arial', sans-serif";
                    ctx.fillStyle = "#f60";
                    ctx.fillRect(10, 1, 62, 20);
                    ctx.fillStyle = "#069";
                    ctx.fillText("SyncSphere⚡", 2, 15);
                    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                    ctx.fillText("2026", 4, 17);
                    const dataUrl = canvas.toDataURL();
                    for (let i = 0; i < dataUrl.length; i++) {
                        canvasHash = (canvasHash << 5) - canvasHash + dataUrl.charCodeAt(i);
                        canvasHash |= 0;
                    }
                }
            } catch (e) {}

            let glRenderer = "generic";
            try {
                const glCanvas = document.createElement("canvas");
                const gl = glCanvas.getContext("webgl") || glCanvas.getContext("experimental-webgl");
                if (gl) {
                    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
                    if (debugInfo) {
                        glRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
                    }
                }
            } catch (e) {}

            const minDim = Math.min(screen.width || 360, screen.height || 640);
            const maxDim = Math.max(screen.width || 360, screen.height || 640);

            const hwString = [
                brand,
                model,
                minDim,
                maxDim,
                screen.colorDepth || 24,
                window.devicePixelRatio || 1,
                navigator.hardwareConcurrency || 4,
                navigator.maxTouchPoints || 0,
                canvasHash,
                glRenderer.slice(0, 30)
            ].join("|");

            let hash = 5381;
            for (let i = 0; i < hwString.length; i++) {
                hash = (hash * 33) ^ hwString.charCodeAt(i);
            }
            const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
            const brandCode = (brand.slice(0, 3) || "DEV").toUpperCase().replace(/[^A-Z]/g, "X");
            hardwareSerial = `SN-${brandCode}-${hexHash.slice(0, 4)}-${hexHash.slice(4, 8)}`;
            
            try {
                localStorage.setItem("syncsphere_device_serial", hardwareSerial);
                document.cookie = `syncsphere_device_serial=${hardwareSerial}; max-age=31536000; path=/; SameSite=Lax`;
            } catch(e) {}
        }

        return { brand, model, serial: hardwareSerial };
    }

    function detectReferrerSource() {
        const ref = (document.referrer || "").toLowerCase();
        const search = window.location.search.toLowerCase();
        if (ref.includes("instagram.com") || search.includes("instagram")) return "Instagram";
        if (ref.includes("tiktok.com") || search.includes("tiktok")) return "TikTok";
        if (ref.includes("facebook.com") || ref.includes("fb.com") || search.includes("facebook") || search.includes("fb")) return "Facebook";
        if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com") || search.includes("twitter")) return "X / Twitter";
        if (ref.includes("youtube.com") || ref.includes("youtu.be")) return "YouTube";
        if (ref.includes("threads.net")) return "Threads";
        if (ref.includes("whatsapp")) return "WhatsApp";
        if (ref.includes("telegram")) return "Telegram";
        if (ref.includes("reddit.com")) return "Reddit";
        if (ref) {
            try {
                return new URL(document.referrer).hostname.replace(/^www\./, "").slice(0, 20);
            } catch(e) {}
        }
        return "Social / Direct Link";
    }

    function getPersistentFlag(key) {
        try {
            if (localStorage.getItem(key) === "true") return true;
        } catch(e) {}
        try {
            const matches = document.cookie.match(new RegExp("(?:^|; )" + key + "=([^;]*)"));
            if (matches && matches[1] === "true") return true;
        } catch(e) {}
        return false;
    }

    function setPersistentFlag(key) {
        try {
            localStorage.setItem(key, "true");
        } catch(e) {}
        try {
            document.cookie = `${key}=true; max-age=31536000; path=/; SameSite=Lax`;
        } catch(e) {}
    }

    function animateViewCounter(element, start, end, duration = 1200) {
        if (!element) return;
        const startTime = performance.now();
        const startVal = Number(start) || 0;
        const endVal = Number(end) || 0;

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (endVal - startVal) * easeOut);
            element.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = endVal.toLocaleString();
            }
        }
        requestAnimationFrame(update);
    }

    async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    // Server-Side Device Verification Registry (Checks if this phone's hardware serial has EVER visited)
    async function checkIsDeviceRegisteredInCloud(serial) {
        const abacusCheck = `https://abacus.jasoncameron.dev/get/syncsphere_devices/${serial}`;
        const countapiCheck = `https://countapi.mileshilliard.com/api/v1/get/syncsphere_device_${serial}`;

        try {
            const res = await fetchWithTimeout(abacusCheck, { headers: { "Accept": "application/json" } });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.value === "number" && data.value >= 1) return true;
            }
            if (res.status === 404) return false;
        } catch(e) {}

        try {
            const res = await fetchWithTimeout(countapiCheck, { headers: { "Accept": "application/json" } });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.value === "number" && data.value >= 1) return true;
            }
            if (res.status === 404) return false;
        } catch(e) {}

        return false;
    }

    // Register this device's serial permanently in the cloud
    async function registerDeviceInCloud(serial) {
        const abacusRegister = `https://abacus.jasoncameron.dev/hit/syncsphere_devices/${serial}`;
        const countapiRegister = `https://countapi.mileshilliard.com/api/v1/hit/syncsphere_device_${serial}`;

        try {
            await fetchWithTimeout(abacusRegister, { headers: { "Accept": "application/json" } });
        } catch(e) {}
        try {
            await fetchWithTimeout(countapiRegister, { headers: { "Accept": "application/json" } });
        } catch(e) {}
    }

    // Get current global views without incrementing (for returning visitors / duplicates)
    async function getGlobalViewsCount() {
        const abacusGet = "https://abacus.jasoncameron.dev/get/syncsphere_live_views/total";
        const countapiGet = "https://countapi.mileshilliard.com/api/v1/get/syncsphere_official_total_views";

        try {
            const res = await fetchWithTimeout(abacusGet, { headers: { "Accept": "application/json" } });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.value === "number") return data.value;
            }
        } catch(e) {}

        try {
            const res = await fetchWithTimeout(countapiGet, { headers: { "Accept": "application/json" } });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.value === "number") return data.value;
            }
        } catch(e) {}

        return null;
    }

    // Increment global views ONLY ONCE per unique hardware device
    async function incrementGlobalViewsCount() {
        const abacusHit = "https://abacus.jasoncameron.dev/hit/syncsphere_live_views/total";
        const countapiHit = "https://countapi.mileshilliard.com/api/v1/hit/syncsphere_official_total_views";

        try {
            const res = await fetchWithTimeout(abacusHit, { headers: { "Accept": "application/json" } });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.value === "number") return data.value;
            }
        } catch(e) {}

        try {
            const res = await fetchWithTimeout(countapiHit, { headers: { "Accept": "application/json" } });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.value === "number") return data.value;
            }
        } catch(e) {}

        return null;
    }

    async function initRealTimeViews() {
        if (!viewCountEl) return;

        const device = analyzePhoneDevice();
        const source = detectReferrerSource();
        const storageKey = `syncsphere_view_recorded_${device.serial}`;

        // 1. Instant client-side duplicate check (localStorage & persistent cookie)
        let isKnownDuplicate = getPersistentFlag(storageKey) || getPersistentFlag("syncsphere_global_view_recorded");

        let cachedCount = 0;
        try {
            cachedCount = parseInt(localStorage.getItem("syncsphere_last_views") || "0", 10);
        } catch(e) {}

        if (cachedCount > 0) {
            viewCountEl.textContent = cachedCount.toLocaleString();
        }

        if (deviceInfoText) {
            if (isKnownDuplicate) {
                deviceInfoText.textContent = `${device.brand} ${device.model} [${device.serial}] • Verified (Duplicate prevented)`;
            } else {
                deviceInfoText.textContent = `Analyzing ${device.brand} ${device.model}...`;
            }
        }

        // 2. Server-Side Device Verification (Prevents duplicates across apps, private/incognito tabs, or cleared cache)
        if (!isKnownDuplicate) {
            const isRegisteredInCloud = await checkIsDeviceRegisteredInCloud(device.serial);
            if (isRegisteredInCloud) {
                isKnownDuplicate = true;
                // Sync to local storage so future page reloads are instantaneous
                setPersistentFlag(storageKey);
                setPersistentFlag("syncsphere_global_view_recorded");
            }
        }

        // 3. IF THIS DEVICE HAS ALREADY VISITED BEFORE:
        // STRICTLY PREVENT DUPLICATES! Never call increment!
        if (isKnownDuplicate) {
            const latestTotal = await getGlobalViewsCount();
            const finalCount = latestTotal !== null ? latestTotal : (cachedCount || 1);
            try {
                localStorage.setItem("syncsphere_last_views", String(finalCount));
            } catch(e) {}

            if (finalCount !== cachedCount && cachedCount > 0) {
                animateViewCounter(viewCountEl, cachedCount, finalCount, 600);
            } else {
                viewCountEl.textContent = finalCount.toLocaleString();
            }

            if (deviceInfoText) {
                deviceInfoText.textContent = `${device.brand} ${device.model} [${device.serial}] • Verified (Duplicate prevented)`;
            }
            return;
        }

        // 4. GENUINE FIRST-TIME VISIT FOR THIS DEVICE:
        // Immediately lock local flag so rapid reloads/clicks can never double-count
        setPersistentFlag(storageKey);
        setPersistentFlag("syncsphere_global_view_recorded");

        // Permanently record this phone's serial in the cloud registry
        registerDeviceInCloud(device.serial);

        // Increment global views in the cloud database
        const newTotal = await incrementGlobalViewsCount();
        const finalCount = newTotal !== null ? newTotal : (cachedCount + 1);

        try {
            localStorage.setItem("syncsphere_last_views", String(finalCount));
            localStorage.setItem("syncsphere_device_model", `${device.brand} ${device.model}`);
        } catch(e) {}

        animateViewCounter(viewCountEl, cachedCount, finalCount, 1200);

        if (deviceInfoText) {
            deviceInfoText.textContent = `${device.brand} ${device.model} • First View Recorded! (${source})`;
        }

        // Briefly show confirmation tooltip
        if (webViewsBadge) {
            webViewsBadge.classList.add("show_tip");
            setTimeout(() => {
                webViewsBadge.classList.remove("show_tip");
            }, 3800);
        }
    }

    if (webViewsBadge) {
        webViewsBadge.addEventListener("click", () => {
            webViewsBadge.classList.toggle("show_tip");
            setTimeout(() => {
                webViewsBadge.classList.remove("show_tip");
            }, 3800);
        });
    }

    initRealTimeViews();
});




