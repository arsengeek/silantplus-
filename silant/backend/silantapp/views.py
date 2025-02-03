from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView 
from rest_framework.decorators import api_view
from rest_framework.generics import UpdateAPIView
from .serializers import (
    CustomTokenObtainPairSerializer,
    ApiTableDataMachine,
    ApiTableDataRequestMachine,
    ApiTableFullDataMachine,
    ApiTableDataTO,
    ApiTableDataReclamation,
    ApiReferenceModel,
    ApiMaintenanceType,
    ApiFailureNode,
    ApiRecoveryMethod,
    ApiSrviceCompany
    )   
from .models import Machine, TO, ReferenceModel, MaintenanceType, Reclamation, FailureNode, RecoveryMethod, ServiceCompany
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Machine, Reclamation
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.openapi import Parameter, IN_HEADER
from rest_framework.exceptions import NotFound

#параметры для swagger
jwt_token = Parameter(
    'Authorization',
    in_=IN_HEADER,
    description='JWT Bearer token',
    type='string',
    required=True
)

#для swagger
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@extend_schema(
    request=ApiTableDataRequestMachine, 
    responses=ApiTableDataMachine
)

#запрос на получение ограниченной информации гостям о машине
class ApiTableDataMachineView(APIView):
    authentication_classes = [] 
    permission_classes = [AllowAny] 

    #для swagger
    @swagger_auto_schema(
        operation_description="Get machine details by factory number",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'factory_number': openapi.Schema(type=openapi.TYPE_STRING, description='Factory number of the machine'),
            },
            required=['factory_number']
        ),
        responses={
            200: ApiTableDataMachine,
            400: 'Serial number is required.',
            404: 'Machine not found.',
        }
    )
    
    def post(self, request):
        serializer = ApiTableDataRequestMachine(data=request.data)
        if serializer.is_valid():
            factory_number = serializer.validated_data['factory_number']
            try:
                machine = Machine.objects.get(factoryNumber=factory_number)
            except Machine.DoesNotExist:
                return Response({"error": "Machine not found."}, status=status.HTTP_404_NOT_FOUND)
            
            machine_serializer = ApiTableDataMachine(machine)
            return Response(machine_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#запрос на получения полной информации клиентам о машине
class ApiTableFullDataMachineView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    #для swagger
    @swagger_auto_schema(
        operation_description="Get machine details",  
        responses={
            200: ApiTableFullDataMachine(many=True), 
            400: 'Invalid request.',
            404: 'Machine not found.',
        },
        manual_parameters=[jwt_token]

    )

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        elif request.user.useRole == 'guest':
            return Response({"error": "Not authenticated"}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = request.user
            if user.useRole == 'manager':
                print(user.useRole)
                all_machines = Machine.objects.all()
                serializer = ApiTableFullDataMachine(all_machines, many=True)
                
                if not serializer.data:
                    return Response({"error": "No machines found."}, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response(serializer.data, status=status.HTTP_200_OK)
                
            if user.useRole == 'serviceCompany':
                print(user.useRole)
                all_machines = Machine.objects.filter(serviceCompany__name=user)
                serializer = ApiTableFullDataMachine(all_machines, many=True)

                if not serializer.data:
                    return Response({"error": "No machines found."}, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response(serializer.data, status=status.HTTP_200_OK)

            all_machines = Machine.objects.filter(client=user)
            serializer = ApiTableFullDataMachine(all_machines, many=True)

            if not serializer.data:
                return Response({"error": "No machines found."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Machine.DoesNotExist:
            return Response({"error": "Machine not found."}, status=status.HTTP_404_NOT_FOUND)

#обновление данных в машине
class MachineUpdateView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Machine.objects.all()
    serializer_class = ApiTableFullDataMachine

    @swagger_auto_schema(
        operation_description="Update TO details",
        manual_parameters=[jwt_token], 
        responses={
            200: ApiTableFullDataMachine(),
            400: "Invalid request.",
            403: "Forbidden.",
            404: "Machine not found."
        }
    )

    def get_object(self):
        try:
            obj = super().get_object()
        except Machine.DoesNotExist:
            return Response("Not found data",status=status.HTTP_404_NOT_FOUND)
        
        if self.request.user.useRole != 'manager':      
            raise serializers.ValidationError("У вас нет прав на изменение этой записи")
        return obj
  
#таблица то
class ApiTableDataTOView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get to details",  
        responses={
            200: ApiTableDataTO(many=True), 
            400: 'Invalid request.',
            404: 'TO not found.',
        },
        manual_parameters=[jwt_token]

    )

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if request.user.useRole == 'guest':
            return Response({"error": "Not authenticated"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = request.user
            if user.useRole == 'serviceCompany':
                all_machines = Machine.objects.filter(serviceCompany__name=user) 
                if not all_machines.exists():
                    return Response({"error": "No TO found for the user."}, status=status.HTTP_404_NOT_FOUND)
                
                to = TO.objects.filter(machine__in=all_machines)
                if not to.exists():
                    return Response({"error": "No TO records found."}, status=status.HTTP_404_NOT_FOUND)
                
                serializer = ApiTableDataTO(to, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            all_machines = Machine.objects.filter(client=user) 
            
            if not all_machines.exists():
                return Response({"error": "No TO found for the user."}, status=status.HTTP_404_NOT_FOUND)
            
            to = TO.objects.filter(machine__in=all_machines)
            if not to.exists():
                return Response({"error": "No TO records found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = ApiTableDataTO(to, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#обновление данных в таблице то
class TOUpdateView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = TO.objects.all()
    serializer_class = ApiTableDataTO

    @swagger_auto_schema(
        operation_description="Update TO details",
        manual_parameters=[jwt_token], 
        responses={
            200: ApiTableDataTO(),
            400: "Invalid request.",
            403: "Forbidden.",
            404: "TO not found."
        }
    )

    def get_object(self):
        try:
            obj = super().get_object()
        except TO.DoesNotExist:
            return Response("Not found data",status=status.HTTP_404_NOT_FOUND)
        
        if self.request.user.useRole != 'manager':
            if obj.machine.client != self.request.user.username:
                if obj.serviceCompany.name != self.request.user.username:
                    raise serializers.ValidationError("У вас нет прав на изменение этой записи")
                else:
                    return obj
            return obj
        return obj
    
#таблица рекламаций
class ApiTableDataReclamationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Update TO details",
        manual_parameters=[jwt_token], 
        responses={
            200: ApiTableDataReclamation(),
            400: "Invalid request.",
            403: "Forbidden.",
            404: "TO not found."
        }
    )
    

    def get(self, request):
        try:
            user_role = request.user.useRole

            if user_role == 'serviceCompany':
                service_company = ServiceCompany.objects.get(name=request.user)
                machines = Machine.objects.filter(serviceCompany=service_company)
            else:
                machines = Machine.objects.filter(client=request.user)

            if not machines.exists():
                return Response({"error": "No machines found for the user."}, status=status.HTTP_404_NOT_FOUND)
            
            reclamations = Reclamation.objects.filter(machine__in=machines)
            if not reclamations.exists():
                return Response({"error": "No reclamations found for the user."}, status=status.HTTP_404_NOT_FOUND)
            
            serializers = ApiTableDataReclamation(reclamations, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        
        except ServiceCompany.DoesNotExist:
            return Response({"error": "Service company not found for the user."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

#обновление данных в таблице рекламаций
class ReclamationUpdateView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Reclamation.objects.all()
    serializer_class = ApiTableDataReclamation

    @swagger_auto_schema(
        operation_description="Update Reclamation details",
        manual_parameters=[jwt_token], 
        responses={
            200: ApiTableDataReclamation(),
            400: "Invalid request.",
            403: "Forbidden.",
            404: "Reclamation not found."
        }
    )

    def get_object(self):
        try:
            obj = super().get_object()
        except Reclamation.DoesNotExist:
            return Response("Not found data",status=status.HTTP_404_NOT_FOUND)
        
        if obj.serviceCompany.name != self.request.user.username:
            if self.request.user.useRole == 'manager':
                return obj
            return Response("Not access",status=status.HTTP_404_NOT_FOUND)
        else:
            return obj  
        return obj
    
#вывод подробной информации о модели
class ApiReferenceModelView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение подробной информации о модели",
        manual_parameters=[
            openapi.Parameter(
                'name',
                openapi.IN_QUERY,
                description="Название модели",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            200: ApiReferenceModel,  # Замените на правильный сериализатор
            400: 'Параметр name обязателен.',
            404: 'Модель с таким названием не найдена.',
        }
    )
    def get(self, request):
        # Получение параметра из запроса
        name = request.GET.get('name')
        
        # Если параметр отсутствует, возвращаем ошибку 400
        if not name:
            return Response(
                {'error': 'Параметр name обязателен.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Поиск модели в базе данных
            model = ReferenceModel.objects.get(name=name)
        except ReferenceModel.DoesNotExist:
            # Возвращаем ошибку 404, если модель не найдена
            raise NotFound({'error': 'Модель с таким названием не найдена.'})

        # Сериализация данных и возврат успешного ответа
        serializer = ApiReferenceModel(model)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
#вывод подробной информации о типе ТО
class ApiMaintenanceTypeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get To details",
        manual_parameters=[
            openapi.Parameter(
                'name',
                openapi.IN_QUERY,
                description="Name of the type",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            200: ApiMaintenanceType,
            400: 'Name is required.',
            404: 'TO not found.',
        }
    )

    def get(self, request):
        name = request.GET.get('name')
        if not name:
            return Response({'Не введен параметр'}, sstatus=status.HTTP_404_NOT_FOUND)
        
        model = MaintenanceType.objects.get(name=name)
        serializer = ApiMaintenanceType(model)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
#вывод подробной информации о причине отказа
class ApiFailureNodeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get To details",
        manual_parameters=[
            openapi.Parameter(
                'name',
                openapi.IN_QUERY,
                description="Name of the type",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            200: ApiFailureNode,
            400: 'Name is required.',
            404: 'Node not found.',
        }
    )

    def get(self, request):
        name = request.GET.get('name')
        if not name:
            return Response({'Не введен параметр'}, status=status.HTTP_404_NOT_FOUND)
        
        model = FailureNode.objects.get(name=name)
        serializer = ApiFailureNode(model)       
        return Response(serializer.data, status=status.HTTP_200_OK)
    
#вывод подробной информации о методе восстановления
class ApiRecoveryMethodView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get To details",
        manual_parameters=[
            openapi.Parameter(
                'name',
                openapi.IN_QUERY,
                description="Name of the type",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            200: ApiRecoveryMethod,
            400: 'Name is required.',
            404: 'Method not found.',
        }
    )

    def get(self, request):
        name = request.GET.get('name')
        if not name:
            return Response({'Не введен параметр'}, status=status.HTTP_404_NOT_FOUND) 
          
        model = RecoveryMethod.objects.get(name=name)
        serializer = ApiRecoveryMethod(model)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
#вывод подробной информации о сервисной компании
class ApiServiceCompanyView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get To details",
        manual_parameters=[
            openapi.Parameter(
                'name',
                openapi.IN_QUERY,
                description="Name of the type",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            200: ApiSrviceCompany,
            400: 'Name is required.',
            404: 'Method not found.',
        }
    )

    def get(self, request):
        name = request.GET.get('name')
        if not name:
            return Response({'Не введен параметр'}, status=status.HTTP_404_NOT_FOUND) 
          
        model = ServiceCompany.objects.get(name=name)
        serializer = ApiSrviceCompany(model)
        return Response(serializer.data, status=status.HTTP_200_OK)
