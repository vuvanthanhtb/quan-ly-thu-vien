### Sinh viên
```K25DTCN313 - Vũ Văn Thanh```

```K25DTCN284 - Đặng Anh Đức```

```K25DTCN291 Đỗ Đức Huy```

```K25DTCN311 - Đỗ Hữu Tự```

```K25DTCN275 - Đậu Thị Tuyết Anh```

```K25DTCN289 - Lưu Thanh Hùng```

### SQL
```
CREATE DATABASE IF NOT EXISTS thuvien CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thuvien;

CREATE TABLE IF NOT EXISTS sach (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ma_sach VARCHAR(64) NOT NULL UNIQUE,
  ten_sach VARCHAR(255) NOT NULL,
  tac_gia VARCHAR(255) NOT NULL,
  nam_xuat_ban INT,
  so_luong INT DEFAULT 0,
  ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ✅ Hai bản ghi mẫu
INSERT INTO sach (ma_sach, ten_sach, tac_gia, nam_xuat_ban, so_luong)
VALUES 
('S001', 'Lập trình Java cơ bản', 'Nguyễn Văn A', 2022, 10),
('S002', 'Cấu trúc dữ liệu & Giải thuật', 'Trần Thị B', 2023, 8);
```
