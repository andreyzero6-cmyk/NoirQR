from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data
VENUES = [
    {
        "id": 1,
        "name": "Тестовое кафе",
        "slug": "test-cafe",
        "description": "Лучшее кафе в городе",
        "themeColor": "#FF6B6B"
    }
]

MENU = [
    {
        "id": 1,
        "name": "Капучино",
        "price": 5.99,
        "description": "Классический итальянский кофе с молоком",
        "category": "Напитки",
        "image_url": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
        "venue_slug": "test-cafe"
    },
    {
        "id": 2,
        "name": "Пицца Маргарита",
        "price": 12.99,
        "description": "Традиционная итальянская пицца с томатами и моцареллой",
        "category": "Основные блюда",
        "image_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
        "venue_slug": "test-cafe"
    },
    {
        "id": 3,
        "name": "Тирамису",
        "price": 6.99,
        "description": "Классический итальянский десерт",
        "category": "Десерты",
        "image_url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        "venue_slug": "test-cafe"
    }
]

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "NoirQR API is running", "status": "ok"})

@app.route('/venues', methods=['GET'])
def get_venues():
    return jsonify(VENUES)

@app.route('/menu', methods=['GET'])
def get_menu():
    return jsonify(MENU)

@app.route('/order', methods=['POST'])
def submit_order():
    data = request.get_json()
    print(f"Order received: {data}")
    return jsonify({"status": "success", "message": "Order received"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=False)
