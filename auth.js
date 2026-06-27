// Simple auth.js file to prevent 404 errors
console.log("Auth.js loaded - Using localStorage for auth");

// Check if user is logged in
function checkUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    const protectedPages = ["events.html", "timetables.html"];
    const currentPage = window.location.pathname.split("/").pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        sessionStorage.setItem("redirectAfterLogin", currentPage);
        window.location.replace("login.html");
    }
    
    // Update auth button if exists
    updateAuthUI();
}

// Update login/logout button
function updateAuthUI() {
    const currentUser = sessionStorage.getItem('currentUser');
    const authBtn = document.getElementById("authBtn");
    
    if (!authBtn) return;
    
    if (currentUser) {
        authBtn.textContent = "Logout";
        authBtn.onclick = function() {
            sessionStorage.removeItem('currentUser');
            window.location.href = "login.html";
        };
        authBtn.style.background = "#ff4d4d";
    } else {
        authBtn.textContent = "Login";
        authBtn.onclick = function() {
            window.location.href = "login.html";
        };
        authBtn.style.background = "#0055a5";
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = "login.html";
}

// Run check when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkUser);
} else {
    checkUser();
}