import { Table } from "react-bootstrap";

const SachTable = (props) => {
  const { books, onSelected } = props;

  return (
    <Table striped bordered hover size="sm" className="shadow-sm">
      <thead>
        <tr>
          <th style={{ width: 80 }}>STT</th>
          <th style={{ width: 120 }}>Mã</th>
          <th>Tên sách</th>
          <th style={{ width: 220 }}>Tác giả</th>
          <th style={{ width: 90 }}>Năm</th>
          <th style={{ width: 80 }}>Số lượng</th>
        </tr>
      </thead>
      <tbody>
        {books.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          books.map((s) => (
            <tr key={s.id} role="button" onClick={() => onSelected(s)}>
              <td>{s.id}</td>
              <td>{s.maSach}</td>
              <td>{s.tenSach}</td>
              <td>{s.tacGia}</td>
              <td>{s.namXuatBan ?? ""}</td>
              <td>{s.soLuong}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default SachTable;
