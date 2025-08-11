document.addEventListener("DOMContentLoaded", function () {
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

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
                // --- Flip trigger ONLY for "Happy Birthday" ---
                if (/^happy\s*birthday$/i.test(msg) || /^HB$/i.test(msg)) {
                    setTimeout(() => {
                        const flipCard = document.getElementById("flip-card");
                        if (flipCard) {
                            flipCard.classList.add("flipped");
                        }
                    }, 3000); // 3 second delay
                }
                // ---------------------------------------------

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
                data.messages.forEach(msg => {
                    const div = document.createElement("div");
                    div.classList.add("chat-message");
                    div.textContent = msg;
                    chatBox.appendChild(div);
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            });
    }

    // Auto-refresh messages every 2 seconds
    setInterval(loadMessages, 2000);
    loadMessages();
});
