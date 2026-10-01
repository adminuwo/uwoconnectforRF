# UWO Connect - Custom Tutorial Audio Files

Aap yahan apni custom recorded ya AI generated voice MP3 files rakh sakte hain.

### Files ka Naam:
- `welcome.mp3` / `welcome_hi.mp3`
- `channels.mp3` / `channels_hi.mp3`
- `automations.mp3` / `automations_hi.mp3`
- `workflows.mp3` / `workflows_hi.mp3`
- `crm.mp3` / `crm_hi.mp3`
- `inbox.mp3` / `inbox_hi.mp3`
- `campaigns.mp3` / `campaigns_hi.mp3`
- `catalog.mp3` / `catalog_hi.mp3`
- `invoices.mp3` / `invoices_hi.mp3`
- `payments.mp3` / `payments_hi.mp3`

### tourConfig.js me Kaise Link Karein:
```javascript
{
  id: 'welcome',
  ...
  audioUrl: '/audio/tour/welcome.mp3',      // English ya default voice
  audioUrlHi: '/audio/tour/welcome_hi.mp3', // Hindi voice
}
```
Jab audio file yahan present hogi, tour automatically is file ko play karega. Agar file nahi hogi toh browser text-to-speech voice play hogi!
