/**
 * Modal cho phép user tạo playlist mới:
 * - Input text để nhập tên playlist
 * - Nút "Hủy" và "Tạo"
 * - Click ngoài modal → đóng
 * - Auto focus input khi mở
 */

import React from 'react';

const CreatePlaylistModal = ({ isOpen, onClose, newPlaylistName, setNewPlaylistName, onCreate }) => {
  if (!isOpen) return null;

  return (
    // Modal overlay - Nền mờ phía sau modal
    // Click vào overlay (ngoài modal-box) sẽ đóng modal
    // onClick handler: (e) => e.target.className === 'modal-overlay' && onClose()
    // Chỉ đóng nếu click chính xác trên overlay, không phải trên modal-box
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      {/* Modal content box */}
      <div className="modal-box">
        {/* Tiêu đề modal */}
        <h3>Tạo Playlist Mới</h3>
        
        {/* 
         * Input field để nhập tên playlist
         * - value: được bind với newPlaylistName từ parent (App.jsx)
         * - onChange: gọi setNewPlaylistName để cập nhật state
         * - autoFocus: tự động focus vào input khi modal mở
         */}
        <input 
          type="text" 
          placeholder="Nhập tên playlist..." 
          value={newPlaylistName} 
          onChange={(e) => setNewPlaylistName(e.target.value)} 
          autoFocus 
        />
        
        {/* Nút hành động: Hủy + Tạo */}
        <div className="modal-actions">
          {/* Nút Hủy - Đóng modal mà không tạo playlist */}
          <button id="btn-cancel" onClick={onClose}>Hủy</button>
          
          {/* Nút Tạo - Gọi onCreate để tạo playlist mới */}
          <button id="btn-create" onClick={onCreate}>Tạo</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;