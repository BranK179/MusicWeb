/**
 * Hiển thị trang chủ với 4 dòng cuộn ngang:
 * 1. Dòng Người Dùng: Bài hát thích + Playlist cá nhân + Top bài hát
 * 2. Dòng Bài Hát Hàng Đầu: 15 bài hát phổ biến
 * 3. Dòng Danh Sách Phát Hàng Đầu: 15 playlist
 * 4. Dòng Nghệ Sĩ Hàng Đầu: 15 nghệ sĩ
 * 
 * @see DANH_SÁCH_TỆP.md để hiểu chi tiết trang này
 */

import React, { useMemo } from 'react';

// Memoized ScrollableRow component - Định nghĩa ngoài để tránh remount
// React.memo ngăn component re-render khi props không thay đổi
const ScrollableRow = React.memo(({ title, children }) => (
  <div style={{ marginBottom: "40px" }}>
    <h2 style={{ fontSize: "1.5rem", color: "#fff", margin: "0 0 15px 0" }}>{title}</h2>
    <div
      className="horizontal-scroll-container"
      style={{ 
        display: "flex", 
        gap: "15px", 
        overflowX: "auto", 
        paddingBottom: "10px", 
        width: "100%", 
        boxSizing: "border-box"
      }}
    >
      {children}
    </div>
  </div>
));

ScrollableRow.displayName = 'ScrollableRow';

const Home = ({ 
  playlists, 
  activePlaylistIndex, 
  openPlaylist, 
  likedSongs, 
  customPlaylists,
  playSpecificSong,
  navigateTo,
  toggleLikeSpecificSong,
  viewArtist,
  isSongDetailOpen,
  setIsSongDetailOpen
}) => {
  /* 
   * Trích xuất tất cả bài hát từ tất cả playlist
   * flatMap: biến mảng playlist thành mảng phẳng của tất cả bài hát
   * VD: [[song1, song2], [song3, song4]] => [song1, song2, song3, song4]
   * Dùng useMemo để tránh recalculate nếu playlists không thay đổi
   */
  const allSongs = useMemo(() => playlists.flatMap(p => p.songs), [playlists]);

  /* 
   * Lấy danh sách các nghệ sĩ duy nhất
   * Step 1: Lấy tên tất cả nghệ sĩ từ allSongs
   * Step 2: Dùng Set để loại bỏ các nghệ sĩ trùng nhau
   * Step 3: Chuyển Set thành Array để có thể map
   * Dùng useMemo để tránh recalculate nếu allSongs không thay đổi
   */
  const artists = useMemo(() => {
    const artistsSet = new Set(allSongs.map(song => song.artist));
    return Array.from(artistsSet).map(artist => ({
      name: artist,
      songs: allSongs.filter(s => s.artist === artist),
      cover: allSongs.find(s => s.artist === artist)?.cover
    }));
  }, [allSongs]);

  /* Xử lý khi người dùng click vào bài hát: bắt đầu phát */
  const handleSongClick = (songTitle, playlistIndex) => {
    playSpecificSong(songTitle);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>Chào buổi chiều</h1>
      
      {/* ===== DÒNG 1: Người Dùng (Bài Hát Thích + Playlist Cá Nhân + Top Bài Hát) ===== */}
      {/* 
       * Dòng đầu tiên không có tiêu đề riêng, hiển thị:
       * - Thẻ "Bài hát đã thích" nếu có liked songs
       * - Các custom playlists của người dùng
       * - Lên đến 5 bài hát đã thích (phần còn lại sau playlist)
       * Mỗi card có chiều rộng cố định 200px để căn chỉnh hàng ngang
       */}
      <div style={{ marginBottom: "40px" }}>
        <div
          className="horizontal-scroll-container"
          style={{ 
            display: "flex", 
            gap: "15px", 
            overflowX: "auto", 
            paddingBottom: "10px", 
            width: "100%", 
            boxSizing: "border-box"
          }}
        >
          {/* Thẻ "Bài hát đã thích" - Dẫn tới view "liked" */}
          {likedSongs.length > 0 && (
            <div 
              className="playlist-card"
              onClick={() => navigateTo('liked')}
              style={{ 
                minWidth: "200px",
                flex: "0 0 200px",
                cursor: "pointer"
              }}
            >
              {/* Hình nền gradient với icon trái tim */}
              <div style={{ background: "linear-gradient(135deg, #450af5, #1db954)", width: "100%", height: "180px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <i className="fa-solid fa-heart" style={{ fontSize: "60px", color: "#fff" }}></i>
              </div>
              {/* Tiêu đề và số lượng bài hát */}
              <h3>Bài hát đã thích</h3>
              <p style={{ fontSize: "13px", color: "#b3b3b3" }}>{likedSongs.length} bài hát</p>
            </div>
          )}

          {/* Các Custom Playlists của người dùng */}
          {customPlaylists.map((pl, idx) => (
            <div 
              key={pl.id}
              className="playlist-card"
              onClick={() => openPlaylist(playlists.findIndex(p => p.id === pl.id))}
              style={{ 
                minWidth: "200px",
                flex: "0 0 200px",
                cursor: "pointer"
              }}
            >
              {/* Hình ảnh bìa playlist */}
              <img src={pl.coverImage} alt={pl.name} style={{ width: "100%", height: "180px", borderRadius: "10px", objectFit: "cover", marginBottom: "10px" }} />
              <h3 style={{ fontSize: "15px", margin: "0 0 5px 0" }}>{pl.name}</h3>
              <p style={{ fontSize: "13px", color: "#b3b3b3", margin: 0 }}>Playlist cá nhân</p>
            </div>
          ))}

          {/* Top 5 bài hát đã thích - Lấy số lượng còn lại sau các playlist card */}
          {/* 
           * Công thức tính số bài hát hiển thị:
           * - Mỗi dòng có tối đa 5 item
           * - Trừ 1 item cho "Bài hát đã thích"
           * - Trừ số custom playlists
           * = Số bài hát có thể hiển thị
           * Lấy chúng từ liked songs để show các bài mới yêu thích nhất
           */}
          {likedSongs.slice(0, 5 - (customPlaylists.length + 1)).map((songTitle, idx) => {
            // Tìm đối tượng bài hát từ allSongs để lấy chi tiết (hình ảnh, tên, nghệ sĩ)
            const song = allSongs.find(s => s.title === songTitle);
            return song ? (
              <div 
                key={`${songTitle}-${idx}`}
                className="song-card"
                onClick={() => handleSongClick(songTitle, activePlaylistIndex)}
                style={{
                  minWidth: "200px",
                  flex: "0 0 200px",
                  cursor: "pointer",
                  background: "#282828",
                  padding: "15px",
                  borderRadius: "10px",
                  transition: "background 0.3s"
                }}
                /* Hiệu ứng hover: đổi màu nền khi di chuột */
                onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#282828"}
              >
                {/* Hình ảnh bài hát */}
                <img src={song.cover} alt={song.title} style={{ width: "100%", height: "150px", borderRadius: "8px", objectFit: "cover", marginBottom: "10px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {/* Tên bài hát (truncate nếu quá dài) */}
                  <p style={{ fontSize: "15px", color: "#fff", margin: "0", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</p>
                  {/* Tên nghệ sĩ (truncate nếu quá dài) */}
                  <p style={{ fontSize: "13px", color: "#b3b3b3", margin: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.artist}</p>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* ===== DÒNG 2: Bài Hát Hàng Đầu ===== */}
      {/* 
       * Hiển thị 15 bài hát phổ biến nhất
       * Mỗi bài hát là một card có ảnh, tên, và tên nghệ sĩ
       * Click vào card để phát bài hát
       */}
      <ScrollableRow title="Bài Hát Hàng Đầu">
        {allSongs.slice(0, 15).map((song, idx) => (
          <div 
            key={`${song.title}-${idx}`}
            className="song-card"
            onClick={() => handleSongClick(song.title, 0)}
            style={{
              minWidth: "200px",
              flex: "0 0 200px",
              cursor: "pointer",
              background: "#282828",
              padding: "15px",
              borderRadius: "10px",
              transition: "background 0.3s"
            }}
            /* Hiệu ứng hover: đổi màu nền */
            onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#282828"}
          >
            {/* Hình ảnh bài hát */}
            <img src={song.cover} alt={song.title} style={{ width: "100%", height: "150px", borderRadius: "8px", objectFit: "cover", marginBottom: "10px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {/* Tên bài hát */}
              <p style={{ fontSize: "15px", color: "#fff", margin: "0", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</p>
              {/* Tên nghệ sĩ */}
              <p style={{ fontSize: "13px", color: "#b3b3b3", margin: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.artist}</p>
            </div>
          </div>
        ))}
      </ScrollableRow>

      {/* ===== DÒNG 3: Danh Sách Phát Hàng Đầu ===== */}
      {/* 
       * Hiển thị 15 playlist mặc định (không phải custom playlist)
       * Mỗi playlist là một card có hình bìa, tên, và mô tả
       * Click vào card để mở playlist
       */}
      <ScrollableRow title="Danh Sách Phát Hàng Đầu">
        {playlists.filter(p => !p.id.startsWith('custom_')).slice(0, 15).map((playlist, idx) => (
          <div 
            key={playlist.id}
            className="playlist-card"
            onClick={() => openPlaylist(idx)}
            style={{ 
              minWidth: "200px",
              flex: "0 0 200px",
              cursor: "pointer"
            }}
          >
            {/* Hình ảnh bìa playlist */}
            <img src={playlist.coverImage} alt={playlist.name} style={{ width: "100%", height: "180px", borderRadius: "10px", objectFit: "cover", marginBottom: "10px" }} />
            {/* Tên playlist */}
            <h3 style={{ fontSize: "15px", margin: "0 0 5px 0" }}>{playlist.name}</h3>
            {/* Mô tả playlist (truncate nếu quá dài) */}
            <p style={{ fontSize: "13px", color: "#b3b3b3", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{playlist.description}</p>
          </div>
        ))}
      </ScrollableRow>

      {/* ===== DÒNG 4: Nghệ Sĩ Hàng Đầu ===== */}
      {/* 
       * Hiển thị 15 nghệ sĩ phổ biến nhất
       * Mỗi nghệ sĩ là một card có ảnh tròn, tên, và số bài hát
       * Ảnh được lấy từ bìa của bài hát đầu tiên của nghệ sĩ
       */}
      <ScrollableRow title="Nghệ Sĩ Hàng Đầu">
        {artists.slice(0, 15).map((artist, idx) => (
          <div 
            key={artist.name}
            className="artist-card"
            onClick={() => viewArtist(artist.name)}
            style={{
              minWidth: "200px",
              flex: "0 0 200px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "15px",
              borderRadius: "10px",
              background: "#282828",
              transition: "background 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#282828"}
          >
            {/* 
             * Ảnh tròn của nghệ sĩ
             * Container 150x150px với borderRadius: 50% để làm tròn
             * flexShrink: 0 để đảm bảo ảnh không bị nén
             */}
            <div style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
              marginBottom: "15px",
              flexShrink: 0
            }}>
              <img src={artist.cover} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {/* Tên nghệ sĩ */}
            <p style={{ fontSize: "15px", color: "#fff", margin: "0", fontWeight: "500" }}>{artist.name}</p>
            {/* Số lượng bài hát của nghệ sĩ */}
            <p style={{ fontSize: "13px", color: "#b3b3b3", margin: "5px 0 0 0" }}>{artist.songs.length} bài hát</p>
          </div>
        ))}
      </ScrollableRow>
    </div>
  );
};

export default Home;