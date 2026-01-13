import { useEffect, useRef, useState } from "react";

export default function VideoCall({ socket, onClose }) {
  const pcRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingIceRef = useRef([]);
   const ringingIntervalRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [isCaller, setIsCaller] = useState(false);

  /* ---------------- SAFE SEND ---------------- */
  const safeSend = (payload) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  };

  /* ---------------- WAIT FOR SOCKET ---------------- */
  const waitForSocket = () =>
    new Promise((resolve) => {
      if (!socket) return;

      if (socket.readyState === WebSocket.OPEN) return resolve();

      const check = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });
   


  /* ---------------- CREATE PEER CONNECTION ---------------- */
  const createPC = () => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        safeSend({ type: "ice", data: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current && e.streams[0]) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    pcRef.current = pc;
    return pc;
  };

  /* ---------------- PREPARE MEDIA ---------------- */
  const prepareMedia = async () => {
    if (localStreamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const pc = createPC();
    const senders = pc.getSenders();

    stream.getTracks().forEach((track) => {
      if (!senders.find((s) => s.track === track)) {
        pc.addTrack(track, stream);
      }
    });
  };

  /* ---------------- START CALL ---------------- */
  const startCall = async () => {
  if (ringingIntervalRef.current) return; // 🚫 already ringing

  await waitForSocket();
  setIsCaller(true);
  await prepareMedia();

  safeSend({ type: "call_request" });

  ringingIntervalRef.current = setInterval(() => {
    safeSend({ type: "call_request" });
  }, 2000);
};



  /* ---------------- ACCEPT CALL ---------------- */
  const acceptCall = async () => {
    await waitForSocket();
    setIncoming(false);
    setIsCaller(false);
    await prepareMedia();
    safeSend({ type: "call_accept" });
  };

  /* ---------------- SOCKET HANDLER ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handler = async (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "call_request") {
        setIncoming(true);
      }

      if (msg.type === "call_accept" && isCaller && !started) {
        await prepareMedia();
        const pc = createPC();

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        safeSend({ type: "offer", data: offer });
        setStarted(true);
        if (ringingIntervalRef.current) {
  clearInterval(ringingIntervalRef.current);
  ringingIntervalRef.current = null;
}

      }

      if (msg.type === "offer") {
        await prepareMedia();
        const pc = createPC();

        await pc.setRemoteDescription(msg.data);

        // Flush ICE
        pendingIceRef.current.forEach((c) =>
          pc.addIceCandidate(c)
        );
        pendingIceRef.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        safeSend({ type: "answer", data: answer });
        setStarted(true);
      }

      if (msg.type === "answer") {
        const pc = pcRef.current;
        if (!pc) return;

        await pc.setRemoteDescription(msg.data);

        // Flush ICE
        pendingIceRef.current.forEach((c) =>
          pc.addIceCandidate(c)
        );
        pendingIceRef.current = [];
      }

      if (msg.type === "ice" && msg.data) {
        const pc = createPC();
        if (pc.remoteDescription) {
          await pc.addIceCandidate(msg.data);
        } else {
          pendingIceRef.current.push(msg.data);
        }
      }

      if (msg.type === "call_end") {
        endCall(false);
      }
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket, isCaller, started]);

  /* ---------------- RE-ATTACH LOCAL VIDEO AFTER UI RENDER ---------------- */
  useEffect(() => {
    if (started && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [started]);

  /* ---------------- END CALL ---------------- */
  const endCall = (notify = true) => {
    if (ringingIntervalRef.current) {
  clearInterval(ringingIntervalRef.current);
  ringingIntervalRef.current = null;
}

    if (notify) safeSend({ type: "call_end" });

    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    pendingIceRef.current = [];

    setStarted(false);
    setIncoming(false);
    setIsCaller(false);

    onClose();
  };

  /* ---------------- UI ---------------- */
  return (
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
    {/* REMOTE VIDEO (FULL SCREEN) */}
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      className={`absolute inset-0 w-full h-full object-cover ${
        started ? "" : "hidden"
      }`}
    />

    {/* LOCAL VIDEO (FLOATING PIP) */}
    <video
      ref={localVideoRef}
      autoPlay
      muted
      playsInline
      className={`absolute bottom-24 right-4 w-32 h-48 md:w-48 md:h-64 
        object-cover rounded-lg border-2 border-white shadow-lg
        ${started ? "" : "hidden"}`}
    />

    {/* INCOMING CALL OVERLAY */}
    {incoming && !started && (
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
        <p className="text-lg mb-6">📞 Incoming video call</p>
        <button
          onClick={acceptCall}
          className="bg-green-600 px-6 py-2 rounded-full text-white text-lg"
        >
          Accept
        </button>
      </div>
    )}

    {/* START CALL BUTTON */}
    {!started && !incoming && (
      <button
        onClick={startCall}
        className="bg-indigo-600 px-6 py-2 rounded-full text-white text-lg"
      >
        Start Video Call
      </button>
    )}

    {/* CALL CONTROLS */}
    {started && (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6">
        <button
          onClick={() => endCall(true)}
          className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
        >
          ⛔
        </button>
      </div>
    )}
  </div>
);

}
