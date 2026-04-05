# SSL Certificate — Certbot & Let's Encrypt

## What is SSL and why does it matter?

When a user logs in, their password and JWT token travel from their browser to your server. Without SSL, this data is sent as plain text — anyone on the same network (coffee shop WiFi, ISP, etc.) can read it.

SSL encrypts all traffic between the browser and server. It's what makes `http://` become `https://`.

---

## Before (HTTP only)

```
Browser → http://api.a2zstaffs.com/api/auth/login
         ↑ password sent as plain text
         ↑ JWT token exposed
         ↑ browser shows "Not Secure" warning
```

- Data was unencrypted in transit
- Browsers warned users the site was not secure
- Google ranks HTTP sites lower in search results
- JWT tokens could be stolen mid-transit (man-in-the-middle attack)

---

## After (HTTPS with Certbot)

```
Browser → https://api.a2zstaffs.com/api/auth/login
         ↑ fully encrypted
         ↑ browser shows padlock icon
         ↑ certificate verified by Let's Encrypt
```

- All data encrypted with TLS
- Browser shows padlock — users trust the site
- Man-in-the-middle attacks blocked
- Required for Google OAuth to work in production

---

## What is Let's Encrypt?

A free, automated certificate authority (CA). Before Let's Encrypt, SSL certificates cost $50–$300/year and required manual renewal. Let's Encrypt issues free certificates valid for 90 days and auto-renews them.

## What is Certbot?

A tool that talks to Let's Encrypt on your behalf. It:
1. Proves you own the domain (by placing a file Nginx serves)
2. Downloads the certificate
3. Patches your Nginx config automatically
4. Sets up a cron job to auto-renew before expiry

---

## How it was set up

```bash
sudo certbot --nginx -d api.a2zstaffs.com
```

Certbot automatically updated `/etc/nginx/conf.d/a2zstaffs.conf` to add:
- SSL certificate paths
- HTTP → HTTPS redirect
- TLS settings

Certificate location on server:
```
/etc/letsencrypt/live/api.a2zstaffs.com/fullchain.pem   ← public cert
/etc/letsencrypt/live/api.a2zstaffs.com/privkey.pem     ← private key
```

Certificate expires: **2026-07-04** (auto-renews via cron before expiry)

---

## Auto-renewal

Certbot installs a cron job that runs twice daily:
```bash
certbot renew --quiet
```

It only renews if the certificate is within 30 days of expiry. No manual action needed.

To manually test renewal:
```bash
sudo certbot renew --dry-run
```

---

## If the certificate ever expires

```bash
sudo certbot --nginx -d api.a2zstaffs.com
```

Same command as the initial setup — re-issues and patches Nginx automatically.
