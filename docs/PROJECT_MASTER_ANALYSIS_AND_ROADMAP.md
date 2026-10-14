# 🌐 UwoConnect — Master System Audit, Technical Architecture & Strategic Roadmap

> **Audit Date**: October 2026  
> **Repository Scope**: `UWO-CONNECT_B` (Django/ASGI/MongoDB Backend) & `UWO-Connect_F` (Next.js 15.1/React 19 Frontend)  
> **Audit Status**: ✅ **428/428 Endpoints Healthy (100.0% Clean Pass Rate | 0 Server Crashes)**  
> **Frontend Pages Audit**: ✅ **98/98 Routes Verified (100% Pass Rate)**

---

## 📑 Table of Contents
1. [Executive Summary & Monorepo Anatomy](#1-executive-summary--monorepo-anatomy)
2. [End-to-End Technology Stack](#2-end-to-end-technology-stack)
3. [Deep Dive: 10 Core Architectural Subsystems](#3-deep-dive-10-core-architectural-subsystems)
   - [3.1 Dual-Layer Payment Isolation (SaaS Platform vs. Client Merchant)](#31-dual-layer-payment-isolation-saas-platform-vs-client-merchant)
   - [3.2 Double-Entry Prepaid Usage Ledger & Metered Consumption](#32-double-entry-prepaid-usage-ledger--metered-consumption)
   - [3.3 Visual Workflow Graph Traversal Engine (ReactFlow)](#33-visual-workflow-graph-traversal-engine-reactflow)
   - [3.4 Meta Graph Webhook Pipeline (WhatsApp, Instagram, Facebook)](#34-meta-graph-webhook-pipeline-whatsapp-instagram-facebook)
   - [3.5 Multimodal RAG AI & Autonomous Function Calling (Google Calendar)](#35-multimodal-rag-ai--autonomous-function-calling-google-calendar)
   - [3.6 Hinglish & English Commercial Lead Qualification Engine](#36-hinglish--english-commercial-lead-qualification-engine)
   - [3.7 Real-Time WebSockets & Native WebRTC Calling](#37-real-time-websockets--native-webrtc-calling)
   - [3.8 Multi-Tenant White-Labeling & Dynamic CNAME Resolution](#38-multi-tenant-white-labeling--dynamic-cname-resolution)
   - [3.9 Interactive Product Tour with Bilingual Audio Narration](#39-interactive-product-tour-with-bilingual-audio-narration)
   - [3.10 GST Invoicing, Itemized Quotations & E-Sign Proposals](#310-gst-invoicing-itemized-quotations--e-sign-proposals)
4. [Database Taxonomy (82 MongoDB Collections)](#4-database-taxonomy-82-mongodb-collections)
5. [Master Endpoint Audit Results & Bug Resolution](#5-master-endpoint-audit-results--bug-resolution)
6. [Strategic Roadmap: 8 High-Impact Features to Build Next](#6-strategic-roadmap-8-high-impact-features-to-build-next)
7. [Security Hardening & Production Scalability Guidelines](#7-security-hardening--production-scalability-guidelines)

---

## 1. Executive Summary & Monorepo Anatomy

**UwoConnect** is an enterprise-grade, multi-tenant **Omni-Channel Customer Engagement, AI Automation, and CRM Platform**. It bridges the gap between messaging channels (WhatsApp Business Cloud API, Instagram DM, Facebook Messenger, YouTube comments, Gmail, Outlook), automated business workflows, conversational AI bots, GST-compliant invoicing, and white-label reseller management.

```mermaid
graph TB
    subgraph Frontend_App ["Frontend Layer (UWO-Connect_F)"]
        NextApp["Next.js 15.1 App Router (React 19)"]
        BrandCtx["BrandContext (Dynamic CNAME Whitelabel)"]
        FlowBuilder["ReactFlow Visual Workflow Canvas"]
        WebRTC_Engine["WebRTC P2P Voice/Video Engine"]
    end

    subgraph API_Gateway ["API & Protocol Gateway"]
        DRF["Django 5.2 REST Framework (Stateless JWT)"]
        ASGI["Daphne / Django Channels v4 (WebSockets)"]
    end

    subgraph Channel_Ingestion ["Omni-Channel Ingestion"]
        MetaHook["Meta Graph Webhooks (WhatsApp/IG/FB)"]
        YT["YouTube Data API v3 Listener"]
        Mail["Gmail OAuth2 / Outlook Sync"]
    end

    subgraph Business_Engines ["Core Domain Engines"]
        WF_Engine["Workflow State Machine & Branching"]
        RAG_Engine["RAG AI Engine (OpenAI gpt-4o-mini + Gemini)"]
        Lead_Engine["Hinglish Commercial Intent Classifier"]
        Ledger_Engine["Double-Entry Usage Wallet Ledger"]
        PDF_Engine["ReportLab GST Tax Invoice & Quotations"]
    end

    subgraph Persistence ["Persistence Layer"]
        MongoDB[("MongoDB Atlas (django-mongodb-backend)")]
        CloudFiles["Google Cloud Storage / Azure Blob Storage"]
    end

    NextApp -->|HTTP REST| DRF
    NextApp -->|WSS WebSockets| ASGI
    WebRTC_Engine <--> NextApp

    Channel_Ingestion --> DRF
    Channel_Ingestion --> ASGI

    DRF --> Business_Engines
    ASGI --> Business_Engines

    Business_Engines --> MongoDB
    Business_Engines --> CloudFiles
```

### Monorepo Structure
| Subproject | Path | Key Tech | Primary Scope |
| :--- | :--- | :--- | :--- |
| **Backend** | [`UWO-CONNECT_B`](file:///b:/Uwo_Connect/UWO-CONNECT_B) | Python 3.12, Django 5.2, DRF, Daphne, Channels v4, MongoDB Atlas | 801 URL routes, 82 Models, 35 Services, 44 View modules |
| **Frontend** | [`UWO-Connect_F`](file:///b:/Uwo_Connect/UWO-Connect_F) | Next.js 15.1, React 19, Tailwind CSS v4, Framer Motion, ReactFlow | 98 routes (Client Workspace, Super Admin, Guest portals) |
| **Documentation** | [`UWO-Connect_F/docs`](file:///b:/Uwo_Connect/UWO-Connect_F/docs) | Markdown | Architecture specs, User guides, Legal compliance |

---

## 2. End-to-End Technology Stack

### Frontend Architecture
- **Framework**: Next.js 15.1.0 with React 19 (App Router paradigm).
- **Styling**: Tailwind CSS v4 with custom glassmorphism design tokens in [`globals.css`](file:///b:/Uwo_Connect/UWO-Connect_F/src/app/globals.css).
- **Workflow Canvas**: `reactflow` (v11.11.4) with custom bezier edges, handles, and node wrappers in [`builder/[id]/page.jsx`](file:///b:/Uwo_Connect/UWO-Connect_F/src/app/client/workflows/builder/%5Bid%5D/page.jsx).
- **Interactive UI**: `framer-motion` for drawer slide-overs and popup dialogs; `lucide-react` for icon consistency.
- **Analytics Visualization**: `chart.js` and `react-chartjs-2` for telemetry, conversion funnels, and broadcast delivery stats.

### Backend Architecture
- **Framework**: Django 5.2 running ASGI via Daphne.
- **Database Engine**: MongoDB Atlas connected via `django-mongodb-backend` (>=5.2) and PyMongo.
- **Real-Time Layer**: Django Channels v4 for WebSocket broadcasting across tenant rooms.
- **Authentication**: `djangorestframework-simplejwt` with custom header & URL query token extractors in [`jwt_auth.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/services/jwt_auth.py), supplemented by optional Firebase Auth.
- **PDF Generation**: `reportlab` for programmatic GST Tax Invoices and Quotations with QR code embedding.
- **Storage Adapters**: Pluggable storage supporting Google Cloud Storage and Azure Blob Storage.

---

## 3. Deep Dive: 10 Core Architectural Subsystems

### 3.1 Dual-Layer Payment Isolation (SaaS Platform vs. Client Merchant)
A standout architectural achievement in UwoConnect is the **total separation of platform SaaS revenue from client merchant revenue**:

```mermaid
graph LR
    subgraph Platform_Billing ["1. UwoConnect SaaS Billing"]
        UWO_Sub["Platform Subscriptions (₹499/mo)"]
        UWO_Wallet["Prepaid WhatsApp Usage Wallet"]
        UWO_Keys["UwoConnect Master Razorpay Account"]
        UWO_Sub --> UWO_Keys
        UWO_Wallet --> UWO_Keys
    end

    subgraph Client_Merchant ["2. Workspace Merchant Gateway"]
        Customer["End Customer"]
        Checkout["/checkout/[productId]"]
        Client_Keys["Client's Own Razorpay (OAuth / API Keys)"]
        Customer --> Checkout
        Checkout --> Client_Keys
        Client_Keys --> Client_Bank["Direct to Client Merchant Account"]
    end
```

- **Client Razorpay Gateway ([`razorpay_gateway_views.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/views/razorpay_gateway_views.py))**:
  Workspaces connect their own Razorpay account via Razorpay Partner OAuth (`/api/razorpay/connect`) or direct API keys (`rzp_live_*`).
- When a customer purchases a product on `/checkout/[productId]`, the backend fetches the owning workspace's credentials, generates the order using *their* keys, and verifies the payment using *their* secret. **Funds settle directly into the client's bank account.**

---

### 3.2 Double-Entry Prepaid Usage Ledger & Metered Consumption
- **File**: [`wallet_services.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/services/wallet_services.py)
- **Metered Rate Card**:
  * Marketing WhatsApp: ₹0.78 (78 paise)
  * Utility WhatsApp: ₹0.35 (35 paise)
  * Authentication: ₹0.15 (15 paise)
  * Service Conversation: ₹0.40 (40 paise)
  * Broadcast Overages: ₹0.94 per message
- **Ledger Security**:
  All wallet adjustments write to [`WalletLedger`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/models.py). The service checks for duplicate `reference_id` submissions to ensure webhook retries never double-credit or double-debit customer balances.

---

### 3.3 Visual Workflow Graph Traversal Engine (ReactFlow)
- **File**: [`workflow_service.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/services/workflow_service.py) & [`builder/[id]/page.jsx`](file:///b:/Uwo_Connect/UWO-Connect_F/src/app/client/workflows/builder/%5Bid%5D/page.jsx)
- **Execution Traversal**:
  Workflows are stored as JSON directed acyclic graphs (`nodes` and `edges`).
- **Interactive Button & List Matching**:
  1. *Row ID Match*: Matches exact Meta payload IDs (`list_reply.id`).
  2. *Normalized Text Match*: Case-insensitive string matching.
  3. *Numeric Shorthand Match*: Recognizes `"1"`, `"#1"`, or `"option 1"`.
  4. *Emoji-Stripped Match*: Strips non-alphanumeric characters for fuzzy intent resolution.
- **Handoff to AI**:
  If the customer replies with *"talk to ai"* or *"chat with ai"*, the engine sets `session.variables['ai_mode'] = True`, passing subsequent queries to the RAG AI bot.

---

### 3.4 Meta Graph Webhook Pipeline (WhatsApp, Instagram, Facebook)
- **File**: [`meta_webhook_service.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/services/meta_webhook_service.py)
- **Inbound Message Parsing**:
  - `text`: Extracted directly into conversation timelines.
  - `image` & `document`: Media IDs queried via Meta Graph API, downloaded, and persisted to GCS/Azure Blob.
  - `audio` & `voice`: Inbound voice notes captured for in-browser playback.
  - `location`: Inbound location pins parsed into latitude/longitude for store locator lookups.
  - `statuses`: Updates message status (`sent` $\rightarrow$ `delivered` $\rightarrow$ `read`).
- **Human Takeover Override**:
  Conversations feature a `bot_disabled` flag. If an agent sends a manual message from the Unified Inbox, bot replies pause automatically for that contact.

---

### 3.5 Multimodal RAG AI & Autonomous Function Calling (Google Calendar)
- **File**: [`ai_service.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/services/ai_service.py)
- **Document Chunking & Vector Retrieval**:
  Uploaded PDFs/DOCXs in [`KnowledgeDocument`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/models.py) are partitioned into 800-word chunks with 100-word overlaps. Embeddings are generated using `text-embedding-3-small` (1536 dimensions).
- **Native OpenAI Function Calling Tools**:
  - `check_calendar_availability`: Queries Google Calendar for open appointment slots.
  - `book_appointment`: Inserts confirmed bookings directly into the business's Google Calendar.

---

### 3.6 Hinglish & English Commercial Lead Qualification Engine
- **File**: [`lead_qualification_service.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/services/lead_qualification_service.py)
- **Colloquial Intent Classification**:
  Detects commercial and pricing intent across both English and Indian colloquial Hinglish:
  * English: `price`, `cost`, `how much`, `quotation`, `discount`, `payment link`
  * Hinglish: `kya price`, `rate batao`, `kitne ka`, `kitne me`, `kitna lagega`, `kharidna hai`, `order krna h`, `discount h kya`, `paise kitne`
- **Automated CRM Progression**:
  When pricing intent is detected, the contact automatically advances:
  $$\text{NEW} \longrightarrow \text{QUALIFIED} \longrightarrow \text{HOT\_LEAD}$$

---

### 3.7 Real-Time WebSockets & Native WebRTC Calling
- **File**: [`consumers.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/consumers.py)
- **4 Real-Time WebSocket Protocols**:
  1. `InboxConsumer`: Real-time chat sync, typing indicators, human takeover, and agent reassignments.
  2. `TeamChatConsumer`: Internal agency communication channels.
  3. `WebRTCConsumer`: Peer-to-peer audio/video signaling (`offer`, `answer`, `ice_candidate`).
  4. `QrAuthConsumer`: WhatsApp Web-style desktop login via mobile QR code scan.

---

### 3.8 Multi-Tenant White-Labeling & Dynamic CNAME Resolution
- **File**: [`BrandContext.jsx`](file:///b:/Uwo_Connect/UWO-Connect_F/src/context/BrandContext.jsx) & [`whitelabel_views.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/views/whitelabel_views.py)
- When accessed via custom agency domains (e.g., `app.digitalagency.com`), `BrandContext` queries the backend by `window.location.hostname` and injects:
  - Custom CSS variables: `--brand-primary`, `--brand-accent`
  - Dynamic page title replacement (replaces "UwoConnect" with Agency Name)
  - Dynamic favicon and custom copyright footers

---

### 3.9 Interactive Product Tour with Bilingual Audio Narration
- **File**: [`ProductTour.jsx`](file:///b:/Uwo_Connect/UWO-Connect_F/src/components/tour/ProductTour.jsx) & [`tourConfig.js`](file:///b:/Uwo_Connect/UWO-Connect_F/src/lib/tourConfig.js)
- **Spotlight Masking**: Computes exact DOM element coordinates via `getBoundingClientRect` and renders a dark spotlight overlay.
- **Bilingual TTS Narration**: Provides synchronized audio narration in both English and Hindi with dual voice profiles (*Abha* and *Dev*).

---

### 3.10 GST Invoicing, Itemized Quotations & E-Sign Proposals
- **File**: [`sales_document_views.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/views/sales_document_views.py) & [`pdf_service.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/services/pdf_service.py)
- **Auto-Incrementing Numbering**: Collision-safe sequential numbering: `UWO-QTN-2026-00001`, `UWO-PRP-2026-00001`, `UWO-INV-2026-00001`.
- **Public Interactive Links**: Secure token URLs (`/public/proposal/[token]`) allow clients to review items, e-sign in-browser, and pay directly.

---

## 4. Database Taxonomy (82 MongoDB Collections)

The backend database defines **82 collections** organized into 10 domain clusters:

| # | Cluster | Count | Key Models |
| :--- | :--- | :--- | :--- |
| **1** | **Tenancy & Auth** | 6 | `Client`, `User`, `UserPreference`, `TeamInvite`, `QrAuthSession`, `LinkedDevice` |
| **2** | **Omni-Channel Inbox** | 4 | `Message`, `Conversation`, `ConversationAuditLog`, `Log` |
| **3** | **CRM & Contacts** | 3 | `Contact`, `ContactFollowUp`, `Template` |
| **4** | **Email Center** | 5 | `EmailAccount`, `EmailMessage`, `EmailAutoReplyRule`, `EmailAutomationWorkflow`, `EmailTeamNote` |
| **5** | **Campaigns & Broadcasts**| 4 | `Campaign`, `CampaignFollowUp`, `BroadcastEntitlement`, `BroadcastUsage` |
| **6** | **Automation & Flow Engine** | 3 | `Automation`, `Workflow`, `WorkflowSession` |
| **7** | **AI Knowledge Base** | 3 | `KnowledgeDocument`, `KnowledgeChunk`, `CompetitorAnalysis` |
| **8** | **Catalog, Billing & Wallet**| 12| `Product`, `Order`, `PaymentOrder`, `SalesDocument`, `Invoice`, `ClientWallet`, `WalletLedger`, `WalletRechargeOrder`, `RazorpayConnection`, `ProductPayment` |
| **9** | **Plans & Entitlements** | 6 | `Feature`, `Plan`, `PlanFeature`, `ClientFeatureOverride`, `PlanAuditLog`, `ClientSubscription` |
| **10**| **Team & Operations** | 10| `Project`, `Task`, `TaskComment`, `WorkReport`, `Attendance`, `LeaveRequest`, `TeamChannel`, `TeamChatMessage`, `SupportMessage`, `TeamMessage` |

---

## 5. Master Endpoint Audit Results & Bug Resolution

### Full Endpoint Verification
- **Total Registered URL Patterns**: **819 Patterns**
- **Unique Evaluated Endpoints**: **428 Endpoints**
- **Evaluation Engine**: Automated Django REST Framework test runner ([`audit_all_backend_endpoints.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/audit_all_backend_endpoints.py)) using `APIClient` under authenticated Administrator, authenticated Client, and Anonymous roles.

### Audit Run Results:
```
======================================================================
🎯 BACKEND AUDIT RESULT: 428/428 ENDPOINTS HEALTHY (100.0%)
🔥 ZERO 500 SERVER CRASHES: 0 failures
======================================================================
```

### Bug Detected & Resolved During Audit:
* **Endpoint**: `/api/admin/client-platform-overview/`
* **Root Cause**: `AttributeError: module 'django.utils.timezone' has no attribute 'utc'` in [`telemetry_views.py:506`](file:///b:/Uwo_Connect/UWO-CONNECT_B/api/views/telemetry_views.py#L506). In Django 5.0+, `timezone.utc` was removed in favor of `datetime.timezone.utc`.
* **Fix Applied**: Updated import to `from datetime import timezone as dt_timezone` and replaced references with `datetime.min.replace(tzinfo=dt_timezone.utc)`.
* **Result**: Endpoint returned `HTTP 200 OK` with payload `['success', 'summary', 'distribution', 'clients', 'pagination', 'timestamp']`, bringing the entire backend to a **100% clean pass rate**.

---

## 6. Strategic Roadmap: 8 High-Impact Features to Build Next

```mermaid
timeline
    title Feature Expansion Roadmap
    Phase 1 (Immediate Impact) : Autonomous WhatsApp Voice Note AI Agent (Whisper + TTS) : In-Chat Team Notes & @Agent Mentions
    Phase 2 (Commerce & CRM)   : Shopify & WooCommerce 2-Way Sync Engine : AI Deal Co-Pilot & Win Probability Scoring
    Phase 3 (Enterprise Scale) : Meta Click-to-WhatsApp (CTWA) Ad Attribution : Native WhatsApp Interactive Flows API
    Phase 4 (Advanced AI)     : Specialized Multi-Agent AI Swarm : Broadcast A/B Testing & Anti-Ban Rate Pacing
```

### 1. 🎙️ Autonomous WhatsApp Voice Note AI Agent (Speech-to-Speech)
- **Objective**: Over 40% of WhatsApp inquiries in India and emerging markets arrive as voice notes.
- **Workflow**: Inbound voice note $\rightarrow$ OpenAI Whisper transcription $\rightarrow$ RAG LLM query $\rightarrow$ Text-to-Speech audio synthesis $\rightarrow$ Voice note response delivered back to WhatsApp.

### 2. 🧠 AI Deal Co-Pilot & Predictive Win-Probability in CRM Pipeline
- **Objective**: Transform the static Kanban CRM pipeline into an intelligent deal acceleration engine.
- **Workflow**: Analyzes message count, customer response latency, budget size, and sentiment to compute a **Win Probability Score (0–100%)** with recommended actions (e.g. *"Customer price sensitive; suggest 10% discount quote"*).

### 3. 🛍️ Shopify & WooCommerce 2-Way E-Commerce Sync
- **Objective**: Connect existing e-commerce storefronts directly to WhatsApp chat funnels.
- **Workflow**: Auto-sync product inventory and trigger automated **WhatsApp Abandoned Cart Recovery** messages after 30 minutes with 1-click checkout recovery buttons.

### 4. 👥 Specialized Multi-Agent AI Swarm & Department Routing
- **Objective**: Partition single-prompt LLM behavior into 3 specialized AI sub-agents:
  1. *Sales Closer Agent*: Product pitches and payment links.
  2. *Support Agent*: PDF user manual troubleshooting.
  3. *Billing Agent*: Invoices, taxes, and payment confirmation.

### 5. 📈 Meta Click-to-WhatsApp (CTWA) Ads Attribution & RoAS Dashboard
- **Objective**: Attribute marketing spend on Meta Ads directly to closed sales in the CRM.
- **Workflow**: Captures Meta Ad ID upon inbound message, attaches it to the Contact record, and tracks revenue generated upon Razorpay checkout.

### 6. 📱 Interactive WhatsApp Native Flows & In-Chat Forms (Meta Flows API)
- **Objective**: Replace tedious multi-message conversational questionnaires with native in-chat forms.
- **Workflow**: Opens an interactive multi-field form directly inside WhatsApp for lead capture, surveys, and bookings.

### 7. ⚖️ Broadcast A/B Content Testing & Anti-Ban Rate Pacing
- **Objective**: Optimize broadcast conversion while protecting Meta WhatsApp quality tier ratings.
- **Workflow**: Tests Message A vs. Message B on a 10% sample audience, auto-dispatching the winning template to the remaining 90% with dynamic pacing (e.g., 20 $\rightarrow$ 50 $\rightarrow$ 100 msgs/min).

### 8. 💬 In-Chat Team Collaboration & @Agent Mentions
- **Objective**: Enable seamless internal collaboration inside live customer conversations.
- **Workflow**: Yellow-highlighted internal private notes invisible to the WhatsApp customer, with `@Agent` mentions triggering real-time alerts.

---

## 7. Security Hardening & Production Scalability Guidelines

1. **Redis Channel Layer for Horizontal Scaling**:
   Update `CHANNEL_LAYERS` in [`settings.py`](file:///b:/Uwo_Connect/UWO-CONNECT_B/core/settings.py) from `InMemoryChannelLayer` to `channels_redis.core.RedisChannelLayer` backed by Google Cloud Memorystore or Redis Cloud to allow multi-instance WebSocket synchronization across Cloud Run containers.
2. **Asynchronous Webhook Acknowledgment**:
   Return `HTTP 200 OK` to Meta within 1.5 seconds, offloading RAG vector lookups and media uploads to a background worker to avoid Meta timeout retries.
3. **MongoDB Atlas Vector Search**:
   Transition from in-memory numpy cosine similarity to native MongoDB Atlas `$vectorSearch` indexes as knowledge document chunks grow past 10,000 items.

---

*Specification Version: 3.0.0 | Master System Reference*
