# backend/routes/__init__.py
# expose the route modules so `from routes import alerts` works

from . import auth
from . import flights
from . import alerts
from . import notifications

__all__ = ["auth", "flights", "alerts", "notifications"]