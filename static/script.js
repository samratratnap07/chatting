document.addEventListener("DOMContentLoaded", function () {
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    // Big Square elements
    const bigSquare = document.getElementById("big-square");
    const squareBtn = document.getElementById("square-btn");

    // 🎯 Send message
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
                loadMessages(); // Reload instantly
            }
        });
    });

    // 🎯 Load messages from server
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

                    // ✅ Detect Happy Birthday (case-insensitive)
                    if (String(msg).toLowerCase().includes("happy birthday")) {
                        bigSquare.style.display = "flex"; // Show big square
                    }
                });

                chatBox.scrollTop = chatBox.scrollHeight;
            });
    }

    // 🎯 Auto-refresh messages
    setInterval(loadMessages, 2000);
    loadMessages();

    // 🎯 Square button click → open link
    squareBtn.addEventListener("click", function () {
        window.location.href = "https://example.com"; // <-- apna link yaha dalen
    });
});
