# boston_scientific/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    ProductoViewSet,
    ClienteViewSet,
    ArchivoDeCargaViewSet,
    CargaMasivaProductosView,
    CargarTXTView,
    GenerarExcelView,
)

app_name = 'boston_scientific'

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'archivos-carga', ArchivoDeCargaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('productos-carga-masiva/', CargaMasivaProductosView.as_view(), name='carga-masiva-productos'),
    path('cargar-txt/', CargarTXTView.as_view(), name='cargar-txt'),
    path('generar-excel/<uuid:numero_archivo>/', GenerarExcelView.as_view(), name='generar-excel'),
]
