"use client";

import { useState, useEffect, useRef } from "react";

// --- KOMPONEN UTAMA (Canvas & Teks Menyatu) ---
export default function Home() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // State untuk animasi mengetik (sekarang digunakan di dalam Canvas)
  const [typingState, setTypingState] = useState({
    show: false,
    name: "",
    message: "",
    nameIndex: 0,
    messageIndex: 0,
    finishedName: false,
    finishedAll: false,
  });

  const fullName = "sipaacantik ";
  const fullMessage = "semangat terus yaa, ngoding nyaaaa ❤️✨";

  // --- EFEK 1: Logika Mengetik (Typewriter Logic) ---
  useEffect(() => {
    // Mulai musik saat komponen dimuat (opsional, karena autoPlay kadang diblokir browser)
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log("Autoplay musik diblokir. Klik layar untuk mulai."));
    }

    if (!typingState.show) return;

    // Mengetik Nama
    if (!typingState.finishedName && typingState.nameIndex < fullName.length) {
      const timeout = setTimeout(() => {
        setTypingState((prev) => ({
          ...prev,
          name: prev.name + fullName[typingState.nameIndex],
          nameIndex: prev.nameIndex + 1,
        }));
      }, 150); // Kecepatan mengetik nama (lambat/dramatis)
      return () => clearTimeout(timeout);
    } else if (typingState.nameIndex === fullName.length && !typingState.finishedName) {
      setTypingState((prev) => ({ ...prev, finishedName: true }));
    }

    // Mengetik Pesan (setelah Nama selesai)
    if (typingState.finishedName && !typingState.finishedAll && typingState.messageIndex < fullMessage.length) {
      const timeout = setTimeout(() => {
        setTypingState((prev) => ({
          ...prev,
          message: prev.message + fullMessage[typingState.messageIndex],
          messageIndex: prev.messageIndex + 1,
        }));
      }, 70); // Kecepatan mengetik pesan (sedikit lebih cepat)
      return () => clearTimeout(timeout);
    } else if (typingState.messageIndex === fullMessage.length && !typingState.finishedAll) {
      setTypingState((prev) => ({ ...prev, finishedAll: true }));
    }
  }, [typingState]);

  // --- EFEK 2: Logika Canvas (Kembang Api & Teks Background) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    let particles = [];
    let rockets = [];
    let stars = [];

    // Buat data bintang background statis
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.02,
      });
    }

    function createHeart(x, y) {
      for (let t = 0; t < Math.PI * 2; t += 0.15) {
        const scale = 7;
        const px = x + scale * 16 * Math.pow(Math.sin(t), 3);
        const py = y - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        particles.push({
          x, y, targetX: px, targetY: py, life: 90,
          color: `hsl(${Math.random() * 360},100%,75%)`,
        });
      }
      // Trigger untuk mulai memunculkan teks di background
      setTypingState((prev) => ({ ...prev, show: true }));
    }

    function spawnRocket() {
      rockets.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetY: canvas.height * (0.15 + Math.random() * 0.4),
        speed: 7 + Math.random() * 2,
        exploded: false,
      });
    }

    const interval = setInterval(spawnRocket, 1200);

    // --- FUNGSI MENGGAMBAR TEKS DI CANVAS (Background Layer) ---
    function drawBackgroundText() {
      if (!typingState.show) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Menggambar Nama ("sipaacantik 💖")
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Ukuran Font Responsif (mengecil di layar HP)
      const nameFontSize = Math.min(canvas.width * 0.1, 120); 
      ctx.font = `900 ${nameFontSize}px 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

      // Efek Glow Nama
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#ff4d6d";
      ctx.fillStyle = "#f9a8d4"; // pink-300

      // Menggambar teks Nama yang sudah diketik
      ctx.fillText(typingState.name, centerX, centerY - nameFontSize * 0.3);

      // Kursor berkedip untuk Nama
      if (!typingState.finishedName && Math.floor(Date.now() / 400) % 2 === 0) {
        const nameWidth = ctx.measureText(typingState.name).width;
        ctx.fillStyle = "#f9a8d4";
        ctx.fillRect(centerX + nameWidth / 2 + 5, centerY - nameFontSize * 0.8, 4, nameFontSize);
      }

      // Menggambar Pesan ("semangat terus...")
      if (typingState.finishedName) {
        const messageFontSize = Math.min(canvas.width * 0.04, 35);
        ctx.font = `italic 600 ${messageFontSize}px 'Segoe UI', sans-serif`;
        
        // Efek Glow Pesan (lebih lembut)
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 192, 203, 0.8)";
        ctx.fillStyle = "white";

        // Menggambar teks Pesan yang sudah diketik
        ctx.fillText(typingState.message, centerX, centerY + nameFontSize * 0.6);

        // Kursor berkedip untuk Pesan
        if (!typingState.finishedAll && Math.floor(Date.now() / 400) % 2 === 0) {
          const messageWidth = ctx.measureText(typingState.message).width;
          ctx.fillStyle = "white";
          ctx.fillRect(centerX + messageWidth / 2 + 5, centerY + nameFontSize * 0.6 - messageFontSize * 0.4, 3, messageFontSize);
        }
      }

      // Reset shadow agar tidak mempengaruhi partikel kembang api
      ctx.shadowBlur = 0;
    }

    function animate() {
      // Background hitam solid untuk layer terbawah
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Gambar Bintang (Layer paling belakang)
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        // Efek kerlip
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 1) star.opacity = 1;
      });

      // 2. Gambar Teks (Layer Background - Mengetik)
      drawBackgroundText();

      // 3. Gambar Jejak Kembang Api (Transparan agar teks di belakang tembus)
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 4. Update & Gambar Roket
      rockets.forEach((r, idx) => {
        if (!r.exploded) {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          r.y -= r.speed;
          if (r.y <= r.targetY) {
            r.exploded = true;
            createHeart(r.x, r.y);
            rockets.splice(idx, 1);
          }
        }
      });

      // 5. Update & Gambar Partikel Hati
      particles.forEach((p, i) => {
        p.x += (p.targetX - p.x) * 0.08;
        p.y += (p.targetY - p.y) * 0.08;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [typingState.name, typingState.message, typingState.show]); // Re-run saat teks berubah

  // Menangani klik layar untuk memulai musik (jika autoplay diblokir)
  const handleStartAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <main className="min-h-screen bg-black overflow-hidden relative cursor-pointer" onClick={handleStartAudio}>
      
      {/* 🎵 Musik - Pastikan file /public/lagu.mp3 ada */}
      <audio ref={audioRef} loop>
        <source src="/lagu.mp3" type="audio/mp3" />
      </audio>

      {/* Satu-satunya Canvas untuk Kembang Api & Teks Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Overlay transparan untuk menangkap klik awal (opsional) */}
      {!typingState.show && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <p className="text-white/30 text-sm animate-pulse">Menunggu ledakan pertama... (Klik untuk musik)</p>
        </div>
      )}
    </main>
  );
}