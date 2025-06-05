# Deployment Guide

This guide explains how to deploy the cntr-service on an Ubuntu server using Docker.

## Prerequisites

### 1. Install Docker
```bash
# Update package list
sudo apt-get update

# Install required packages
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Add your user to docker group
sudo usermod -aG docker ${USER}
```

### 2. Install Docker Compose
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Apply executable permissions
sudo chmod +x /usr/local/bin/docker-compose
```

## Deployment Steps

### 1. Prepare the Server
```bash
# Create deployment directory
mkdir -p /opt/cntr-service
cd /opt/cntr-service
```

### 2. Copy Project Files
Copy the following files to the server:
- All application files
- Dockerfile
- docker-compose.yml
- .dockerignore

### 3. Deploy the Application
```bash
# Build and start containers
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Verify Deployment
```bash
# Test the API endpoint
curl http://localhost:3008/employee/1
```

## Firewall Configuration

If using UFW (Uncomplicated Firewall):
```bash
# Allow SSH
sudo ufw allow 22

# Allow the application port
sudo ufw allow 3008

# If using external MSSQL
sudo ufw allow out 1433/tcp
sudo ufw allow in 1433/tcp

# Enable firewall
sudo ufw enable
```

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart containers
docker-compose up -d --build
```

### View Logs
```bash
# View application logs
docker-compose logs -f app
```

### Stop Application
```bash
# Stop containers
docker-compose down
```

## Troubleshooting

### Check Container Status
```bash
# List containers
docker ps -a

# Check container logs
docker logs cntr-service
```

### Database Connectivity
```bash
# Test MSSQL connection from container
docker exec cntr-service nc -zv 192.168.1.100 1433
```

### Common Issues

1. **Container fails to start:**
   - Check logs: `docker-compose logs app`
   - Ensure all required files are present
   - Verify database server is accessible at 192.168.1.100

2. **Database connection fails:**
   - Verify DB_SERVER (192.168.1.100) is accessible
   - Check if port 1433 is open
   - Verify database credentials (sa/YourStrong@Passw0rd)
   - Check if LINKED_SERVER (OW) is configured correctly

3. **Permission issues:**
   - Ensure proper file permissions
   - Check Docker daemon is running
   - Verify user is in docker group 