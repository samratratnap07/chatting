document.addEventListener("DOMContentLoaded", function () {
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    // Send message
    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const msg = messageInput.value.trim();
        if (msg === "") return;

        // Show instantly in UI
        appendMessage("You", msg, new Date().toLocaleTimeString());
        messageInput.value = "";

        fetch("/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        }).then(response => response.json())
          .then(data => {
              if (!data.success) {
                  console.error("Message send failed");
              }
          });
    });

    // Append message to chat
    function appendMessage(sender, text, time) {
        const div = document.createElement("div");
        div.classList.add("msg", sender === "Nick" ? "nick" : sender === "You" ? "nick" : "saisha");
        div.innerHTML = `<strong>${sender}:</strong> ${text}<div class="timestamp">${time}</div>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Load messages from server
    function loadMessages() {
        fetch("/messages")
            .then(response => response.json())
            .then(data => {
                chatBox.innerHTML = "";
                data.messages.forEach(msg => {
                    appendMessage(msg[1], msg[2], msg[3]);
                });
            });
    }

    // Auto-refresh messages every 2 seconds
    setInterval(loadMessages, 2000);
    loadMessages();
});
