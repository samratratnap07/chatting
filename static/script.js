document.addEventListener("DOMContentLoaded", function () {
    const messageForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    // Flip card elements
    const flipInner = document.querySelector("#flip-card .flip-inner");
    const squareBtn = document.getElementById("square-btn");

    let flipped = false; // flip only once

    // Send message
    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const msg = messageInput.value.trim();
        if (msg === "") return;

        fetch("/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                messageInput.value = "";
                loadMessages();
            }
        });
    });

    // Load messages
    function loadMessages() {
        fetch("/messages")
            .then(res => res.json())
            .then(data => {
                chatBox.innerHTML = "";
                let triggerFlip = false;

                data.messages.forEach(msg => {
                    const text = msg.message || msg;
                    const div = document.createElement("div");
                    div.classList.add("chat-message");
                    div.textContent = text;
                    chatBox.appendChild(div);

                    if (!flipped && String(text).toLowerCase().includes("happy birthday")) {
                        triggerFlip = true;
                    }
                });

                chatBox.scrollTop = chatBox.scrollHeight;

                if (triggerFlip && !flipped) {
                    flipped = true;
                    flipInner.classList.add("flipped");
                }
            });
    }

    setInterval(loadMessages, 2000);
    loadMessages();

    // Button link
    squareBtn.addEventListener("click", function () {
        window.location.href = "https://example.com"; // change to your URL
    });
});
