# 🚀 Production Deployment Guide - Sudanese Teacher

Complete step-by-step guide for deploying SUDATUTOR to a Linux production server using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Preparation](#server-preparation)
3. [Project Setup](#project-setup)
4. [Docker Deployment](#docker-deployment)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL Setup](#ssl-setup)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Linux Server** (Ubuntu 20.04+ or similar)
- ✅ **SSH Access** with sudo privileges
- ✅ **Domain Name** (optional but recommended)
- ✅ **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)
- ✅ **File Search Store** created with curriculum data (see CORPUS_SETUP.md)

### Minimum Server Requirements

- **CPU**: 2 cores
- **RAM**: 2 GB
- **Disk**: 10 GB free space
- **OS**: Ubuntu 20.04 LTS or newer
- **Network**: Public IP address

---

## Server Preparation

### Step 1: Connect to Your Server

```bash
ssh username@your-server-ip
```

### Step 2: Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

### Step 3: Install Docker

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installation script
sudo sh get-docker.sh

# Add your user to the docker group
sudo usermod -aG docker $USER

# Activate group changes (or log out and back in)
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

### Step 4: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 5: Install Git

```bash
sudo apt install git -y
git --version
```

### Step 6: Configure Firewall

```bash
# Install UFW (if not already installed)
sudo apt install ufw -y

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: do this before enabling firewall)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow application port
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

---

## Project Setup

### Step 1: Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/sudatutor-v6
cd /opt

# Clone the repository
sudo git clone https://github.com/O96a/sudatutor-v6.git

# Change ownership to your user
sudo chown -R $USER:$USER sudatutor-v6

# Navigate to project
cd sudatutor-v6
```

### Step 2: Configure Environment Variables

```bash
# Create .env file from template
cp .env.production.example .env

# Edit with your favorite editor
nano .env
```

Add your actual configuration:

```env
GEMINI_API_KEY=your-actual-api-key-here
NODE_ENV=production
```

**Save the file:**
- In nano: Press `Ctrl+O`, then `Enter`, then `Ctrl+X`
- In vim: Press `Esc`, type `:wq`, press `Enter`

### Step 3: Secure Environment File

```bash
# Set restrictive permissions
chmod 600 .env

# Verify permissions
ls -la .env
# Should show: -rw------- (only owner can read/write)
```

### Step 4: Verify Configuration

```bash
# Check that app.config.ts has the correct File Search Store ID
cat config/app.config.ts | grep FILE_SEARCH_STORE_NAME

# Expected output should show your store ID:
# FILE_SEARCH_STORE_NAME: 'fileSearchStores/your-store-id-here'
```

---

## Docker Deployment

### Step 1: Build Docker Image

```bash
# Build the image (this takes 3-5 minutes)
docker build -t sudatutor:latest .

# Verify image was created
docker images | grep sudatutor
```

### Step 2: Start Application

```bash
# Start with Docker Compose
docker-compose up -d

# The -d flag runs in detached mode (background)
```

### Step 3: Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f sudatutor

# Press Ctrl+C to exit logs
```

Expected output for `docker-compose ps`:
```
NAME              IMAGE       COMMAND                  STATUS        PORTS
sudatutor-app     sudatutor   "serve -s dist -l 30…"   Up (healthy)  0.0.0.0:3000->3000/tcp
```

### Step 4: Test Application

```bash
# Test from server
curl http://localhost:3000

# You should see HTML content returned

# Test health check
docker inspect sudatutor-app --format='{{.State.Health.Status}}'
# Should return: healthy
```

### Step 5: Test from Browser

Open your browser and navigate to:
```
http://your-server-ip:3000
```

You should see the Sudanese Teacher application!

---

## Nginx Configuration

For production, use Nginx as a reverse proxy to handle SSL and improve performance.

### Step 1: Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl status nginx
```

### Step 2: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/sudatutor
```

Add the following configuration (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Logging
    access_log /var/log/nginx/sudatutor-access.log;
    error_log /var/log/nginx/sudatutor-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # WebSocket support (if needed in future)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Disable proxy buffering
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### Step 3: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/sudatutor /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 4: Update Firewall

```bash
# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'

# Remove direct access to port 3000 (optional, for security)
sudo ufw delete allow 3000/tcp

# Check status
sudo ufw status
```

### Step 5: Configure DNS

Point your domain to your server's IP address:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add/Update DNS records:
   - **A Record**: `@` → `your-server-ip`
   - **A Record**: `www` → `your-server-ip`
3. Wait for DNS propagation (can take 5 minutes to 48 hours)

**Verify DNS:**
```bash
nslookup your-domain.com
dig your-domain.com
```

---

## SSL Setup

Secure your application with free SSL certificates from Let's Encrypt.

### Step 1: Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts:
1. Enter your email address
2. Agree to Terms of Service
3. Choose whether to share email with EFF
4. Select option 2 (Redirect HTTP to HTTPS)

### Step 3: Test SSL

Open your browser and navigate to:
```
https://your-domain.com
```

You should see a secure padlock icon!

### Step 4: Test Auto-Renewal

```bash
# Dry run
sudo certbot renew --dry-run

# If successful, auto-renewal is configured
```

Certificates auto-renew via cron job at `/etc/cron.d/certbot`

### Step 5: Verify SSL Configuration

Test your SSL setup:
```bash
# Use SSL Labs
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check container status
docker-compose ps

# View recent logs
docker-compose logs --tail=50 sudatutor

# Check disk space
df -h

# Check memory usage
free -h

# Monitor container resources
docker stats sudatutor-app
```

### Viewing Logs

```bash
# Application logs
docker-compose logs -f sudatutor

# Nginx access logs
sudo tail -f /var/log/nginx/sudatutor-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/sudatutor-error.log

# System logs
sudo journalctl -u docker -f
```

### Updating the Application

```bash
# Navigate to project directory
cd /opt/sudatutor-v6

# Pull latest changes from GitHub
git pull origin main

# Rebuild Docker image
docker build -t sudatutor:latest .

# Restart container with new image
docker-compose down
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs -f sudatutor
```

### Backup Strategy

```bash
# Create backup script
nano /home/$USER/backup-sudatutor.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/sudatutor-$DATE.tar.gz /opt/sudatutor-v6

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs -r rm

echo "Backup completed: sudatutor-$DATE.tar.gz"
```

Make executable and run:
```bash
chmod +x /home/$USER/backup-sudatutor.sh
/home/$USER/backup-sudatutor.sh
```

Add to crontab for weekly backups:
```bash
crontab -e

# Add this line (runs every Sunday at 2 AM)
0 2 * * 0 /home/$USER/backup-sudatutor.sh
```

### Resource Monitoring

```bash
# Install monitoring tools
sudo apt install htop nethogs iotop -y

# Monitor system resources
htop

# Monitor network usage
sudo nethogs

# Monitor disk I/O
sudo iotop
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker-compose logs sudatutor

# Check if port is in use
sudo netstat -tulpn | grep 3000

# Rebuild from scratch
docker-compose down
docker system prune -a
docker build -t sudatutor:latest .
docker-compose up -d
```

### API Key Issues

```bash
# Verify environment variable is set in container
docker-compose exec sudatutor printenv | grep GEMINI

# Check .env file
cat .env | grep GEMINI_API_KEY

# Restart container after fixing .env
docker-compose restart
```

### Can't Access from Browser

```bash
# Test internal connection
curl http://localhost:3000

# Check firewall
sudo ufw status

# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Restart Nginx
sudo systemctl restart nginx
```

### High Memory Usage

```bash
# Check container stats
docker stats

# Restart container
docker-compose restart

# Adjust memory limits in docker-compose.yml
nano docker-compose.yml
# Modify the deploy.resources.limits.memory value
```

### File Search Store Errors

```bash
# Verify store ID in config
cat config/app.config.ts | grep FILE_SEARCH_STORE_NAME

# Test API connection from container
docker-compose exec sudatutor sh
# Inside container:
wget -O- https://generativelanguage.googleapis.com/v1beta/models
exit
```

---

## Security Best Practices

### 1. Keep System Updated

```bash
# Update weekly
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### 2. Secure SSH Access

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended changes:
# PermitRootLogin no
# PasswordAuthentication no (use SSH keys instead)
# Port 2222 (change default port)

# Restart SSH
sudo systemctl restart ssh
```

### 3. Implement Fail2Ban

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure for Nginx
sudo nano /etc/fail2ban/jail.local

# Add:
[nginx-http-auth]
enabled = true
[nginx-noscript]
enabled = true

# Start service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Regular Backups

- Automate backups (see Backup Strategy above)
- Store backups off-site
- Test restore procedures regularly

### 5. Monitor Logs

```bash
# Set up log rotation
sudo nano /etc/logrotate.d/sudatutor

# Add:
/var/log/nginx/sudatutor-*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

### 6. Use Docker Secrets (Advanced)

For enhanced security, use Docker secrets instead of environment variables:

```bash
# Create secrets
echo "your-api-key" | docker secret create gemini_api_key -

# Update docker-compose.yml to use secrets
```

### 7. Implement Rate Limiting

Add to Nginx configuration:

```nginx
# In http block
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# In location block
limit_req zone=api burst=20 nodelay;
```

---

## Quick Command Reference

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# Restart application
docker-compose restart

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Update application
git pull && docker build -t sudatutor:latest . && docker-compose up -d

# Backup
tar -czf backup-$(date +%Y%m%d).tar.gz /opt/sudatutor-v6

# Check health
curl http://localhost:3000

# Rebuild from scratch
docker-compose down && docker system prune -a && docker build -t sudatutor:latest . && docker-compose up -d
```

---

## Support & Resources

- **GitHub**: [O96a/sudatutor-v6](https://github.com/O96a/sudatutor-v6)
- **Issues**: [Report a problem](https://github.com/O96a/sudatutor-v6/issues)
- **Documentation**: See README.md and CORPUS_SETUP.md

---

## Checklist

Use this checklist to ensure successful deployment:

- [ ] Server meets minimum requirements
- [ ] Docker and Docker Compose installed
- [ ] Git repository cloned
- [ ] .env file configured with API key
- [ ] File Search Store created and configured
- [ ] Docker image built successfully
- [ ] Container running and healthy
- [ ] Application accessible from browser
- [ ] Nginx installed and configured
- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] Auto-restart on reboot configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Documentation reviewed

---

**Deployment completed!** 🎉

Your Sudanese Teacher application is now running in production!

Access it at: `https://your-domain.com`
