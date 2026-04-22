/**
 * Trang thư viện hiển thị:
 * - Card gradient "Bài hát đã thích" (với số lượng)
 * - Grid các playlist cá nhân do user tạo
 * - Nút xoá cho từng playlist
 */

import React from 'react';

const Library = ({ likedSongs, customPlaylists, playlists, navigateTo, openPlaylist, onDeletePlaylist }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>Thư viện của bạn</h1>
      
      {/* 
       * Grid layout cho các playlist
       * CSS class "playlists-grid" định nghĩa trong index.css:
       * - display: grid
       * - grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))
       * - gap: 20px
       * Tự động sắp xếp các card thành lưới với chiều rộng tối thiểu 220px
       */}
      <div className="playlists-grid">
        {/* Card "Bài hát đã thích" - Gradient background với icon trái tim */}
        <div 
          className="playlist-card" 
          onClick={() => navigateTo("liked")} 
          style={{ 
            background: "linear-gradient(135deg, #450af5, #1db954)", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "flex-end", 
            padding: "20px", 
            minHeight: "220px" 
          }}
        >
          {/* Tiêu đề "Bài hát đã thích" */}
          <h2 style={{ color: "#fff", fontSize: "2rem", margin: "0 0 10px 0" }}>Bài hát đã thích</h2>
          {/* Hiển thị số lượng bài hát đã thích */}
          <p style={{ color: "#fff", fontSize: "16px", margin: 0, opacity: 0.9 }}>{likedSongs.length} bài hát</p>
        </div>
        
        {/* Danh sách các Custom Playlists */}
        {customPlaylists.map((pl) => (
          <div 
            key={pl.id} 
            className="playlist-card" 
            style={{ position: 'relative' }}
          >
            {/* Card nội dung: ảnh + tên + mô tả */}
            <div onClick={() => openPlaylist(playlists.findIndex(p => p.id === pl.id))} style={{ cursor: 'pointer' }}>
              {/* Hình ảnh bìa playlist */}
              <img src={pl.coverImage} alt={pl.name} />
              {/* Tên playlist */}
              <h3>{pl.name}</h3>
              {/* Loại: Playlist cá nhân */}
              <p>Playlist cá nhân</p>
            </div>
            
            {/* Nút xoá playlist - Vị trí tuyệt đối ở góc phải trên */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                {/* Xác nhận trước khi xoá */}
                if (window.confirm(`Xoá playlist "${pl.name}"?`)) {
                  onDeletePlaylist(pl.id);
                }
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 77, 77, 0.8)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'background 0.2s'
              }}
              /* Hiệu ứng hover: đỏ hơn */
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 77, 77, 1)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 77, 77, 0.8)'}
              title="Xoá playlist"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;