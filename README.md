<div align="center">

# المعلم السوداني (Sudanese Teacher)

<img width="1200" height="475" alt="Sudanese Teacher Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

**AI-powered educational tutor for the Sudanese curriculum**  
مساعد تعليمي ذكي مدعوم بالذكاء الاصطناعي للمناهج السودانية

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Production Deployment](#-production-deployment)

</div>

---

## 📖 Overview

**المعلم السوداني** is an intelligent educational assistant specifically designed for students following the Sudanese curriculum (Grades 1-12). Powered by Google's Gemini 2.5 Flash with File Search capabilities, it provides accurate, curriculum-based answers to student questions across all subjects.

### Key Highlights

- ✅ **Curriculum-Specific**: Trained exclusively on official Sudanese curriculum materials
- 🎯 **117 Subjects**: Covers all subjects from Grade 1 through Grade 12 (Science & Arts tracks)
- 🤖 **AI-Powered**: Uses Google Gemini 2.5 Flash with RAG (Retrieval-Augmented Generation)
- 🌐 **Bilingual**: Supports both Arabic and English
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- 🔒 **Source-Grounded**: Every answer includes citations from curriculum documents

---

## ✨ Features

### For Students
- 📚 Select your grade and subject
- 💬 Ask questions in natural language (Arabic or English)
- 📖 Get accurate answers based solely on the curriculum
- 🔍 View source citations and references
- 💡 Receive encouragement and learning support

### For Educators & Administrators
- 🎓 Monitor curriculum coverage
- 📊 Understand common student questions
- 🔄 Easy curriculum updates via File Search Store
- 🌍 Accessible from anywhere with internet

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/O96a/sudatutor-v6.git
   cd sudatutor-v6
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Edit .env.local and add your API key
   # GEMINI_API_KEY=your-api-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```
sudatutor-v6/
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── ChatInterface.tsx    # Main chat UI
│   │   ├── SelectionScreen.tsx  # Grade/subject selection
│   │   ├── Spinner.tsx          # Loading indicator
│   │   └── icons/               # SVG icon components
│   ├── services/                # Business logic
│   │   └── geminiService.ts     # Gemini AI integration
│   ├── App.tsx                  # Main application component
│   ├── index.tsx                # Application entry point
│   ├── types.ts                 # TypeScript type definitions
│   ├── curriculumData.ts        # Grade/subject mappings
│   └── index.css                # Global styles
├── config/                      # Configuration files
│   └── app.config.ts           # Application constants
├── scripts/                     # Utility scripts
│   ├── create-filestore.js     # Create File Search Store
│   ├── upload-curriculum.js    # Upload curriculum files
│   ├── check-store.js          # Verify store status
│   └── cleanup-rag-stores.js   # Cleanup old stores
├── curriculum-data/             # Curriculum text files (117 files)
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── .env.example                # Environment template
└── README.md                   # This file
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

### Application Config

Edit `config/app.config.ts` to customize:

```typescript
export const CONFIG = {
  FILE_SEARCH_STORE_NAME: 'fileSearchStores/your-store-id',
  GEMINI_MODEL: 'gemini-2.5-flash',
  // ... more options
};
```

---

## 📚 Documentation

### File Search Store Setup

The application uses Google's File Search Store to manage curriculum documents. Follow these steps:

#### 1. Create File Search Store

```bash
# Set your API key
export GEMINI_API_KEY="your-api-key-here"  # Linux/Mac
$env:GEMINI_API_KEY="your-api-key-here"    # Windows PowerShell

# Create the store
node scripts/create-filestore.js
```

#### 2. Upload Curriculum Files

```bash
# Upload all 117 curriculum files
node scripts/upload-curriculum.js
```

This will upload all files from `curriculum-data/` to your File Search Store.

#### 3. Verify Upload

```bash
# Check store status
node scripts/check-store.js

# List all documents
node scripts/upload-curriculum.js --list
```

#### 4. Update Configuration

Copy the store name from the creation output and update `config/app.config.ts`:

```typescript
FILE_SEARCH_STORE_NAME: 'fileSearchStores/your-new-store-id'
```

---

## 🎨 Customization

### Adding New Subjects

1. Add curriculum file to `curriculum-data/`
2. Update `src/curriculumData.ts`
3. Re-upload to File Search Store

### Changing UI Theme

Edit Tailwind configuration in `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'gem-blue': '#4A90E2',  // Primary color
        // ... customize more colors
      }
    }
  }
}
```

### Modifying System Instructions

Edit the prompt in `src/services/geminiService.ts`:

```typescript
systemInstruction: `Your custom instructions here...`
```

---

## 🚀 Production Deployment

This section provides detailed instructions for deploying to a production Linux server using Docker.

### Prerequisites

- **Linux Server** (Ubuntu 20.04+ recommended)
- **Docker** and **Docker Compose** installed
- **Domain name** (optional but recommended)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)

### Step 1: Prepare Your Linux Server

1. **Update system packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Docker**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add your user to docker group
   sudo usermod -aG docker $USER
   
   # Activate changes
   newgrp docker
   ```

3. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   docker-compose --version
   ```

4. **Install Git** (if not already installed)
   ```bash
   sudo apt install git -y
   ```

### Step 2: Clone and Setup Project

1. **Clone the repository**
   ```bash
   cd /opt
   sudo git clone https://github.com/O96a/sudatutor-v6.git
   sudo chown -R $USER:$USER sudatutor-v6
   cd sudatutor-v6
   ```

2. **Create environment file**
   ```bash
   nano .env
   ```
   
   Add the following (replace with your actual API key):
   ```env
   GEMINI_API_KEY=your-actual-gemini-api-key-here
   NODE_ENV=production
   ```
   
   Save with `Ctrl+O`, then `Enter`, then `Ctrl+X`

3. **Set proper permissions**
   ```bash
   chmod 600 .env
   ```

### Step 3: Build and Deploy with Docker

1. **Build the Docker image**
   ```bash
   docker build -t sudatutor:latest .
   ```
   
   This will take a few minutes the first time.

2. **Start the application**
   ```bash
   docker-compose up -d
   ```
   
   The `-d` flag runs it in detached mode (background).

3. **Verify the application is running**
   ```bash
   docker-compose ps
   docker-compose logs -f sudatutor
   ```
   
   Press `Ctrl+C` to exit logs.

4. **Test the application**
   ```bash
   curl http://localhost:3000
   ```
   
   You should see HTML content returned.

### Step 4: Configure Firewall

1. **Allow HTTP traffic**
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw enable
   sudo ufw status
   ```

### Step 5: Setup Nginx Reverse Proxy (Recommended)

For production, it's recommended to use Nginx as a reverse proxy with SSL.

1. **Install Nginx**
   ```bash
   sudo apt install nginx -y
   ```

2. **Create Nginx configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/sudatutor
   ```
   
   Add the following configuration (replace `your-domain.com` with your actual domain):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable the site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/sudatutor /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Allow Nginx through firewall**
   ```bash
   sudo ufw allow 'Nginx Full'
   ```

### Step 6: Setup SSL with Let's Encrypt (Recommended)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```
   
   Follow the prompts. Choose to redirect HTTP to HTTPS.

3. **Test auto-renewal**
   ```bash
   sudo certbot renew --dry-run
   ```

### Step 7: Setup Auto-restart on Server Reboot

1. **Create systemd service** (alternative to Docker restart policy)
   ```bash
   sudo nano /etc/systemd/system/sudatutor.service
   ```
   
   Add:
   ```ini
   [Unit]
   Description=Sudanese Teacher Application
   Requires=docker.service
   After=docker.service
   
   [Service]
   Type=oneshot
   RemainAfterExit=yes
   WorkingDirectory=/opt/sudatutor-v6
   ExecStart=/usr/local/bin/docker-compose up -d
   ExecStop=/usr/local/bin/docker-compose down
   
   [Install]
   WantedBy=multi-user.target
   ```

2. **Enable the service**
   ```bash
   sudo systemctl enable sudatutor.service
   sudo systemctl start sudatutor.service
   ```

### Deployment Commands Reference

```bash
# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Stop application
docker-compose down

# Update application (pull new changes)
cd /opt/sudatutor-v6
git pull origin main
docker-compose down
docker build -t sudatutor:latest .
docker-compose up -d

# View container status
docker-compose ps

# Check container health
docker inspect sudatutor-v6-sudatutor-1 --format='{{.State.Health.Status}}'

# Access container shell (for debugging)
docker-compose exec sudatutor sh
```

### Monitoring and Maintenance

1. **Check disk space**
   ```bash
   df -h
   ```

2. **Clean up old Docker images**
   ```bash
   docker system prune -a
   ```

3. **View application logs**
   ```bash
   docker-compose logs --tail=100 -f
   ```

4. **Monitor resource usage**
   ```bash
   docker stats
   ```

### Troubleshooting

**Issue: Container won't start**
```bash
# Check logs
docker-compose logs sudatutor

# Check if port 3000 is already in use
sudo netstat -tulpn | grep 3000

# Rebuild from scratch
docker-compose down
docker system prune -a
docker build -t sudatutor:latest .
docker-compose up -d
```

**Issue: API key not working**
```bash
# Verify environment variable is set
docker-compose exec sudatutor printenv | grep GEMINI
```

**Issue: Can't connect from browser**
```bash
# Check firewall
sudo ufw status

# Check Nginx status
sudo systemctl status nginx

# Test internal connection
curl http://localhost:3000
```

### Security Best Practices

1. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use strong firewall rules**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   ```

3. **Regular backups**
   ```bash
   # Backup script
   tar -czf sudatutor-backup-$(date +%Y%m%d).tar.gz /opt/sudatutor-v6
   ```

4. **Monitor logs regularly**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   docker-compose logs -f
   ```

---

## 🏗️ Build for Production (Non-Docker)

### Build

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

#### Static Hosting (Vercel, Netlify, GitHub Pages)

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

**Environment Variables**: Configure `GEMINI_API_KEY` in your hosting provider's dashboard.

**⚠️ Security Warning**: For production use with public access, implement a backend proxy to secure the API key. The current setup exposes the API key in the browser bundle.

#### Docker (See Production Deployment section above)

Use the provided Dockerfile and docker-compose.yml for containerized deployment.

#### Traditional Server (Manual Deployment)

1. Build the project: `npm run build`
2. Copy `dist/` folder to your server
3. Serve with nginx or Apache
4. Configure web server to handle SPA routing

---

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Technology Stack

- **Frontend**: React 19.2.0, TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **AI**: Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS, Custom CSS
- **Font**: Cairo (Google Fonts)

---

## 📊 Curriculum Coverage

### Grades 1-9
- Arabic, English, Math, Islamic Studies
- Science, IT, History, Geography
- Art, Nature, Technical Education

### Grades 10-12
- **Science Track**: Physics, Chemistry, Biology, Engineering
- **Arts Track**: History, Geography, Literature
- **Common**: Arabic, English, Islamic Studies, IT

**Total**: 117 curriculum documents covering 12 grade levels

---

## 🔒 Security & Privacy

- ✅ API keys stored in environment variables (never in code)
- ✅ No user data stored on servers
- ✅ All queries processed through Google's secure infrastructure
- ✅ Docker secrets support for enhanced security
- ✅ HTTPS/SSL recommended for production
- ⚠️ **Important**: This is a client-side application. For production with public access, implement a backend proxy to secure the API key

### Securing Your API Key in Production

For production deployments, consider:
1. **Backend Proxy**: Create a simple backend service that holds the API key
2. **API Gateway**: Use services like AWS API Gateway or Google Cloud Endpoints
3. **Environment Variables**: Use Docker secrets or cloud provider secret managers
4. **Rate Limiting**: Implement rate limiting to prevent abuse

---

## 🐛 Troubleshooting

### Issue: "API_KEY environment variable not set"

**Solution**: Ensure `.env.local` exists with `GEMINI_API_KEY=your-key`

### Issue: "File Search Store not found"

**Solution**: 
1. Run `node scripts/create-filestore.js`
2. Update `config/app.config.ts` with the new store name

### Issue: "No curriculum documents found"

**Solution**: Run `node scripts/upload-curriculum.js` to upload curriculum files

### Issue: Build errors

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **National Centre for Curricula and Educational Research (NCCER)** - Sudanese curriculum content
- **Google Gemini** - AI capabilities
- **Google AI Studio** - File Search functionality
- **React** - UI framework
- **Vite** - Build tool

---

## 📞 Support

- **GitHub Repository**: [O96a/sudatutor-v6](https://github.com/O96a/sudatutor-v6)
- **Issues**: [GitHub Issues](https://github.com/O96a/sudatutor-v6/issues)
- **Documentation**: See `CORPUS_SETUP.md` for detailed curriculum setup instructions
- **Deployment Guide**: See the [Production Deployment](#-production-deployment) section above

---

## 🗺️ Roadmap

- [ ] Add user authentication
- [ ] Implement progress tracking
- [ ] Add quiz generation
- [ ] Support voice input
- [ ] Mobile apps (iOS/Android)
- [ ] Offline mode
- [ ] Multi-language support beyond Arabic/English

---

<div align="center">

**Made with ❤️ for Sudanese students**

[⬆ Back to Top](#المعلم-السوداني-sudanese-teacher)

</div>
