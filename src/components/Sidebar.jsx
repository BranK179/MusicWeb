/**
 * Sidebar bên trái chứa:
 * - Logo ứng dụng
 * - Nút điều hướng: Trang chủ, Tìm kiếm
 * - Phần "Thư viện của bạn": Tạo playlist, Bài hát đã thích
 */

import React from 'react';

const Sidebar = ({ currentView, setCurrentView, openCreateModal }) => {
  // Hàm điều hướng: 
  // - Cập nhật URL hash (VD: #home, #search, #library)
  // - Cập nhật currentView state để highlight menu item đang hoạt động
  const navigateTo = (view) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  return (
    <div className="sidebar">
        {/* ===== LOGO ===== */}
        <h2><i className="fa-solid fa-headphones"></i> Trực Tuyến</h2>
        
        {/* ===== MENU CHÍNH ===== */}
        {/* Nút Trang chủ */}
        <p 
          className={currentView === "home" ? "active" : ""} 
          onClick={() => navigateTo("home")}
        >
          <i className="fa-solid fa-house"></i> Trang chủ
        </p>
        
        {/* Nút Tìm kiếm */}
        <p 
          className={currentView === "search" ? "active" : ""} 
          onClick={() => { navigateTo("search"); }}
        >
          <i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm
        </p>
        
        <br/>
        
        {/* ===== PHẦN THỰC VIỆN ===== */}
        {/* Tiêu đề "Thư viện của bạn" - Có active state khi ở library view */}
        <p 
          className={currentView === "library" ? "active" : ""} 
          onClick={() => navigateTo("library")} 
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          <i className="fa-solid fa-book"></i> Thư viện của bạn
        </p>
        
        {/* Sub-menu dưới Thư viện */}
        <div style={{ marginLeft: "20px", marginTop: "10px", fontSize: "14px" }}>
          {/* Nút "Tạo playlist" - Mở modal tạo playlist mới */}
          <p 
            style={{ cursor: "pointer", marginBottom: "10px" }} 
            onClick={openCreateModal}
          >
            <i className="fa-solid fa-plus"></i> Tạo playlist
          </p>
          
          {/* Nút "Bài hát đã thích" - Điều hướng tới liked view */}
          <p 
            className={currentView === "liked" ? "active" : ""} 
            onClick={() => navigateTo("liked")}
          >
            <i className="fa-solid fa-heart" style={{color: "#1db954"}}></i> Bài hát đã thích
          </p>
        </div>
    </div>
  );
};

export default Sidebar;