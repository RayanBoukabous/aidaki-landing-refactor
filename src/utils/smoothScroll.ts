/**
 * Enhanced smooth scroll utility with custom easing
 * Provides a more controlled and pleasant scrolling experience
 */

export const smoothScrollTo = (elementId: string, offset: number = 80) => {
    const element = document.querySelector(elementId);
    if (!element) return;

    const headerHeight = offset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    // Custom easing function for smoother animation
    const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) * 0.6, 1000); // Max 1s duration, slower multiplier
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo({
            top: startPosition + distance * ease,
            behavior: 'auto' // Disable default smooth behavior to use our custom one
        });

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    };

    requestAnimationFrame(animation);
};

/**
 * Smooth scroll to top with easing
 */
export const smoothScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = Math.min(Math.abs(distance) * 0.5, 800); // Max 0.8s duration

    const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    let startTime: number | null = null;

    const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo({
            top: startPosition + distance * ease,
            behavior: 'auto'
        });

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    };

    requestAnimationFrame(animation);
};

