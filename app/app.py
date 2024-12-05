from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

DIGIMON_API = "https://digimon-api.vercel.app/api/digimon"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search_digimon():
    name = request.form.get('name')
    response = requests.get(f"{DIGIMON_API}/name/{name}")
    if response.status_code == 200:
        data = response.json()
        if data:
            return jsonify(data[0])  # Enviar solo el primer resultado
    return jsonify({"error": "Digimon not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
