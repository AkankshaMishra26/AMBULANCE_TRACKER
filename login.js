document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Here you can implement login functionality
    // For simplicity, let's just check if username and password are not empty
    if (username.trim() === "" || password.trim() === "") {
        document.getElementById("error").innerText = "Username and password are required";
    } else {
        // Here you can redirect to admin page if login is successful
        window.location.href = 'admin.html';
    }
});
