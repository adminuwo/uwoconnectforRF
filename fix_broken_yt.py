import re

origin_path = r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\156107ba-4b13-4dc8-b7eb-45dcecd6cdc2\scratch\origin_channels.jsx"
target_path = r"d:\ALPHA\AISA_CON_M-F\src\app\client\channels\page.jsx"

with open(origin_path, "r", encoding="utf-16") as f:
    origin_code = f.read()

with open(target_path, "r", encoding="utf-8") as f:
    target_code = f.read()

# The youtube card starts with `{/* --- YOUTUBE CARD --- */}` and ends just before `</div>\n        )}\n\n        {/* Modals */}` or `</div>\n      )}`
yt_card = re.search(r"(\s*\{\/\* --- YOUTUBE CARD --- \*\/\}.*?)(?=<\/div>\s*\)\}\s*\{\/\* WhatsApp Configuration Modal \*\/\})", origin_code, re.DOTALL)
if not yt_card:
    yt_card = re.search(r"(\s*\{\/\* --- YOUTUBE CARD --- \*\/\}.*?)(?=\s*<\/div>\s*<\/DashboardLayout>)", origin_code, re.DOTALL)

# In target code, find the broken youtube card block and replace it.
broken_card = re.search(r"(\s*\{\/\* --- YOUTUBE CARD --- \*\/\}.*?)(?=<\/div>\s*<\/div>\s*\)\})", target_code, re.DOTALL)
if broken_card and yt_card:
    # Let's see what broken_card matched
    target_code = target_code.replace(broken_card.group(1), yt_card.group(1))
else:
    print("Could not find broken card")

with open(target_path, "w", encoding="utf-8") as f:
    f.write(target_code)
print("Fixed youtube card")
