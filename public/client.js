// Connect to the Socket.IO server
const socket = io();

// Get DOM elements
const messageInput = document.getElementById('messageInput');
const submitButton = document.getElementById('submitButton');

fetch('http://localhost:5000/get-session-data')
    .then(response => response.json())
    .then(data => {
        userToken = data.userToken; // Retrieve the user's token
        console.log('User Token:', userToken);

        adminToken = data.adminToken; // Retrieve the admin's token
        console.log('Admin Token:', adminToken);

        // Emit a private message to the admin once you have adminToken
        socket.emit('private message', {
            recipientUserId: adminToken,
            message: 'Hello, this is a private message.'
        });
    })
    .catch(error => {
        console.error('Error fetching session data:', error);
    });

// // Listen for chat messages from the server
// socket.on('chat message', (message) => {
//     console.log('Received message:', message);
// });

// // Handle submitting a message
// submitButton.addEventListener('click', () => {
//     const message = messageInput.value;
//     if (message) {
//         // Emit a 'chat message' event to the server with userToken and message
//         socket.emit('chat message', message);
//         messageInput.value = ''; // Clear the input field
//     }
// });

