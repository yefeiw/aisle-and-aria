# Domain & Deployment Handoff — aisleandaria.com

**Status as of 2026-10-11:**
- Site is live at https://yefeiw.github.io/aisle-and-aria/ (GitHub Pages, deploy from `main` branch root)
- Repo: https://github.com/yefeiw/aisle-and-aria
- `CNAME` file (containing `aisleandaria.com`) is committed in repo root — GitHub Pages custom domain will be picked up automatically once DNS resolves
- User is logged in to Cloudflare in their own browser; domain `aisleandaria.com` was **not yet registered** at last check (verified via Verisign RDAP, HTTP 404 = unregistered)

## What the user already has

- Cloudflare account, logged in (registration done in their own Chrome)
- GitHub account `yefeiw`, with a stored credential in Git Credential Manager on this machine
  (retrieve with: `printf "protocol=https\nhost=github.com\n\n" | "C:/Users/jeff_/.workbuddy/binaries/PortableGit/versions/1.2.0/mingw64/bin/git-credential-manager.exe" get`)

## Steps for the next agent

### 1. Register the domain (needs user's hands for payment)

User must do this themselves (card payment):
Cloudflare Dashboard → **Domain Registration → Register Domains** → search `aisleandaria.com` → Add to cart → Checkout. Expected price ~$10-11/yr (at-cost; if it shows a much higher "premium" price, STOP and re-check). WHOIS privacy is free and on by default — keep it on.

Being the registrar, Cloudflare auto-hosts DNS for the domain. No nameserver changes needed.

### 2. Add DNS records in Cloudflare (agent can do this if user provides an API token)

User creates a scoped token: My Profile → **API Tokens** → Create Token → **Edit zone DNS** template → zone = `aisleandaria.com`. Then via API (or user can click it in the DNS UI themselves):

| Type | Name    | Content                     | Proxy     | TTL |
|------|---------|-----------------------------|-----------|-----|
| A    | `@`     | `185.199.108.153`           | DNS only  | Auto |
| A    | `@`     | `185.199.109.153`           | DNS only  | Auto |
| A    | `@`     | `185.199.110.153`           | DNS only  | Auto |
| A    | `@`     | `185.199.111.153`           | DNS only  | Auto |
| CNAME| `www`   | `yefeiw.github.io`           | DNS only  | Auto |

IMPORTANT: set proxy status to **DNS only (grey cloud)**, NOT proxied (orange cloud). GitHub Pages needs to provision its own TLS cert; Cloudflare proxying breaks the DCV check unless configured with Full (strict) + custom cert. Grey cloud first, HTTPS will still be provided by GitHub Pages via Let's Encrypt.

API example (if token provided):
```bash
ZONE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/zones?name=aisleandaria.com" | python -c "import sys,json;print(json.load(sys.stdin)['result'][0]['id'])")

for ip in 185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153; do
  curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -d "{\"type\":\"A\",\"name\":\"aisleandaria.com\",\"content\":\"$ip\",\"proxied\":false}"
done

curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -d '{"type":"CNAME","name":"www","content":"yefeiw.github.io","proxied":false}'
```

### 3. Activate the custom domain on GitHub Pages

`CNAME` is already in the repo root, so once DNS resolves:
- Repo → Settings → Pages → Custom domain should show `aisleandaria.com`; if not, enter it manually and Save
- Tick **Enforce HTTPS** once the cert is provisioned (can take up to ~30-60 min after DNS propagates)

Via API (token from GCM as shown above):
```bash
curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/yefeiw/aisle-and-aria/pages \
  -d '{"cname":"aisleandaria.com","source":{"branch":"main","path":"/"}}'

# enforce HTTPS after cert is ready:
curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/yefeiw/aisle-and-aria/pages \
  -d '{"https_enforced":true}'
```

### 4. Verify

```bash
curl -sI https://aisleandaria.com | head -5   # expect 200 + GitHub Pages headers
curl -sI https://www.aisleandaria.com | head -5  # expect 301 -> apex
```

## Post-launch checklist for the user (content, not deployment)

1. Replace placeholder contact info in `assets/js/main.js` (CONFIG object: email / phone / Instagram)
2. Replace placeholder photos in `assets/images/` (same filenames, no code changes)
3. Adjust package prices in `index.html` (search `pkg-price`)
4. Read through every claim (ordination, bilingual service, FAQ answers) and make them true
5. Optional: swap the mailto booking form for Formspree — README has instructions
