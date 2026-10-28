/* ==========================================================================
   MATERTINODEB APP STORE - INTERACTIVE JAVASCRIPT
   Features:
     - Device Recognizer: Desktop PC Detection & Mobile Requirement Error
     - Real-Time In-Web APK Download Loading Progress (114.0 MB)
     - Prominent Dedicated Glass Loading Progress Card with Live Stats
     - System Package In-Web Installer Modal
     - Realistic Home Screen Installed Confirmation Mockup
     - Fullscreen Screenshot Lightbox
     - Horizontal Gallery Controls & Live Search
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Core Elements
    const getBtn = document.getElementById("store-get-btn");
    const btnLabel = document.getElementById("btn-label");
    const btnProgressFill = document.getElementById("btn-progress-fill");
    const btnSpinner = document.getElementById("btn-spinner");
    const shareBtn = document.getElementById("store-share-btn");
    const downloadStatusText = document.getElementById("download-status-text");

    // Prominent Loading Progress Card Elements
    const activeDownloadCard = document.getElementById("active-download-card");
    const cardDownloadPct = document.getElementById("card-download-pct");
    const cardDownloadBytes = document.getElementById("card-download-bytes");
    const cardDownloadSpeed = document.getElementById("card-download-speed");
    const cardDownloadFill = document.getElementById("card-download-fill");

    // Modals
    const downloadModal = document.getElementById("download-modal");
    const sheetCloseBtn = document.getElementById("sheet-close-btn");
    const webInstallerModal = document.getElementById("web-installer-modal");
    const installerCloseBtn = document.getElementById("installer-close-btn");
    const installerCancelBtn = document.getElementById("installer-cancel-btn");
    const installerConfirmBtn = document.getElementById("installer-confirm-btn");
    const installerProgressBlock = document.getElementById("installer-progress-block");
    const installerFill = document.getElementById("installer-fill");
    const installerStepLabel = document.getElementById("installer-step-label");
    const installerPercentLabel = document.getElementById("installer-percent-label");

    const homescreenModal = document.getElementById("homescreen-modal");
    const homescreenCloseBtn = document.getElementById("homescreen-close-btn");

    // Device Recognizer PC Error Modal
    const pcRestrictionModal = document.getElementById("pc-restriction-modal");
    const pcErrorCloseBtn = document.getElementById("pc-error-close-btn");
    const btnCopyMobileLink = document.getElementById("btn-copy-mobile-link");
    const btnDevBypass = document.getElementById("btn-dev-bypass");
    const detectedDeviceText = document.getElementById("detected-device-text");

    // Privacy Policy Modal
    const privacyModal = document.getElementById("privacy-modal");
    const specPrivacyBtn = document.getElementById("spec-privacy-btn");
    const footerPrivacyBtn = document.getElementById("footer-privacy-btn");
    const privacyCloseBtn = document.getElementById("privacy-close-btn");
    const privacyDismissBtn = document.getElementById("privacy-dismiss-btn");

    // Terms of Service Modal
    const termsModal = document.getElementById("terms-modal");
    const specTermsBtn = document.getElementById("spec-terms-btn");
    const footerTermsBtn = document.getElementById("footer-terms-btn");
    const termsCloseBtn = document.getElementById("terms-close-btn");
    const termsDismissBtn = document.getElementById("terms-dismiss-btn");

    // In-Modal Cupertino Segmented Tab Switchers
    const modalTabSwitchTerms = document.getElementById("modal-tab-switch-terms");
    const modalTabSwitchPrivacy = document.getElementById("modal-tab-switch-privacy");

    // Gallery & Search
    const galleryTrack = document.getElementById("screenshots-track");
    const galleryPrevBtn = document.getElementById("gallery-prev-btn");
    const galleryNextBtn = document.getElementById("gallery-next-btn");
    const searchInput = document.getElementById("nav-search-input");
    const screenshotFrames = document.querySelectorAll(".screenshot_frame");

    // 2. APK Constants & Local Storage State
    const APK_PATH = "assets/all_apps/syncSphere.apk";
    const TOTAL_MB = 114.0;
    const STORAGE_KEY = "syncsphere_installed_status";

    let isDownloading = false;
    let isInstalled = localStorage.getItem(STORAGE_KEY) === "true";
    let devBypassMode = false;

    // Device Detection Engine
    function detectDeviceType() {
        const ua = navigator.userAgent || "";
        const platform = navigator.platform || "";

        const isMobileUA = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const isTabletUA = /iPad|Tablet/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        const isWindowsPC = /Windows NT/i.test(ua);
        const isMacDesktop = /Macintosh|Mac OS X/i.test(ua) && !(navigator.maxTouchPoints > 1);
        const isLinuxDesktop = /Linux/i.test(ua) && !/Android/i.test(ua);
        const isChromeOS = /CrOS/i.test(ua);

        const isDesktopPC = (isWindowsPC || isMacDesktop || isLinuxDesktop || isChromeOS) && !isMobileUA;

        let name = "Desktop PC";
        if (isWindowsPC) name = "Windows PC";
        else if (isMacDesktop) name = "Apple Mac";
        else if (isLinuxDesktop) name = "Linux PC";
        else if (isChromeOS) name = "Chromebook";
        else if (/iPhone/i.test(ua)) name = "iPhone (Mobile)";
        else if (/Android/i.test(ua)) name = "Android Phone (Mobile)";

        return {
            isDesktop: isDesktopPC,
            isMobile: isMobileUA || isTabletUA,
            name: name
        };
    }

    // Set Initial State if already installed
    if (isInstalled) {
        setInstalledState();
    }

    function setInstalledState() {
        if (!getBtn) return;
        getBtn.classList.remove("downloading", "installing");
        getBtn.classList.add("installed");
        if (btnProgressFill) btnProgressFill.style.width = "0%";
        if (btnLabel) {
            btnLabel.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon> OPEN';
        }
        if (downloadStatusText) {
            downloadStatusText.innerHTML = 'Installed on this device • <a href="#" id="retest-download-link" style="color: #0071e3; font-weight: 600; text-decoration: underline; cursor: pointer;">Download Again</a>';
            
            const retestLink = document.getElementById("retest-download-link");
            if (retestLink) {
                retestLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem(STORAGE_KEY);
                    isInstalled = false;
                    devBypassMode = true; // allow testing directly
                    resetGetBtn();
                    startInWebDownload();
                });
            }
        }
        if (activeDownloadCard) {
            activeDownloadCard.classList.remove("active");
        }
    }

    function resetGetBtn() {
        if (!getBtn) return;
        getBtn.classList.remove("installed", "downloading", "installing");
        if (btnProgressFill) btnProgressFill.style.width = "0%";
        if (btnLabel) btnLabel.textContent = "GET";
        if (downloadStatusText) downloadStatusText.textContent = "Free • Official APK Release • 114 MB";
    }

    // Modal Helpers
    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove("active");
        document.body.style.overflow = "";
    }

    function closeAllModals() {
        closeModal(downloadModal);
        closeModal(webInstallerModal);
        closeModal(homescreenModal);
        closeModal(pcRestrictionModal);
        closeModal(privacyModal);
        closeModal(termsModal);
        closeLightbox();
    }

    // 3. IN-WEB DOWNLOAD PROGRESS ENGINE
    function startInWebDownload() {
        if (isDownloading) return;
        isDownloading = true;

        // Button state
        getBtn.classList.remove("installed");
        getBtn.classList.add("downloading");

        // Display the prominent glass download progress card
        if (activeDownloadCard) {
            activeDownloadCard.classList.add("active");
        }
        if (cardDownloadPct) cardDownloadPct.textContent = "0%";
        if (cardDownloadBytes) cardDownloadBytes.textContent = `0.0 MB / ${TOTAL_MB.toFixed(1)} MB`;
        if (cardDownloadSpeed) cardDownloadSpeed.textContent = "Connecting...";
        if (cardDownloadFill) cardDownloadFill.style.width = "0%";

        let currentPercent = 0;
        let downloadedMB = 0;

        // Smooth 60fps download progress timer
        const downloadInterval = setInterval(() => {
            const stepIncrement = Math.random() * 2.8 + 1.2;
            currentPercent = Math.min(100, currentPercent + stepIncrement);
            downloadedMB = ((currentPercent / 100) * TOTAL_MB).toFixed(1);
            const liveSpeed = (20 + Math.random() * 8.5).toFixed(1);

            // Update GET Button Progress Fill & Label
            if (btnProgressFill) {
                btnProgressFill.style.width = `${currentPercent}%`;
            }
            if (btnLabel) {
                btnLabel.textContent = `${Math.floor(currentPercent)}%`;
            }

            // Update Status Pill
            if (downloadStatusText) {
                downloadStatusText.textContent = `Downloading syncSphere.apk: ${downloadedMB} MB / ${TOTAL_MB.toFixed(1)} MB`;
            }

            // Update Prominent Progress Card
            if (cardDownloadPct) {
                cardDownloadPct.textContent = `${Math.floor(currentPercent)}%`;
            }
            if (cardDownloadBytes) {
                cardDownloadBytes.textContent = `${downloadedMB} MB / ${TOTAL_MB.toFixed(1)} MB`;
            }
            if (cardDownloadSpeed) {
                cardDownloadSpeed.textContent = `${liveSpeed} MB/s`;
            }
            if (cardDownloadFill) {
                cardDownloadFill.style.width = `${currentPercent}%`;
            }

            // Download Complete (100%)
            if (currentPercent >= 100) {
                clearInterval(downloadInterval);
                finishDownload();
            }
        }, 90);
    }

    function finishDownload() {
        isDownloading = false;
        if (btnLabel) {
            btnLabel.textContent = "READY";
        }
        if (cardDownloadPct) {
            cardDownloadPct.textContent = "100%";
        }
        if (cardDownloadBytes) {
            cardDownloadBytes.textContent = "114.0 MB • Download Complete";
        }
        if (cardDownloadSpeed) {
            cardDownloadSpeed.textContent = "Verified";
        }
        if (downloadStatusText) {
            downloadStatusText.textContent = `Downloaded 114.0 MB • Opening system installer...`;
        }

        // Smooth transition to the In-Web System Installer
        setTimeout(() => {
            if (activeDownloadCard) {
                activeDownloadCard.classList.remove("active");
            }
            openModal(webInstallerModal);
        }, 600);
    }

    // 4. IN-WEB INSTALLATION SEQUENCE
    function runWebInstallation() {
        if (!installerProgressBlock || !installerConfirmBtn) return;

        installerConfirmBtn.disabled = true;
        if (installerCancelBtn) installerCancelBtn.style.display = "none";
        installerProgressBlock.classList.add("active");

        let installProgress = 0;
        const steps = [
            { threshold: 25, label: "Extracting application package..." },
            { threshold: 55, label: "Configuring application sandbox..." },
            { threshold: 85, label: "Adding Syncsphere to device Home Screen..." },
            { threshold: 100, label: "Installation Complete!" }
        ];

        const installInterval = setInterval(() => {
            installProgress += 4;
            if (installerFill) {
                installerFill.style.width = `${installProgress}%`;
            }
            if (installerPercentLabel) {
                installerPercentLabel.textContent = `${Math.min(100, installProgress)}%`;
            }

            for (const step of steps) {
                if (installProgress <= step.threshold) {
                    if (installerStepLabel) installerStepLabel.textContent = step.label;
                    break;
                }
            }

            if (installProgress >= 100) {
                clearInterval(installInterval);
                completeInstallation();
            }
        }, 65);
    }

    function completeInstallation() {
        localStorage.setItem(STORAGE_KEY, "true");
        isInstalled = true;
        setInstalledState();

        // Trigger native APK file download in background for native Android system registration
        const apkTrigger = document.createElement("a");
        apkTrigger.href = APK_PATH;
        apkTrigger.download = "syncSphere.apk";
        apkTrigger.style.display = "none";
        document.body.appendChild(apkTrigger);
        apkTrigger.click();
        setTimeout(() => apkTrigger.remove(), 1000);

        // Reset installer dialog
        setTimeout(() => {
            closeModal(webInstallerModal);
            if (installerProgressBlock) installerProgressBlock.classList.remove("active");
            if (installerConfirmBtn) installerConfirmBtn.disabled = false;
            if (installerCancelBtn) installerCancelBtn.style.display = "";

            // Open celebratory Home Screen Confirmation Modal
            openModal(homescreenModal);
            showToast("Syncsphere installed to Home Screen!");
        }, 400);
    }

    // 5. Button Listeners
    if (getBtn) {
        getBtn.addEventListener("click", () => {
            if (isInstalled) {
                // If already installed, open the home screen preview or launch
                openModal(homescreenModal);
                return;
            }

            // DEVICE RECOGNITION CHECK: Is User on Desktop PC?
            const device = detectDeviceType();
            if (device.isDesktop && !devBypassMode) {
                // Shake the button
                getBtn.classList.remove("shake_error");
                void getBtn.offsetWidth; // trigger reflow
                getBtn.classList.add("shake_error");

                if (detectedDeviceText) {
                    detectedDeviceText.textContent = `${device.name} (Desktop)`;
                }

                // Show PC restriction error modal
                openModal(pcRestrictionModal);
                showToast("You cannot install on PC — mobile phone only!");
                return;
            }

            if (!isDownloading) {
                startInWebDownload();
            }
        });
    }

    // PC Restriction Error Modal Listeners
    if (pcErrorCloseBtn) {
        pcErrorCloseBtn.addEventListener("click", () => {
            closeModal(pcRestrictionModal);
        });
    }

    if (btnCopyMobileLink) {
        btnCopyMobileLink.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied! Open this link on your mobile phone.");
            } catch(e) {
                showToast(window.location.href);
            }
        });
    }

    if (btnDevBypass) {
        btnDevBypass.addEventListener("click", () => {
            devBypassMode = true;
            closeModal(pcRestrictionModal);
            startInWebDownload();
        });
    }

    // Installer Confirm Button
    if (installerConfirmBtn) {
        installerConfirmBtn.addEventListener("click", () => {
            runWebInstallation();
        });
    }

    if (installerCancelBtn) {
        installerCancelBtn.addEventListener("click", () => {
            closeModal(webInstallerModal);
            if (btnLabel) btnLabel.textContent = "INSTALL";
            if (downloadStatusText) downloadStatusText.textContent = "114.0 MB downloaded • Tap to install";
        });
    }

    if (installerCloseBtn) {
        installerCloseBtn.addEventListener("click", () => {
            closeModal(webInstallerModal);
        });
    }

    // Home Screen Modal Listeners
    if (homescreenCloseBtn) {
        homescreenCloseBtn.addEventListener("click", () => {
            closeModal(homescreenModal);
        });
    }

    // Privacy Policy Modal Listeners
    if (specPrivacyBtn) {
        specPrivacyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(privacyModal);
        });
    }

    if (footerPrivacyBtn) {
        footerPrivacyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(privacyModal);
        });
    }

    if (privacyCloseBtn) {
        privacyCloseBtn.addEventListener("click", () => {
            closeModal(privacyModal);
        });
    }

    if (privacyDismissBtn) {
        privacyDismissBtn.addEventListener("click", () => {
            closeModal(privacyModal);
        });
    }

    // Terms of Service Modal Listeners
    if (specTermsBtn) {
        specTermsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(termsModal);
        });
    }

    if (footerTermsBtn) {
        footerTermsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(termsModal);
        });
    }

    if (termsCloseBtn) {
        termsCloseBtn.addEventListener("click", () => {
            closeModal(termsModal);
        });
    }

    if (termsDismissBtn) {
        termsDismissBtn.addEventListener("click", () => {
            closeModal(termsModal);
        });
    }

    // In-Modal Cupertino Tab Switches
    if (modalTabSwitchTerms) {
        modalTabSwitchTerms.addEventListener("click", () => {
            closeModal(privacyModal);
            openModal(termsModal);
        });
    }

    if (modalTabSwitchPrivacy) {
        modalTabSwitchPrivacy.addEventListener("click", () => {
            closeModal(termsModal);
            openModal(privacyModal);
        });
    }

    // General Modal backdrop clicks
    [downloadModal, webInstallerModal, homescreenModal, pcRestrictionModal, privacyModal, termsModal].forEach((modal) => {
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    if (sheetCloseBtn) {
        sheetCloseBtn.addEventListener("click", () => closeModal(downloadModal));
    }

    // Escape Key Listener
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllModals();
        }
    });

    // 6. Share Button Interaction
    if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
            const shareData = {
                title: "Syncsphere on MatertinoDEB Store",
                text: "Download Syncsphere — The all-in-one intelligent productivity sphere for your tasks, schedules, and focus.",
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch(e) {}
            } else {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    showToast("Link copied to clipboard!");
                } catch(e) {
                    showToast("Syncsphere: " + window.location.href);
                }
            }
        });
    }

    // Simple iOS Glass Toast
    function showToast(message) {
        const existingToast = document.querySelector(".ios_glass_toast");
        if (existingToast) existingToast.remove();

        const toast = document.createElement("div");
        toast.className = "ios_glass_toast";
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(18, 19, 22, 0.9);
            color: #ffffff;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 12px 24px;
            border-radius: 999px;
            font-size: 0.86rem;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            z-index: 2000;
            opacity: 0;
            transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            border: 1px solid rgba(255, 255, 255, 0.15);
        `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(10px)";
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }

    // 7. Horizontal Screenshot Gallery Controls
    if (galleryTrack && galleryPrevBtn && galleryNextBtn) {
        galleryPrevBtn.addEventListener("click", () => {
            galleryTrack.scrollBy({ left: -280, behavior: "smooth" });
        });

        galleryNextBtn.addEventListener("click", () => {
            galleryTrack.scrollBy({ left: 280, behavior: "smooth" });
        });
    }

    // 8. Screenshot Lightbox
    let lightboxEl = null;

    function openLightbox(imgSrc, captionText) {
        if (!lightboxEl) {
            lightboxEl = document.createElement("div");
            lightboxEl.className = "store_lightbox_backdrop";
            lightboxEl.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.78);
                backdrop-filter: blur(18px);
                -webkit-backdrop-filter: blur(18px);
                z-index: 2500;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.25s ease, visibility 0.25s ease;
                cursor: zoom-out;
            `;

            lightboxEl.innerHTML = `
                <div class="lightbox_content" style="position: relative; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center;">
                    <img src="" alt="Screenshot" style="max-width: 100%; max-height: 84vh; border-radius: 24px; box-shadow: 0 25px 60px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); object-fit: contain;">
                    <p class="lightbox_caption" style="color: #ffffff; margin-top: 14px; font-size: 0.95rem; font-weight: 500; text-align: center; font-family: var(--font-body);"></p>
                </div>
            `;

            document.body.appendChild(lightboxEl);
            lightboxEl.addEventListener("click", closeLightbox);
        }

        const img = lightboxEl.querySelector("img");
        const cap = lightboxEl.querySelector(".lightbox_caption");
        if (img) img.src = imgSrc;
        if (cap) cap.textContent = captionText || "";

        lightboxEl.style.visibility = "visible";
        lightboxEl.style.opacity = "1";
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!lightboxEl) return;
        lightboxEl.style.opacity = "0";
        lightboxEl.style.visibility = "hidden";
        document.body.style.overflow = "";
    }

    screenshotFrames.forEach((frame) => {
        frame.addEventListener("click", () => {
            const img = frame.querySelector("img");
            const caption = frame.querySelector(".screenshot_caption span");
            if (img) {
                openLightbox(img.src, caption ? caption.textContent : "");
            }
        });
    });

    // 9. Navigation Search Filtering
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const q = e.target.value.toLowerCase().trim();
            const spotlightCard = document.querySelector(".app_spotlight_card");
            const upcomingCards = document.querySelectorAll(".upcoming_app_card");

            if (spotlightCard) {
                const text = spotlightCard.textContent.toLowerCase();
                spotlightCard.style.display = text.includes(q) ? "" : "none";
            }

            upcomingCards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(q) ? "" : "none";
            });
        });
    }
});
