// ============================================
// COURSE SELECTION PAGE - JAVASCRIPT
// ============================================

// Store favorites in localStorage
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Store current selected course for checkout
let currentSelectedCourse = null;

// Store filter choices
let currentCategory = 'All';
let showSavedOnly = false;

// Course prices (in USD)
const coursePrices = {
    'Introduction to Web Development': 299,
    'Data Science Fundamentals': 399,
    'Mobile App Development': 449,
    'Cloud Computing Essentials': 349,
    'Advanced Python Programming': 399,
    'Database Design & SQL': 349,
    'Cybersecurity Fundamentals': 449,
    'UI/UX Design Principles': 299,
    'Artificial Intelligence Basics': 499
};

// Initialize favorite buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFavorites();
    updateCourseCount();
    loadTheme();
    setupSmoothScrolling();
    setupBackToTopButton();
});

// ============================================
// SELECT COURSE FUNCTION
// ============================================
// When user clicks "Select" button, display course details
function selectCourse(button, courseName, courseCode, description, instructor, credits, schedule, prerequisites, outcomes) {
    // Remove selected class from all cards
    const allCards = document.querySelectorAll('.course-card');
    allCards.forEach(card => card.classList.remove('selected'));

    // Add selected class to clicked card
    button.closest('.course-card').classList.add('selected');

    // Store current selected course for checkout
    currentSelectedCourse = {
        name: courseName,
        code: courseCode,
        description: description,
        instructor: instructor,
        credits: credits,
        schedule: schedule,
        prerequisites: prerequisites,
        outcomes: outcomes,
        price: coursePrices[courseName] || 299
    };

    // Get the display element
    const courseDisplay = document.getElementById('courseDisplay');

    // Create HTML for the selected course with all details, checkout button, and info button
    const courseHTML = `
        <h3>${courseName}</h3>
        <p><strong>Course Code:</strong> ${courseCode}</p>
        <p><strong>Credits:</strong> ${credits}</p>
        <p><strong>Schedule:</strong> ${schedule}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Instructor:</strong> ${instructor}</p>
        <p style="color: #5c8d55; margin-top: 1rem;"><strong>Course successfully selected.</strong></p>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
            <button class="checkout-btn" onclick="openCheckout()">Proceed to Checkout</button>
            <button class="info-btn" onclick="openCourseDetails()">View Details</button>
        </div>
    `;

    // Update the display with animation
    courseDisplay.innerHTML = courseHTML;
}

// ============================================
// CLEAR SELECTION FUNCTION
// ============================================
// Clear the selected course display
function clearSelection() {
    // Remove selected class from all cards
    const allCards = document.querySelectorAll('.course-card');
    allCards.forEach(card => card.classList.remove('selected'));

    // Reset the display
    const courseDisplay = document.getElementById('courseDisplay');
    courseDisplay.innerHTML = '<p>No course selected yet. Click "Select" on a course below.</p>';
}

// ============================================
// FILTER COURSES FUNCTION
// ============================================
// Search and filter courses by name, level, and saved status
function filterCourses() {
    // Get the search input value and convert to lowercase
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    
    // Get all course cards
    const courseCards = document.querySelectorAll('.course-card');
    let visibleCount = 0;

    // Loop through each course card
    courseCards.forEach(card => {
        // Get the course name from the h3 element
        const courseName = card.querySelector('h3').textContent.toLowerCase();
        const courseCode = card.querySelector('.course-code').textContent.toLowerCase();
        const difficulty = card.querySelector('.difficulty').textContent;
        const isSaved = card.querySelector('.fav-btn').classList.contains('favorited');

        const matchesSearch = courseName.includes(searchTerm) || courseCode.includes(searchTerm);
        const matchesCategory = currentCategory === 'All' || difficulty === currentCategory;
        const matchesSaved = !showSavedOnly || isSaved;

        // Show card only when it matches all filters
        if (matchesSearch && matchesCategory && matchesSaved) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update the count of matching courses
    document.getElementById('matchCount').textContent = visibleCount;
}

// Change the category filter
function setCategoryFilter(category, button) {
    currentCategory = category;

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    filterCourses();
}

// Show only saved courses or show all courses again
function toggleSavedOnly() {
    showSavedOnly = !showSavedOnly;

    const savedButton = document.getElementById('savedOnlyBtn');

    if (showSavedOnly) {
        savedButton.textContent = 'Show All Courses';
        savedButton.classList.add('active');
    } else {
        savedButton.textContent = 'Show Saved Courses Only';
        savedButton.classList.remove('active');
    }

    filterCourses();
}

// ============================================
// TOGGLE FAVORITE FUNCTION
// ============================================
// Add or remove course from favorites
function toggleFavorite(event) {
    event.preventDefault();
    
    // Get the favorite button
    const favBtn = event.target;
    const courseCard = favBtn.closest('.course-card');
    const courseName = courseCard.querySelector('h3').textContent;

    // Toggle the favorited class
    favBtn.classList.toggle('favorited');

    // Add or remove from favorites array
    if (favBtn.classList.contains('favorited')) {
        favBtn.textContent = 'Saved';
        if (!favorites.includes(courseName)) {
            favorites.push(courseName);
        }
    } else {
        favBtn.textContent = 'Save';
        const index = favorites.indexOf(courseName);
        if (index > -1) {
            favorites.splice(index, 1);
        }
    }

    // Save favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    filterCourses();
}

// ============================================
// LOAD FAVORITES FROM STORAGE
// ============================================
// Restore favorite status from localStorage on page load
function loadFavorites() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const courseName = card.querySelector('h3').textContent;
        const favBtn = card.querySelector('.fav-btn');

        // If course is in favorites, mark it as favorited
        if (favorites.includes(courseName)) {
            favBtn.classList.add('favorited');
            favBtn.textContent = 'Saved';
        }
    });
}

// ============================================
// UPDATE COURSE COUNT
// ============================================
// Display total number of courses
function updateCourseCount() {
    const totalCourses = document.querySelectorAll('.course-card').length;
    document.getElementById('courseCount').textContent = totalCourses;
    document.getElementById('matchCount').textContent = totalCourses;
}

// ============================================
// CHECKOUT MODAL FUNCTIONS
// ============================================

// Open checkout modal
function openCheckout() {
    if (!currentSelectedCourse) {
        alert('Please select a course first!');
        return;
    }

    // Show the modal
    document.getElementById('checkoutModal').style.display = 'block';

    // Populate course summary
    const summary = `
        <p><strong>Course:</strong> ${currentSelectedCourse.name}</p>
        <p><strong>Course Code:</strong> ${currentSelectedCourse.code}</p>
        <p><strong>Credits:</strong> ${currentSelectedCourse.credits}</p>
        <p><strong>Price per Credit:</strong> $${Math.round(currentSelectedCourse.price / currentSelectedCourse.credits)}</p>
    `;
    document.getElementById('checkoutSummary').innerHTML = summary;

    // Calculate and display prices
    const coursePrice = currentSelectedCourse.price;
    const tax = coursePrice * 0.10;
    const total = coursePrice + tax;

    document.getElementById('coursePrice').textContent = '$' + coursePrice.toFixed(2);
    document.getElementById('taxPrice').textContent = '$' + tax.toFixed(2);
    document.getElementById('totalPrice').textContent = '$' + total.toFixed(2);
}

// Close checkout modal
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Complete checkout and process payment
function completeCheckout() {
    // Get form values
    const studentName = document.getElementById('studentName').value.trim();
    const studentEmail = document.getElementById('studentEmail').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // Simple validation
    if (!studentName || !studentEmail || !studentId) {
        alert('Please fill in all student information!');
        return;
    }

    if (!isValidEmail(studentEmail)) {
        alert('Please enter a valid student email address.');
        return;
    }

    if (!cardName || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all billing information!');
        return;
    }

    // Validate card details
    if (!isValidCardNumber(cardNumber)) {
        alert('Card number must contain exactly 16 digits.');
        return;
    }

    if (!isValidExpiry(expiry)) {
        alert('Expiry date must be in MM/YY format.');
        return;
    }

    if (!isValidCVV(cvv)) {
        alert('CVV must be 3 digits!');
        return;
    }

    // Success message
    const coursePrice = currentSelectedCourse.price;
    const tax = coursePrice * 0.10;
    const total = coursePrice + tax;

    // Show success message
    alert(`Payment Successful!\n\nCourse: ${currentSelectedCourse.name}\nStudent: ${studentName}\nTotal Paid: $${total.toFixed(2)}\n\nThank you for enrolling!`);

    // Close modal
    closeCheckout();

    // Clear forms
    document.getElementById('studentForm').reset();
    document.getElementById('billingForm').reset();

    // Clear selection
    clearSelection();
}

// ============================================
// COURSE DETAILS MODAL FUNCTIONS
// ============================================

// Open course details modal
function openCourseDetails() {
    if (!currentSelectedCourse) {
        alert('Please select a course first!');
        return;
    }

    // Show the modal
    document.getElementById('courseDetailsModal').style.display = 'block';

    // Create detailed course information HTML
    const outcomesList = currentSelectedCourse.outcomes
        .split(', ')
        .map(item => `<li>${item}</li>`)
        .join('');

    const prerequisites = currentSelectedCourse.prerequisites || 'None';

    const detailsHTML = `
        <h2>${currentSelectedCourse.name}</h2>
        
        <!-- Course Header Info -->
        <div class="details-header">
            <div class="detail-item">
                <strong>Course Code:</strong> ${currentSelectedCourse.code}
            </div>
            <div class="detail-item">
                <strong>Credits:</strong> ${currentSelectedCourse.credits}
            </div>
            <div class="detail-item">
                <strong>Difficulty:</strong> <span class="difficulty-badge">${getDifficulty(currentSelectedCourse.code)}</span>
            </div>
        </div>

        <!-- Overview Section -->
        <div class="detail-section">
            <h3>Course Overview</h3>
            <p>${currentSelectedCourse.description}</p>
        </div>

        <!-- Instructor Section -->
        <div class="detail-section">
            <h3>Instructor Information</h3>
            <p><strong>Instructor:</strong> ${currentSelectedCourse.instructor}</p>
            <p><strong>Office Hours:</strong> By appointment (Email: ${currentSelectedCourse.instructor.toLowerCase().replace(/[^a-z]/g, '')}@university.edu)</p>
        </div>

        <!-- Schedule Section -->
        <div class="detail-section">
            <h3>Schedule</h3>
            <p><strong>Meeting Times:</strong> ${currentSelectedCourse.schedule}</p>
            <p><strong>Location:</strong> Building A, Room ${getRandomRoom()}</p>
            <p><strong>Semester:</strong> Spring 2026</p>
        </div>

        <!-- Prerequisites Section -->
        <div class="detail-section">
            <h3>Prerequisites</h3>
            <p>${prerequisites}</p>
        </div>

        <!-- Learning Outcomes Section -->
        <div class="detail-section">
            <h3>Learning Outcomes</h3>
            <p>Upon successful completion of this course, students will be able to:</p>
            <ul class="outcomes-list">
                ${outcomesList}
            </ul>
        </div>

        <!-- Course Topics Section -->
        <div class="detail-section">
            <h3>Course Topics</h3>
            <ul class="topics-list">
                <li>Fundamentals and Core Concepts</li>
                <li>Intermediate Techniques and Practices</li>
                <li>Advanced Applications and Case Studies</li>
                <li>Industry Best Practices and Standards</li>
                <li>Hands-on Project Work</li>
            </ul>
        </div>

        <!-- Assessment Section -->
        <div class="detail-section">
            <h3>Assessment Methods</h3>
            <ul class="assessment-list">
                <li><strong>Participation:</strong> 10%</li>
                <li><strong>Assignments:</strong> 30%</li>
                <li><strong>Midterm Project:</strong> 30%</li>
                <li><strong>Final Project:</strong> 30%</li>
            </ul>
        </div>

        <!-- Resources Section -->
        <div class="detail-section">
            <h3>Course Resources</h3>
            <ul class="resources-list">
                <li>Online Learning Platform Access</li>
                <li>Course Materials & Lecture Notes</li>
                <li>Lab/Development Environment</li>
                <li>Library Resources</li>
                <li>Peer Study Groups</li>
                <li>Tutoring Services</li>
            </ul>
        </div>

        <!-- Price Section -->
        <div class="detail-section price-section">
            <h3>Course Fee</h3>
            <p><strong>Total Cost:</strong> $${currentSelectedCourse.price}</p>
            <p><strong>Per Credit:</strong> $${Math.round(currentSelectedCourse.price / currentSelectedCourse.credits)}</p>
        </div>

        <!-- Action Button -->
        <div class="details-actions">
            <button class="confirm-btn" onclick="openCheckout(); closeCourseDetails();">Proceed to Enrollment</button>
        </div>
    `;

    document.getElementById('courseDetailsBody').innerHTML = detailsHTML;
}

// Close course details modal
function closeCourseDetails() {
    document.getElementById('courseDetailsModal').style.display = 'none';
}

// Helper function to get difficulty level based on course code
function getDifficulty(courseCode) {
    if (courseCode.includes('501') || courseCode.includes('401')) return 'Advanced';
    if (courseCode.includes('301') || courseCode.includes('201')) return 'Intermediate';
    return 'Beginner';
}

// Helper function to generate random room number
function getRandomRoom() {
    return 100 + Math.floor(Math.random() * 50);
}

// ============================================
// SIMPLE VALIDATION HELPERS
// ============================================
function isValidEmail(email) {
    return email.includes('@') && email.includes('.');
}

function isValidCardNumber(cardNumber) {
    const digitsOnly = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(digitsOnly);
}

function isValidExpiry(expiry) {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
}

function isValidCVV(cvv) {
    return /^\d{3}$/.test(cvv);
}

// ============================================
// FEEDBACK FORM FUNCTION
// ============================================
// Show a simple confirmation when feedback is submitted
function submitFeedback(event) {
    event.preventDefault();

    const name = document.getElementById('feedbackName').value.trim();
    const email = document.getElementById('feedbackEmail').value.trim();
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMessage').value.trim();
    const result = document.getElementById('feedbackResult');

    if (!name || !email || !type || !message) {
        result.textContent = 'Please fill in all feedback fields.';
        result.style.color = '#b94b4b';
        return;
    }

    if (!isValidEmail(email)) {
        result.textContent = 'Please enter a valid email address.';
        result.style.color = '#b94b4b';
        return;
    }

    result.textContent = 'Thank you, ' + name + '! Your feedback has been noted.';
    result.style.color = '#4d7f58';
    document.getElementById('feedbackForm').reset();
}

// ============================================
// THEME AND NAVIGATION FUNCTIONS
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    const themeButton = document.getElementById('themeToggle');

    themeButton.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('darkMode', isDark ? 'on' : 'off');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('darkMode');

    if (savedTheme === 'on') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = 'Light Mode';
    }
}

function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const sectionId = link.getAttribute('href');
            const section = document.querySelector(sectionId);

            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function setupBackToTopButton() {
    window.addEventListener('scroll', function() {
        const backToTopBtn = document.getElementById('backToTopBtn');

        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Close modal when clicking outside it
window.onclick = function(event) {
    const checkoutModal = document.getElementById('checkoutModal');
    const courseDetailsModal = document.getElementById('courseDetailsModal');
    
    if (event.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    if (event.target === courseDetailsModal) {
        courseDetailsModal.style.display = 'none';
    }
}
