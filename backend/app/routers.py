from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from .database import get_session
from .models import MenuItem, Venue
from .schemas import MenuItemRead, VenueRead

router = APIRouter()

@router.get("/venues/{venue_slug}/menu", response_model=list[MenuItemRead])
def get_menu(venue_slug: str, session: Session = Depends(get_session)):
    venue = session.exec(select(Venue).where(Venue.slug == venue_slug)).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    items = session.exec(select(MenuItem).where(MenuItem.venue_id == venue.id)).all()
    return items
