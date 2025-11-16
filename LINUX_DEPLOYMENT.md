# 🐧 Linux Server Deployment Guide - SudaTutor

Complete step-by-step guide to deploy SudaTutor on a Linux server using Docker.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Preparation](#server-preparation)
3. [Clone Repository](#clone-repository)
4. [Environment Setup](#environment-setup)
5. [Docker Installation](#docker-installation)
6. [Build & Deploy](#build--deploy)
7. [Nginx Reverse Proxy (Optional)](#nginx-reverse-proxy)
8. [SSL/HTTPS Setup](#sslhttps-setup)
9. [Monitoring & Logs](#monitoring--logs)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:

- ✅ Linux server (Ubuntu 20.04+, Debian 11+, CentOS 8+, etc.)
- ✅ SSH access to the server (with sudo privileges)
- ✅ Domain name (optional, but recommended for production)
- ✅ Gemini API Key from [Google AI Studio](https://aistudio.google.com/apikey)
- ✅ Git installed on the server
- ✅ At least 1GB RAM and 10GB disk space

---

## 🖥️ Server Preparation

### Step 1: Connect to Your Server

```bash
# SSH into your Linux server
ssh your-username@your-server-ip

# Example:
ssh root@192.168.1.100
# or
ssh ubuntu@myserver.com
```

### Step 2: Update System Packages

```bash
# For Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# For CentOS/RHEL
sudo yum update -y

# For Fedora
sudo dnf update -y
```

### Step 3: Install Essential Tools

```bash
# For Ubuntu/Debian
sudo apt install -y curl wget git vim ufw

# For CentOS/RHEL
sudo yum install -y curl wget git vim firewalld

# For Fedora
sudo dnf install -y curl wget git vim firewalld
```

---

## 📥 Clone Repository

### Step 1: Navigate to Project Directory

```bash
# Create a directory for projects
sudo mkdir -p /opt/apps
cd /opt/apps

# Or use your home directory
cd ~
```

### Step 2: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/O96a/sudatutor-v6.git

# Navigate into the project
cd sudatutor-v6

# Verify you're on the main branch
git branch
```

### Step 3: Check Latest Updates

```bash
# Pull the latest changes (if needed)
git pull origin main

# View commit history
git log --oneline -5
```

---

## 🔐 Environment Setup

### Step 1: Create Environment File

```bash
# Create .env file
nano .env
```

### Step 2: Add Environment Variables

Add the following content to `.env`:

```env
# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Application Configuration
NODE_ENV=production

# Optional: Port configuration (if you want to change)
# PORT=3000
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter`

### Step 3: Secure the Environment File

```bash
# Set proper permissions
chmod 600 .env

# Verify permissions
ls -la .env
# Should show: -rw------- (only owner can read/write)
```

### Step 4: Verify File Search Store Configuration

```bash
# Check the config file
cat config/app.config.ts | grep FILE_SEARCH_STORE_NAME

# Should show:
# FILE_SEARCH_STORE_NAME: 'fileSearchStores/sudan-curriculum-file-searc-1es7p89safsi',
```

✅ **Configuration is already set to your new filestore!**

---

## 🐳 Docker Installation

### Option A: Ubuntu/Debian

```bash
# Remove old versions (if any)
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Option B: CentOS/RHEL

```bash
# Remove old versions
sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# Install prerequisites
sudo yum install -y yum-utils

# Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Option C: Quick Install Script (All Distributions)

```bash
# Official Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clean up
rm get-docker.sh
```

### Post-Installation Steps

```bash
# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, avoids using sudo)
sudo usermod -aG docker $USER

# Apply group changes (logout/login or use this command)
newgrp docker

# Verify Docker installation
docker --version
docker-compose --version

# Test Docker
docker run hello-world
```

**Expected output:**
```
Docker version 24.x.x, build xxxxx
Docker Compose version v2.x.x
```

---

## 🚀 Build & Deploy

### Step 1: Build Docker Image

```bash
# Make sure you're in the project directory
cd /opt/apps/sudatutor-v6
# or
cd ~/sudatutor-v6

# IMPORTANT: Load environment variables before building
# Docker needs to read the .env file during build
export $(grep -v '^#' .env | xargs)

# Build the Docker image (this may take 5-10 minutes)
# The API key will be baked into the static files during build
docker-compose build --no-cache

# View build progress
# You should see:
# - Installing npm dependencies
# - Building the application with Vite
# - Creating production image
```

**Note:** The `--no-cache` flag ensures a fresh build with the latest environment variables.

### Step 2: Start the Application

```bash
# Start the application in detached mode
docker-compose up -d

# Check running containers
docker-compose ps

# You should see:
# NAME                STATUS              PORTS
# sudatutor-app       Up                  0.0.0.0:3000->3000/tcp
```

### Step 3: Verify Deployment

```bash
# Check if the container is running
docker ps

# Check container logs
docker-compose logs -f

# Test the application
curl http://localhost:3000

# You should see the HTML content of your application
```

### Step 4: Configure Firewall

```bash
# For UFW (Ubuntu/Debian)
sudo ufw allow 3000/tcp
sudo ufw allow 22/tcp  # Keep SSH open!
sudo ufw enable
sudo ufw status

# For firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

### Step 5: Access Your Application

Open your browser and navigate to:
```
http://your-server-ip:3000
```

Example:
- `http://192.168.1.100:3000`
- `http://myserver.com:3000`

✅ **Your application should now be running!**

---

## 🌐 Nginx Reverse Proxy (Optional but Recommended)

Using Nginx as a reverse proxy provides:
- Custom domain support
- SSL/HTTPS
- Better security
- Caching

### Step 1: Install Nginx

```bash
# For Ubuntu/Debian
sudo apt install -y nginx

# For CentOS/RHEL
sudo yum install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Create Nginx Configuration

```bash
# Create a new configuration file
sudo nano /etc/nginx/sites-available/sudatutor

# For CentOS/RHEL use:
# sudo nano /etc/nginx/conf.d/sudatutor.conf
```

### Step 3: Add Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Or use your server IP if you don't have a domain:
    # server_name 192.168.1.100;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/sudatutor-access.log;
    error_log /var/log/nginx/sudatutor-error.log;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Client body size limit (for future file uploads if needed)
    client_max_body_size 10M;
}
```

**Save and exit** (`Ctrl+X`, `Y`, `Enter`)

### Step 4: Enable Configuration

```bash
# For Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/sudatutor /etc/nginx/sites-enabled/

# For CentOS/RHEL (already enabled)
# Configuration is already active in conf.d/

# Test Nginx configuration
sudo nginx -t

# Should show:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5: Update Firewall

```bash
# For UFW
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 3000/tcp  # Close direct access to port 3000

# For firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --remove-port=3000/tcp
sudo firewall-cmd --reload
```

### Step 6: Test Access

Now access your application via:
```
http://your-domain.com
# or
http://your-server-ip
```

Port 3000 is no longer needed in the URL! 🎉

---

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
# For Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# For CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx

# Obtain and install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# 1. Enter your email
# 2. Agree to terms
# 3. Choose to redirect HTTP to HTTPS (recommended)

# Certbot will automatically:
# - Obtain SSL certificate
# - Update Nginx configuration
# - Set up auto-renewal
```

### Verify SSL

```bash
# Test SSL configuration
sudo nginx -t

# Check certificate renewal
sudo certbot renew --dry-run

# View certificates
sudo certbot certificates
```

### Access Your Secure Application

```
https://your-domain.com
```

✅ **Your application is now secured with HTTPS!**

---

## 📊 Monitoring & Logs

### Docker Logs

```bash
# View real-time logs
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# View logs for specific time
docker-compose logs --since 30m

# View specific container logs
docker logs sudatutor-app
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/sudatutor-access.log

# Error logs
sudo tail -f /var/log/nginx/sudatutor-error.log

# View last 50 lines
sudo tail -n 50 /var/log/nginx/sudatutor-error.log
```

### Container Stats

```bash
# View resource usage
docker stats sudatutor-app

# View all containers
docker stats

# Press Ctrl+C to exit
```

### Health Check

```bash
# Check container health
docker inspect sudatutor-app --format='{{.State.Health.Status}}'

# Should show: healthy

# Check application endpoint
curl http://localhost:3000
```

---

## 🔧 Management Commands

### Start/Stop/Restart

```bash
# Stop the application
docker-compose stop

# Start the application
docker-compose start

# Restart the application
docker-compose restart

# Stop and remove containers
docker-compose down

# Start fresh
docker-compose up -d
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Rebuild and restart (with --no-cache to ensure env vars are updated)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs -f
```

### Cleanup

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a

# Free up disk space
df -h
```

---

## 🐛 Troubleshooting

### Issue 1: Container Won't Start

```bash
# Check logs
docker-compose logs

# Check if port is already in use
sudo netstat -tulpn | grep 3000
# or
sudo lsof -i :3000

# Kill process using port 3000
sudo kill -9 <PID>

# Restart Docker service
sudo systemctl restart docker
docker-compose up -d
```

### Issue 2: API Key Not Working

```bash
# Verify environment file
cat .env

# Ensure the API key is properly formatted (no quotes, spaces, or special characters)
# Correct format:
# GEMINI_API_KEY=AIza...

# Load environment variables into shell
export $(grep -v '^#' .env | xargs)

# Verify it's loaded
echo $GEMINI_API_KEY

# Rebuild with the API key baked into the static files
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check if it's working
docker-compose logs -f
```

**Important:** For static site builds (like Vite), the API key must be available **during build time**, not just runtime. That's why we export it before building.

### Issue 3: Permission Denied

```bash
# Fix ownership
sudo chown -R $USER:$USER /opt/apps/sudatutor-v6

# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

### Issue 4: Out of Memory

```bash
# Check memory usage
free -h

# Increase swap space (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Issue 5: Application Shows Errors

```bash
# Check browser console for errors
# Open Developer Tools (F12) → Console

# Verify filestore configuration
cat config/app.config.ts | grep FILE_SEARCH_STORE_NAME

# Test Gemini API manually
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY_HERE"
```

### Issue 6: Nginx 502 Bad Gateway

```bash
# Check if Docker container is running
docker ps

# Check if app is listening on port 3000
curl http://localhost:3000

# Check Nginx error logs
sudo tail -f /var/log/nginx/sudatutor-error.log

# Restart both services
docker-compose restart
sudo systemctl restart nginx
```

---

## 🔄 Auto-Restart on Server Reboot

### Enable Docker Auto-Start

```bash
# Enable Docker service
sudo systemctl enable docker

# Set container restart policy (already configured in docker-compose.yml)
# restart: unless-stopped

# Verify
docker inspect sudatutor-app --format='{{.HostConfig.RestartPolicy.Name}}'
# Should show: unless-stopped
```

### Test Reboot

```bash
# Reboot server
sudo reboot

# After reboot, SSH back in and check
docker ps
# Container should be running automatically
```

---

## 📈 Performance Optimization

### Enable Nginx Caching

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/sudatutor
```

Add caching configuration:

```nginx
# Add at the top of the file (outside server block)
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=sudatutor_cache:10m max_size=100m inactive=60m;
proxy_cache_key "$scheme$request_method$host$request_uri";

server {
    # ... existing configuration ...

    location / {
        # Enable caching
        proxy_cache sudatutor_cache;
        proxy_cache_valid 200 60m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header X-Cache-Status $upstream_cache_status;

        # ... existing proxy settings ...
    }
}
```

```bash
# Create cache directory
sudo mkdir -p /var/cache/nginx
sudo chown -R www-data:www-data /var/cache/nginx

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🎯 Quick Reference Commands

```bash
# Load environment variables (do this before building!)
export $(grep -v '^#' .env | xargs)

# View application
docker-compose ps

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Update application with env vars
git pull && export $(grep -v '^#' .env | xargs) && docker-compose down && docker-compose up -d --build --no-cache

# Check health
curl http://localhost:3000

# View Nginx logs
sudo tail -f /var/log/nginx/sudatutor-access.log

# Reload Nginx
sudo systemctl reload nginx

# Clean Docker
docker system prune -a
```

---

## ✅ Post-Deployment Checklist

- [ ] Application is accessible via browser
- [ ] Grade/subject selection works
- [ ] Chat responses are working
- [ ] Math equations render correctly (for math subjects)
- [ ] Arabic text displays correctly (RTL)
- [ ] Source citations appear
- [ ] Mobile view works
- [ ] HTTPS is enabled (if using domain)
- [ ] Logs are accessible
- [ ] Auto-restart on reboot is configured
- [ ] Firewall rules are set
- [ ] Backup strategy is in place

---

## 🎉 Success!

Your SudaTutor application is now:
- ✅ Running in Docker
- ✅ Using your new API key
- ✅ Accessible on your Linux server
- ✅ Production-ready

**Access your application:**
- **With domain + HTTPS:** `https://your-domain.com`
- **With domain (HTTP):** `http://your-domain.com`
- **With IP + Nginx:** `http://your-server-ip`
- **Direct Docker:** `http://your-server-ip:3000`

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker-compose logs -f`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/sudatutor-error.log`
4. Open an issue on GitHub: https://github.com/O96a/sudatutor-v6/issues

---

**Happy Deploying! 🚀🎓**
