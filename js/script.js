document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const createMobileMenu = () => {
        // Create mobile menu trigger button
        const mobileMenuTrigger = document.createElement('div');
        mobileMenuTrigger.className = 'mobile-trigger';
        mobileMenuTrigger.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(mobileMenuTrigger);
        
        // Get the sidebar element
        const sidebar = document.querySelector('.sidebar');
        
        // Add click event to mobile trigger
        mobileMenuTrigger.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            this.innerHTML = sidebar.classList.contains('show') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && !mobileMenuTrigger.contains(event.target)) {
                sidebar.classList.remove('show');
                mobileMenuTrigger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    };
    
    // Right sidebar toggle for medium screens
    const createRightSidebarToggle = () => {
        // Only create if it doesn't exist and the viewport is appropriate
        if (window.innerWidth <= 1200 && !document.querySelector('.right-trigger')) {
            // Create right sidebar trigger button
            const rightSidebarTrigger = document.createElement('div');
            rightSidebarTrigger.className = 'right-trigger';
            rightSidebarTrigger.innerHTML = '<i class="fas fa-list-ul"></i>';
            document.body.appendChild(rightSidebarTrigger);
            
            // Get the right sidebar element
            const rightSidebar = document.querySelector('.right-sidebar');
            
            // Add click event to right sidebar trigger
            rightSidebarTrigger.addEventListener('click', function() {
                rightSidebar.classList.toggle('show');
                this.innerHTML = rightSidebar.classList.contains('show') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-list-ul"></i>';
            });
            
            // Close right sidebar when clicking outside
            document.addEventListener('click', function(event) {
                if (!rightSidebar.contains(event.target) && !rightSidebarTrigger.contains(event.target)) {
                    rightSidebar.classList.remove('show');
                    rightSidebarTrigger.innerHTML = '<i class="fas fa-list-ul"></i>';
                }
            });
        }
    };
    
    // TOC highlighting based on scroll position
    const setupTOCHighlighting = () => {
        const tocLinks = document.querySelectorAll('.toc-list a');
        if (tocLinks.length === 0) return;
        
        const headings = Array.from(tocLinks).map(link => {
            const id = link.getAttribute('href').substring(1);
            return document.getElementById(id);
        }).filter(Boolean);
        
        const highlightTOC = () => {
            // Get current scroll position with buffer
            const scrollPosition = window.scrollY + 100;
            
            // Find the current heading
            let currentHeading = headings[0];
            
            for (let heading of headings) {
                if (heading.offsetTop <= scrollPosition) {
                    currentHeading = heading;
                } else {
                    break;
                }
            }
            
            // Remove all active classes
            tocLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current heading's link
            if (currentHeading) {
                const id = currentHeading.getAttribute('id');
                const activeLink = document.querySelector(`.toc-list a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        };
        
        // Initial highlight
        highlightTOC();
        
        // Highlight on scroll
        window.addEventListener('scroll', highlightTOC);
    };
    
    // Modal functionality for project previews
    const setupProjectModals = () => {
        const modal = document.getElementById('projectModal');
        const modalClose = document.getElementById('modalClose');
        const modalTitle = document.getElementById('modalTitle');
        const modalIframe = document.getElementById('modalIframe');
        const modalLoading = document.getElementById('modalLoading');
        const previewButtons = document.querySelectorAll('.btn-live-preview');
        
        if (!modal || previewButtons.length === 0) return;
        
        // Open modal with project preview
        previewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const projectUrl = this.getAttribute('data-project-url');
                const projectTitle = this.getAttribute('data-project-title');
                
                if (projectUrl && projectUrl !== '#') {
                    // Show loading spinner
                    modalLoading.classList.remove('hidden');
                    
                    // Set iframe source
                    modalIframe.src = projectUrl;
                    
                    // Set modal title
                    modalTitle.textContent = projectTitle || 'Project Preview';
                    
                    // Show modal
                    modal.classList.add('active');
                    
                    // Disable page scrolling
                    document.body.style.overflow = 'hidden';
                    
                    // Hide loading spinner when iframe loads
                    modalIframe.onload = function() {
                        modalLoading.classList.add('hidden');
                    };
                }
            });
        });
        
        // Close modal
        modalClose.addEventListener('click', function() {
            closeModal();
        });
        
        // Close modal when clicking outside of it
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Function to close the modal
        function closeModal() {
            modal.classList.remove('active');
            
            // Reset iframe after animation completes
            setTimeout(() => {
                modalIframe.src = 'about:blank';
                modalLoading.classList.remove('hidden');
            }, 300);
            
            // Re-enable page scrolling
            document.body.style.overflow = '';
        }
    };
    
    // Call the mobile menu function for screens smaller than 768px
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
    
    // Call the right sidebar toggle for medium screens
    if (window.innerWidth <= 1200 && window.innerWidth > 768) {
        createRightSidebarToggle();
    }
    
    // Setup TOC highlighting
    setupTOCHighlighting();
    
    // Setup project modals
    setupProjectModals();
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            // Only create mobile menu if it doesn't exist
            if (!document.querySelector('.mobile-trigger')) {
                createMobileMenu();
            }
        } else {
            // Remove mobile menu if it exists
            const trigger = document.querySelector('.mobile-trigger');
            if (trigger) {
                trigger.remove();
            }
            // Make sure sidebar is visible on desktop
            document.querySelector('.sidebar').classList.remove('show');
        }
        
        if (window.innerWidth <= 1200 && window.innerWidth > 768) {
            createRightSidebarToggle();
        } else {
            // Remove right trigger if it exists and not needed
            const rightTrigger = document.querySelector('.right-trigger');
            if (rightTrigger) {
                rightTrigger.remove();
            }
        }
    });
    
    // Active link highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.substring(currentPath.lastIndexOf('/') + 1)) {
            link.classList.add('active');
        } else if (currentPath === '/' && link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        }
    });
}); 