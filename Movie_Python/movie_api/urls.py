from django.urls import path
from .views import recommended

urlpatterns = [
    path('recommended/<int:movie_id>/', recommended, name='recommended'),
]

