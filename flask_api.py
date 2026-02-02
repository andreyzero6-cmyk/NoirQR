from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data
venues = [
    {
        "id": 1,
        "name": "Тестовое кафе",
        "slug": "test-cafe",
        "description": "Лучшее кафе в городе",
        "themeColor": "#FF6B6B",
        "telegramChatId": "@test_cafe_bot",
        "menuItems": [
            {
                "id": 1,
                "name": "Капучино",
                "price": 5.99,
                "description": "Классический итальянский кофе с молоком",
                "category": "Напитки",
                "imageUrl": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
                "isAvailable": True,
                "venue_id": 1
            },
            {
                "id": 2,
                "name": "Пицца Маргарита",
                "price": 12.99,
                "description": "Традиционная итальянская пицца с томатами и моцареллой",
                "category": "Основные блюда",
                "imageUrl": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
                "isAvailable": True,
                "venue_id": 1
            },
            {
                "id": 3,
                "name": "Тирамису",
                "price": 6.99,
                "description": "Классический итальянский десерт",
                "category": "Десерты",
                "imageUrl": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
                "isAvailable": True,
                "venue_id": 1
            }
        ]
    }
]

@app.route('/')
def home():
    return jsonify({"message": "NoirQR API is running", "status": "ok"})

@app.route('/venues')
def get_venues():
    return jsonify(venues)

@app.route('/venue/<slug>')
def get_venue(slug):
    venue = next((v for v in venues if v["slug"] == slug), None)
    if venue:
        return jsonify(venue)
    return jsonify({"error": "Venue not found"}), 404

@app.route('/venue/<slug>/menu')
def get_venue_menu(slug):
    venue = next((v for v in venues if v["slug"] == slug), None)
    if venue:
        return jsonify(venue["menuItems"])
    return jsonify({"error": "Venue not found"}), 404

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    return jsonify({
        "message": "Order received successfully",
        "order_id": 12345,
        "status": "processing",
        "data": data
    })

if __name__ == '__main__':
    print("🚀 NoirQR API Server running on http://localhost:3001")
    app.run(host='0.0.0.0', port=3001, debug=False)