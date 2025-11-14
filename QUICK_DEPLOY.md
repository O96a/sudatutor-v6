# 🚀 Quick Start - Production Deployment

This is a condensed version of the full deployment guide. For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## What I Just Did

✅ Updated README.md with comprehensive documentation
✅ Updated GitHub repository URL to O96a/sudatutor-v6
✅ Optimized Docker configuration for production
✅ Created detailed deployment guide (DEPLOYMENT_GUIDE.md)
✅ Created production environment template (.env.production.example)
✅ Committed and pushed everything to GitHub

## Your Next Steps - Deploy to Linux Server

### 1️⃣ Connect to Your Server

```bash
ssh username@your-server-ip
```

### 2️⃣ Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3️⃣ Clone Repository

```bash
cd /opt
sudo git clone https://github.com/O96a/sudatutor-v6.git
sudo chown -R $USER:$USER sudatutor-v6
cd sudatutor-v6
```

### 4️⃣ Configure Environment

```bash
# Create .env file
nano .env
```

Add your API key:
```env
GEMINI_API_KEY=your-actual-api-key-here
NODE_ENV=production
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Secure the file
chmod 600 .env
```

### 5️⃣ Deploy with Docker

```bash
# Build image
docker build -t sudatutor:latest .

# Start application
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### 6️⃣ Configure Firewall

```bash
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 7️⃣ Test It!

```bash
# From server
curl http://localhost:3000

# From browser
http://your-server-ip:3000
```

## Optional but Recommended

### Setup Nginx + SSL

```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/sudatutor
```

Paste the Nginx config from DEPLOYMENT_GUIDE.md, then:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sudatutor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Allow Nginx
sudo ufw allow 'Nginx Full'

# Install SSL
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Common Commands

```bash
# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Update app
git pull && docker build -t sudatutor:latest . && docker-compose up -d

# Check health
docker-compose ps
curl http://localhost:3000
```

## Troubleshooting

**Container won't start?**
```bash
docker-compose logs sudatutor
```

**Can't access from browser?**
```bash
# Check firewall
sudo ufw status

# Test internal
curl http://localhost:3000
```

**Need to rebuild?**
```bash
docker-compose down
docker system prune -a
docker build -t sudatutor:latest .
docker-compose up -d
```

## Important Files

- **README.md** - Complete project documentation
- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **CORPUS_SETUP.md** - File Search Store setup
- **.env.production.example** - Environment template
- **Dockerfile** - Docker build configuration
- **docker-compose.yml** - Docker Compose configuration

## Security Checklist

- [ ] API key stored securely in .env
- [ ] .env file has restrictive permissions (600)
- [ ] Firewall configured
- [ ] SSL certificate installed (if using domain)
- [ ] Regular backups scheduled
- [ ] System kept updated

## Need Help?

📖 Full Guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
🐛 Issues: [GitHub Issues](https://github.com/O96a/sudatutor-v6/issues)
📚 Setup: [CORPUS_SETUP.md](CORPUS_SETUP.md)

---

**Ready to deploy!** 🎉

Your code is now in GitHub at: https://github.com/O96a/sudatutor-v6
