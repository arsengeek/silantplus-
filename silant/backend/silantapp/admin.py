from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserRole

@admin.register(UserRole)
class UserRoleAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'useRole', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Role', {'fields': ('useRole',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'useRole', 'is_staff', 'is_superuser')}
        ),
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'useRole')

    filter_horizontal = []