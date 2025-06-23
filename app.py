from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

# Helper to load drug data
DATA_PATH = os.path.join(os.path.dirname(__file__), 'drug_full_details.json')
def load_drugs():
    with open(DATA_PATH, encoding='utf-8') as f:
        return json.load(f)

@app.route('/')
def home():
    return "Hello from Drug_PhamacyApp backend!"

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})

@app.route('/api/drugs')
def get_all_drugs():
    drugs = load_drugs()
    return jsonify(drugs)

@app.route('/api/drug/<name>')
def get_drug_by_name(name):
    drugs = load_drugs()
    name = name.lower()
    for drug in drugs:
        if drug['ชื่อการค้า'].lower() == name or drug['ชื่อสามัญ'].lower() == name:
            return jsonify(drug)
    return jsonify({"error": "not found"}), 404

@app.route('/api/forms')
def get_unique_forms():
    drugs = load_drugs()
    form_counts = {}
    for drug in drugs:
        form = drug.get('รูปแบบยา', '')
        if form:
            form_counts[form] = form_counts.get(form, 0) + 1
    forms = [{"form": k, "count": v} for k, v in form_counts.items()]
    forms.sort(key=lambda x: x['count'], reverse=True)
    return jsonify(forms)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000) 