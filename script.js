document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    if (localStorage.getItem("token")) {
        // User is logged in, fetch ambulances
        fetchAmbulances();
    } else {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
    }
});

function fetchAmbulances() {
    fetch('/api/ambulances')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayAmbulances(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayAmbulances(ambulances) {
    const ambulanceList = document.getElementById("ambulanceList");
    ambulanceList.innerHTML = '';

    ambulances.forEach(ambulance => {
        const div = document.createElement('div');
        div.classList.add('ambulance');
        div.innerHTML = `
            <h2>${ambulance.name}</h2>
            <p>Location: ${ambulance.location}</p>
        `;
        ambulanceList.appendChild(div);
    });
}

// Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = 'login.html';
}

// Login form submit handler
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("token", data.token);
        window.location.href = 'index.html';
    })
    .catch(error => {
        document.getElementById("error").innerText = "Invalid username or password";
        console.error('There was a problem with the fetch operation:', error);
    });
});
