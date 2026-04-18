return (
    <main className="min-h-screen bg-black overflow-hidden relative">
      
      {/* 🎵 Musik */}
      <audio autoPlay loop>
        <source src="/lagu.mp3" type="audio/mp3" />
      </audio>

      <LoveFirework
        onExplode={(x, y) => {
          setShow(true); // Langsung set true tanpa menunggu koordinat tertentu
        }}
      />

      {show && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none px-4"
          /* className di atas memastikan teks berada tepat di tengah layar (z-50 agar di paling depan) */
        >
          <div className="text-center">
            <h1
              className="text-6xl md:text-8xl font-extrabold text-pink-300 animate-pulse mb-4"
              style={{
                textShadow: "0 0 20px #ff4d6d, 0 0 40px #ff4d6d, 0 0 60px #ff4d6d",
              }}
            >
              sipaacantik 💖
            </h1>

            <p
              className="text-xl md:text-2xl text-white font-medium max-w-lg"
              style={{
                textShadow: "0 0 10px pink, 0 0 20px rgba(255,192,203,0.8)",
              }}
            >
              {text}
            </p>
          </div>
        </div>
      )}
    </main>
  );