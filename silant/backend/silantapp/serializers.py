from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Machine, TO, MaintenanceType, ServiceCompany, Reclamation, FailureNode, RecoveryMethod,ReferenceModel

#получение токена с ролью после входа в аккаунт
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        print(f"Generated Token: {token}")
        token['role'] = user.useRole  # Добавление поля 'role' в токен
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['role'] = user.useRole 
        return data
    
# запрос на получение ограниченной информации гостям
class ApiTableDataMachine(serializers.ModelSerializer):
    model = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelEngine = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelTransmission = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelLeadingBridge = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelManagedBridge = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )

    class Meta:
        model = Machine
        fields = ["factoryNumber",
        "factoryNumberEngine",
        "factoryNumberTransmission",
        "factoryNumberLeadingBridge",
        "factoryNumberManagedBridge",
        "model",
        "modelEngine",
        "modelTransmission",
        "modelLeadingBridge",
        "modelManagedBridge"]
        
class ApiTableDataRequestMachine(serializers.Serializer):
    factory_number = serializers.CharField(max_length=100, required=True)

#запрос на получение полной информации клиентам
class ApiTableFullDataMachine(serializers.ModelSerializer):
    dataShipment = serializers.DateField(format="%Y-%m-%d")
    serviceCompany = serializers.SlugRelatedField(
        queryset=ServiceCompany.objects.all(),
        slug_field='name' 
    )
    model = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelEngine = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelTransmission = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelLeadingBridge = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )
    modelManagedBridge = serializers.SlugRelatedField(
        queryset=ReferenceModel.objects.all(),
        slug_field='name' 
    )

    class Meta:
        model = Machine
        fields = [
                  "factoryNumber",
                  "model",
                  "modelEngine",
                  "factoryNumberEngine",
                  "modelTransmission",
                  "factoryNumberTransmission",
                  "modelLeadingBridge",
                  "factoryNumberLeadingBridge",
                  "modelManagedBridge",
                  "factoryNumberManagedBridge",
                  'factoryNumberSupplyContract',
                  "dataShipment",
                  "consumer",
                  "adressExplotation",
                  "complictation",
                  "client",
                  "serviceCompany",
                  "id"]

#запрос на получения информации о ТО
class ApiTableDataTO(serializers.ModelSerializer):
    TypeTO = serializers.SlugRelatedField(
        queryset=MaintenanceType.objects.all(),
        slug_field='name' 
    )
    machine = serializers.SlugRelatedField(
        queryset=Machine.objects.all(),
        slug_field='model__name' 
    )
    serviceCompany = serializers.SlugRelatedField(
        queryset=ServiceCompany.objects.all(),
        slug_field='name' )
    organizationDoTO = serializers.CharField() 
    dataOrder = serializers.DateField(format="%Y-%m-%d") 
    orderNumber = serializers.CharField()  
    dateTO = serializers.DateField(format="%Y-%m-%d")  
    development = serializers.IntegerField()

    class Meta:
        model = TO
        fields = [
            'TypeTO', 
            'dateTO',
            'development',
            'orderNumber', 
            'dataOrder', 
            'organizationDoTO', 
            'machine', 
            'serviceCompany', 
            'id',          
        ]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
#запрос на получение информации о рекламации
class ApiTableDataReclamation(serializers.ModelSerializer):
    dateReclamation = serializers.DateField(format="%Y-%m-%d")
    development = serializers.IntegerField()
    rejectNode = serializers.SlugRelatedField(
        queryset=FailureNode.objects.all(),
        slug_field='name' 
    )
    descriotionReject = serializers.CharField()
    recoveryMethod = serializers.SlugRelatedField(
        queryset=RecoveryMethod.objects.all(),
        slug_field='name' 
    )
    useSpareParts = serializers.CharField()
    dataRecovery = serializers.DateField(format="%Y-%m-%d")
    downtimeEquipment = serializers.IntegerField()
    machine = serializers.SlugRelatedField(
        queryset=Machine.objects.all(),
        slug_field='model__name' 
    )
    serviceCompany = serializers.SlugRelatedField(
        queryset=ServiceCompany.objects.all(),
        slug_field='name' 
    )

    class Meta:
        model = Reclamation
        fields = [
            'dateReclamation',
            'development',
            'rejectNode',
            'descriotionReject',
            'recoveryMethod',
            'useSpareParts',
            'dataRecovery',
            'downtimeEquipment',
            'machine',
            'serviceCompany',
            'id'
        ]

class ApiReferenceModel(serializers.ModelSerializer):
    class Meta:
        model = ReferenceModel
        fields = [ "name", "description"]


class ApiMaintenanceType(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceType
        fields = [ "name", "description"]

class ApiFailureNode(serializers.ModelSerializer):
    class Meta:
        model = FailureNode
        fields = [ "name", "description"]
    
class ApiRecoveryMethod(serializers.ModelSerializer):
    class Meta:
        model = RecoveryMethod
        fields = [ "name", "description"]

class ApiSrviceCompany(serializers.ModelSerializer):
    class Meta:
        model = ServiceCompany
        fields = ['name', 'description']
        