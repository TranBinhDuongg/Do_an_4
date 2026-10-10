import { useState } from 'react';
import { HandHeart, Eye, UsersThree, MapPin, Copy, Check } from '@phosphor-icons/react';

export function SectionLabel({ number, children }) {
  return <div className="section-label"><span>{number}</span><span>{children}</span><span className="section-label-rule" aria-hidden="true" /></div>;
}

const exampleText = 'Tôi thấy [số lượng, loài vật] tại [địa chỉ hoặc mốc nhận biết] ở Hưng Yên. Thời điểm phát hiện là [giờ, ngày]. Con vật có biểu hiện [điều quan sát được]. Tôi có [hình ảnh/thông tin vị trí] và có thể liên lạc qua [kênh liên hệ].';

function ReportExample() {
  const [copyState, setCopyState] = useState('');
  async function copyExample() {
    try {
      await navigator.clipboard.writeText(exampleText);
      setCopyState('Đã sao chép');
    } catch {
      setCopyState('Hãy chọn nội dung mẫu để sao chép.');
    }
  }
  return <blockquote className="report-example"><div className="report-example-label">NỘI DUNG THAM KHẢO</div><p>“{exampleText}”</p><footer><span>Mẫu tin báo để bạn tham khảo.</span><button type="button" onClick={copyExample}>{copyState === 'Đã sao chép' ? <Check size={16} /> : <Copy size={16} />} Sao chép mẫu</button></footer><span className="copy-feedback" role="status">{copyState}</span></blockquote>;
}

const situations = [
  ['Động vật bị bỏ rơi', 'Chó, mèo hoặc con non được phát hiện không có người chăm sóc. Ghi lại số lượng, vị trí và thời điểm bạn nhìn thấy.'],
  ['Có dấu hiệu bị thương', 'Con vật đi lại khó khăn hoặc có biểu hiện bất thường. Mô tả những gì quan sát được để trung tâm có thêm thông tin.'],
  ['Động vật mắc kẹt', 'Con vật trong khu vực khó tiếp cận, nhà kho hoặc vị trí không thể tự ra ngoài. Nêu rõ lối vào và điều kiện tại hiện trường.'],
  ['Chó, mèo đi lạc', 'Con vật xuất hiện trong khu dân cư và chưa xác định được người chăm sóc. Hình ảnh, đặc điểm nhận dạng và vị trí có thể giúp kết nối thông tin.'],
];

export function GioiThieuChiTiet() {
  return <div className="center-information">
    <section id="ve-trung-tam" className="center-section" aria-labelledby="center-about-title">
      <SectionLabel number="01">Về chúng tôi</SectionLabel>
      <p className="intro-kicker">TRẠM CỨU HỘ ĐỘNG VẬT</p>
      <h2 id="center-about-title">Một nơi để kết nối.<br />Một hành trình để chăm sóc.</h2>
      <div className="center-about-body"><div className="center-about-copy"><p>Trạm cứu hộ động vật hướng đến việc kết nối người dân với đội ngũ hỗ trợ động vật. Từ một tin báo trong khu phố, thông tin về con vật được tập hợp để tìm hiểu tình huống và lựa chọn cách hỗ trợ phù hợp.</p><p>Bạn không cần hiểu về nghiệp vụ cứu hộ để bắt đầu giúp đỡ. Một mô tả rõ ràng, hình ảnh và việc giữ liên lạc sẽ giúp trung tâm hiểu tình huống, tìm cách hỗ trợ và tiếp nối sự chăm sóc.</p></div><figure className="center-illustration"><img src="/images/dong-hanh-cung-cho.jpg" alt="Một người phụ nữ âu yếm chú chó trong công viên" width="1400" height="933" loading="lazy" decoding="async" /></figure></div>
      <div className="center-values"><article><HandHeart className="value-icon" size={28} aria-hidden="true" /><h3>Quan tâm đúng cách</h3><p>Đặt tình trạng của con vật và điều kiện tại hiện trường vào trọng tâm khi tìm hiểu một trường hợp.</p></article><article><Eye className="value-icon" size={28} aria-hidden="true" /><h3>Thông tin rõ ràng</h3><p>Phân biệt điều đã quan sát với điều chưa chắc chắn để tránh hiểu sai tình huống cần hỗ trợ.</p></article><article><UsersThree className="value-icon" size={28} aria-hidden="true" /><h3>Kết nối cộng đồng</h3><p>Người báo tin, người chăm sóc và đội hỗ trợ cùng bổ sung thông tin trong quá trình xử lý.</p></article></div>
    </section>
    <section id="truong-hop" className="center-section center-situations" aria-labelledby="situations-title"><SectionLabel number="02">Những trường hợp cần quan tâm</SectionLabel><h2 id="situations-title">Khi nào bạn<br />có thể báo tin?</h2><p className="center-lead">Nếu bắt gặp một con vật cần giúp đỡ, bạn có thể cung cấp thông tin về tình huống. Dưới đây là những trường hợp thường gặp.</p><figure className="center-illustration center-situation-photo"><img src="/images/meo-nghi-ngoi.jpg" alt="Hai chú mèo nằm cạnh nhau trên một tấm chăn" width="1400" height="1050" loading="lazy" decoding="async" /></figure><div className="center-situation-grid">{situations.map(([title, description], index) => <article key={title}><span className="center-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></article>)}</div><p className="center-context">Việc báo tin giúp trung tâm tìm hiểu sự việc. Phương án hỗ trợ còn phụ thuộc vào thông tin được xác nhận, địa điểm, điều kiện tiếp cận và nguồn lực tại thời điểm đó.</p></section>
  </div>;
}

export function SauKhiBaoTin() {
  return <>
    <section className="center-section center-process" id="sau-bao-tin" aria-labelledby="process-title"><SectionLabel number="04">Hành trình hỗ trợ</SectionLabel><p className="intro-kicker">TỪ TIN BÁO ĐẾN HỖ TRỢ</p><h2 id="process-title">Sau khi báo tin,<br />điều gì sẽ tiếp theo?</h2><p className="center-lead">Một trường hợp cần được làm rõ trước khi lựa chọn cách hỗ trợ. Quy trình dưới đây giúp bạn hiểu những thông tin có thể cần trao đổi thêm.</p><ol className="center-process-list"><li><h3>Ghi nhận thông tin</h3><p>Tổng hợp vị trí, tình trạng con vật, hình ảnh và thông tin liên hệ mà người báo tin cung cấp.</p></li><li><h3>Trao đổi và xác minh</h3><p>Hỏi thêm về hiện trường, thời điểm phát hiện hoặc vị trí hiện tại của con vật nếu thông tin ban đầu chưa đủ rõ.</p></li><li><h3>Xem xét phương án hỗ trợ</h3><p>Cân nhắc tình huống thực tế, khả năng tiếp cận và đội ngũ phù hợp. Việc gửi tin báo chưa đồng nghĩa với xác nhận tiếp nhận cứu hộ.</p></li><li><h3>Phối hợp và cập nhật</h3><p>Người báo tin tiếp tục cung cấp thông tin khi có thay đổi. Nếu có phương án hỗ trợ, hai bên trao đổi về bước tiếp theo và cách phối hợp.</p></li></ol></section>
    <section id="mau-tin-bao" className="center-section center-example" aria-labelledby="example-title"><SectionLabel number="05">Chuẩn bị tin báo</SectionLabel><div><p className="intro-kicker">VÍ DỤ MINH HỌA</p><h2 id="example-title">Một tin báo<br />rõ ràng có thể rất ngắn.</h2><p className="center-lead">Nêu điều bạn nhìn thấy, địa điểm cụ thể và cách liên lạc. Thay các phần trong ngoặc bằng thông tin thực tế.</p></div><ReportExample /></section>
    <section className="center-section center-location" id="dia-diem" aria-labelledby="location-title"><SectionLabel number="06">Kết nối với trung tâm</SectionLabel><p className="intro-kicker">ĐỊA ĐIỂM TRUNG TÂM</p><h2 id="location-title">Kết nối với trạm cứu hộ.</h2><div className="center-location-grid"><div className="center-address-card"><span className="center-address-label"><MapPin size={16} aria-hidden="true" /> YÊN MỸ · HƯNG YÊN</span><h3>25 đường 39A</h3><p>Xã Yên Mỹ, tỉnh Hưng Yên</p><a className="intro-action" href="https://www.google.com/maps/search/?api=1&query=25%20%C4%91%C6%B0%E1%BB%9Dng%2039A%2C%20x%C3%A3%20Y%C3%AAn%20M%E1%BB%B9%2C%20H%C6%B0ng%20Y%C3%AAn" target="_blank" rel="noopener noreferrer">Xem trên bản đồ <span aria-hidden="true">↗</span></a><p className="center-map-note">Địa chỉ minh họa cho thiết kế, chưa xác nhận cơ sở hoạt động tại đây.</p></div><dl><div><dt>Liên hệ trước khi đến</dt><dd>Trao đổi với trung tâm để xác nhận trường hợp cần hỗ trợ và điều kiện tiếp nhận.</dd></div><div><dt>Điện thoại / kênh báo tin</dt><dd>Chờ cập nhật thông tin chính thức.</dd></div><div><dt>Giờ tiếp nhận</dt><dd>Liên hệ để xác nhận lịch tiếp nhận khi trung tâm công bố kênh liên lạc.</dd></div><div><dt>Thông tin cần mang theo</dt><dd>Vị trí phát hiện, mô tả tình trạng, hình ảnh và thông tin liên hệ của người báo tin.</dd></div></dl></div></section>
  </>;
}

const questions = [
  ['Tôi chưa biết rõ tình trạng con vật thì sao?', 'Hãy mô tả điều bạn quan sát được, thời điểm và vị trí. Bạn không cần tự xác định bệnh hay mức độ tổn thương. Những chi tiết như số lượng, màu lông, cách di chuyển hoặc biểu hiện bất thường có thể giúp làm rõ tình huống.'],
  ['Tôi nên gửi hình ảnh như thế nào?', 'Ưu tiên hình ảnh cho thấy con vật và bối cảnh xung quanh, kèm thời điểm chụp. Nếu có nhiều ảnh, hãy chọn ảnh rõ nhất và chỉ dẫn nơi chụp. Tránh đưa thông tin riêng tư của người khác vào hình ảnh khi không cần thiết.'],
  ['Tôi có thể báo tin khi đã rời hiện trường không?', 'Bạn vẫn có thể cung cấp thông tin đã quan sát, nhưng cần nói rõ thời điểm và việc bạn đã rời đi. Nếu có người tại hiện trường sẵn sàng trao đổi, chỉ cung cấp thông tin liên hệ của họ khi đã được đồng ý.'],
  ['Nếu vị trí hoặc tình trạng con vật thay đổi thì sao?', 'Bổ sung vị trí mới, thời điểm cập nhật và những thay đổi bạn nhìn thấy vào cùng cuộc trao đổi. Nêu rõ tin báo ban đầu để trung tâm dễ đối chiếu, thay vì tạo nhiều thông tin rời rạc về cùng một trường hợp.'],
  ['Báo tin có đồng nghĩa với được cứu hộ ngay không?', 'Tin báo là thông tin ban đầu để tìm hiểu trường hợp. Việc hỗ trợ còn phụ thuộc vào xác minh, địa điểm, điều kiện hiện trường và nguồn lực. Hiện chưa có thời gian phản hồi hay cam kết tiếp nhận cụ thể được công bố trên trang.'],
  ['Tôi có thể đưa con vật đến trung tâm không?', 'Hãy liên hệ trước để xác nhận thời gian và điều kiện tiếp nhận. Địa chỉ trong bản thiết kế này là địa chỉ minh họa; cần xác nhận địa điểm thực tế với trung tâm trước khi di chuyển.'],
  ['Trung tâm có thu phí hoặc tiếp nhận đóng góp không?', 'Chính sách chi phí, nhận nuôi và đóng góp chưa được công bố tại đây. Khi có thông tin chính thức, các điều kiện và kênh liên hệ sẽ được bổ sung rõ ràng trước khi bạn quyết định tham gia.'],
  ['Có thể gửi tin báo ngay trên website này không?', 'Website hiện giới thiệu trung tâm và hướng dẫn chuẩn bị tin báo. Chưa có chức năng gửi tin báo trực tiếp. Số điện thoại và đường dẫn báo tin chính thức sẽ được cập nhật sau khi xác nhận.'],
];

export function CauHoiThuongGap() {
  return <section className="intro-apps" id="cau-hoi" aria-labelledby="faq-title"><SectionLabel number="07">Giải đáp thắc mắc</SectionLabel><div className="intro-questions"><h2 id="faq-title">Những điều bạn<br />có thể muốn biết.</h2>{questions.map(([question, answer], index) => <details key={question}><summary><span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{question}</span></summary><p>{answer}</p></details>)}</div></section>;
}

