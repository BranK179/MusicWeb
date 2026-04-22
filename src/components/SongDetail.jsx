/**
 * Sidebar bên phải hiển thị chi tiết bài hát đang phát:
 * - Tiêu đề "Đang phát"
 * - Ảnh bìa lớn
 * - Tên bài hát
 * - Tên nghệ sĩ
 * - Giới thiệu về bài hát
 */

import React from 'react';

const SongDetail = ({ currentSong, isSongDetailOpen, toggleSongDetail }) => {
  if (!currentSong || currentSong.title === "Chưa có bài hát") return null;

  return (
    // Sidebar bên phải - Có smooth slide animation
    // Classes: 'song-detail-open' / 'song-detail-closed' điều khiển animation
    // CSS transition trong index.css
    <div className={`song-detail-sidebar ${isSongDetailOpen ? 'song-detail-open' : 'song-detail-closed'}`}>
      
      {/* ===== HEADER: Tiêu đề + Nút đóng ===== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        {/* Tiêu đề "Đang phát" */}
        <span style={{ fontWeight: 'bold', color: '#fff' }}>Đang phát</span>
        
        {/* Nút đóng (X) - Click để đóng sidebar */}
        <button 
          onClick={toggleSongDetail}
          style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', fontSize: '20px', padding: '0' }}
          title="Đóng"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      {/* ===== HÌNH ẢNH BÀI HÁT ===== */}
      <img src={currentSong.cover} alt={currentSong.title} />
      
      {/* ===== THÔNG TIN BÀI HÁT ===== */}
      <div className="song-detail-info" style={{ width: '100%' }}>
        {/* Tên bài hát */}
        <h2>{currentSong.title}</h2>
        
        {/* Tên nghệ sĩ - Màu xanh Spotify (#1db954) */}
        <p style={{ color: '#1db954', fontWeight: 'bold', fontSize: '16px' }}>{currentSong.artist}</p>
        
        {/* Phần "Giới thiệu" về bài hát */}
        <div className="about-artist">
          <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>Giới thiệu</p>
          <p>
            Bài hát "{currentSong.title}" là một trong những tác phẩm nổi bật của {currentSong.artist}. 
            Thưởng thức giai điệu tuyệt vời này trên trình phát nhạc của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongDetail;