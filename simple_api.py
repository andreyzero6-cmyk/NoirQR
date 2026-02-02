from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs
import threading
import time

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

class SimpleAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        if path == '/':
            response = {"message": "NoirQR API is running", "status": "ok"}
        elif path == '/venues':
            response = venues
        elif path.startswith('/venue/'):
            slug = path.split('/venue/')[1].split('/')[0]
            venue = next((v for v in venues if v["slug"] == slug), None)
            if venue:
                if path.endswith('/menu'):
                    response = venue["menuItems"]
                else:
                    response = venue
            else:
                self.send_response(404)
                response = {"error": "Venue not found"}
        else:
            response = {"error": "Not found"}

        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        response = {"message": "Order received successfully", "order_id": 12345, "status": "processing"}
        self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    server_address = ('', 3001)
    httpd = HTTPServer(server_address, SimpleAPIHandler)
    print("🚀 NoirQR API Server running on http://localhost:3001")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()