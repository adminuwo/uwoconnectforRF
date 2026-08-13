import os

file_path = 'src/app/client/channels/page.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import GoogleNewsConfigModal", "import ZohoConfigModal, { ZohoIcon } from '@/components/channels/ZohoConfigModal';\nimport GoogleNewsConfigModal")
content = content.replace("const [isGoogleNewsConfigModalOpen, setIsGoogleNewsConfigModalOpen] = useState(false);", "const [isGoogleNewsConfigModalOpen, setIsGoogleNewsConfigModalOpen] = useState(false);\n  const [isZohoConfigModalOpen, setIsZohoConfigModalOpen] = useState(false);")
content = content.replace("const handleWhatsAppSaved = (updatedClient) => {\n    setClient(updatedClient);\n    setToast({ msg: 'WhatsApp configured', type: 'success' });\n    setIsConfigModalOpen(false);\n  };", "const handleWhatsAppSaved = (updatedClient) => {\n    setClient(updatedClient);\n    setToast({ msg: 'WhatsApp configured', type: 'success' });\n    setIsConfigModalOpen(false);\n  };\n\n  const handleZohoSaved = (updatedClient) => {\n    setClient(updatedClient);\n    setIsZohoConfigModalOpen(false);\n    setToast({ msg: 'Zoho configuration saved!', type: 'success' });\n  };")
content = content.replace("const isGoogleNewsConnected = Boolean(client?.google_news_enabled);", "const isGoogleNewsConnected = Boolean(client?.google_news_enabled);\n  const isZohoConnected = Boolean(client?.zoho_enabled);")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
