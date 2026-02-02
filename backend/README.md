# NoirQR Backend (FastAPI)

## Быстрый старт

1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
2. Скопируйте .env.example в .env и при необходимости измените параметры.
3. Запустите backend:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

## Структура
- `app/models.py` — модели SQLModel
- `app/database.py` — подключение к БД
- `app/routers.py` — маршруты FastAPI
- `app/schemas.py` — схемы для сериализации

API будет доступен на http://localhost:8000
