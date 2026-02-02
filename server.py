from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="NoirQR API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Venue(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    themeColor: str
    telegramChatId: str
    menuItems: List[dict] = []

class MenuItem(BaseModel):
    id: int
    name: str
    price: float
    description: str
    category: str
    imageUrl: Optional[str] = None
    isAvailable: bool = True
    venue_id: int

# In-memory storage
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

# Routes
@app.get("/")
def read_root():
    return {"message": "NoirQR API is running", "status": "ok"}

@app.get("/venues")
def get_venues():
    return venues

@app.get("/venue/{slug}")
def get_venue(slug: str):
    venue = next((v for v in venues if v["slug"] == slug), None)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue

@app.get("/venue/{slug}/menu")
def get_menu(slug: str):
    venue = next((v for v in venues if v["slug"] == slug), None)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue["menuItems"]

@app.post("/admin/venue")
def create_venue(venue: dict):
    new_id = max(v["id"] for v in venues) + 1 if venues else 1
    venue["id"] = new_id
    venue["menuItems"] = []
    venues.append(venue)
    return venue

@app.delete("/admin/venue/{venue_id}")
def delete_venue(venue_id: int):
    global venues
    venues = [v for v in venues if v["id"] != venue_id]
    return {"message": "Venue deleted"}

@app.post("/admin/menu-item")
def create_menu_item(item: dict):
    venue = next((v for v in venues if v["id"] == item["venue_id"]), None)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    new_id = max(i["id"] for i in venue["menuItems"]) + 1 if venue["menuItems"] else 1
    item["id"] = new_id
    venue["menuItems"].append(item)
    return item

@app.delete("/admin/menu-item/{venue_id}/{item_id}")
def delete_menu_item(venue_id: int, item_id: int):
    venue = next((v for v in venues if v["id"] == venue_id), None)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    venue["menuItems"] = [i for i in venue["menuItems"] if i["id"] != item_id]
    return {"message": "Menu item deleted"}

@app.post("/order")
def create_order(order: dict):
    # Mock order processing
    return {
        "message": "Order received successfully",
        "order_id": 12345,
        "status": "processing"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)