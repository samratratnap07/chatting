from flask import Flask, render_template, request, redirect, session, url_for, jsonify
import sqlite3
from datetime import datetime
import pytz   # ✅ Add for timezone fix

app = Flask(__name__)
app.secret_key = 'secretkey123'

# USERS: Only Nick and Saisha
USERS = {
    "Nick": "491981",
    "Saisha": "491981"
}

# Ensure database exists
def init_db():
    conn = sqlite3.connect("chat.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sender TEXT,
                    message TEXT,
                    timestamp TEXT
                )''')
    conn.commit()
    conn.close()

init_db()

# LOGIN PAGE
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in USERS and USERS[username] == password:
            session['username'] = username
            return redirect(url_for('chat'))
        else:
            return render_template('login.html', error="Invalid credentials")
    return render_template('login.html')

# CHAT PAGE
@app.route('/chat')
def chat():
    if 'username' not in session:
        return redirect('/')
    return render_template('chat.html', username=session['username'])

# API - get all messages for AJAX
@app.route('/messages')
def get_messages():
    conn = sqlite3.connect("chat.db")
    c = conn.cursor()
    c.execute("SELECT sender, message, timestamp FROM messages ORDER BY id ASC")
    rows = c.fetchall()
    conn.close()

    messages = []
    for sender, message, timestamp in rows:
        messages.append({
            "sender": sender,
            "message": message,
            "timestamp": timestamp
        })
    return jsonify(messages=messages)

# SEND MESSAGE
@app.route('/send', methods=['POST'])
def send():
    if 'username' not in session:
        return jsonify(success=False)

    data = request.get_json()
    msg = data.get('message', '').strip()
    if msg == "":
        return jsonify(success=False)

    user = session['username']

    # ✅ GET CURRENT INDIAN TIME
    IST = pytz.timezone('Asia/Kolkata')
    time = datetime.now(IST).strftime("%H:%M")

    conn = sqlite3.connect("chat.db")
    c = conn.cursor()
    c.execute("INSERT INTO messages (sender, message, timestamp) VALUES (?, ?, ?)",
              (user, msg, time))
    conn.commit()
    conn.close()

    return jsonify(success=True)

# LOGOUT (Step 3 fix ✅)
@app.route('/logout', methods=['POST', 'GET'])
def logout():
    session.pop('username', None)
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
