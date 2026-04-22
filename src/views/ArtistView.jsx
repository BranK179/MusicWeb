/**
 * Trang xem profile và bài hát của nghệ sĩ:
 * - Banner với ảnh nghệ sĩ
 * - Tên nghệ sĩ + "Nghệ sĩ được xác minh"
 * - Danh sách tất cả bài hát của nghệ sĩ
 * - Nút like/unlike cho từng bài hát
 * 
 * @see DANH_SÁCH_TỆP.md để hiểu chi tiết
 */

import React from 'react';

const ArtistView = ({ selectedArtist, artistSongs, likedSongs, toggleLikeSpecificSong, playSpecificSong }) => {
  if (!selectedArtist || artistSongs.length === 0) return null;

  return (
    <div className="artist-profile">
      {/* ===== BANNER SECTION ===== */}
      {/* 
       * Banner gồm 2 phần:
       * 1. Hình nền (background image) - Lấy từ cover của bài hát đầu tiên
       * 2. Avatar + Thông tin (nằm phía dưới, lấp chồng lên background)
       */}
      <div className="artist-banner">
        {/* Hình nền banner - Dùng cover của bài hát đầu tiên để hiển thị */}
        <img className="artist-banner-bg" src={artistSongs[0]?.cover} alt="" />
        
        {/* Container thông tin nghệ sĩ: Avatar + Tên + Badge */}
        <div className="artist-info-header">
          {/* Avatar tròn của nghệ sĩ - Lấy từ cover bài hát đầu tiên */}
          <img className="artist-avatar" src={artistSongs[0]?.cover} alt="" />
          
          {/* Tên và badge xác minh */}
          <div className="artist-name-badge">
            {/* Badge "Nghệ sĩ được xác minh" */}
            <div className="artist-verified">
              <i className="fa-solid fa-circle-check"></i> Nghệ sĩ được xác minh
            </div>
            {/* Tên nghệ sĩ */}
            <h1>{selectedArtist}</h1>
          </div>
        </div>
      </div>

      {/* ===== DANH SÁCH BÀI HÁT ===== */}
      <div className="track-list-soundcloud">
        {/* Tab navigation (Bài hát / Album) */}
        <div className="sc-tabs">
          <span className="sc-tab-item active">Bài hát</span>
          <span style={{ color: '#b3b3b3', fontSize: '14px', cursor: 'pointer' }}>Album</span>
        </div>

        {/* Danh sách bài hát của nghệ sĩ */}
        <div style={{ marginTop: "20px" }}>
          {/* 
           * Lặp qua tất cả bài hát của nghệ sĩ (artistSongs)
           * artistSongs được filter từ App.jsx: 
           * allSongs.filter(song => song.artist === selectedArtist)
           */}
          {artistSongs.map((s, i) => {
            // Kiểm tra xem bài hát có trong danh sách "đã thích"
            const isSongLiked = likedSongs.includes(s.title);
            
            return (
              <div 
                key={i} 
                className="track-item" 
                onClick={() => playSpecificSong(s.title)}
              >
                {/* Hình ảnh bài hát */}
                <img src={s.cover} alt="" />
                
                {/* Icon play - Hiển thị khi hover */}
                <i className="fa-solid fa-circle-play play-btn-small"></i>
                
                {/* Thông tin bài hát: Tên + Tên nghệ sĩ */}
                <div style={{ flex: 1 }}>
                  {/* Tên bài hát */}
                  <div style={{ color: '#fff', fontSize: '15px', fontWeight: '500' }}>{s.title}</div>
                  {/* Tên nghệ sĩ */}
                  <div style={{ color: '#b3b3b3', fontSize: '13px' }}>{s.artist}</div>
                </div>
                
                {/* Nút hành động: Like + Menu (ellipsis) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', color: '#b3b3b3' }}>
                  {/* Nút Like/Unlike - Đổi icon khi được like */}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleLikeSpecificSong(s.title); 
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                  >
                    <i 
                      className={isSongLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                      style={{ color: isSongLiked ? "#1db954" : "#b3b3b3", fontSize: "16px" }}
                    ></i>
                  </button>
                  
                  {/* Nút menu (hiện tại chỉ là icon) */}
                  <i className="fa-solid fa-ellipsis" style={{ cursor: 'pointer' }}></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArtistView;