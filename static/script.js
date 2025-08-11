document.addEventListener("DOMContentLoaded", function () {
    const messageForm = document.getElementById("chat-form"); // aapke html me form id 'chat-form' tha
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    const bigSquare = document.getElementById("big-square");
    const squareText = document.getElementById("square-text");
    const squareBtn = document.getElementById("square-btn");

    let bigSquareVisible = false;

    // Send message handler
    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const msg = messageInput.value.trim();
        if (msg === "") return;

        fetch("/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageInput.value = "";
                loadMessages(); // Reload immediately
            }
        });
    });

    // Toggle big square show/flip function
    function toggleBigSquare() {
        if (!bigSquareVisible) {
            bigSquare.style.display = "flex";
            squareText.style.display = "block";
            squareBtn.style.display = "inline-block";
            bigSquareVisible = true;
        } else {
            bigSquare.classList.add("inner-flip");

            setTimeout(() => {
                // Toggle visibility of text and button
                if (squareText.style.display === "none") {
                    squareText.style.display = "block";
                    squareBtn.style.display = "inline-block";
                } else {
                    squareText.style.display = "none";
                    squareBtn.style.display = "none";
                }
                bigSquare.classList.remove("inner-flip");
            }, 1000); // matches animation duration
        }
    }

    // Load messages function
    function loadMessages() {
        fetch("/messages")
            .then(response => response.json())
            .then(data => {
                chatBox.innerHTML = "";
                data.messages.forEach(msg => {
                    const div = document.createElement("div");
                    div.classList.add("chat-message");
                    // Display message text, you can enhance with username, timestamp as per your original code
                    div.textContent = msg.message || msg; // support either
                    chatBox.appendChild(div);

                    if (String(msg.message || msg).toLowerCase().includes("happy birthday")) {
                        toggleBigSquare();
                    }
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            });
    }

    // Auto update messages every 2 seconds
    setInterval(loadMessages, 2000);
    loadMessages();

    // Button click opens link in same tab
    squareBtn.addEventListener("click", function () {
        window.location.href = "https://example.com"; // Change to your desired URL
    });
});
