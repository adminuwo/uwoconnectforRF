import os

def merge_global_listener():
    file_path = 'src/components/dashboard/GlobalIncomingCallListener.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = content.split('<<<<<<< HEAD\n')
    out = [blocks[0]]
    for block in blocks[1:]:
        head_part, rest = block.split('=======\n', 1)
        remote_part, remainder = rest.split('>>>>>>>', 1)
        # remainder includes the commit hash and newline, let's clean it
        remainder = remainder.split('\n', 1)[1] if '\n' in remainder else remainder

        if 'import { useRouter }' in head_part:
            out.append(remote_part)
        elif 'backendUrlStr' in head_part:
            out.append(head_part + '\n' + remote_part)
        elif 'data.type === \'offer\'' in head_part:
            out.append(head_part + '\n' + remote_part)
        elif 'handleAccept' in head_part:
            out.append(remote_part.replace('stopRingtone();', 'stopRingtone();\n' + head_part.replace('const handleAccept = () => {\n    stopRingtone();\n', '').replace('}\n    setIncomingCall(null);\n    router.push(\'/client/calls\');\n  };\n', '')))
        elif 'handleDecline' in head_part:
            # We want both WebSocket send and the remote logic
            decline_head_inner = head_part.replace('const handleDecline = () => {\n    stopRingtone();\n', '').replace('}\n    setIncomingCall(null);\n    pendingOfferRef.current = null;\n  };\n', '')
            out.append(remote_part.replace('stopRingtone();', 'stopRingtone();\n' + decline_head_inner + '\n    pendingOfferRef.current = null;\n'))
        else:
            out.append(head_part + '\n' + remote_part)
        out.append(remainder)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write("".join(out))
    print("Merged GlobalIncomingCallListener.jsx")

def merge_calls():
    file_path = 'src/app/client/calls/page.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = content.split('<<<<<<< HEAD\n')
    out = [blocks[0]]
    for block in blocks[1:]:
        head_part, rest = block.split('=======\n', 1)
        remote_part, remainder = rest.split('>>>>>>>', 1)
        remainder = remainder.split('\n', 1)[1] if '\n' in remainder else remainder

        if 'localVideoRef.current.srcObject' in head_part:
            out.append(head_part + '\n' + remote_part)
        elif 'const pc = new RTCPeerConnection' in head_part:
            # Keep remote RTCPeerConnection (it has ICE handlers)
            out.append(remote_part)
        elif 'offer = await pc.createOffer();' in head_part:
            out.append(head_part + '\n' + remote_part)
        else:
            out.append(head_part + '\n' + remote_part)
        out.append(remainder)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write("".join(out))
    print("Merged calls/page.jsx")

def merge_inbox():
    file_path = 'src/app/client/inbox/page.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = content.split('<<<<<<< HEAD\n')
    out = [blocks[0]]
    for block in blocks[1:]:
        head_part, rest = block.split('=======\n', 1)
        remote_part, remainder = rest.split('>>>>>>>', 1)
        remainder = remainder.split('\n', 1)[1] if '\n' in remainder else remainder

        if 'MessageSquare' in head_part:
            out.append(remote_part)
        elif 'const wsRef = useRef(null);' in head_part:
            # Combine
            out.append(head_part + '\n' + remote_part)
        elif 'const [msgRes, contactRes]' in head_part:
            # Combine the axios calls? No, remote is much better with profileRes, teamRes, statsRes. 
            # We just need to make sure selectedConvoIdRef is used. Remote has selectedConvoIdRef!
            out.append(remote_part)
        elif 'msg.metadata.message.quick_replies' in head_part:
            # Keep remote rendering which is far superior
            out.append(remote_part)
        else:
            # fallback
            out.append(remote_part)
        out.append(remainder)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write("".join(out))
    print("Merged inbox/page.jsx")

if __name__ == '__main__':
    try:
        merge_global_listener()
    except Exception as e:
        print("Error Global:", e)
    
    try:
        merge_calls()
    except Exception as e:
        print("Error Calls:", e)
        
    try:
        merge_inbox()
    except Exception as e:
        print("Error Inbox:", e)
