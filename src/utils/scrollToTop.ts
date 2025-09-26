/**
 * Comprehensive scroll-to-top utility that works across all devices and browsers
 */
export const forceScrollToTop = () => {
  // Method 1: Standard window.scrollTo with instant behavior
  if (window.scrollTo) {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (e) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }
  
  // Method 2: Direct window scroll property assignment
  if (window.pageYOffset !== undefined) {
    window.pageYOffset = 0;
  }
  if (window.pageXOffset !== undefined) {
    window.pageXOffset = 0;
  }
  
  // Method 3: Document element scroll
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  }
  
  // Method 4: Body scroll
  if (document.body) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }
  
  // Method 5: Root element scroll
  const root = document.getElementById('root');
  if (root) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
  }
  
  // Method 6: iOS Safari specific handling
  if (navigator.userAgent.includes('Safari') && navigator.userAgent.includes('Mobile')) {
    // Handle iOS Safari bounce scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = '0px';
    document.body.style.width = '100%';
    
    // Reset after a brief moment
    setTimeout(() => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    }, 10);
  }
  
  // Method 7: Handle any scrollable containers
  const scrollableSelectors = [
    '[data-scroll-container]',
    '.overflow-auto',
    '.overflow-y-auto', 
    '.overflow-x-auto',
    '.overflow-scroll',
    '.h-screen',
    '.min-h-screen'
  ];
  
  scrollableSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      }
    });
  });
  
  // Method 8: Force repaint
  if (document.body) {
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }
};

/**
 * Execute scroll to top with multiple timing strategies
 */
export const executeScrollToTop = () => {
  // Immediate execution
  forceScrollToTop();
  
  // Execute on next tick
  setTimeout(forceScrollToTop, 0);
  
  // Execute after 10ms (for immediate async operations)
  setTimeout(forceScrollToTop, 10);
  
  // Execute after 50ms (for component mounting)
  setTimeout(forceScrollToTop, 50);
  
  // Execute after 100ms (for slower async operations)
  setTimeout(forceScrollToTop, 100);
  
  // Execute after 200ms (final fallback)
  setTimeout(forceScrollToTop, 200);
};