document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = nav.contains(event.target) || menuToggle.contains(event.target);
        if (!isClickInside && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });

    const timelineSections = document.querySelectorAll('.timeline-section');
    const navLinks = document.querySelectorAll('.timeline-nav a');

    // Hide all sections except the first one
    timelineSections.forEach((section, index) => {
        if (index !== 0) section.style.display = 'none';
    });

    // Add this function to scroll timelines to top on section change
    const scrollTimelinesToTop = () => {
        const timelines = document.querySelectorAll('.timeline');
        timelines.forEach(timeline => {
            timeline.scrollTop = 0; // Reset scroll position to top
        });
    };

    // Modify the click handler for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            timelineSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the selected section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).style.display = 'block';
            
            // Scroll the newly displayed timeline to top
            scrollTimelinesToTop();
        });
    });

    // Initial scroll to top for the default visible timeline
    scrollTimelinesToTop();

    // 只保留時間軸展開的處理
    const timelines = document.querySelectorAll('.timeline');
    
    const handleScroll = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const timeline = entry.target;
                setTimeout(() => {
                    timeline.classList.add('expanded');
                }, 300);
                observer.unobserve(timeline);
            }
        });
    };

    const observer = new IntersectionObserver(handleScroll, {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    });

    timelines.forEach(timeline => {
        observer.observe(timeline);
    });

    // 添加滾動監聽
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            timelines.forEach(timeline => {
                const rect = timeline.getBoundingClientRect();
                if (rect.bottom <= window.innerHeight * 1.2) {
                    timeline.classList.add('expanded');
                }
            });
        }, 100);
    });

    // Check for timeline overflow
    const checkTimelineOverflow = () => {
        const timelines = document.querySelectorAll('.timeline');
        timelines.forEach(timeline => {
            if (timeline.scrollHeight > timeline.clientHeight) {
                timeline.classList.add('has-overflow');
            } else {
                timeline.classList.remove('has-overflow');
            }
        });
    };

    // Initial check
    checkTimelineOverflow();

    // Check on content change
    const observerContentChange = new MutationObserver(checkTimelineOverflow);
    document.querySelectorAll('.timeline').forEach(timeline => {
        observerContentChange.observe(timeline, { 
            childList: true, 
            subtree: true 
        });
    });

    // Check on scroll
    document.querySelectorAll('.timeline').forEach(timeline => {
        timeline.addEventListener('scroll', () => {
            const isAtBottom = timeline.scrollHeight - timeline.scrollTop <= timeline.clientHeight + 50;
            if (isAtBottom) {
                timeline.classList.remove('has-overflow');
            } else {
                timeline.classList.add('has-overflow');
            }
        });
    });
}); 