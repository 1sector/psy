INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'tests',
    'corsheaders',  # Добавьте это
]

ALLOWED_HOSTS = ['*']  # В продакшене лучше указать конкретный домен

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Добавьте это
]

CORS_ALLOWED_ORIGINS = [
    "https://psyho.netlify.app",
    "http://localhost:5173",  # Для локальной разработки
]

CSRF_TRUSTED_ORIGINS = [
    "https://psyho.netlify.app",
] 