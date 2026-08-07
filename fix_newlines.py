import re
filepath = r"d:\ALPHA\AISA_CON_M-F\src\app\client\channels\page.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace literal \n with actual newlines
content = content.replace("\\n", "\n")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed literal newlines")
