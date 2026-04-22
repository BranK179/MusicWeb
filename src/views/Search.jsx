/**
 * Trang tìm kiếm với:
 * - Ô input text để nhập từ khóa
 * - Lọc real-time theo tên bài hát hoặc tên nghệ sĩ
 * - Danh sách kết quả với ảnh, tên bài, tên nghệ sĩ
 * - Click trên kết quả → phát bài hát
 */

import React from 'react';

const Search = ({ searchQuery, setSearchQuery, searchResults, playSpecificSong }) => {
  return (
    <div style={{ padding: "20px" }}>
      {/* 
       * Ô input tìm kiếm
       * - Giá trị được bind với searchQuery từ parent (App.jsx)
       * - onChange event gọi setSearchQuery để cập nhật trạng thái
       * - App.jsx sẽ tự động filter searchResults dựa trên searchQuery
       * - Placeholder hướng dẫn người dùng nhập từ khóa
       */}
      <input 
        type="text" 
        placeholder="Bạn muốn nghe gì?" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        style={{ 
          width: "100%", 
          maxWidth: "400px", 
          padding: "15px 20px", 
          borderRadius: "30px", 
          border: "none", 
          backgroundColor: "#242424", 
          color: "#fff" 
        }} 
      />
      
      {/* Danh sách kết quả tìm kiếm */}
      <div style={{ marginTop: "20px" }}>
        {/* 
         * Lặp qua từng bài hát trong searchResults
         * searchResults được filter từ App.jsx dựa trên:
         * - Tên bài hát (title.toLowerCase().includes(searchQuery))
         * - Tên nghệ sĩ (artist.toLowerCase().includes(searchQuery))
         * - Case-insensitive (chữ hoa/thường không quan trọng)
         */}
        {searchResults.map((s, i) => (
          <div 
            key={i} 
            onClick={() => playSpecificSong(s.title)} 
            style={{ 
              padding: "12px", 
              display: "flex", 
              alignItems: "center", 
              gap: "15px", 
              cursor: "pointer" 
            }}
          >
            {/* Hình ảnh bìa bài hát */}
            <img src={s.cover} style={{ width: "45px", borderRadius: "5px" }} alt="" />
            <div>
              {/* Tên bài hát - Hiển thị ở dòng trên */}
              <div style={{color: "#fff"}}>{s.title}</div>
              {/* Tên nghệ sĩ - Hiển thị ở dòng dưới, màu xám */}
              <div style={{fontSize: "12px", color: "#b3b3b3"}}>{s.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;