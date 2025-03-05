from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),  # админка будет доступна по /admin/
    path('tests/', include('tests.urls')),  # URLs для приложения tests
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 