# EC2 Production Deployment Guide

> **t3.micro | Ubuntu | No Docker | Direct git pull from `main`**

---

## One-time EC2 Setup (run once after launching instance)

### 1. Install Node.js, PM2, Nginx

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 — process manager
sudo npm install -g pm2

# Nginx
sudo apt update && sudo apt install -y nginx
```

### 2. Clone the repo

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_ORG/YOUR_REPO.git Staffs_Management
cd Staffs_Management
```

### 3. Install dependencies

```bash
cd VMS/server && npm install --production
cd ../Frontend && npm install
```

### 4. Create server .env (gitignored — must be done manually)

```bash
nano /home/ubuntu/Staffs_Management/VMS/server/.env
```

Paste and fill in your values:
```
NODE_ENV=production
PORT=5001

AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=a2zstaffsresume

FRONTEND_URL=https://a2zstaffs.com

MONGODB_URI=your_mongodb_uri
DB_NAME=a2zstaffs_vms

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1h
JWT_EXPIRE_REMEMBER=7d

MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

GOOGLE_CLIENT_ID=your_google_client_id

EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_app_password
EMAIL_FROM=A2Z Staffs <your_email>

# DO NOT add ENABLE_TEST_OTP in production
```

### 5. Build the frontend

```bash
cd /home/ubuntu/Staffs_Management/VMS/Frontend
npm run build
```

### 6. Create logs directory

```bash
mkdir -p /home/ubuntu/Staffs_Management/logs
```

### 7. Start with PM2

```bash
cd /home/ubuntu/Staffs_Management
pm2 start ecosystem.config.js
pm2 save
pm2 startup    # Follow the printed command to enable auto-start on reboot
```

Verify both apps are running:
```bash
pm2 status
```

### 8. Set up Nginx

```bash
# Replace 'a2zstaffs.com' in the config file with your actual domain
sed -i 's/a2zstaffs.com/YOUR_ACTUAL_DOMAIN/g' nginx/a2zstaffs.conf

# Copy to Nginx
sudo cp nginx/a2zstaffs.conf /etc/nginx/sites-available/a2zstaffs
sudo ln -s /etc/nginx/sites-available/a2zstaffs /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Add rate limit zones to http block in nginx.conf
sudo nano /etc/nginx/nginx.conf
# Add these lines inside the http { } block:
#   limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
#   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=60r/m;
#   limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

# Test and reload
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 9. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d a2zstaffs.com -d www.a2zstaffs.com
# Certbot auto-patches your nginx config with SSL certs
# Auto-renewal is set up via systemd timer automatically
```

### 10. Firewall — block direct Node access

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw deny 3000
sudo ufw deny 5001
sudo ufw status
```

**Also update AWS EC2 Security Group inbound rules:**
- Allow 22 (SSH) — from your IP only
- Allow 80 (HTTP) — from 0.0.0.0/0
- Allow 443 (HTTPS) — from 0.0.0.0/0
- Remove/delete any rules for port 3000 or 5001

---

## Deploying Updates (every time you push to main)

```bash
cd /home/ubuntu/Staffs_Management
git pull origin main
cd VMS/server && npm install --production
cd ../Frontend && npm install && npm run build
cd /home/ubuntu/Staffs_Management
pm2 restart all
```

Or save this as a script `/home/ubuntu/deploy.sh`:
```bash
#!/bin/bash
set -e
cd /home/ubuntu/Staffs_Management
git pull origin main
cd VMS/server && npm install --production
cd ../Frontend && npm install && npm run build
cd /home/ubuntu/Staffs_Management
pm2 restart all
echo "Deployment complete!"
```
```bash
chmod +x /home/ubuntu/deploy.sh
# Run with: ./deploy.sh
```

---

## Monitoring

```bash
pm2 status                    # Process status + memory usage
pm2 logs                      # Live logs (both apps)
pm2 logs vms-backend          # Backend logs only
pm2 logs vms-frontend         # Frontend logs only
sudo nginx -t                 # Validate nginx config
sudo systemctl status nginx   # Nginx status
```

---

## Verification Checklist

- [ ] `pm2 status` → both `vms-backend` and `vms-frontend` show **online**
- [ ] `curl https://a2zstaffs.com/api/health` → `{ status: 'ok' }`
- [ ] Browser `https://a2zstaffs.com` → padlock icon, site loads
- [ ] Login works end-to-end
- [ ] OTP `123456` no longer bypasses verification
- [ ] `curl http://a2zstaffs.com:5001` → connection refused
- [ ] `curl http://a2zstaffs.com:3000` → connection refused
- [ ] Rapid login attempts → HTTP 429 after 5 tries
