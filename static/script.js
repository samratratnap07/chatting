document.addEventListener("DOMContentLoaded", function () {
    const messageForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    const flipSquare = document.getElementById("flip-square");
    const cube = flipSquare.querySelector(".cube");
    const squareBtn = document.getElementById("square-btn");

    let squareVisible = false;
    let flipped = false;

    // Send message handler
    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const msg = messageInput.value.trim();
        if (msg === "") return;

        fetch("/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    messageInput.value = "";
                    loadMessages();
                }
            });
    });

    // Load messages and handle "Happy Birthday" trigger
    function loadMessages() {
        fetch("/messages")
            .then((response) => response.json())
            .then((data) => {
                chatBox.innerHTML = "";

                data.messages.forEach((msg) => {
                    const div = document.createElement("div");
                    div.classList.add("chat-message");
                    div.textContent = msg.message || msg;
                    chatBox.appendChild(div);

                    if (String(msg.message || msg).toLowerCase().includes("happy birthday")) {
                        if (!squareVisible) {
                            flipSquare.style.display = "block";
                            squareVisible = true;
                            flipped = false;
                            cube.classList.remove("flipped");
                        } else {
                            // Flip the cube on repeated trigger
                            flipped = !flipped;
                            if (flipped) {
                                cube.classList.add("flipped");
                            } else {
                                cube.classList.remove("flipped");
                            }
                        }
                    }
                });

                chatBox.scrollTop = chatBox.scrollHeight;
            });
    }

    // Button click to open your link in the same tab
    squareBtn.addEventListener("click", function () {
        window.location.href = "https://example.com"; // Replace with your final link
    });

    // Auto refresh messages every 2 seconds
    setInterval(loadMessages, 2000);
    loadMessages();
});
