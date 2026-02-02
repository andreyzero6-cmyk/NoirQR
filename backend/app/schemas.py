from typing import Optional
from sqlmodel import SQLModel

class UserRead(SQLModel):
    id: int
    email: str

class VenueRead(SQLModel):
    id: int
    slug: str
    name: str
    telegram_chat_id: Optional[str]
    theme_color: Optional[str]
    owner_id: int

class MenuItemRead(SQLModel):
    id: int
    name: str
    price: float
    description: Optional[str]
    image_url: Optional[str]
    venue_id: int
