from django.urls import path
from .views import recommended, health_check

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('recommended/<int:movie_id>/', recommended, name='recommended'),
]
