from django.db import models
from django.contrib.auth.models import AbstractUser

class UserRole(AbstractUser):
    ROLE_CHOICES = [
        ('guest', 'Guest'),
        ('menager', 'Menager'),
        ('client', 'Client'),
        ('serviceCompany', 'ServiceCompany'),
    ]
    useRole = models.CharField(max_length=15, choices=ROLE_CHOICES, default='guest')

    groups = None
    user_permissions = None

# машина
class Machine(models.Model):
    factoryNumber = models.CharField(max_length=100)
    factoryNumberEngine = models.CharField(max_length=100)
    factoryNumberTransmission = models.CharField(max_length=100)
    factoryNumberLeadingBridge = models.CharField(max_length=100)
    factoryNumberManagedBridge = models.CharField(max_length=100)
    factoryNumberSupplyContract = models.CharField(max_length=100)
    model = models.ForeignKey('ReferenceModel', on_delete=models.CASCADE, related_name='machines_as_model')
    modelEngine = models.ForeignKey('ReferenceModel', on_delete=models.CASCADE, related_name='machines_as_modelEngine')
    modelTransmission = models.ForeignKey('ReferenceModel', on_delete=models.CASCADE, related_name='machines_as_modelTransmission')
    modelLeadingBridge = models.ForeignKey('ReferenceModel', on_delete=models.CASCADE, related_name='machines_as_modelLeadingBridge')
    modelManagedBridge = models.ForeignKey('ReferenceModel', on_delete=models.CASCADE, related_name='machines_as_modelManagedBridge')
    dataShipment = models.DateField()
    consumer = models.CharField(max_length=100)
    adressExplotation = models.CharField(max_length=200)
    complictation = models.TextField()
    client = models.CharField(max_length=100)
    serviceCompany = models.ForeignKey('ServiceCompany', on_delete=models.CASCADE, related_name='machines')

# техническое обслуживание
class TO(models.Model):
    TypeTO = models.ForeignKey('MaintenanceType', on_delete=models.CASCADE, related_name='tos')
    dateTO = models.DateField()
    development = models.IntegerField()
    orderNumber = models.CharField(max_length=100)
    dataOrder = models.DateField()
    organizationDoTO = models.CharField(max_length=100)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='tos')
    serviceCompany = models.ForeignKey('ServiceCompany', on_delete=models.CASCADE, related_name='tos')

# рекламация
class Reclamation(models.Model):
    dateReclamation = models.DateField()
    development = models.IntegerField()
    rejectNode = models.ForeignKey('FailureNode', on_delete=models.CASCADE, related_name='reclamations')
    descriotionReject = models.TextField()
    recoveryMethod = models.ForeignKey('RecoveryMethod', on_delete=models.CASCADE, related_name='reclamations')
    useSpareParts = models.TextField()
    dataRecovery = models.DateField()
    downtimeEquipment = models.IntegerField()
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='reclamations')
    serviceCompany = models.ForeignKey('ServiceCompany', on_delete=models.CASCADE, related_name='reclamations')

# сервисная компания
class ServiceCompany(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name
    
# модель оборудования
class ReferenceModel(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name

# вид то
class MaintenanceType(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name
    
# узел отказа
class FailureNode(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name

# способ восстановления
class RecoveryMethod(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name    
    

    
    