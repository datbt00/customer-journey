export interface SegmentData {
  campaign: string;
  service: string;
  period: string;
  status: string;
  soKHDuKien: number;
  soKHBlacklist: number;
  guiOTT: number;
}

export async function getData(): Promise<SegmentData[]> {
  const segmentCode = [
    "LASTLOGIN_1211",
    "ANALYTICS_22",
    "INTEGRATIONS_45",
    "STATISTICS_78",
    "ACTIVITY_99",
    "ENGAGEMENT_100",
    "RETENTION_121",
    "REPORTS_145",
    "DASHBOARD_189",
    "SETTINGS_205",
  ];
  const segmentName = [
    "Thời gian đăng nhập APP Ví cuối cùng >",
    "Đổi mật khẩu cho tài khoản Ví",
    "Chuyển khoản tới tài khoản khác",
    "Nạp tiền vào Ví điện tử",
    "Xem lịch sử giao dịch",
    "Khóa thẻ/tài khoản",
    "Xem số dư trong Ví",
    "Quản lý thông tin cá nhân",
    "Xác thực giao dịch",
    "Thay đổi thông tin liên hệ",
  ];
  const periods = [
    "Chạy hàng ngày",
    "Chạy hàng tuần",
    "Chạy hàng tháng",
    "Chạy hàng quý",
    "Chạy hàng năm",
    "Chạy theo yêu cầu",
    "Chạy hàng lẻ",
    "Chạy hàng dịp đặc biệt",
    "Chạy hàng kỷ niệm",
    "Chạy theo lịch trình",
  ];
  const services = [
    "Taxi",
    "Thức ăn",
    "Bánh mỳ",
    "Cà phê",
    "Trà sữa",
    "Quần áo",
    "Giày dép",
    "Điện thoại",
    "Máy tính",
    "Camera",
  ];
  const statuss = ["Đang diễn ra", "Chưa diễn ra"];

  const data: SegmentData[] = [];

  for (let i = 0; i < 85; i++) {
    let segment: SegmentData;
    if (i === 0) {
      segment = {
        campaign: "Chiến dịch đầu tiên",
        service: "Taxi",
        period: "Chạy hàng ngày",
        status: "Đang diễn ra",
        soKHDuKien: 2000,
        soKHBlacklist: 20,
        guiOTT: 1800,
      };
    } else if (i === 1) {
      segment = {
        campaign: "Chiến dịch thứ hai",
        service: "Film",
        period: "Chạy một lần",
        status: "Chưa diễn ra",
        soKHDuKien: 1000,
        soKHBlacklist: 10,
        guiOTT: 0,
      };
    } else {
      const randomIndex = i % segmentCode.length;
      segment = {
        campaign: segmentName[randomIndex],
        service: services[randomIndex % services.length],
        period: periods[randomIndex % periods.length],
        status: statuss[Math.floor(Math.random() * statuss.length)],
        soKHDuKien: Math.floor(Math.random() * 5000) + 500,
        soKHBlacklist: Math.floor(Math.random() * 50),
        guiOTT: Math.floor(Math.random() * 4000),
      };
    }
    data.push(segment);
  }

  return data;
}
