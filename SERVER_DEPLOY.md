# Инструкция по развертыванию на сервере

## 1. Подготовка сервера

### Установка Docker и Docker Compose
```bash
# Обновление пакетов
sudo apt-get update

# Установка необходимых пакетов
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Добавление GPG ключа Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Настройка репозитория
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Добавление пользователя в группу docker
sudo usermod -aG docker ${USER}
```

## 2. Развертывание приложения

### Создание директории и копирование файлов
```bash
# Создание директории
sudo mkdir -p /opt/cntr-service
sudo chown $USER:$USER /opt/cntr-service
cd /opt/cntr-service

# Копирование файлов проекта
# (выполните эту команду на вашем локальном компьютере)
scp -r /path/to/local/project/* user@server:/opt/cntr-service/
```

### Проверка файлов
```bash
# Проверка наличия всех необходимых файлов
ls -la /opt/cntr-service
```

### Запуск приложения
```bash
# Переход в директорию проекта
cd /opt/cntr-service

# Запуск контейнеров
docker-compose up -d

# Проверка статуса
docker-compose ps
```

## 3. Проверка работоспособности

### Проверка логов
```bash
# Просмотр логов
docker-compose logs -f
```

### Тестирование API
```bash
# Проверка эндпоинта сотрудника
curl http://localhost:3008/employee/1

# Проверка эндпоинта ПВА
curl http://localhost:3008/pva/data?docId=586306789
```

## 4. Настройка автозапуска

### Создание systemd сервиса
```bash
sudo nano /etc/systemd/system/cntr-service.service
```

Добавьте следующее содержимое:
```ini
[Unit]
Description=CNTR Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/cntr-service
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

### Включение автозапуска
```bash
sudo systemctl enable cntr-service
sudo systemctl start cntr-service
```

## 5. Настройка файрвола

```bash
# Разрешение порта 3008
sudo ufw allow 3008

# Проверка статуса
sudo ufw status
```

## 6. Мониторинг

### Проверка статуса сервиса
```bash
# Статус контейнеров
docker-compose ps

# Логи в реальном времени
docker-compose logs -f

# Использование ресурсов
docker stats
```

## 7. Обновление приложения

```bash
# Остановка контейнеров
docker-compose down

# Получение обновлений
git pull

# Пересборка и запуск
docker-compose up -d --build
```

## 8. Устранение неполадок

### Проверка логов
```bash
# Логи приложения
docker-compose logs app

# Логи базы данных
docker-compose logs db
```

### Проверка сетевых настроек
```bash
# Проверка доступности порта
netstat -tulpn | grep 3008

# Проверка подключения к БД
docker exec cntr-service nc -zv 192.168.1.100 1433
```

### Перезапуск сервиса
```bash
# Перезапуск контейнеров
docker-compose restart

# Полный перезапуск
docker-compose down
docker-compose up -d
``` 