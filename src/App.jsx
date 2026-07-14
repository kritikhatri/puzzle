import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// ==========================================
// Web Audio Synthesized Sound Effects Engine
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime); // High pitch tick
    
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playShutter() {
    if (this.muted) return;
    this.init();
    
    // Shutter noise burst
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    // Mechanical camera slap click
    const osc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);
    
    clickGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    
    noise.start();
    osc.start();
    noise.stop(this.ctx.currentTime + 0.2);
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playHeartBurst() {
    if (this.muted) return;
    this.init();
    
    const playSparkle = (delay, freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + delay + 0.15);
      
      gain.gain.setValueAtTime(0.0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + 0.15);
    };
    
    playSparkle(0, 1100);
    playSparkle(0.04, 1400);
    playSparkle(0.08, 1200);
    playSparkle(0.12, 1700);
  }

  playSnap() {
    if (this.muted) return;
    this.init();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(760, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // Major arpeggio C5 - E5 - G5 - C6
    
    freqs.forEach((freq, idx) => {
      const delay = idx * 0.1;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0.0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + 0.35);
    });
  }

  playFly() {
    if (this.muted) return;
    this.init();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.85);
    
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.85);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.85);
  }
}

const soundEngine = new SoundEngine();

export default function App() {
  // State for webcam stream
  const [stream, setStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(null); // null = checking, true = has camera, false = denied/unavailable
  const [cameraError, setCameraError] = useState('');

  // Fallback upload state
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Flow & capture states
  const [countdown, setCountdown] = useState(null); // null or 3, 2, 1, 0
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // base64 data url

  // Puzzle state
  const [isPuzzlePhase, setIsPuzzlePhase] = useState(false);
  const [pieces, setPieces] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [flyStyle, setFlyStyle] = useState({});

  // Film strip photos
  const [photos, setPhotos] = useState([]);

  // Audio state
  const [isMuted, setIsMuted] = useState(false);

  // Gameplay Mode state
  const [puzzleMode, setPuzzleMode] = useState('auto'); // 'auto' | 'manual'
  const [draggedPieceId, setDraggedPieceId] = useState(null);
  const [solvingTimer, setSolvingTimer] = useState(0);

  // Custom Caption modal state
  const [activeEditingPhotoIndex, setActiveEditingPhotoIndex] = useState(null);
  const [captionInputText, setCaptionInputText] = useState('');

  // Cursor sparkle trail particles
  const [trailParticles, setTrailParticles] = useState([]);
  const lastSpawnRef = useRef({ x: 0, y: 0 });

  // Geolocation & Long distance sharing state
  const [roomId, setRoomId] = useState('');
  const [isRoomActive, setIsRoomActive] = useState(false);
  const [userName, setUserName] = useState('Me');
  const [partnerName, setPartnerName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [distance, setDistance] = useState('');
  const [connectedSince, setConnectedSince] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Drag and drop mechanics refs
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const piecesRef = useRef(pieces);
  const draggedPieceIdRef = useRef(draggedPieceId);

  // Local snapped pieces sparkle bursts
  const [localSparkles, setLocalSparkles] = useState([]);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);
  const timersRef = useRef([]);
  const gameTimerIntervalRef = useRef(null);

  // Geolocation Haversine calculator
  const getHaversineDistance = (coords1, coords2) => {
    if (!coords1 || !coords2) return null;
    const R = 6371; // Earth radius in km
    const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const dLon = ((coords2.lon - coords1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coords1.lat * Math.PI) / 180) *
        Math.cos((coords2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Keep refs up-to-date for stable callback closures
  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  useEffect(() => {
    draggedPieceIdRef.current = draggedPieceId;
  }, [draggedPieceId]);

  // Audio controls toggle
  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      soundEngine.muted = next;
      return next;
    });
  };

  // Initialize camera stream
  const initCamera = useCallback(async () => {
    try {
      // Clear previous stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      
      setStream(mediaStream);
      setHasCamera(true);
      setCameraError('');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera initialization failed, using file fallback:", err);
      setHasCamera(false);
      setCameraError(err.message || 'Webcam access denied or unavailable');
    }
  }, [stream]);

  // Join existing shared session room
  const joinSharedRoom = async (code) => {
    const name = prompt("You have been invited to share a photobooth strip! 💖\n\nEnter your nickname to join:") || "Partner";
    setUserName(name);
    setRoomId(code);
    setIsRoomActive(true);
    setIsSyncing(true);

    try {
      const res = await fetch(`https://kvdb.io/puzzle_pb_2026/room_${code}`);
      if (res.ok) {
        const data = await res.json();
        
        // Setup geolocation for distance measurement
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const receiverCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
              const dist = getHaversineDistance(data.senderCoords, receiverCoords);
              const distanceStr = dist ? `${dist.toLocaleString()} km apart 🎀` : `${Math.floor(Math.random() * 2500) + 400} km apart 🎀`;
              
              const updatedData = {
                ...data,
                partnerName: name,
                receiverCoords,
                distance: distanceStr
              };
              
              await fetch(`https://kvdb.io/puzzle_pb_2026/room_${code}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
              });
              
              setPhotos(data.photos || []);
              setPartnerName(data.userName || 'Creator');
              setDistance(distanceStr);
              setConnectedSince(data.connectedSince || '');
              setIsConnected(true);
              setIsSyncing(false);
            },
            async () => {
              const fallbackDist = `${Math.floor(Math.random() * 2500) + 400} km apart 🎀`;
              const updatedData = {
                ...data,
                partnerName: name,
                distance: fallbackDist
              };
              await fetch(`https://kvdb.io/puzzle_pb_2026/room_${code}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
              });
              
              setPhotos(data.photos || []);
              setPartnerName(data.userName || 'Creator');
              setDistance(fallbackDist);
              setConnectedSince(data.connectedSince || '');
              setIsConnected(true);
              setIsSyncing(false);
            }
          );
        } else {
          const fallbackDist = `${Math.floor(Math.random() * 2500) + 400} km apart 🎀`;
          const updatedData = {
            ...data,
            partnerName: name,
            distance: fallbackDist
          };
          await fetch(`https://kvdb.io/puzzle_pb_2026/room_${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
          
          setPhotos(data.photos || []);
          setPartnerName(data.userName || 'Creator');
          setDistance(fallbackDist);
          setConnectedSince(data.connectedSince || '');
          setIsConnected(true);
          setIsSyncing(false);
        }
      } else {
        alert("Failed to join room. Session might be expired.");
        setIsRoomActive(false);
        setRoomId('');
        setIsSyncing(false);
      }
    } catch (err) {
      console.error("Join room failed:", err);
      alert("Network error joining shared room.");
      setIsRoomActive(false);
      setRoomId('');
      setIsSyncing(false);
    }
    initCamera();
  };

  // Start new shared room session
  const startSharedRoom = async () => {
    const name = prompt("Enter your name to start a shared strip session: 💖", "Me") || "Me";
    setUserName(name);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(code);
    setIsRoomActive(true);
    setShowShareModal(true);
    setConnectedSince(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?room=${code}`;
    window.history.pushState({ path: newurl }, '', newurl);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const senderCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          const initialRoomState = {
            photos: [],
            userName: name,
            partnerName: '',
            distance: '',
            senderCoords,
            connectedSince: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          await fetch(`https://kvdb.io/puzzle_pb_2026/room_${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialRoomState)
          });
        },
        async () => {
          const fallbackDist = `${Math.floor(Math.random() * 2500) + 400} km apart 🎀`;
          setDistance(fallbackDist);
          const initialRoomState = {
            photos: [],
            userName: name,
            partnerName: '',
            distance: fallbackDist,
            connectedSince: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          await fetch(`https://kvdb.io/puzzle_pb_2026/room_${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialRoomState)
          });
        }
      );
    } else {
      const fallbackDist = `${Math.floor(Math.random() * 2500) + 400} km apart 🎀`;
      setDistance(fallbackDist);
      const initialRoomState = {
        photos: [],
        userName: name,
        partnerName: '',
        distance: fallbackDist,
        connectedSince: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      await fetch(`https://kvdb.io/puzzle_pb_2026/room_${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialRoomState)
      });
    }
  };

  // Poll shared database room
  useEffect(() => {
    if (!isRoomActive || !roomId) return;

    let isSubscribed = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`https://kvdb.io/puzzle_pb_2026/room_${roomId}`);
        if (res.ok && isSubscribed) {
          const data = await res.json();
          
          if (data.photos && JSON.stringify(data.photos) !== JSON.stringify(photos)) {
            setPhotos(data.photos);
            
            const lastPhoto = data.photos[data.photos.length - 1];
            if (lastPhoto && lastPhoto.sender !== userName && data.photos.length > photos.length) {
              alert(`${data.partnerName || 'Your partner'} captured a new photo! 💖`);
            }
          }

          if (data.partnerName && data.partnerName !== userName && partnerName !== data.partnerName) {
            setPartnerName(data.partnerName);
            setIsConnected(true);
          } else if (data.userName && data.userName !== userName && partnerName !== data.userName) {
            setPartnerName(data.userName);
            setIsConnected(true);
          }

          if (data.distance && distance !== data.distance) {
            setDistance(data.distance);
          }
          if (data.connectedSince && connectedSince !== data.connectedSince) {
            setConnectedSince(data.connectedSince);
          }
        }
      } catch (err) {
        console.warn("Error polling room updates:", err);
      }
    }, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
    };
  }, [isRoomActive, roomId, photos, userName, partnerName, distance, connectedSince]);

  // Detect URL parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      joinSharedRoom(roomParam);
    } else {
      initCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear all timeouts
  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (gameTimerIntervalRef.current) {
      clearInterval(gameTimerIntervalRef.current);
      gameTimerIntervalRef.current = null;
    }
  };

  // Keyboard shortcut listener (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        const active = document.activeElement?.tagName;
        if (active === 'INPUT' || active === 'BUTTON') return;
        
        e.preventDefault();
        
        const canCapture = 
          !isPuzzlePhase && 
          !isFlying && 
          countdown === null && 
          photos.length < 3 && 
          (hasCamera || uploadedImageSrc);

        if (canCapture) {
          triggerCaptureFlow();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCamera, uploadedImageSrc, isPuzzlePhase, isFlying, countdown, photos]);

  // Trigger countdown
  const triggerCaptureFlow = () => {
    if (photos.length >= 3) return;
    clearAllTimers();
    setCountdown(3);
    soundEngine.playTick(); // Synthesized count click

    const tick = (count) => {
      if (count > 0) {
        const timer = setTimeout(() => {
          setCountdown(count - 1);
          soundEngine.playTick(); // Tick click
          tick(count - 1);
        }, 1000);
        timersRef.current.push(timer);
      } else {
        setCountdown(null);
        performCapture();
      }
    };

    tick(3);
  };

  // Desaturate and boost contrast for B&W film style
  const applyBlackAndWhiteFilter = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, 480, 360);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      const factor = 1.4;
      gray = factor * (gray - 128) + 128;
      
      gray = Math.max(0, Math.min(255, gray));
      
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  // Capture frame to canvas
  const performCapture = () => {
    soundEngine.playShutter(); // Synthesized Shutter click sound
    soundEngine.playHeartBurst(); // Synthesized sparkle sound

    setIsFlashActive(true);
    const flashTimer = setTimeout(() => {
      setIsFlashActive(false);
    }, 600);
    timersRef.current.push(flashTimer);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (hasCamera && videoRef.current) {
      ctx.clearRect(0, 0, 480, 360);
      ctx.save();
      ctx.translate(480, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, 480, 360);
      ctx.restore();
      
      applyBlackAndWhiteFilter(canvas);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(dataUrl);
      startPuzzlePhase(dataUrl);
    } else if (uploadedImageSrc) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, 480, 360);
        
        const canvasAspect = 480 / 360;
        const imgAspect = img.width / img.height;
        let sx, sy, sWidth, sHeight;
        
        if (imgAspect > canvasAspect) {
          sHeight = img.height;
          sWidth = img.height * canvasAspect;
          sx = (img.width - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = img.width;
          sHeight = img.width / canvasAspect;
          sx = 0;
          sy = (img.height - sHeight) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 480, 360);
        applyBlackAndWhiteFilter(canvas);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(dataUrl);
        startPuzzlePhase(dataUrl);
      };
      img.src = uploadedImageSrc;
    }
  };

  // Sparkle burst effects at correct cell centers on snap
  const triggerSinglePieceSparkle = (x, y) => {
    const newSparkles = Array.from({ length: 6 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 50 + 35; // displacement
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      
      return {
        id: Date.now() + i + Math.random(),
        x,
        y,
        dx,
        dy,
        symbol: i % 2 === 0 ? '❤️' : '✨',
        size: Math.random() * 12 + 10
      };
    });
    setLocalSparkles(prev => [...prev, ...newSparkles]);
    
    setTimeout(() => {
      setLocalSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 800);
  };

  // Cursor trailer mouse move handler
  const handleMouseMove = (e) => {
    const lastPos = lastSpawnRef.current;
    const dist = Math.sqrt((e.clientX - lastPos.x) ** 2 + (e.clientY - lastPos.y) ** 2);
    if (dist < 18) return; 

    lastSpawnRef.current = { x: e.clientX, y: e.clientY };
    
    const newParticle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      symbol: Math.random() > 0.5 ? '🌸' : '✨',
      size: Math.random() * 8 + 8,
      rotation: Math.random() * 360
    };
    
    setTrailParticles(prev => [...prev, newParticle].slice(-20)); // cap size
    
    setTimeout(() => {
      setTrailParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 600);
  };

  // Start puzzle shattering & snapping sequence
  const startPuzzlePhase = (imageSrc) => {
    const piecesList = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      
      const scatteredX = (Math.random() - 0.5) * 360;
      const scatteredY = (Math.random() - 0.5) * 280;
      const scatteredRotation = (Math.random() - 0.5) * 90;

      piecesList.push({
        id: i,
        row,
        col,
        scatteredX,
        scatteredY,
        scatteredRotation,
        isSnapped: false,
      });
    }

    setPieces(piecesList);
    setIsPuzzlePhase(true);
    setIsComplete(false);

    if (puzzleMode === 'auto') {
      // Auto-snap staggered timers
      piecesList.forEach((piece, index) => {
        const snapTimer = setTimeout(() => {
          setPieces((prev) =>
            prev.map((p) => {
              if (p.id === piece.id) {
                soundEngine.playSnap(); // snap pop sound
                triggerSinglePieceSparkle(piece.col * 160 + 80, piece.row * 120 + 60);
                return { ...p, isSnapped: true };
              }
              return p;
            })
          );
        }, index * 100 + 200);
        timersRef.current.push(snapTimer);
      });

      const completeTimer = setTimeout(() => {
        setIsComplete(true);
        soundEngine.playVictory(); // arpeggio chord arpeggios sound
        
        const transitionTimer = setTimeout(() => {
          startFlyAnimation(imageSrc);
        }, 1600);
        timersRef.current.push(transitionTimer);
      }, 9 * 100 + 400);
      timersRef.current.push(completeTimer);
    } else {
      // Manual Mode: Setup game solving timer
      setSolvingTimer(0);
      if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current);
      
      gameTimerIntervalRef.current = setInterval(() => {
        setSolvingTimer(prev => prev + 1);
      }, 1000);
    }
  };

  // Drag and drop event handlers
  const handlePieceStartDrag = (pieceId, clientX, clientY) => {
    if (isComplete || isFlying) return;
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece || piece.isSnapped) return;
    
    setDraggedPieceId(pieceId);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      offsetX: piece.scatteredX,
      offsetY: piece.scatteredY
    };
  };

  const handleGlobalMove = useCallback((clientX, clientY) => {
    const pid = draggedPieceIdRef.current;
    if (pid === null) return;
    
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    
    let newX = dragStartRef.current.offsetX + deltaX;
    let newY = dragStartRef.current.offsetY + deltaY;
    
    newX = Math.max(-230, Math.min(230, newX));
    newY = Math.max(-170, Math.min(170, newY));

    setPieces(prev => prev.map(p => p.id === pid ? { ...p, scatteredX: newX, scatteredY: newY } : p));
  }, []);

  const handleGlobalEndDrag = useCallback(() => {
    const pid = draggedPieceIdRef.current;
    if (pid === null) return;
    
    const currentPieces = piecesRef.current;
    const piece = currentPieces.find(p => p.id === pid);
    if (piece) {
      const dist = Math.sqrt(piece.scatteredX * piece.scatteredX + piece.scatteredY * piece.scatteredY);
      if (dist < 30) {
        // Snap locking
        setPieces(prev => prev.map(p => p.id === pid ? { 
          ...p, 
          scatteredX: 0, 
          scatteredY: 0, 
          scatteredRotation: 0, 
          isSnapped: true 
        } : p));
        
        soundEngine.playSnap(); // snap pop
        triggerSinglePieceSparkle(piece.col * 160 + 80, piece.row * 120 + 60);

        const otherPiecesSnapped = currentPieces.filter(p => p.id !== pid).every(p => p.isSnapped);
        if (otherPiecesSnapped) {
          // Solved!
          setIsComplete(true);
          soundEngine.playVictory(); // arpeggio chord sound

          // Clear timer interval
          if (gameTimerIntervalRef.current) {
            clearInterval(gameTimerIntervalRef.current);
            gameTimerIntervalRef.current = null;
          }
          
          const flyTimer = setTimeout(() => {
            startFlyAnimation(capturedImage);
          }, 1600);
          timersRef.current.push(flyTimer);
        }
      }
    }
    
    setDraggedPieceId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage]);

  // Hook global drag event listeners
  useEffect(() => {
    if (draggedPieceId === null) return;

    const onMouseMove = (e) => {
      handleGlobalMove(e.clientX, e.clientY);
    };
    
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleGlobalMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseUp = () => {
      handleGlobalEndDrag();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [draggedPieceId, handleGlobalMove, handleGlobalEndDrag]);

  // Fly animation to film strip slot
  const startFlyAnimation = (imageSrc) => {
    const activeSlotIndex = photos.length;
    const slotId = `film-slot-${activeSlotIndex}`;
    const slotEl = document.getElementById(slotId);
    const stageEl = stageRef.current;

    if (slotEl && stageEl) {
      const stageRect = stageEl.getBoundingClientRect();
      const slotRect = slotEl.getBoundingClientRect();

      const dx = slotRect.left - stageRect.left;
      const dy = slotRect.top - stageRect.top;
      const scale = slotRect.width / stageRect.width;
      const finalRotation = (Math.random() - 0.5) * 8; 
      const offsetX = (Math.random() - 0.5) * 6; 
      const offsetY = (Math.random() - 0.5) * 10; 

      setFlyStyle({
        transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${finalRotation}deg)`,
        opacity: 0.15,
        transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.35, 1), opacity 0.8s ease-in-out',
        transformOrigin: 'top left',
        pointerEvents: 'none',
      });

      setIsFlying(true);
      soundEngine.playFly(); // Sweep sliding sound

      const animationEndTimer = setTimeout(async () => {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newPhoto = {
          src: imageSrc,
          date: timeString,
          rotation: finalRotation,
          offsetX,
          offsetY,
          sender: userName,
          customCaption: ''
        };

        if (isRoomActive && roomId) {
          try {
            const checkRes = await fetch(`https://kvdb.io/puzzle_pb_2026/room_${roomId}`);
            let updatedPhotos = [];
            let latestData = {};
            if (checkRes.ok) {
              latestData = await checkRes.json();
              updatedPhotos = [...(latestData.photos || []), newPhoto];
            } else {
              updatedPhotos = [...photos, newPhoto];
            }

            const updatedData = {
              ...latestData,
              photos: updatedPhotos
            };

            await fetch(`https://kvdb.io/puzzle_pb_2026/room_${roomId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData)
            });
            setPhotos(updatedPhotos);
          } catch (err) {
            console.error("Shared photo upload failed:", err);
            setPhotos(prev => [...prev, newPhoto]);
          }
        } else {
          setPhotos(prev => [...prev, newPhoto]);
        }

        // Reset stages
        setIsFlying(false);
        setIsPuzzlePhase(false);
        setIsComplete(false);
        setCapturedImage(null);
        setFlyStyle({});
        setUploadedImageSrc(null); 
      }, 820);
      timersRef.current.push(animationEndTimer);
    } else {
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newPhoto = {
        src: imageSrc,
        date: timeString,
        rotation: (Math.random() - 0.5) * 8,
        offsetX: (Math.random() - 0.5) * 6,
        offsetY: (Math.random() - 0.5) * 10,
        sender: userName,
        customCaption: ''
      };
      setPhotos(prev => [...prev, newPhoto]);
      setIsPuzzlePhase(false);
      setIsComplete(false);
      setCapturedImage(null);
      setUploadedImageSrc(null);
    }
  };

  // Fallback Upload File Handlers
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImageSrc(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Drag & drop file handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Trigger Caption Edit Input Dialog
  const openCaptionEditor = (index) => {
    const photo = photos[index];
    if (!photo) return;
    setActiveEditingPhotoIndex(index);
    setCaptionInputText(photo.customCaption || `Shot #${index + 1} • ${photo.date}`);
  };

  // Save Custom Polaroid Caption and sync to database
  const saveCustomCaption = async () => {
    if (activeEditingPhotoIndex === null) return;
    
    setPhotos(prev => prev.map((p, idx) => idx === activeEditingPhotoIndex ? { ...p, customCaption: captionInputText } : p));
    
    if (isRoomActive && roomId) {
      try {
        const checkRes = await fetch(`https://kvdb.io/puzzle_pb_2026/room_${roomId}`);
        if (checkRes.ok) {
          const data = await checkRes.json();
          const updatedPhotos = data.photos.map((p, idx) => 
            idx === activeEditingPhotoIndex ? { ...p, customCaption: captionInputText } : p
          );
          const updatedData = {
            ...data,
            photos: updatedPhotos
          };
          await fetch(`https://kvdb.io/puzzle_pb_2026/room_${roomId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
        }
      } catch (err) {
        console.warn("Syncing custom caption failed:", err);
      }
    }
    
    setActiveEditingPhotoIndex(null);
  };

  // Download film strip
  const downloadFilmStrip = async () => {
    if (photos.length < 3) return;

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');

    // 1. Draw film strip background (warm dark charcoal-plum)
    ctx.fillStyle = '#2c1e26';
    ctx.fillRect(0, 0, 320, 960);

    // 2. Draw sprocket perforated holes
    ctx.fillStyle = '#faf3ef'; 
    const drawSprocket = (x, y) => {
      const w = 10;
      const h = 16;
      const r = 3;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();
    };

    for (let y = 10; y < 960; y += 32) {
      drawSprocket(12, y);  
      drawSprocket(298, y); 
    }

    // 3. Render 3 polaroid frames onto the canvas
    const polaroidHeight = 220;
    const yOffsets = [40, 320, 600];

    const drawPolaroidCard = (photo, index, yOffset) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          
          const cx = 160 + (photo.offsetX || 0);
          const cy = yOffset + (polaroidHeight / 2) + (photo.offsetY || 0);
          
          ctx.translate(cx, cy);
          ctx.rotate((photo.rotation * Math.PI) / 180);

          ctx.shadowColor = 'rgba(61, 43, 53, 0.25)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 4;

          ctx.fillStyle = '#fafaf8';
          ctx.fillRect(-90, -110, 180, 220); // 180x220px card

          ctx.shadowColor = 'transparent';
          ctx.drawImage(img, -80, -90, 160, 120);

          ctx.fillStyle = '#3d2b35';
          ctx.font = 'italic bold 11px "Playfair Display", Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText(`#${index + 1}`, 0, 70);

          // Draw Washi Tape corners
          ctx.save();
          ctx.fillStyle = 'rgba(232, 160, 168, 0.75)'; 
          ctx.translate(-75, -100);
          ctx.rotate((-15 * Math.PI) / 180);
          ctx.fillRect(-20, -7, 40, 14);
          ctx.restore();

          ctx.save();
          ctx.fillStyle = 'rgba(201, 182, 217, 0.75)'; 
          ctx.translate(75, 100);
          ctx.rotate((15 * Math.PI) / 180);
          ctx.fillRect(-20, -7, 40, 14);
          ctx.restore();

          ctx.restore();

          // Draw caption on the film strip
          ctx.fillStyle = '#faf3ef'; 
          ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          
          const captionText = photo.customCaption || `SHOT #${index + 1} • ${photo.date}`;
          ctx.fillText(captionText.toUpperCase(), 160, yOffset + 245);

          resolve();
        };
        img.src = photo.src;
      });
    };

    await drawPolaroidCard(photos[0], 0, yOffsets[0]);
    await drawPolaroidCard(photos[1], 1, yOffsets[1]);
    await drawPolaroidCard(photos[2], 2, yOffsets[2]);

    // 4. Draw Footer Title
    ctx.fillStyle = '#e8a0a8'; 
    ctx.font = '900 14px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    
    if (isRoomActive) {
      ctx.fillText('SHOT TOGETHER, MILES APART 🎀', 160, 895);
      ctx.fillStyle = '#faf3ef';
      ctx.font = '600 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${userName.toUpperCase()} & ${partnerName.toUpperCase() || 'PARTNER'} • ${distance.toUpperCase()}`, 160, 918);
    } else {
      ctx.fillText('PUZZLE PHOTOBOOTH 🎀', 160, 895);
      ctx.fillStyle = '#faf3ef';
      ctx.font = '600 9px "Plus Jakarta Sans", sans-serif';
      const currentDate = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      ctx.fillText(currentDate.toUpperCase(), 160, 918);
    }

    const link = document.createElement('a');
    link.download = `photobooth-strip-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Reset Strip & Camera
  const resetStrip = async () => {
    clearAllTimers();
    setPhotos([]);
    setCapturedImage(null);
    setUploadedImageSrc(null);
    setIsPuzzlePhase(false);
    setIsComplete(false);
    setIsFlying(false);
    setFlyStyle({});
    setCountdown(null);

    if (isRoomActive && roomId) {
      try {
        const res = await fetch(`https://kvdb.io/puzzle_pb_2026/room_${roomId}`);
        if (res.ok) {
          const data = await res.json();
          const clearedState = {
            ...data,
            photos: []
          };
          await fetch(`https://kvdb.io/puzzle_pb_2026/room_${roomId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clearedState)
          });
        }
      } catch (err) {
        console.warn("Reset shared room state failed:", err);
      }
    }
    
    initCamera();
  };

  // Leave shared room session
  const leaveSharedRoom = () => {
    clearAllTimers();
    setIsRoomActive(false);
    setRoomId('');
    setPartnerName('');
    setIsConnected(false);
    setPhotos([]);
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newurl }, '', newurl);
    initCamera();
  };

  const copyShareLink = () => {
    const link = window.location.protocol + "//" + window.location.host + window.location.pathname + `?room=${roomId}`;
    navigator.clipboard.writeText(link);
    alert("Shareable partner link copied! Send it to your partner. 💖🎀");
    setShowShareModal(false);
  };

  const snappedCount = pieces.filter((p) => p.isSnapped).length;

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      {/* Background Cursor trailer particles */}
      {trailParticles.map(p => (
        <span
          key={p.id}
          className="trail-sparkle-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
          }}
        >
          {p.symbol}
        </span>
      ))}

      <header>
        {/* Sound toggle switch */}
        <button 
          className={`mute-toggle-btn ${isMuted ? 'muted' : ''}`} 
          onClick={toggleMute}
          title={isMuted ? "Unmute sounds 🔊" : "Mute sounds 🔇"}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <div className="title-wrapper">
          <h1 className="app-title">Puzzle Photobooth 🎀</h1>
          <div className="title-flourish">for us, shot together 🎀</div>
        </div>
        <p className="app-subtitle">
          Shatter your expressions. Watch them snap back together into vintage B&W prints.
          <span className="keyboard-hint">Spacebar to Shoot</span>
        </p>
      </header>

      {/* Sharing Session Banner */}
      <section className="sharing-control-banner">
        {!isRoomActive ? (
          <button className="share-session-btn" onClick={startSharedRoom}>
            <span>💖</span> Start a Shared Strip Together
          </button>
        ) : (
          <div className="shared-session-info">
            <div className="shared-session-status">
              <span className="pulsing-heart">💖</span>{' '}
              {isConnected ? (
                <span>Connected: <strong>{userName}</strong> & <strong>{partnerName}</strong></span>
              ) : (
                <span>Session Active. Waiting for partner to join...</span>
              )}
            </div>
            
            <div className="shared-session-meta">
              {distance && <span className="session-distance">📍 {distance}</span>}
              {connectedSince && <span className="session-time">⏱ Connected: {connectedSince}</span>}
              <span className="room-code-tag">Room: {roomId}</span>
            </div>

            <div className="shared-session-actions">
              <button className="copy-link-btn" onClick={() => setShowShareModal(true)}>
                🔗 Invite Partner
              </button>
              <button className="leave-room-btn" onClick={leaveSharedRoom}>
                💔 Leave Session
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Invite Modal */}
      {showShareModal && (
        <div className="share-modal-backdrop">
          <div className="share-modal-box">
            <h3 className="modal-title">Share the Booth! 💖</h3>
            <p className="modal-desc">
              Send this link to your partner! When they open it, their camera will connect, and you will interleave shots on the same film strip in real-time.
            </p>
            <div className="modal-link-box">
              {window.location.protocol + "//" + window.location.host + window.location.pathname + `?room=${roomId}`}
            </div>
            <div className="modal-buttons">
              <button className="modal-btn-confirm" onClick={copyShareLink}>Copy Link & Close</button>
              <button className="modal-btn-cancel" onClick={() => setShowShareModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="syncing-overlay">
          <div className="sync-spinner">🌸</div>
          <div>Connecting and syncing shared strip...</div>
        </div>
      )}

      {/* Custom Polaroid Caption modal */}
      {activeEditingPhotoIndex !== null && (
        <div className="share-modal-backdrop">
          <div className="share-modal-box">
            <h3 className="modal-title">Write Polaroid Caption 📝🎀</h3>
            <p className="modal-desc">Type a custom label or date for this photo card:</p>
            <input 
              type="text" 
              className="caption-text-input"
              value={captionInputText} 
              onChange={(e) => setCaptionInputText(e.target.value)}
              placeholder="e.g. best friends 💖"
              maxLength={24}
              autoFocus
            />
            <div className="modal-buttons" style={{ marginTop: '1.2rem' }}>
              <button className="modal-btn-confirm" onClick={saveCustomCaption}>Save 💖</button>
              <button className="modal-btn-cancel" onClick={() => setActiveEditingPhotoIndex(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <main className="workspace">
        {/* Left Side: Camera & Viewport stage */}
        <section className="stage-panel">
          <div className="camera-bezel">
            <div className={`camera-lens-led ${hasCamera ? 'active' : ''} ${countdown !== null ? 'recording' : ''}`} />
            
            <div 
              ref={stageRef}
              className="viewport"
              style={isFlying ? flyStyle : {}}
            >
              {/* Viewfinder Vignette Overlay */}
              {!isPuzzlePhase && (hasCamera || uploadedImageSrc) && (
                <div className="viewfinder-vignette" />
              )}

              {/* Viewfinder HUD Chrome */}
              {!isPuzzlePhase && (hasCamera || uploadedImageSrc) && (
                <div className="viewfinder-hud">
                  <div className="viewfinder-hud-left">
                    <span className={`rec-dot ${countdown !== null ? 'pulse' : ''}`} />
                    <span>REC</span>
                  </div>
                  <div className="viewfinder-hud-right">
                    <span>F:2.8</span>
                    <span>B&W FILM</span>
                    <span>ISO 100</span>
                  </div>
                </div>
              )}

              {/* Webcam View */}
              {hasCamera === true && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="webcam-feed"
                  style={{ display: isPuzzlePhase ? 'none' : 'block' }}
                />
              )}

              {/* Connecting Webcam Spinner */}
              {hasCamera === null && (
                <div className="webcam-loading-indicator">
                  <span>🌸</span> CONNECTING WEBCAM...
                </div>
              )}

              {/* Fallback File Uploader */}
              {hasCamera === false && !uploadedImageSrc && (
                <div 
                  className="fallback-uploader"
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ borderColor: isDragOver ? 'var(--accent-color)' : 'transparent' }}
                >
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden-canvas"
                    onChange={handleFileChange}
                  />
                  <div className="upload-icon">🌸</div>
                  <div className="upload-title">Camera Unavailable</div>
                  <div className="upload-desc">
                    {cameraError ? `Reason: ${cameraError}. ` : 'No webcam detected or permission denied. '}
                    Drag & drop a photo here or click to browse.
                  </div>
                  <button className="upload-btn">Browse Photo</button>
                </div>
              )}

              {/* Fallback Photo Preview */}
              {hasCamera === false && uploadedImageSrc && (
                <div className="fallback-preview-container" style={{ display: isPuzzlePhase ? 'none' : 'block' }}>
                  <img src={uploadedImageSrc} className="fallback-preview-img" alt="Uploaded Preview" />
                  <div className="change-photo-overlay" onClick={triggerFileInput}>
                    Change Photo
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden-canvas"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* 3-2-1 Countdown Overlay */}
              {countdown !== null && (
                <div className="countdown-overlay">
                  <div className="countdown-label">Capturing in {countdown}</div>
                  <div className="countdown-number">{countdown}</div>
                </div>
              )}

              {/* Magical Heart Sparkles on capture */}
              {isFlashActive && (
                <div className="heart-burst-container">
                  {[...Array(15)].map((_, i) => {
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    const size = Math.random() * 20 + 12;
                    const delay = Math.random() * 0.15;
                    const duration = Math.random() * 0.35 + 0.4;
                    const angle = (Math.random() - 0.5) * 60;
                    const symbol = i % 3 === 0 ? '❤️' : i % 3 === 1 ? '🌸' : '✨';
                    return (
                      <span 
                        key={i} 
                        className="heart-sparkle" 
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          fontSize: `${size}px`,
                          animationDelay: `${delay}s`,
                          animationDuration: `${duration}s`,
                          transform: `rotate(${angle}deg)`
                        }}
                      >
                        {symbol}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Camera flash overlay */}
              <div className={`flash-overlay ${isFlashActive ? 'flash-active' : ''}`} />

              {/* Puzzle Shatter Screen */}
              {isPuzzlePhase && capturedImage && (
                <div className="puzzle-stage">
                  {/* Grid layout lines to guide target positions */}
                  <div className="grid-guides">
                    {[...Array(9)].map((_, index) => (
                      <div key={index} className="grid-guide-cell" />
                    ))}
                  </div>

                  {/* Puzzle Pieces */}
                  {pieces.map((piece) => (
                    <div
                      key={piece.id}
                      className={`puzzle-piece ${draggedPieceId === piece.id ? 'active-dragging' : ''}`}
                      onMouseDown={(e) => {
                        if (puzzleMode === 'manual') handlePieceStartDrag(piece.id, e.clientX, e.clientY);
                      }}
                      onTouchStart={(e) => {
                        if (puzzleMode === 'manual' && e.touches[0]) {
                          handlePieceStartDrag(piece.id, e.touches[0].clientX, e.touches[0].clientY);
                        }
                      }}
                      style={{
                        backgroundImage: `url(${capturedImage})`,
                        backgroundSize: '480px 360px',
                        backgroundPosition: `${-piece.col * 160}px ${-piece.row * 120}px`,
                        left: `${piece.col * 160}px`,
                        top: `${piece.row * 120}px`,
                        transform: piece.isSnapped
                          ? 'translate(0px, 0px) rotate(0deg) scale(1)'
                          : `translate(${piece.scatteredX}px, ${piece.scatteredY}px) rotate(${piece.scatteredRotation}deg) scale(0.95)`,
                        opacity: piece.isSnapped ? 1 : 0.85,
                        cursor: piece.isSnapped ? 'default' : (puzzleMode === 'manual' ? 'grab' : 'default'),
                        touchAction: 'none'
                      }}
                    />
                  ))}

                  {/* Local single piece snapping arpeggio sparkles explosion */}
                  {localSparkles.map(s => (
                    <span
                      key={s.id}
                      className="local-sparkle-particle"
                      style={{
                        left: `${s.x}px`,
                        top: `${s.y}px`,
                        fontSize: `${s.size}px`,
                        transform: 'translate(-50%, -50%)',
                        animation: 'particle-explode 0.8s ease-out forwards',
                        '--dx': `${s.dx}px`,
                        '--dy': `${s.dy}px`
                      }}
                    >
                      {s.symbol}
                    </span>
                  ))}
                </div>
              )}

              {/* Puzzle Completed stamp overlay */}
              {isComplete && !isFlying && (
                <div className="puzzle-complete-overlay">
                  <div className="puzzle-complete-stamp">Puzzle Complete 💖</div>
                </div>
              )}
            </div>
          </div>

          {/* Sub bezel Controls */}
          <div className="stage-controls">
            {isPuzzlePhase && !isComplete && (
              <div className="counter-badge">
                {puzzleMode === 'manual' ? (
                  <span>🧩 {snappedCount} / 9 SOLVED • ⏱ {solvingTimer}s</span>
                ) : (
                  <span>🌸 {snappedCount} / 9 PIECES SNAPPED</span>
                )}
              </div>
            )}
            
            {/* Mode selection buttons */}
            {!isPuzzlePhase && (
              <div className="mode-selector">
                <button 
                  className={`mode-btn ${puzzleMode === 'auto' ? 'active' : ''}`}
                  onClick={() => setPuzzleMode('auto')}
                  disabled={countdown !== null}
                >
                  🌸 Auto-Snap
                </button>
                <button 
                  className={`mode-btn ${puzzleMode === 'manual' ? 'active' : ''}`}
                  onClick={() => setPuzzleMode('manual')}
                  disabled={countdown !== null}
                >
                  🧩 Play Puzzle
                </button>
              </div>
            )}

            {!isPuzzlePhase && (
              <button
                className="capture-btn"
                onClick={triggerCaptureFlow}
                disabled={photos.length >= 3 || (hasCamera === false && !uploadedImageSrc) || countdown !== null}
              >
                📸 Pinch to Capture
              </button>
            )}
          </div>
        </section>

        {/* Right Side: Retro Film Strip */}
        <section className="film-strip-panel">
          <div className="film-strip-wrapper">
            <div className="film-strip-torn-top" />
            <div className="film-strip-title-container">
              <h2 className="film-strip-title">Film Strip 🎀</h2>
            </div>
            
            <div className="film-strip-slots">
              {[0, 1, 2].map((index) => {
                const photo = photos[index];
                const isActiveSlot = index === photos.length;
                return (
                  <div
                    key={index}
                    id={`film-slot-${index}`}
                    className={`film-slot ${isActiveSlot && isFlying ? 'active-target' : ''}`}
                  >
                    {photo ? (
                      <>
                        <div 
                          className="polaroid-card clickable-card"
                          onClick={() => openCaptionEditor(index)}
                          title="Click to write custom caption! 📝🎀"
                          style={{ 
                            transform: `rotate(${photo.rotation}deg) translate(${photo.offsetX || 0}px, ${photo.offsetY || 0}px)` 
                          }}
                        >
                          <div className="washi-tape-tl" />
                          <div className="washi-tape-br" />

                          <div className="polaroid-image-container">
                            <img src={photo.src} className="polaroid-img" alt={`Strip Shot #${index + 1}`} />
                          </div>
                          <div className="polaroid-handwritten-label">
                            {photo.customCaption ? photo.customCaption.substring(0, 14) : `#${index + 1}`}
                          </div>
                        </div>
                        <div className="polaroid-caption">
                          {photo.customCaption || `Shot #${index + 1} • ${photo.date}`} {photo.sender && `(${photo.sender})`}
                        </div>
                      </>
                    ) : (
                      <div className="film-slot-placeholder">
                        {index + 1}
                        <span>Empty</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="film-strip-torn-bottom" />
          </div>

          {/* Film Strip actions */}
          <div className="film-controls">
            <button
              className="action-btn btn-primary"
              onClick={downloadFilmStrip}
              disabled={photos.length < 3}
            >
              📥 Download Strip
            </button>
            <button
              className="action-btn btn-danger"
              onClick={resetStrip}
            >
              🔄 Reset Strip
            </button>
          </div>
        </section>
      </main>

      {/* Hidden canvas for capturing frame data */}
      <canvas ref={canvasRef} className="hidden-canvas" width="480" height="360" />
    </div>
  );
}
