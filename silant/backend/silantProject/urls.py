from django.contrib import admin
from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from silantapp.views import (
   CustomTokenObtainPairView, 
   ApiTableDataMachineView,
   ApiTableFullDataMachineView,
   ApiTableDataTOView,
   TOUpdateView,
   ApiTableDataReclamationView,
   ReclamationUpdateView,
   ApiReferenceModelView,
   ApiMaintenanceTypeView,
   ApiFailureNodeView,
   ApiRecoveryMethodView,
   MachineUpdateView,
   ApiServiceCompanyView)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.authentication import JWTAuthentication

#схема для swagger
schema_view = get_schema_view(
   openapi.Info(
      title="Your API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@yourapi.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
   authentication_classes=[JWTAuthentication]
)

urlpatterns = [
   path('admin/', admin.site.urls),
   path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('api/machine/', ApiTableDataMachineView.as_view(), name='machine_detail'),
   path('api/to/', ApiTableDataTOView.as_view(), name='to_detail'),
   path('api/machine/full/', ApiTableFullDataMachineView.as_view(), name='machine_full_detail'),
   path('api/to/update/<int:pk>/', TOUpdateView.as_view(), name='to-update'),
   path('api/reclamation/', ApiTableDataReclamationView.as_view(), name='reclamation_detail'),
   path('api/reclamation/update/<int:pk>/', ReclamationUpdateView.as_view(), name='reclamation-update'),
   path('api/checkmodel/', ApiReferenceModelView.as_view(), name='check_model'),
   path('api/typeTo/', ApiMaintenanceTypeView.as_view(), name='check_typeTo'),
   path('api/reject/', ApiFailureNodeView.as_view(), name='check_reject'),
   path('api/recovery/', ApiRecoveryMethodView.as_view(), name='check_recovery'),
   path('api/servicecompany/', ApiServiceCompanyView.as_view(), name='sevice_company'),
   path('api/update/machine/<int:pk>/', MachineUpdateView.as_view(), name='update_machine'),
   re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]