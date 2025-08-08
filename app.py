from flask import Flask, render_template, request, redirect, session, url_for
import sqlite3
from datetime import datetime

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

# ROUTES
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

@app.route('/chat')
def chat():
    if 'username' not in session:
        return redirect('/')
    conn = sqlite3.connect("chat.db")
    c = conn.cursor()
    c.execute("SELECT * FROM messages")
    msgs = c.fetchall()
    conn.close()
    return render_template('chat.html', messages=msgs, user=session['username'])

@app.route('/send', methods=['POST'])
def send():
    if 'username' not in session:
        return redirect('/')
    msg = request.form['message']
    user = session['username']
    time = datetime.now().strftime("%H:%M")
    conn = sqlite3.connect("chat.db")
    c = conn.cursor()
    c.execute("INSERT INTO messages (sender, message, timestamp) VALUES (?, ?, ?)", (user, msg, time))
    conn.commit()
    conn.close()
    return redirect('/chat')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
