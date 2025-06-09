from django.contrib import admin
from .models import Producto, Cliente, ArchivoDeCarga


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('gtin', 'codigo', 'descripcion')
    search_fields = ('gtin', 'codigo', 'descripcion')


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo')
    search_fields = ('nombre', 'codigo')


@admin.register(ArchivoDeCarga)
class ArchivoDeCargaAdmin(admin.ModelAdmin):
    list_display = ('numero_archivo', 'codigo', 'lote', 'caducidad', 'fecha_carga')
    list_filter = ('caducidad', 'fecha_carga')
    search_fields = ('codigo', 'lote', 'numero_cliente', 'orden_compra', 'ticket_salida')
