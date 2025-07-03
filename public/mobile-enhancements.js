// Mobile-specific JavaScript enhancements for Chainlit

(function() {
    'use strict';

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Wait for DOM to be ready
    function whenReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // Add mobile-specific classes
    function addMobileClasses() {
        document.documentElement.classList.add('js-enabled');
        if (isMobile) {
            document.documentElement.classList.add('mobile-device');
        }
        if (isTouch) {
            document.documentElement.classList.add('touch-device');
        }
    }

    // Optimize viewport for mobile
    function optimizeViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
    }

    // Prevent zoom on iOS when focusing inputs
    function preventIOSZoom() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea');
            inputs.forEach(input => {
                if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }
    }

    // Improve touch scrolling
    function improveTouchScrolling() {
        const scrollableElements = document.querySelectorAll('[data-scrollable], .cl-chat-container, .cl-messages');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.scrollBehavior = 'smooth';
        });
    }

    // Auto-resize textarea based on content
    function autoResizeTextarea() {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
        });
    }

    // Improve button touch feedback
    function improveTouchFeedback() {
        const buttons = document.querySelectorAll('button, .cl-button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    // Handle orientation changes
    function handleOrientationChange() {
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                // Recalculate viewport height
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                
                // Trigger reflow
                window.dispatchEvent(new Event('resize'));
            }, 100);
        });
    }

    // Set CSS custom property for real viewport height
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }

    // Observe DOM changes to apply enhancements to new elements
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Apply enhancements to new elements
                            const textareas = node.querySelectorAll('textarea');
                            textareas.forEach(textarea => {
                                textarea.addEventListener('input', function() {
                                    this.style.height = 'auto';
                                    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
                                });
                            });

                            const buttons = node.querySelectorAll('button, .cl-button');
                            buttons.forEach(button => {
                                button.addEventListener('touchstart', function() {
                                    this.classList.add('touch-active');
                                });
                                
                                button.addEventListener('touchend', function() {
                                    setTimeout(() => {
                                        this.classList.remove('touch-active');
                                    }, 150);
                                });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Smooth scroll to bottom for new messages
    function smoothScrollToBottom() {
        const chatContainer = document.querySelector('.cl-chat-container, .cl-messages');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    // Initialize all mobile enhancements
    function initMobileEnhancements() {
        addMobileClasses();
        optimizeViewport();
        setViewportHeight();
        
        if (isMobile || isTouch) {
            preventIOSZoom();
            improveTouchScrolling();
            autoResizeTextarea();
            improveTouchFeedback();
            handleOrientationChange();
            observeDOMChanges();
        }

        console.log('Mobile enhancements initialized');
    }

    // Add CSS for touch feedback
    function addTouchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .touch-active {
                opacity: 0.7;
                transform: scale(0.98);
                transition: all 0.1s ease;
            }
            
            .mobile-device .cl-input-container {
                padding-bottom: calc(var(--mobile-padding, 12px) + env(safe-area-inset-bottom, 0px));
            }
            
            .mobile-device .cl-chat-container {
                padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
            }
            
            /* Use real viewport height */
            .mobile-device {
                height: calc(var(--vh, 1vh) * 100);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when ready
    whenReady(() => {
        addTouchStyles();
        initMobileEnhancements();
    });

    // Export for potential external use
    window.ChainlitMobile = {
        isMobile,
        isTouch,
        smoothScrollToBottom,
        initMobileEnhancements
    };

})();