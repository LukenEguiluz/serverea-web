from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('user.urls', namespace='user')),
    path('api/boston/', include('boston_scientific.urls', namespace='boston_scientific')),
]
