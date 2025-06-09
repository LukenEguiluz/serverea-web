from django.db import models
import uuid

# Create your models here.
from django.db import models

class Producto(models.Model):
    gtin = models.CharField(max_length=20, unique=True)
    codigo = models.CharField(max_length=20)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return f"{self.codigo} - {self.descripcion or 'Sin descripción'}"
    
class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"
    
class ArchivoDeCarga(models.Model):
    numero_archivo = models.CharField(max_length=255)
    codigo = models.CharField(max_length=50)
    lote = models.CharField(max_length=50)
    caducidad = models.DateField()
    documento_reposicion = models.CharField(max_length=100, blank=True)
    fecha_reposicion = models.DateField(null=True, blank=True)
    numero_envio = models.CharField(max_length=50, blank=True)
    orden_compra = models.CharField(max_length=50, blank=True)
    ticket_salida = models.CharField(max_length=50, blank=True)
    almacen_bsci = models.CharField(max_length=50, blank=True)
    numero_cliente = models.CharField(max_length=50, blank=True)
    etiqueta_rfid = models.CharField(max_length=100, blank=True)
    fecha_carga = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.numero_archivo} - {self.codigo} ({self.lote})"
