const { useState, useRef, useEffect } = React;

const allPlaylists = [
  {
    id: "sontung",
    name: "Sơn Tùng M-TP Mix",
    description: "Tuyển tập những bài hát hay nhất",
    coverImage: "./image/son-tung.jpg",
    songs: [
      { 
        title: "Chúng Ta Của Hiện Tại", 
        artist: "Sơn Tùng M-TP", 
        src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776077112/chung-ta-cua-hien-tai_ag6p0h.mp3", 
        cover: "./image/son-tung.jpg",
        lyrics: "Mùa thu mang giấc mơ quay về\nVẫn nguyên vẹn như hôm nào\nLá bay theo gió xôn xao\nChốn xưa anh chờ..."
      },
      { title: "Muộn Rồi Mà Sao Còn", artist: "Sơn Tùng M-TP", src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776077246/muon-roi-sao-ma-con_efuwqp.mp3", cover: "./image/son-tung.jpg"},
      { title: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP", src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776077632/noi-nay-co-anh_mrzc22.mp3", cover: "./image/son-tung.jpg"},
      { title: "Đừng Làm Trái Tim Anh Đau", artist: "Sơn Tùng M-TP", src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776077659/son-tung-mtp-Dunglamtraitimanhdau_iuf6kb.mp3", cover: "./image/son-tung.jpg"},
    ]
  },
  {
    id: "hieuthuhai",
    name: "HIEUTHUHAI Top Hits",
    description: "Nhạc suy hay nhạc quẩy đều có đủ",
    coverImage: "./image/hieu-thu-hai.jpg",
    songs: [
      { 
        title: "Ngủ Một Mình", 
        artist: "HIEUTHUHAI", 
        src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776078799/ngu-mot-minh_p0poia.mp3", 
        cover: "./image/hieu-thu-hai.jpg",
        lyrics: "Baby anh không muốn phải ngủ một mình đêm nay..."
      },
      { title: "Không Thể Say", artist: "HIEUTHUHAI", src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776078567/khong-the-say_uw5ll2.mp3", cover: "./image/hieu-thu-hai.jpg" },
      { title: "Người im lặng gặp người hay nói", artist: "HIEUTHUHAI", src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776078850/nguoi-im-lang-gap-nguoi-hay-noi_sbb17g.mp3", cover: "./image/hieu-thu-hai.jpg" },
      { title: "Nghe Như Tình Yêu", artist: "HIEUTHUHAI", src: "https://res.cloudinary.com/dzisjnhfj/video/upload/v1776078828/nghe-nhu-tinh-yeu_bvwubg.mp3", cover: "./image/hieu-thu-hai.jpg"},
    ]
  }
];

const MusicPlayer = () => {
  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem("myAppPlaylists_v3");
    return savedPlaylists ? JSON.parse(savedPlaylists) : allPlaylists;
  });

  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedSongs, setLikedSongs] = useState(() => {
    const savedLikes = localStorage.getItem("myLikedSongs");
    return savedLikes ? JSON.parse(savedLikes) : [];
  });

  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("myAppPlaylists_v3", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("myLikedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentView(hash);
      else setCurrentView("home");
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  const openPlaylist = (index) => {
    setSelectedPlaylistIndex(index);
    navigateTo("playlist");
  };

  const currentPlaylist = playlists[activePlaylistIndex];
  const currentSong = currentPlaylist?.songs[currentSongIndex] || {
    title: "Chưa có bài hát",
    artist: "Trống",
    src: "",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop",
    lyrics: ""
  };

  const isLiked = likedSongs.includes(currentSong.title);

  const toggleLike = () => {
    if (currentSong.title === "Chưa có bài hát") return;
    if (isLiked) setLikedSongs(likedSongs.filter(song => song !== currentSong.title));
    else setLikedSongs([...likedSongs, currentSong.title]);
  };

  const handleAddSongToPlaylist = (playlistId) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.songs.some(s => s.title === songToAdd.title)) return { ...pl, songs: [...pl.songs, songToAdd] };
        else alert("Bài hát này đã có trong playlist!");
      }
      return pl;
    });
    setPlaylists(updatedPlaylists);
    setIsAddSongModalOpen(false);
  };

  const handleRemoveSongFromPlaylist = (e, playlistId, songTitle) => {
    e.stopPropagation();
    if(confirm(`Xóa bài "${songTitle}" khỏi playlist?`)) {
      const updatedPlaylists = playlists.map(pl => {
        if (pl.id === playlistId) return { ...pl, songs: pl.songs.filter(s => s.title !== songTitle) };
        return pl;
      });
      setPlaylists(updatedPlaylists);
    }
  };

  const playSpecificSong = (targetTitle) => {
    for (let pIndex = 0; pIndex < playlists.length; pIndex++) {
      const sIndex = playlists[pIndex].songs.findIndex(s => s.title === targetTitle);
      if (sIndex !== -1) {
        setActivePlaylistIndex(pIndex);
        setCurrentSongIndex(sIndex);
        setIsPlaying(true);
        break; 
      }
    }
  };

  const viewArtist = (artistName) => {
    setSelectedArtist(artistName);
    navigateTo("artist");
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayPause = () => {
    if (!currentSong.src) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentPlaylist || currentPlaylist.songs.length <= 1) return;
    let nextIndex;
    if (isShuffle) {
      do { nextIndex = Math.floor(Math.random() * currentPlaylist.songs.length); } while (nextIndex === currentSongIndex); 
    } else {
      nextIndex = (currentSongIndex + 1) % currentPlaylist.songs.length;
    }
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!currentPlaylist || currentPlaylist.songs.length <= 1) return;
    setCurrentSongIndex(currentSongIndex === 0 ? currentPlaylist.songs.length - 1 : currentSongIndex - 1);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  useEffect(() => {
    if (isPlaying && currentSong.src) audioRef.current.play().catch(() => {});
  }, [currentSongIndex, activePlaylistIndex]);

  let searchResults = [];
  if (currentView === "search" && searchQuery.trim() !== "") {
    playlists.forEach(pl => pl.songs.forEach(s => {
      if (s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist.toLowerCase().includes(searchQuery.toLowerCase())) {
        if (!searchResults.find(r => r.title === s.title)) searchResults.push(s);
      }
    }));
  }

  let artistSongs = [];
  if (currentView === "artist" && selectedArtist !== "") {
    playlists.forEach(pl => pl.songs.forEach(s => {
      if (s.artist === selectedArtist && !artistSongs.find(as => as.title === s.title)) artistSongs.push(s);
    }));
  }

  const customPlaylists = playlists.filter(p => p.id.startsWith("custom_"));

  return (
    <div className="app-container">
      <div className="top-section">
        <div className="sidebar">
          <h2><i className="fa-solid fa-headphones"></i> Trực Tuyến</h2>
          <p className={currentView === "home" ? "active" : ""} onClick={() => navigateTo("home")}><i className="fa-solid fa-house"></i> Trang chủ</p>
          <p className={currentView === "search" ? "active" : ""} onClick={() => { navigateTo("search"); setSearchQuery(""); }}><i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm</p>
          <br/>
          <p className={currentView === "library" ? "active" : ""} onClick={() => navigateTo("library")} style={{ cursor: "pointer", fontWeight: "bold" }}><i className="fa-solid fa-book"></i> Thư viện của bạn</p>
          <div style={{ marginLeft: "20px", marginTop: "10px", fontSize: "14px" }}>
            <p style={{ cursor: "pointer", marginBottom: "10px" }} onClick={() => setIsModalOpen(true)}><i className="fa-solid fa-plus"></i> Tạo playlist</p>
            <p className={currentView === "liked" ? "active" : ""} onClick={() => navigateTo("liked")}><i className="fa-solid fa-heart" style={{color: "#1db954"}}></i> Bài hát đã thích</p>
          </div>

          {isModalOpen && (
            <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setIsModalOpen(false)}>
              <div className="modal-box">
                <h3>Tạo Playlist Mới</h3>
                <input type="text" placeholder="Nhập tên playlist..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} autoFocus />
                <div className="modal-actions">
                  <button id="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                  <button id="btn-create" onClick={() => {
                    if (newPlaylistName.trim()) {
                      setPlaylists([...playlists, { id: "custom_" + Date.now(), name: newPlaylistName, description: "Playlist cá nhân", coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop", songs: [] }]);
                      setIsModalOpen(false); setNewPlaylistName(""); navigateTo("library");
                    }
                  }}>Tạo</button>
                </div>
              </div>
            </div>
          )}

          {isAddSongModalOpen && (
            <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setIsAddSongModalOpen(false)}>
              <div className="modal-box">
                <h3>Thêm vào Playlist</h3>
                <p style={{color: "#b3b3b3", fontSize: "14px", marginBottom: "15px"}}>Bài hát: <b>{songToAdd?.title}</b></p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "200px", overflowY: "auto" }}>
                  {customPlaylists.map(pl => (
                    <li key={pl.id} onClick={() => handleAddSongToPlaylist(pl.id)} style={{ padding: "12px", backgroundColor: "#333", marginBottom: "8px", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src={pl.coverImage} style={{width: "30px", height: "30px", borderRadius: "4px"}} />
                      {pl.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="main-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div className="main-content" style={{ flex: 1, position: 'relative' }}>
            <div className="top-bar-actions">
              <button className="btn-login" onClick={() => alert("Chức năng đăng nhập đang được phát triển!")}>
                Đăng nhập
              </button>
            </div>

            <div key={currentView} className="fade-in">
              {currentView === "home" && (
                <React.Fragment>
                  <h1>Chào buổi chiều</h1>
                  <div className="playlists-grid">
                    {playlists.map((playlist, index) => (
                      <div key={playlist.id} className={`playlist-card ${activePlaylistIndex === index ? 'active' : ''}`} onClick={() => openPlaylist(index)} >
                        <img src={playlist.coverImage} alt={playlist.name} />
                        <h3>{playlist.name}</h3>
                        <p>{playlist.description}</p>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}

              {currentView === "library" && (
                <div style={{ padding: "20px" }}>
                  <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>Thư viện của bạn</h1>
                  <div className="playlists-grid">
                    <div className="playlist-card" onClick={() => navigateTo("liked")} style={{ background: "linear-gradient(135deg, #450af5, #1db954)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px", minHeight: "220px" }}>
                      <h2 style={{ color: "#fff", fontSize: "2rem", margin: "0 0 10px 0" }}>Bài hát đã thích</h2>
                      <p style={{ color: "#fff", fontSize: "16px", margin: 0, opacity: 0.9 }}>{likedSongs.length} bài hát</p>
                    </div>
                    {customPlaylists.map((pl) => (
                      <div key={pl.id} className="playlist-card" onClick={() => openPlaylist(playlists.findIndex(p => p.id === pl.id))} >
                        <img src={pl.coverImage} />
                        <h3>{pl.name}</h3>
                        <p>Playlist cá nhân</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentView === "playlist" && selectedPlaylistIndex !== null && (
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", gap: "24px", marginBottom: "30px", alignItems: "flex-end" }}>
                    <img src={playlists[selectedPlaylistIndex].coverImage} style={{ width: "220px", height: "220px", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", objectFit: "cover" }} />
                    <div>
                      <p style={{ textTransform: "uppercase", fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>Playlist</p>
                      <h1 style={{ fontSize: "3.5rem", margin: "0 0 15px 0", color: "#fff", fontWeight: "900" }}>{playlists[selectedPlaylistIndex].name}</h1>
                      <p style={{ color: "#b3b3b3", fontSize: "15px", marginBottom: "20px" }}>{playlists[selectedPlaylistIndex].description}</p>
                      <button onClick={() => { if(playlists[selectedPlaylistIndex].songs.length) { setActivePlaylistIndex(selectedPlaylistIndex); setCurrentSongIndex(0); setIsPlaying(true); } }} style={{ padding: "15px 40px", borderRadius: "30px", backgroundColor: "#1db954", color: "#000", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}><i className="fa-solid fa-play"></i> Phát tất cả</button>
                    </div>
                  </div>
                  
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", color: "#b3b3b3" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #282828" }}>
                        <th style={{ padding: "10px 15px", width: "40px" }}>#</th>
                        <th style={{ padding: "10px 15px" }}>Tiêu đề</th>
                        <th style={{ padding: "10px 15px", textAlign: "right" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {playlists[selectedPlaylistIndex].songs.map((song, idx) => {
                        const isSongLiked = likedSongs.includes(song.title);
                        return (
                          <tr key={idx} className="playlist-row" style={{ borderBottom: "1px solid #2a2a2a", cursor: "pointer" }} onClick={() => { setActivePlaylistIndex(selectedPlaylistIndex); setCurrentSongIndex(idx); setIsPlaying(true); }}>
                            <td style={{ padding: "15px" }}>{idx + 1}</td>
                            <td style={{ padding: "15px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <img src={song.cover} style={{ width: "45px", height: "45px", borderRadius: "4px" }} />
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <span style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }}>{song.title}</span>
                                  <span style={{ fontSize: "13px" }} onClick={(e) => { e.stopPropagation(); viewArtist(song.artist); }}>{song.artist}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "15px", textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
                                {/* Nút Tim */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isSongLiked) {
                                      setLikedSongs(likedSongs.filter(s => s !== song.title));
                                    } else {
                                      setLikedSongs([...likedSongs, song.title]);
                                    }
                                  }}
                                  style={{ background: "none", border: "none", cursor: "pointer" }}
                                >
                                  <i className={isSongLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                                    style={{ color: isSongLiked ? "#1db954" : "#b3b3b3", fontSize: "16px" }}></i>
                                </button>

                                {/* Nút Xóa (Chỉ hiện trong playlist cá nhân) */}
                                {playlists[selectedPlaylistIndex].id.startsWith("custom_") && (
                                  <button onClick={(e) => handleRemoveSongFromPlaylist(e, playlists[selectedPlaylistIndex].id, song.title)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}>
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                )}
                                
                                <i className="fa-solid fa-play" style={{ color: "#1db954", marginLeft: "10px" }}></i>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {currentView === "lyrics" && (
                <div style={{ padding: "40px", textAlign: "center", background: "linear-gradient(180deg, #333 0%, #121212 100%)", borderRadius: "8px" }}>
                  <img src={currentSong.cover} style={{ width: "150px", height: "150px", borderRadius: "10px", marginBottom: "20px" }} />
                  <h2 style={{ color: "#fff", fontSize: "2rem" }}>{currentSong.title}</h2>
                  <p style={{ color: "#b3b3b3", fontSize: "1.2rem" }}>{currentSong.artist}</p>
                  <div style={{ whiteSpace: "pre-line", fontSize: "26px", lineHeight: "1.8", color: "#fff", fontWeight: "bold", marginTop: "30px" }}>{currentSong.lyrics || "Lời bài hát đang cập nhật..."}</div>
                </div>
              )}

              {currentView === "search" && (
                <div style={{ padding: "20px" }}>
                  <input type="text" placeholder="Bạn muốn nghe gì?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", maxWidth: "400px", padding: "15px 20px", borderRadius: "30px", border: "none", backgroundColor: "#242424", color: "#fff" }} />
                  <div style={{ marginTop: "20px" }}>
                    {searchResults.map((s, i) => (
                      <div key={i} onClick={() => playSpecificSong(s.title)} style={{ padding: "12px", display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" }}>
                        <img src={s.cover} style={{ width: "45px", borderRadius: "5px" }} />
                        <div><div style={{color: "#fff"}}>{s.title}</div><div style={{fontSize: "12px", color: "#b3b3b3"}}>{s.artist}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentView === "liked" && (
                <div style={{ padding: "20px" }}>
                  <h1><i className="fa-solid fa-heart" style={{color: "#1db954"}}></i> Bài hát đã thích</h1>
                  {likedSongs.map((t, i) => (
                    <div key={i} onClick={() => playSpecificSong(t)} style={{ padding: "12px", color: "#fff", cursor: "pointer" }}>
                      <i className="fa-solid fa-heart" style={{color: "#1db954", marginRight: "10px"}}></i> {t}
                    </div>
                  ))}
                </div>
              )}

              {currentView === "artist" && selectedArtist !== "" && (
                <div className="artist-profile">
                  <div className="artist-banner">
                    <img className="artist-banner-bg" src={artistSongs[0]?.cover} />
                    <div className="artist-info-header">
                      <img className="artist-avatar" src={artistSongs[0]?.cover} />
                      <div className="artist-name-badge">
                        <div className="artist-verified">
                          <i className="fa-solid fa-circle-check"></i> Nghệ sĩ được xác minh
                        </div>
                        <h1>{selectedArtist}</h1>
                      </div>
                    </div>
                  </div>

                  <div className="track-list-soundcloud">
                    <div className="sc-tabs">
                      <span className="sc-tab-item active">Bài hát</span>
                      <span style={{ color: '#b3b3b3', fontSize: '14px', cursor: 'pointer' }}>Album</span>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      {artistSongs.map((s, i) => {
                        const isSongLiked = likedSongs.includes(s.title);
                        
                        return (
                          <div key={i} className="track-item" onClick={() => playSpecificSong(s.title)}>
                            <img src={s.cover} />
                            <i className="fa-solid fa-circle-play play-btn-small"></i>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#fff', fontSize: '15px', fontWeight: '500' }}>{s.title}</div>
                              <div style={{ color: '#b3b3b3', fontSize: '13px' }}>{s.artist}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', color: '#b3b3b3' }}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isSongLiked) {
                                    setLikedSongs(likedSongs.filter(song => song !== s.title));
                                  } else {
                                    setLikedSongs([...likedSongs, s.title]);
                                  }
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                              >
                                <i 
                                  className={isSongLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                                  style={{ color: isSongLiked ? "#1db954" : "#b3b3b3", fontSize: "16px" }}
                                ></i>
                              </button>
                              <i className="fa-solid fa-ellipsis" style={{ cursor: 'pointer' }}></i>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentSong.title !== "Chưa có bài hát" && (
            <div className="song-detail-sidebar">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>Đang phát</span>
                <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }} onClick={() => {/* có thể thêm state ẩn/hiện ở đây */}}></i>
              </div>
              
              <img src={currentSong.cover} alt={currentSong.title} />
              
              <div className="song-detail-info" style={{ width: '100%' }}>
                <h2>{currentSong.title}</h2>
                <p style={{ color: '#1db954', fontWeight: 'bold', fontSize: '16px' }}>{currentSong.artist}</p>
                
                <div className="about-artist">
                  <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>Giới thiệu</p>
                  <p>
                    Bài hát "{currentSong.title}" là một trong những tác phẩm nổi bật của {currentSong.artist}. 
                    Thưởng thức giai điệu tuyệt vời này trên trình phát nhạc của bạn.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="player-bar">
        <div className="track-info">
          <img src={currentSong.cover} className="cover-img" />
          <div>
            <h4>{currentSong.title}</h4>
            <p onClick={() => viewArtist(currentSong.artist)} style={{ cursor: "pointer" }}>
              {currentSong.artist}
            </p>
          </div>
          <button className="like-btn" onClick={toggleLike} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
              style={{ color: isLiked ? '#1db954' : '#b3b3b3', fontSize: "16px" }}></i>
          </button>
          
          <button 
            className="btn-add-circle" 
            onClick={() => { setSongToAdd(currentSong); setIsAddSongModalOpen(true); }}
            title="Thêm vào playlist"
          >
            <i className="fa-solid fa-plus" style={{ fontSize: "14px" }}></i>
          </button>
        </div>

        <div className="controls">
          <div className="buttons">
            <button className="btn-icon" onClick={() => setIsShuffle(!isShuffle)}>
              <i className="fa-solid fa-shuffle" style={{ color: isShuffle ? '#1db954' : '#b3b3b3' }}></i>
            </button>
            <button className="btn-icon" onClick={handlePrev}><i className="fa-solid fa-backward-step"></i></button>
            <button className="btn-play" onClick={togglePlayPause} style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', border: 'none' }}>
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button className="btn-icon" onClick={handleNext}><i className="fa-solid fa-forward-step"></i></button>
            <button className="btn-icon" onClick={() => setIsRepeat(!isRepeat)}>
              <i className="fa-solid fa-repeat" style={{ color: isRepeat ? '#1db954' : '#b3b3b3' }}></i>
            </button>
          </div>
          <div className="progress-container">
            <span>{formatTime(currentTime)}</span>
            <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className="progress-bar-input" style={{ accentColor: '#1db954' }} />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume-controls">
          {/* Nút lời bài hát */}
          <button 
            onClick={() => navigateTo(currentView === "lyrics" ? "home" : "lyrics")} 
            style={{ background: "none", border: "none", color: currentView === "lyrics" ? "#1db954" : "#b3b3b3", cursor: "pointer" }}
            title="Lời bài hát"
          >
            <i className="fa-solid fa-microphone"></i>
          </button>
          
          {/* Icon Loa và Thanh âm lượng */}
          <i className="fa-solid fa-volume-high" style={{ color: '#b3b3b3', fontSize: "14px" }}></i>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange} 
            className="volume-slider"
          />
        </div>
      </div>

      {currentSong.src && (
        <audio ref={audioRef} src={currentSong.src} 
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onEnded={() => isRepeat ? (audioRef.current.currentTime = 0, audioRef.current.play()) : handleNext()}
        />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MusicPlayer />);