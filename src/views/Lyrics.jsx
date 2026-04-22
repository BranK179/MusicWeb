/**
 * Hiển thị lời bài hát của bài đang phát:
 * - Ảnh bìa lớn
 * - Tên bài hát
 * - Tên nghệ sĩ
 * - Lời bài hát (hoặc "Lời bài hát đang cập nhật...")
 */

import React from 'react';

const Lyrics = ({ currentSong }) => {
  if (!currentSong) return null;

  return (
    <div style={{ 
      padding: "40px", 
      textAlign: "center", 
      background: "linear-gradient(180deg, #333 0%, #121212 100%)", 
      borderRadius: "8px" 
    }}>
      {/* Hình ảnh bìa bài hát - Hiển thị lớn ở đầu */}
      <img 
        src={currentSong.cover} 
        style={{ 
          width: "150px", 
          height: "150px", 
          borderRadius: "10px", 
          marginBottom: "20px" 
        }} 
        alt="" 
      />
      
      {/* Tiêu đề bài hát */}
      <h2 style={{ color: "#fff", fontSize: "2rem" }}>{currentSong.title}</h2>
      
      {/* Tên nghệ sĩ */}
      <p style={{ color: "#b3b3b3", fontSize: "1.2rem" }}>{currentSong.artist}</p>
      
      {/* 
       * Phần lời bài hát
       * - whiteSpace: "pre-line" giữ nguyên line breaks từ lyrics
       * - Nếu currentSong.lyrics tồn tại → hiển thị lời
       * - Nếu không → hiển thị "Lời bài hát đang cập nhật..."
       * Dữ liệu lyrics được định nghĩa trong playlists.js
       */}
      <div style={{ 
        whiteSpace: "pre-line", 
        fontSize: "26px", 
        lineHeight: "1.8", 
        color: "#fff", 
        fontWeight: "bold", 
        marginTop: "30px" 
      }}>
        {currentSong.lyrics || "Lời bài hát đang cập nhật..."}
      </div>
    </div>
  );
};

export default Lyrics;