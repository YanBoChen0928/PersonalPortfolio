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

    // Handle timeline expansion only
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

    // Add scroll listener
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

    // Date/Time Display functionality
    const dateTimeBtn = document.getElementById('date-time-button');
    const dateTimeOutput = document.getElementById('date-time-output');
    const dateRadio = document.getElementById('date-radio');
    
    // Function to format date as "Mon, Feb 1, 2025"
    function formatDate(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    
    // Function to format time as "08:10:56 PM"
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        hours = hours.toString().padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    }
    
    // Function to update date/time display
    function updateDateTime() {
        const now = new Date();
        dateTimeOutput.style.display = 'block'; // 显示输出段落
        if (dateRadio.checked) {
            dateTimeOutput.textContent = formatDate(now);
        } else {
            dateTimeOutput.textContent = formatTime(now);
        }
    }
    
    // Add click event listener to the button
    dateTimeBtn.addEventListener('click', updateDateTime);

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleText = themeToggleBtn.querySelector('span');
    const themeToggleIcon = themeToggleBtn.querySelector('i');

    // Function to apply theme
    function applyTheme(isDarkTheme) {
        // Apply theme to body
        document.body.classList.toggle('dark-theme', isDarkTheme);
        
        // Update button text and icon
        themeToggleText.textContent = isDarkTheme ? 'Light Mode' : 'Dark Mode';
        themeToggleIcon.classList.remove(isDarkTheme ? 'fa-moon' : 'fa-sun');
        themeToggleIcon.classList.add(isDarkTheme ? 'fa-sun' : 'fa-moon');
    }

    // Function to toggle theme
    function toggleTheme() {
        const isDarkTheme = !document.body.classList.contains('dark-theme');
        
        // Apply the theme
        applyTheme(isDarkTheme);
        
        // Save theme preference to localStorage
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }

    // Load saved theme preference
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme === 'dark');
        }
    }

    // Load theme when page loads
    loadSavedTheme();

    // Add click event listener
    themeToggleBtn.addEventListener('click', toggleTheme);
}); 