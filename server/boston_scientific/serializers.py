from rest_framework import serializers
from .models import Producto, Cliente, ArchivoDeCarga

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'gtin', 'codigo', 'descripcion']


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'codigo']


class ArchivoDeCargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoDeCarga
        fields = [
            'id',
            'numero_archivo',
            'codigo',
            'lote',
            'caducidad',
            'documento_reposicion',
            'fecha_reposicion',
            'numero_envio',
            'orden_compra',
            'ticket_salida',
            'almacen_bsci',
            'numero_cliente',
            'etiqueta_rfid',
            'fecha_carga'
        ]

class ProductoCargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["gtin", "codigo", "descripcion"]

    def validate_gtin(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El GTIN debe contener solo dígitos.")
        return value