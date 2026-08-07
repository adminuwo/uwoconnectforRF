import re

origin_path = r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\156107ba-4b13-4dc8-b7eb-45dcecd6cdc2\scratch\origin_channels.jsx"
target_path = r"d:\ALPHA\AISA_CON_M-F\src\app\client\channels\page.jsx"

with open(origin_path, "r", encoding="utf-16") as f:
    origin_code = f.read()

with open(target_path, "r", encoding="utf-8") as f:
    target_code = f.read()

# 1. State variables
yt_state = re.search(r"(  const \[isYouTubeConfigModalOpen.*?\n  const \[youtubeLoading.*?\n)", origin_code)
if yt_state and "isYouTubeConfigModalOpen" not in target_code:
    target_code = target_code.replace("const [zohoLoading, setZohoLoading] = useState(false);", "const [zohoLoading, setZohoLoading] = useState(false);\n" + yt_state.group(1))

# 2. YouTube Card UI
# The card in origin_code
yt_card = re.search(r"(\s*\{\/\* --- YOUTUBE CARD --- \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>)", origin_code, re.DOTALL)
if yt_card and "--- YOUTUBE CARD ---" not in target_code:
    # Insert after Zoho card. We can find the end of the grid:
    # `        </div>\n      )}`
    
    # Let's find Zoho card closing tags.
    # It ends with `      </div>\n\n    </div>\n  )}` maybe?
    # In target code, it ends with:
    # 1428:             </div>
    # 1429:           </div>
    # 1430: 
    # 1431:         </div>
    # 1432:       )}
    
    insertion_point = "          </div>\n\n        </div>\n      )}\n\n      {/* WhatsApp Configuration Modal */}"
    if insertion_point in target_code:
        target_code = target_code.replace(insertion_point, yt_card.group(1) + "\n\n" + insertion_point)
    else:
        # Fallback insertion
        insertion_point_2 = "          </div>\n\n        </div>\n      )}"
        if insertion_point_2 in target_code:
             target_code = target_code.replace(insertion_point_2, yt_card.group(1) + "\n\n" + insertion_point_2)
        else:
             print("Could not find insertion point!")

with open(target_path, "w", encoding="utf-8") as f:
    f.write(target_code)
print("Injected YouTube Card!")
