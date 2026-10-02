/*
 * Danh sách giảng viên.
 * Thêm giáo viên: thả ảnh card vào assets/cards/ (chạy tools/build_cards.py) rồi thêm 1 dòng bên dưới.
 * - group: id của bộ lọc mà giáo viên thuộc về (xem FILTERS)
 * - order: số nhỏ hiển thị trước
 */
window.FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "vn", label: "Giáo viên Việt Nam" },
  { id: "foreign", label: "Giáo viên nước ngoài" },
];

window.TEACHERS = [
  { slug: "dinh-thi-nga", name: "Đinh Thị Nga", group: "vn", degree: "Cử nhân Sư phạm Anh", school: "Trường Đại học Ngoại ngữ – Đại học Quốc gia Hà Nội", card: "01_Dinh-Thi-Nga.webp" },
  { slug: "nguyen-phuong-dung", name: "Nguyễn Phương Dung", group: "vn", degree: "Cử nhân Ngôn ngữ Anh", school: "Trường Đại học Ngoại ngữ – Đại học Quốc gia Hà Nội", card: "02_Nguyen-Phuong-Dung.webp" },
  { slug: "vu-huong-thao", name: "Vũ Hương Thảo", group: "vn", degree: "Thạc sĩ Ngôn ngữ Anh", school: "Trường Đại học Hà Nội", card: "03_Vu-Huong-Thao.webp" },
  { slug: "kieu-kim-anh", name: "Kiều Kim Anh", group: "vn", degree: "Cử nhân Sư phạm Anh", school: "Trường Đại học Ngoại ngữ – Đại học Quốc gia Hà Nội", card: "04_Kieu-Kim-Anh.webp" },
  { slug: "tran-khuong-duy", name: "Trần Khương Duy", group: "vn", degree: "Cử nhân Sư phạm tiếng Anh", school: "Trường Đại học Ngoại ngữ – Đại học Quốc gia Hà Nội", card: "05_Tran-Khuong-Duy.webp" },
  { slug: "le-thi-anh-tuyet", name: "Lê Thị Ánh Tuyết", group: "vn", degree: "Cử nhân Sư phạm Anh", school: "Trường Đại học Sư phạm Hà Nội", card: "06_Le-Thi-Anh-Tuyet.webp" },
  { slug: "nguyen-thi-tuyet-nhung", name: "Nguyễn Thị Tuyết Nhung", group: "vn", degree: "Thạc sĩ Sư phạm Anh", school: "Trường Đại học Ngoại ngữ – Đại học Quốc gia Hà Nội", card: "07_Nguyen-Thi-Tuyet-Nhung.webp" },
  { slug: "do-thi-tham", name: "Đỗ Thị Thắm", group: "vn", degree: "Cử nhân Sư phạm Anh", school: "Trường Đại học Ngoại ngữ – Đại học Quốc gia Hà Nội", card: "08_Do-Thi-Tham.webp" },
  { slug: "duchesne-t-laurente", name: "Duchesne T. Laurente", group: "foreign", degree: "Bachelor in Elementary Education", school: "Negros Oriental State University", card: "09_Duchesne-T-Laurente.webp" },
  { slug: "katreena-sumicad", name: "Katreena Sumicad", group: "foreign", degree: "Bachelor of Science in Business Administration, major in Finance and Marketing", school: "Xavier University – Ateneo de Cagayan", card: "10_Katreena-Sumicad.webp" },
];
