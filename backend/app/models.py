from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    venues: list["Venue"] = Relationship(back_populates="owner")

class Venue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    name: str
    telegram_chat_id: Optional[str] = None
    theme_color: Optional[str] = None
    owner_id: int = Field(foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="venues")
    menu_items: list["MenuItem"] = Relationship(back_populates="venue")

class MenuItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    price: float
    description: Optional[str] = None
    image_url: Optional[str] = None
    venue_id: int = Field(foreign_key="venue.id")
    venue: Optional[Venue] = Relationship(back_populates="menu_items")
