import os

file_path = 'src/app/client/channels/page.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'ZohoConfigModal' not in content[:1000]:
    import_statement = "import ZohoConfigModal, { ZohoIcon } from '@/components/channels/ZohoConfigModal';\n"
    content = content.replace("import WhatsAppConfigModal", import_statement + "import WhatsAppConfigModal")

# 2. Add state
if 'isZohoConfigModalOpen' not in content:
    state_statement = "  const [isZohoConfigModalOpen, setIsZohoConfigModalOpen] = useState(false);\n"
    content = content.replace("const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);", "const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);\n" + state_statement)

# 3. Add handleZohoSaved
if 'handleZohoSaved' not in content:
    handler = """
  const handleZohoSaved = (updatedClient) => {
    setClient(updatedClient);
    setIsZohoConfigModalOpen(false);
    setToast({ msg: 'Zoho configuration saved!', type: 'success' });
  };
"""
    content = content.replace("const handleWhatsAppSaved", handler.strip() + "\n\n  const handleWhatsAppSaved")

# 4. Add isZohoConnected
if 'const isZohoConnected' not in content:
    content = content.replace("const isWhatsAppConnected = Boolean(client?.whatsapp_business_id);", "const isWhatsAppConnected = Boolean(client?.whatsapp_business_id);\n  const isZohoConnected = Boolean(client?.zoho_enabled);")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Zoho state successfully.")
