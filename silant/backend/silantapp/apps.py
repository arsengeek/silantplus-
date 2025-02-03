from django.apps import AppConfig


class SilantappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'silantapp'

    def ready(self):
        import silantapp.signals
