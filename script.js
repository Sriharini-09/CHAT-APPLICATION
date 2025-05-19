(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname = "";

    // Join screen event
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
    const usernameInput = app.querySelector(".join-screen #username");
    const username = usernameInput.value.trim();

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    uname = username;
    socket.emit("newuser", uname);

    // ✅ Clear previous chat messages (important!)
    const messageContainer = app.querySelector(".chat-screen .messages");
    messageContainer.innerHTML = "";

    // ✅ Switch screens
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
});


    // Chat screen event for sending messages
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        const messageInput = app.querySelector(".chat-screen #message-input");
        const message = messageInput.value.trim();

        if (!message) return;

        renderMessage("my", {
            username: uname,
            text: message
        });

        socket.emit("chat", {
            username: uname,
            text: message
        });

        messageInput.value = "";
    });

    // Exit chat event
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.reload(); // simpler and cleaner than assigning the same URL
    });

    // Listen for server updates and messages
    socket.on("update", function (updateMsg) {
        renderMessage("update", updateMsg);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    // Function to render messages in the chat window
    function renderMessage(type, message) {
        const messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");

        if (type === "my") {
            el.className = "message my-message";
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${escapeHTML(message.text)}</div>
                </div>
            `;
        } else if (type === "other") {
            el.className = "message other-message";
            el.innerHTML = `
                <div>
                    <div class="name">${escapeHTML(message.username)}</div>
                    <div class="text">${escapeHTML(message.text)}</div>
                </div>
            `;
        } else if (type === "update") {
            el.className = "update";
            el.textContent = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    // Optional: prevent XSS by escaping HTML
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

})();
