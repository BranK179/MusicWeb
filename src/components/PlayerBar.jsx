/**
 * Component điều khiển phát nhạc ở dưới cùng màn hình.
 * Bố cục 3 phần:
 * - Phần trái: Thông tin bài hát + Nút thích + Nút thêm vào playlist
 * - Phần giữa: Nút điều khiển (Play/Pause/Prev/Next) + Shuffle/Repeat + Progress bar
 * - Phần phải: Nút lời bài hát + Slider âm lượng
 */

import React from 'react';

const PlayerBar = ({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrev, 
  volume, 
  onVolumeChange, 
  currentTime, 
  duration, 
  onSeek, 
  isShuffle, 
  setIsShuffle, 
  isRepeat, 
  setIsRepeat, 
  toggleLike, 
  isLiked, 
  viewArtist, 
  setSongToAdd, 
  setIsAddSongModalOpen,
  currentView,
  navigateTo
}) => {
  if (!currentSong) return null;

  // Hàm chuyển đổi giây thành định dạng MM:SS
  // VD: 225 giây → "3:45"
  // Math.floor(225 / 60) = 3 phút
  // Math.floor(225 % 60) = 45 giây
  // padStart(2, '0') đảm bảo giây luôn 2 chữ số (05 thay vì 5)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player-bar">
        {/* ===== PHẦN TRÁI: Thông tin bài hát + Nút hành động ===== */}
        <div className="track-info">
            {/* Hình ảnh bìa bài hát */}
            <img src={currentSong.cover} className="cover-img" />
            <div>
                {/* Tên bài hát */}
                <h4>{currentSong.title}</h4>
                {/* Tên nghệ sĩ - Click để xem profile của nghệ sĩ */}
                <p onClick={() => viewArtist(currentSong.artist)} style={{ cursor: "pointer" }}>
                  {currentSong.artist}
                </p>
            </div>
            {/* Nút Like/Unlike */}
            <button className="like-btn" onClick={toggleLike} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <i 
                  className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                  style={{ color: isLiked ? '#1db954' : '#b3b3b3', fontSize: "16px" }}
                ></i>
            </button>
            
            {/* Nút "Thêm vào playlist" - Mở modal để chọn playlist */}
            <button 
                className="btn-add-circle" 
                onClick={() => { setSongToAdd(currentSong); setIsAddSongModalOpen(true); }}
                title="Thêm vào playlist"
            >
                <i className="fa-solid fa-plus" style={{ fontSize: "14px" }}></i>
            </button>
        </div>

        {/* ===== PHẦN GIỮA: Điều khiển phát + Progress bar ===== */}
        <div className="controls">
            <div className="buttons">
                {/* Nút Shuffle - Toggle trạng thái shuffle, đổi màu nếu bật */}
                <button className="btn-icon" onClick={() => setIsShuffle(!isShuffle)}>
                  <i className="fa-solid fa-shuffle" style={{ color: isShuffle ? '#1db954' : '#b3b3b3' }}></i>
                </button>
                
                {/* Nút Phát trước (Previous) */}
                <button className="btn-icon" onClick={onPrev}>
                  <i className="fa-solid fa-backward-step"></i>
                </button>
                
                {/* Nút Play/Pause - Icon thay đổi dựa trên isPlaying */}
                <button 
                  className="btn-play" 
                  onClick={onPlayPause} 
                  style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', border: 'none' }}
                >
                  <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                
                {/* Nút Phát tiếp (Next) */}
                <button className="btn-icon" onClick={onNext}>
                  <i className="fa-solid fa-forward-step"></i>
                </button>
                
                {/* Nút Repeat - Toggle giữa không lặp/lặp tất cả, đổi màu nếu bật */}
                <button className="btn-icon" onClick={() => setIsRepeat(!isRepeat)}>
                  <i className="fa-solid fa-repeat" style={{ color: isRepeat ? '#1db954' : '#b3b3b3' }}></i>
                </button>
            </div>
            
            {/* Progress bar - Hiển thị thời gian hiện tại + slider + thời gian tổng */}
            <div className="progress-container">
                {/* Thời gian hiện tại */}
                <span>{formatTime(currentTime)}</span>
                
                {/* Slider điều khiển tiến độ phát - Input range từ 0 đến duration */}
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 0} 
                  value={currentTime} 
                  onChange={onSeek} 
                  className="progress-bar-input" 
                  style={{ accentColor: '#1db954' }} 
                />
                
                {/* Thời gian tổng */}
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        {/* ===== PHẦN PHẢI: Nút lời bài hát + Slider âm lượng ===== */}
        <div className="volume-controls">
            {/* Nút Lời bài hát - Toggle giữa view hiện tại và lyrics view */}
            <button 
                onClick={() => navigateTo(currentView === 'lyrics' ? 'home' : 'lyrics')}
                style={{ background: "none", border: "none", color: currentView === 'lyrics' ? "#1db954" : "#b3b3b3", cursor: "pointer" }}
                title="Lời bài hát"
            >
                <i className="fa-solid fa-microphone"></i>
            </button>
            
            {/* Icon âm lượng */}
            <i className="fa-solid fa-volume-high" style={{ color: '#b3b3b3', fontSize: "14px" }}></i>
            
            {/* Slider điều khiển âm lượng - Range từ 0 (tắt) đến 1 (max) */}
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={onVolumeChange} 
                className="volume-slider"
            />
        </div>
    </div>
  );
};

export default PlayerBar;