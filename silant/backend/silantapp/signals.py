from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

@receiver(user_logged_in)
def add_role_on_login(sender, user, request, **kwargs):
    if not user.useRole:
        user.role = 'client'
        user.save() 
