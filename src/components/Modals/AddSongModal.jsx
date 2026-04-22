/**
 * Modal cho phép user thêm bài hát vào playlist:
 * - Hiển thị tên bài hát sẽ thêm
 * - Danh sách các playlist custom của user
 * - Click playlist → thêm bài vào playlist đó
 * - Click ngoài modal → đóng
 */

import React from 'react';

const AddSongModal = ({ isOpen, onClose, songToAdd, customPlaylists, onAddSong }) => {
  if (!isOpen) return null;

  return (
    // Modal overlay - Click ngoài modal để đóng
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      {/* Modal content box */}
      <div className="modal-box">
        {/* Tiêu đề modal */}
        <h3>Thêm vào Playlist</h3>
        
        {/* 
         * Hiển thị bài hát sẽ thêm
         * songToAdd.title: Tên bài hát từ parent component (PlayerBar.jsx)
         */}
        <p style={{color: "#b3b3b3", fontSize: "14px", marginBottom: "15px"}}>
          Bài hát: <b>{songToAdd?.title}</b>
        </p>
        
        {/* 
         * Danh sách các custom playlists
         * - Duyệt qua customPlaylists từ parent (App.jsx)
         * - Mỗi playlist là một item có thể click
         * - maxHeight + overflowY: auto để scroll nếu có quá nhiều playlist
         */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "200px", overflowY: "auto" }}>
          {customPlaylists.map(pl => (
            // Playlist item - Click để thêm bài hát vào playlist này
            // onAddSong: gọi handler từ parent với playlist ID
            <li 
              key={pl.id} 
              onClick={() => onAddSong(pl.id)} 
              style={{ 
                padding: "12px", 
                backgroundColor: "#333", 
                marginBottom: "8px", 
                borderRadius: "5px", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "10px" 
              }}
            >
              {/* Hình ảnh bìa playlist */}
              <img 
                src={pl.coverImage} 
                style={{width: "30px", height: "30px", borderRadius: "4px"}} 
                alt="" 
              />
              {/* Tên playlist */}
              {pl.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddSongModal;