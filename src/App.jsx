/**
 * Component chính của ứng dụng, quản lý:
 * - Tất cả state (playlist, bài hát hiện tại, user actions)
 * - Audio playback qua HTML5 Audio API
 * - Điều hướng giữa các views (home, library, search, etc.)
 * - CRUD operations cho playlists
 * - Lưu/tải dữ liệu từ localStorage
 */

import React, { useState, useRef, useEffect } from 'react';
import { allPlaylists } from './data/playlists';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Home from './views/Home';
import Library from './views/Library';
import PlaylistView from './views/PlaylistView';
import ArtistView from './views/ArtistView';
import Search from './views/Search';
import Lyrics from './views/Lyrics';
import SongDetail from './components/SongDetail';
import CreatePlaylistModal from './components/Modals/CreatePlaylistModal';
import AddSongModal from './components/Modals/AddSongModal';

const App = () => {
  const audioRef = useRef(null);
  
  // Danh sách toàn bộ playlist (lưu localStorage tự động)
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem("myAppPlaylists_v3");
    return saved ? JSON.parse(saved) : allPlaylists;
  });

  // View hiện tại: "home" | "library" | "search" | "playlist" | "artist" | "liked" | "lyrics"
  const [currentView, setCurrentView] = useState("home");
  
  // Index playlist đang phát hiện tại
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  
  // Index playlist đang xem (khi vào PlaylistView)
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(null);
  
  // Index bài hát hiện tại trong playlist đang phát
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  // Trạng thái phát nhạc
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Danh sách bài hát đã thích (lưu localStorage)
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem("myLikedSongs");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Điều khiển audio: thời gian hiện tại, tổng thời lượng, âm lượng
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  // Chế độ phát nhạc: shuffle và repeat
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  // Trạng thái modals: tạo playlist, thêm bài vào playlist
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  
  // Tìm kiếm và hiển thị nghệ sĩ
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState(null);
  
  // Trạng thái sidebar bên phải (chi tiết bài hát)
  const [isSongDetailOpen, setIsSongDetailOpen] = useState(true);

  // Bài hát hiện tại đang phát
  const currentSong = playlists[activePlaylistIndex]?.songs[currentSongIndex] || null;
  
  // Kết quả tìm kiếm theo tên bài hát hoặc tên nghệ sĩ
  const searchResults = playlists.flatMap(p => p.songs).filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Danh sách bài hát của một nghệ sĩ cụ thể
  const artistSongs = playlists.flatMap(p => p.songs).filter(s => s.artist === selectedArtist);
  
  // Playlist "Bài hát đã thích" - gộp từ danh sách likedSongs
  const likedPlaylist = { 
    id: 'liked', 
    name: 'Bài hát đã thích', 
    description: `${likedSongs.length} bài hát`, 
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=200&auto=format&fit=crop', 
    songs: Array.from(new Map(playlists.flatMap(p => p.songs).filter(s => likedSongs.includes(s.title)).map(s => [s.title, s])).values())
  };
  // Danh sách playlist cá nhân do user tạo
  const customPlaylists = playlists.filter(p => p.id.startsWith('custom_'));

  // Lưu playlists vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("myAppPlaylists_v3", JSON.stringify(playlists));
  }, [playlists]);

  // Lưu liked songs vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("myLikedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Khi bài hát hiện tại thay đổi: cập nhật audio src và phát nếu isPlaying = true
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong) {
      audio.src = currentSong.src;
      audio.load();
      if (isPlaying) audio.play();
      setIsSongDetailOpen(true);
    }
  }, [currentSong]);

  // Lắng nghe audio events: timeupdate, loadedmetadata, ended (auto-play bài tiếp theo)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      // Tự động phát bài tiếp theo khi bài hiện tại kết thúc
      const handleEnded = () => handleNext();

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentSong]);

  // Bật/tắt phát nhạc
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Phát bài tiếp theo (hỗ trợ shuffle)
  // Nếu shuffle: chọn bài ngẫu nhiên
  // Nếu bình thường: phát tiếp theo (nếu repeat=false thì dừng khi hết)
  const handleNext = () => {
    const playlist = playlists[activePlaylistIndex];
    if (!playlist) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.songs.length);
    } else {
      nextIndex = (currentSongIndex + 1) % playlist.songs.length;
      if (nextIndex === 0 && !isRepeat) return;
    }
    setCurrentSongIndex(nextIndex);
  };

  // Phát bài trước
  const handlePrev = () => {
    const playlist = playlists[activePlaylistIndex];
    if (!playlist) return;
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = playlist.songs.length - 1;
    setCurrentSongIndex(prevIndex);
  };

  // Seek (tua) đến vị trí cụ thể trong bài hát
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Thay đổi âm lượng (0-1)
  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const newVolume = parseFloat(e.target.value);
      audio.volume = newVolume;
      setVolume(newVolume);
    }
  };

  // Like/Unlike bài hát hiện tại đang phát
  const toggleLike = () => {
    if (!currentSong) return;
    const songTitle = currentSong.title;
    setLikedSongs(prev => prev.includes(songTitle) ? prev.filter(s => s !== songTitle) : [...prev, songTitle]);
  };

  // Like/Unlike một bài hát cụ thể (dùng từ các view khác)
  const toggleLikeSpecificSong = (title) => {
    setLikedSongs(prev => prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]);
  };

  // Xem tất cả bài hát của một nghệ sĩ
  const viewArtist = (artist) => {
    setSelectedArtist(artist);
    setCurrentView('artist');
  };

  // Mở chi tiết của một playlist
  const openPlaylist = (index) => {
    setSelectedPlaylistIndex(index);
    setCurrentView('playlist');
  };

  // Phát một bài hát cụ thể (tìm trong tất cả playlists)
  const playSpecificSong = (title) => {
    for (let i = 0; i < playlists.length; i++) {
      const songIndex = playlists[i].songs.findIndex(s => s.title === title);
      if (songIndex !== -1) {
        setActivePlaylistIndex(i);
        setCurrentSongIndex(songIndex);
        setIsPlaying(true);
        return;
      }
    }
  };

  // Tạo playlist mới (gọi từ CreatePlaylistModal)
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: "custom_" + Date.now(),
        name: newPlaylistName,
        description: "Playlist cá nhân",
        coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop",
        songs: []
      };
      setPlaylists([...playlists, newPlaylist]);
      setIsCreateModalOpen(false);
      setNewPlaylistName('');
      setCurrentView('library');
    }
  };

  // Thêm bài hát vào playlist (gọi từ AddSongModal)
  const handleAddSongToPlaylist = (playlistId) => {
    if (!songToAdd) return;
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId ? { ...p, songs: [...p.songs, songToAdd] } : p
    ));
    setIsAddSongModalOpen(false);
    setSongToAdd(null);
  };

  // Xoá bài hát khỏi playlist (chỉ dùng cho playlist cá nhân)
  const handleRemoveSongFromPlaylist = (playlistId, songTitle) => {
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId ? { ...p, songs: p.songs.filter(s => s.title !== songTitle) } : p
    ));
  };

  // Xoá toàn bộ playlist
  const handleDeletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (selectedPlaylistIndex !== null) setSelectedPlaylistIndex(null);
    setCurrentView('library');
  };

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);

  return (
    <div className="app-container">
      {/* HTML5 Audio Element - Điều khiển phát nhạc toàn bộ ứng dụng */}
      <audio ref={audioRef} />
      
      <div className="top-section">
        {/* Sidebar Menu - Menu điều hướng bên trái */}
        <Sidebar 
          currentView={currentView} 
          setCurrentView={navigateTo} 
          openCreateModal={openCreateModal} 
        />
        
        {/* Main Layout - Layout chính chứa content và sidebar phải */}
        <div className="main-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main Content - Hiển thị view hiện tại (key={currentView} để trigger animation) */}
          <div className="main-content fade-in" style={{ flex: 1, position: 'relative' }} key={currentView}>
             {/* Điều hướng: Hiển thị component phù hợp dựa vào currentView */}
             {currentView === 'home' && <Home playlists={playlists} activePlaylistIndex={activePlaylistIndex} openPlaylist={openPlaylist} likedSongs={likedSongs} customPlaylists={customPlaylists} playSpecificSong={playSpecificSong} navigateTo={navigateTo} toggleLikeSpecificSong={toggleLikeSpecificSong} viewArtist={viewArtist} isSongDetailOpen={isSongDetailOpen} setIsSongDetailOpen={setIsSongDetailOpen} />}
             {currentView === 'library' && <Library likedSongs={likedSongs} customPlaylists={customPlaylists} playlists={playlists} navigateTo={navigateTo} openPlaylist={openPlaylist} onDeletePlaylist={handleDeletePlaylist} />}
             {currentView === 'playlist' && selectedPlaylistIndex !== null && <PlaylistView 
               playlist={playlists[selectedPlaylistIndex]} 
               likedSongs={likedSongs} 
               toggleLikeSpecificSong={toggleLikeSpecificSong} 
               handleRemoveSongFromPlaylist={(songTitle) => handleRemoveSongFromPlaylist(playlists[selectedPlaylistIndex].id, songTitle)} 
               viewArtist={viewArtist} 
               onPlaySong={(idx) => { setCurrentSongIndex(idx); setActivePlaylistIndex(selectedPlaylistIndex); setIsPlaying(true); }} 
               onPlayAll={() => { setCurrentSongIndex(0); setActivePlaylistIndex(selectedPlaylistIndex); setIsPlaying(true); }} 
               onDeletePlaylist={handleDeletePlaylist}
             />}
             {currentView === 'artist' && <ArtistView selectedArtist={selectedArtist} artistSongs={artistSongs} likedSongs={likedSongs} toggleLikeSpecificSong={toggleLikeSpecificSong} playSpecificSong={(title) => { playSpecificSong(title); setIsPlaying(true); }} />}
             {currentView === 'search' && <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResults={searchResults} playSpecificSong={(title) => { playSpecificSong(title); setIsPlaying(true); }} />}
             {currentView === 'liked' && <PlaylistView 
               playlist={likedPlaylist} 
               likedSongs={likedSongs} 
               toggleLikeSpecificSong={toggleLikeSpecificSong} 
               handleRemoveSongFromPlaylist={() => {}} 
               viewArtist={viewArtist} 
               onPlaySong={(idx) => { playSpecificSong(likedPlaylist.songs[idx].title); setIsPlaying(true); }} 
               onPlayAll={() => { playSpecificSong(likedPlaylist.songs[0]?.title); setIsPlaying(true); }} 
               onDeletePlaylist={handleDeletePlaylist}
             />}
             {currentView === 'lyrics' && <Lyrics currentSong={currentSong} />}
          </div>

          {/* Song Detail Sidebar - Hiển thị chi tiết bài hát bên phải */}
          {currentSong && <SongDetail currentSong={currentSong} isSongDetailOpen={isSongDetailOpen} toggleSongDetail={() => setIsSongDetailOpen(!isSongDetailOpen)} />}
        </div>
      </div>

      {/* Player Bar - Thanh điều khiển phát nhạc ở dưới cùng */}
      <PlayerBar 
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeat={isRepeat}
        setIsRepeat={setIsRepeat}
        toggleLike={toggleLike}
        isLiked={currentSong ? likedSongs.includes(currentSong.title) : false}
        viewArtist={viewArtist}
        setSongToAdd={setSongToAdd}
        setIsAddSongModalOpen={setIsAddSongModalOpen}
        currentView={currentView}
        navigateTo={navigateTo}
      />

      <CreatePlaylistModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        newPlaylistName={newPlaylistName} 
        setNewPlaylistName={setNewPlaylistName} 
        onCreate={handleCreatePlaylist} 
      />

      <AddSongModal 
        isOpen={isAddSongModalOpen} 
        onClose={() => setIsAddSongModalOpen(false)} 
        songToAdd={songToAdd} 
        customPlaylists={customPlaylists} 
        onAddSong={handleAddSongToPlaylist} 
      />
    </div>
  );
};

export default App;