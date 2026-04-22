/**
 * Hiển thị chi tiết một playlist với:
 * - Header: Ảnh bìa, tên, mô tả, nút "Phát tất cả" và "Xoá" (nếu custom)
 * - Bảng danh sách bài hát
 * - Nút like/unlike cho từng bài
 * - Nút xoá bài (chỉ playlist custom)
 */

import React from 'react';

const PlaylistView = ({ playlist, likedSongs, toggleLikeSpecificSong, handleRemoveSongFromPlaylist, viewArtist, onPlaySong, onPlayAll, onDeletePlaylist }) => {
  if (!playlist) return null;

  return (
    <div style={{ padding: "20px" }}>
      {/* Header Playlist: Ảnh bìa + Thông tin + Nút hành động */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "30px", alignItems: "flex-end" }}>
        {/* Ảnh bìa playlist */}
        <img src={playlist.coverImage} style={{ width: "220px", height: "220px", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", objectFit: "cover" }} alt={playlist.name} />
        
        {/* Thông tin playlist: tên + mô tả + nút điều khiển */}
        <div>
          {/* Label "Playlist" */}
          <p style={{ textTransform: "uppercase", fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>Playlist</p>
          
          {/* Tên playlist */}
          <h1 style={{ fontSize: "3.5rem", margin: "0 0 15px 0", color: "#fff", fontWeight: "900" }}>{playlist.name}</h1>
          
          {/* Mô tả playlist */}
          <p style={{ color: "#b3b3b3", fontSize: "15px", marginBottom: "20px" }}>{playlist.description}</p>
          
          {/* Các nút hành động */}
          <div style={{ display: "flex", gap: "15px" }}>
            {/* Nút "Phát tất cả" - Bắt đầu phát từ bài đầu tiên */}
            <button 
              onClick={onPlayAll} 
              style={{ padding: "15px 40px", borderRadius: "30px", backgroundColor: "#1db954", color: "#000", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
            >
              <i className="fa-solid fa-play"></i> Phát tất cả
            </button>
            
            {/* Nút "Xoá playlist" - Chỉ hiển thị cho playlist custom (không phải mặc định) */}
            {playlist.id.startsWith("custom_") && (
              <button 
                onClick={() => {
                  // Xác nhận trước khi xoá
                  if (window.confirm(`Xoá playlist "${playlist.name}"?`)) {
                    onDeletePlaylist(playlist.id);
                  }
                }}
                style={{ padding: "15px 40px", borderRadius: "30px", backgroundColor: "rgba(255, 77, 77, 0.8)", color: "#fff", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 77, 77, 1)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 77, 77, 0.8)'}
              >
                <i className="fa-solid fa-trash"></i> Xoá playlist
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bảng danh sách bài hát */}
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", color: "#b3b3b3" }}>
        {/* Header bảng */}
        <thead>
          <tr style={{ borderBottom: "1px solid #282828" }}>
            <th style={{ padding: "10px 15px", width: "40px" }}>#</th>
            <th style={{ padding: "10px 15px" }}>Tiêu đề</th>
            <th style={{ padding: "10px 15px", textAlign: "right" }}></th>
          </tr>
        </thead>
        
        {/* Danh sách bài hát */}
        <tbody>
          {playlist.songs.map((song, idx) => {
            // Kiểm tra xem bài hát có trong danh sách "đã thích" không
            const isSongLiked = likedSongs.includes(song.title);
            
            return (
              <tr 
                key={idx} 
                className="playlist-row" 
                style={{ borderBottom: "1px solid #2a2a2a", cursor: "pointer" }} 
                onClick={() => onPlaySong(idx)}
              >
                {/* Cột số thứ tự */}
                <td style={{ padding: "15px" }}>{idx + 1}</td>
                
                {/* Cột thông tin bài hát: ảnh + tên + nghệ sĩ */}
                <td style={{ padding: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* Ảnh bìa bài hát */}
                    <img src={song.cover} style={{ width: "45px", height: "45px", borderRadius: "4px" }} alt="" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {/* Tên bài hát */}
                      <span style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }}>{song.title}</span>
                      {/* Tên nghệ sĩ - click để xem tất cả bài hát của nghệ sĩ */}
                      <span style={{ fontSize: "13px" }} onClick={(e) => { e.stopPropagation(); viewArtist(song.artist); }}>{song.artist}</span>
                    </div>
                  </div>
                </td>
                
                {/* Cột nút hành động: like, xoá, play icon */}
                <td style={{ padding: "15px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
                    {/* Nút Like/Unlike */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLikeSpecificSong(song.title); }}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      <i className={isSongLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                        style={{ color: isSongLiked ? "#1db954" : "#b3b3b3", fontSize: "16px" }}></i>
                    </button>

                    {/* Nút Xoá bài (chỉ hiển thị cho playlist custom) */}
                    {playlist.id.startsWith("custom_") && (
                      <button onClick={(e) => { e.stopPropagation(); handleRemoveSongFromPlaylist(song.title); }} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}>
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}

                    {/* Nút Xoá bài từ "Đã thích" (nút trừ thay vì xoá) */}
                    {playlist.id === "liked" && (
                      <button onClick={(e) => { e.stopPropagation(); toggleLikeSpecificSong(song.title); }} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}>
                        <i className="fa-solid fa-minus"></i>
                      </button>
                    )}
                    
                    {/* Icon Play - chỉ hiển thị visual */}
                    <i className="fa-solid fa-play" style={{ color: "#1db954", marginLeft: "10px" }}></i>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistView;