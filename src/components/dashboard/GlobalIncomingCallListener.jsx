import { API_BASE_URL } from '@/config/apiConfig';

export default function GlobalIncomingCallListener() {
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState(null);
  const ringtoneRef = useRef(null);

  const startRingtone = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      let playing = true;
      const playTone = () => {
        if (!playing) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(480, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      };
      playTone();
      const interval = setInterval(playTone, 1800);
      ringtoneRef.current = () => {
        playing = false;
        clearInterval(interval);
        audioCtx.close();
      };
    } catch (e) {}
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current();
      ringtoneRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let channel;

    const handleCallSignal = (data) => {
      if (!data) return;
      if (data.type === 'CALL_INITIATED') {
        setIncomingCall({
          callerName: data.callerName || 'Client / Team Member',
          role: data.role || 'Member',
          dept: data.dept || 'UWOConnect',
          isVideo: data.isVideo,
          sessionId: data.sessionId
        });
        startRingtone();
      } else if (data.type === 'CALL_ACCEPTED' || data.type === 'CALL_REJECTED' || data.type === 'CALL_ENDED') {
        stopRingtone();
        setIncomingCall(null);
      }
    };

    // 1. BroadcastChannel Listener
    try {
      channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.onmessage = (event) => handleCallSignal(event.data);
    } catch (e) {}

    // 2. LocalStorage Cross-Tab Listener
    const handleStorageChange = (e) => {
      if (e.key === 'uwo_calls_signal_event' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleCallSignal(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Custom DOM Event Listener
    const handleCustomCallEvent = (e) => {
      handleCallSignal(e.detail);
    };
    window.addEventListener('uwo_call_signal', handleCustomCallEvent);

    // 4. Backend Active Call Poller (Cross-Device & Cross-Browser)
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/webrtc/call/active-check`);
        if (res.ok) {
          const data = await res.json();
          if (data.active_call) {
            handleCallSignal({
              type: 'CALL_INITIATED',
              callerName: data.caller || 'Abha (Client)',
              role: 'Client',
              dept: 'UWOConnect',
              isVideo: data.is_video,
              sessionId: data.session_id
            });
          }
        }
      } catch (e) {}
    }, 2500);

    return () => {
      clearInterval(pollInterval);
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('uwo_call_signal', handleCustomCallEvent);
      stopRingtone();
    };
  }, []);

  const handleAccept = async () => {
    stopRingtone();
    try {
      const channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.postMessage({ type: 'CALL_ACCEPTED', responderName: 'Team Member' });
    } catch(e) {}
    if (incomingCall?.sessionId) {
      try {
        await fetch(`${API_BASE_URL}/api/webrtc/call/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: incomingCall.sessionId, action: 'accept' })
        });
      } catch(e) {}
    }
    setIncomingCall(null);
    router.push('/client/calls');
  };

  const handleDecline = async () => {
    stopRingtone();
    try {
      const channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.postMessage({ type: 'CALL_REJECTED' });
    } catch(e) {}
    if (incomingCall?.sessionId) {
      try {
        await fetch(`${API_BASE_URL}/api/webrtc/call/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: incomingCall.sessionId, action: 'decline' })
        });
      } catch(e) {}
    }
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
        <div className="relative mx-auto w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-700 font-black text-2xl flex items-center justify-center border-2 border-emerald-500 animate-bounce">
          {incomingCall.callerName[0]}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-30" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{incomingCall.callerName}</h3>
          <p className="text-xs text-slate-500 font-semibold">{incomingCall.role} • {incomingCall.dept}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <PhoneCall size={14} className="animate-pulse text-emerald-600" />
            <span>Incoming {incomingCall.isVideo ? 'HD Video' : 'Voice'} Call...</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleAccept}
            className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105"
            title="Accept & Connect"
          >
            <Phone size={24} />
          </button>
          <button
            onClick={handleDecline}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105"
            title="Decline"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
