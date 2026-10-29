/* ===== NỘI DUNG CÁ NHÂN HÓA — chỉ cần sửa file này để viết lời riêng cho em =====
   Có thể dùng {XUNG} (Anh/Chị) và {xung} (anh/chị) trong các câu chữ. */
window.CA_NHAN = {
  TEN: "Piwon", // cách gọi người học (ví dụ "Linh"); để trống nếu không cần
  XUNG: "Anh Kha :) ", // người viết thư xưng là "Anh" hay "Chị"
  MUC_TIEU: 20, // số câu mục tiêu mỗi ngày
  NGAY_THI: "", // ngày thi, dạng "2026-12-20" (để trống = không hiện đếm ngược)
  ANH_CAN: 300, // số câu đúng để "Bức ảnh bí mật" hiện rõ hoàn toàn
  ANH_LOI: "Ảnh đã hiện rõ rồi. Nhìn xem em đã đi xa đến đâu!",

  /* 5 lá thư mở khóa theo TỔNG SỐ CÂU ĐÚNG */
  THU: [
    {
      at: 25,
      i: "🌱",
      t: "Thư số 1",
      x: "Em ơi, 25 câu đúng đầu tiên rồi nè! Những bước chân đầu bao giờ cũng quan trọng nhất. Em đã bắt đầu rồi, vậy là tốt lắm rồi đó. Cứ nhẹ nhàng đi tiếp nhé, không cần vội. — {XUNG}",
    },
    {
      at: 100,
      i: "☕",
      t: "Thư số 2",
      x: "100 câu đúng rồi em! Nhìn con số này {XUNG} thấy ấm lòng quá. Nhớ tranh thủ nghỉ một chút, uống nước, thả lỏng vai rồi học tiếp nha. Cơ thể khỏe thì đầu óc mới sáng được. — {XUNG}",
    },
    {
      at: 250,
      i: "🔥",
      t: "Thư số 3",
      x: "250 câu rồi đó em. Quãng đường này không phải ai cũng đi được đâu. Có lúc mệt, có lúc nản là chuyện bình thường. Nhưng em vẫn đang ở đây, vẫn đang cố gắng. {XUNG} thấy em mạnh mẽ lắm. — {XUNG}",
    },
    {
      at: 500,
      i: "🌙",
      t: "Thư số 4",
      x: "Nửa ngàn câu đúng rồi em ơi. Dù phía trước còn bao nhiêu, {XUNG} chỉ muốn em nhớ một điều: em không đi một mình. Có người luôn tin tưởng và chờ tin vui của em. Cố lên nhé. — {XUNG}",
    },
    {
      at: 800,
      i: "✨",
      t: "Thư cuối",
      x: "800 câu đúng… Em đã chứng minh được rồi. Không còn gì phải nghi ngờ nữa. Vào phòng thi cứ bình tĩnh và tin vào những gì mình đã chuẩn bị. Thi xong mình kể nhau nghe mọi thứ nhé. {XUNG} tự hào về em. — {XUNG}",
    },
  ],

  /* "Thư hôm nay": mỗi ngày một lời nhắn khác nhau, lần lượt theo danh sách (thêm bao nhiêu tùy ý) */
  DAILY: [
    "Hôm nay chỉ cần làm 10 câu thôi cũng là một chiến thắng nhỏ rồi.",
    "Học không cần hoàn hảo, chỉ cần đều đặn.",
    "Quên là chuyện bình thường. Làm lại câu sai chính là cách nhớ lâu nhất đấy.",
    "Uống đủ nước chưa? Não hoạt động tốt hơn khi không khát.",
    "Mỗi câu đúng là một viên gạch xây lên điểm số cuối kỳ.",
    "Nếu mệt, nghỉ 5 phút rồi học tiếp. Nghỉ ngơi không phải là bỏ cuộc.",
    "Hồi trước {xung} cũng từng lo lắng trước kỳ thi, và rồi mọi thứ vẫn ổn thôi.",
    "Đừng so sánh với ai cả, chỉ cần hôm nay tốt hơn hôm qua một chút.",
    "Ngủ đủ giấc cũng là một phần của việc ôn thi đó nhé.",
    "Câu nào sai thì cứ mừng: em vừa tìm ra chỗ cần học rồi.",
    "Một buổi học 25 phút tập trung còn hơn hai tiếng vừa học vừa lướt điện thoại.",
    "Em không cần giỏi ngay. Em chỉ cần bắt đầu.",
    "Hôm nay thử giải thích một khái niệm cho người khác nghe xem, sẽ nhớ rất lâu.",
    "Thi cử chỉ là một chặng đường, không phải toàn bộ con người em.",
    "Ăn sáng đầy đủ rồi hãy học, bụng no thì đầu mới sáng.",
    "Đứng dậy đi lại một vòng, rồi quay lại học tiếp nhé.",
    "{XUNG} biết có những hôm em thấy nản. Vẫn mở web ra học là em đã giỏi lắm rồi.",
    "Học bằng cách tự kiểm tra như thế này hiệu quả hơn đọc đi đọc lại rất nhiều.",
    "Đừng ôm hết một lúc. Chia nhỏ ra, mỗi ngày một phần là đủ.",
    "Bình tĩnh đọc kỹ đề: nhiều khi đáp án nằm ngay trong cách hỏi.",
    "Em đã cố gắng nhiều hơn em tưởng, {xung} thấy hết đó.",
    "Hôm nay mà đạt mục tiêu thì tối nay được thưởng cho mình một món ngon nhé.",
    "Sai một câu hôm nay, đúng một câu hôm thi. Thế là lời rồi.",
    "Cười một cái trước khi học, nghe có vẻ ngớ ngẩn nhưng hiệu quả thật.",
    "Việc khó nhất là mở sách ra. Em đã làm được rồi thì phần còn lại dễ hơn nhiều.",
    "Cố lên em, {xung} luôn ở phía sau cổ vũ.",
    "Trước giờ thi nhớ ngủ sớm, đừng thức khuya học thêm nhé.",
    "Ôn lại những câu hay sai vào buổi sáng, đầu óc đang tươi nhất.",
    "Mỗi lần cố thêm một chút là em đang tự mạnh lên rồi đấy.",
    "Chúc em một ngày học nhẹ nhàng mà hiệu quả.",
  ],

  MOTTO: [
    "Hôm nay làm vài câu thôi cũng được",
    "Mỗi ngày một chút, qua môn nhẹ nhàng",
    "Bình tĩnh, từng câu một nhé",
    "Học xong nhớ nghỉ ngơi",
    "Chậm mà chắc",
  ],

  /* Lời của linh vật khi em chạm vào nó */
  MASCOT: [
    "Cố lên nào, mình ở đây cùng em!",
    "Làm thử vài câu cho nóng máy nhé?",
    "Em giỏi hơn em nghĩ đấy.",
    "Ăn gì chưa? Học cũng cần năng lượng!",
    "Mình đang lớn lên nhờ em học đó 😎",
    "Một câu nữa thôi rồi nghỉ nhé?",
    "Nghe nói câu may mắn xuất hiện bất chợt đó ✨",
    "Hôm nay mình cùng đạt mục tiêu nha.",
  ],

  OKS: [
    "Chuẩn rồi!",
    "Đỉnh quá!",
    "Chính xác!",
    "Giỏi lắm!",
    "Ăn trọn điểm!",
    "Mượt như nhung",
    "Quá dễ với em!",
    "Cứ đà này là qua môn",
  ],
  NOS: [
    "Tiếc ghê, nhớ lại nhé",
    "Sai chút xíu thôi",
    "Ghi nhớ đáp án này nha",
    "Không sao, lần sau là đúng",
    "Câu này hơi lắt léo thật",
    "Sai để nhớ lâu hơn mà",
  ],
  LUCKY: [
    "Câu may mắn! Em nhận thêm điểm",
    "Trúng câu may mắn rồi!",
    "Bonus dành riêng cho em",
  ],

  AVT: [
    "Cố lên! Học bổng đang chờ 🎓",
    "Bao giờ đạt học bổng? ^O^",
    "Chúc em thi tốt! ✨",
  ],
};
