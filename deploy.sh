#!/bin/bash

# Create deployment directory
mkdir -p /opt/cntr-service
cd /opt/cntr-service

# Copy all necessary files
cp -r ./* /opt/cntr-service/

# Set proper permissions
chmod +x /opt/cntr-service/deploy.sh

# Build and start containers
docker-compose up -d --build

# Check container status
docker-compose ps

# Show logs
docker-compose logs -f 