document.addEventListener("DOMContentLoaded", function () {
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    // Flip-card element reference (make sure it's in your HTML)
    const flipCardInner = document.querySelector(".flip-card-inner");

    // Handle sending messages
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
                loadMessages(); // Reload messages instantly
            }
        });
    });

    // Function to load messages from the server
    function loadMessages() {
        fetch("/messages")
            .then(response => response.json())
            .then(data => {
                chatBox.innerHTML = "";
                let birthdayFound = false; // Track if message contains "Happy Birthday"

                data.messages.forEach(msg => {
                    const div = document.createElement("div");
                    div.classList.add("chat-message");
                    div.textContent = msg;
                    chatBox.appendChild(div);

                    // Check for birthday trigger (case insensitive)
                    if (typeof msg === "string" && msg.toLowerCase().includes("happy birthday")) {
                        birthdayFound = true;
                    }
                });

                // Flip card animation trigger
                if (flipCardInner) {
                    if (birthdayFound) {
                        flipCardInner.classList.add("flip");
                    } else {
                        flipCardInner.classList.remove("flip");
                    }
                }

                chatBox.scrollTop = chatBox.scrollHeight;
            });
    }

    // Auto-refresh messages every 2 seconds
    setInterval(loadMessages, 2000);
    loadMessages();
});
