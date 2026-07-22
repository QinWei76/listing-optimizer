# Deploy ListingAI Worker

## Prerequisites

```bash
npm install -g wrangler
wrangler login
```

## Set the API Key

```bash
cd worker
wrangler secret put DEEPSEEK_API_KEY
# Paste: sk-23d562237724474fbf489b29843043a6
```

## Deploy

```bash
wrangler deploy
```

After deploy the Worker is available at:

```
https://listingai-api.<your-subdomain>.workers.dev
```

## Update the Frontend

Replace the hard-coded DeepSeek URL in the front-end code with:

```
https://listingai-api.<your-subdomain>.workers.dev/api/generate
```

The API key is no longer exposed in client-side code.
