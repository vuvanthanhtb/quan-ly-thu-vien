import { Table, Card, Badge } from "react-bootstrap";

const SachTable = (props) => {
  const { books, onSelected, selected } = props;

  return (
    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}>
      <Card.Header style={{ background: 'linear-gradient(135deg, #3A5BA0 0%, #2C4A85 100%)', color: 'white', borderRadius: '15px 15px 0 0', padding: '15px 20px' }}>
        <h5 className="mb-0">📚 Danh sách sách trong thư viện</h5>
      </Card.Header>
      <Card.Body style={{ padding: 0 }}>
        <Table hover className="mb-0" style={{ borderRadius: '0 0 15px 15px' }}>
          <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #3A5BA0' }}>
            <tr>
              <th style={{ width: 80, padding: '15px', fontWeight: '600', color: '#555' }}>STT</th>
              <th style={{ width: 120, padding: '15px', fontWeight: '600', color: '#555' }}>Mã sách</th>
              <th style={{ padding: '15px', fontWeight: '600', color: '#555' }}>Tên sách</th>
              <th style={{ width: 220, padding: '15px', fontWeight: '600', color: '#555' }}>Tác giả</th>
              <th style={{ width: 110, padding: '15px', fontWeight: '600', color: '#555', textAlign: 'center' }}>Năm XB</th>
              <th style={{ width: 110, padding: '15px', fontWeight: '600', color: '#555', textAlign: 'center' }}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center" style={{ padding: '40px', color: '#999', fontSize: '1.1rem' }}>
                  📭 Không có dữ liệu
                </td>
              </tr>
            ) : (
              books.map((s, index) => {
                const isSelected = selected?.id === s.id;
                return (
                  <tr 
                    key={s.id} 
                    role="button" 
                    onClick={() => onSelected(s)}
                    style={{
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#e3f2fd' : (index % 2 === 0 ? '#ffffff' : '#f8f9fa'),
                      borderLeft: isSelected ? '4px solid #3A5BA0' : '4px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#f0f4ff';
                      }
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                      }
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <Badge bg={isSelected ? 'primary' : 'secondary'} style={{ fontSize: '0.85rem' }}>
                        {isSelected && '✓ '}{s.id}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px', fontWeight: isSelected ? '700' : '500', color: '#3A5BA0' }}>{s.maSach}</td>
                    <td style={{ padding: '12px', fontWeight: isSelected ? '600' : '500' }}>{s.tenSach}</td>
                    <td style={{ padding: '12px', color: '#666' }}>{s.tacGia}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {s.namXuatBan ? (
                        <Badge bg="info" style={{ fontSize: '0.85rem' }}>{s.namXuatBan}</Badge>
                      ) : (
                        <span style={{ color: '#999' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <Badge 
                        bg={s.soLuong > 5 ? 'success' : s.soLuong > 0 ? 'warning' : 'danger'}
                        style={{ fontSize: '0.9rem', minWidth: '40px' }}
                      >
                        {s.soLuong}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default SachTable;
