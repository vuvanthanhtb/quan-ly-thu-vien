import { useEffect, useState } from "react";
import { Alert, Button, Container, Modal, Navbar, Spinner } from "react-bootstrap";
import { SachForm, SachTable } from "./components";
import { apiSach } from "./services/api";

const App = () => {
  const [books, setBooks] = useState([]);
  const [selected, setSelectted] = useState(null);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getAllBooks = async () => {
    try {
      setLoading(true);
      const res = await apiSach.getAllBooks();
      // const res = [
      //   {id:1, maSach: 'S001', tenSach: 'Lập trình Java cơ bản', tacGia: 'Nguyễn Văn A', namXuatBan: 2022, soLuong: 10},
      //   {id:2, maSach: 'S002', tenSach: 'Lập trình React nâng cao', tacGia: 'Trần Thị B', namXuatBan: 2023, soLuong: 5},
      //   {id:3, maSach: 'S003', tenSach: 'Cấu trúc dữ liệu và giải thuật', tacGia: 'Lê Văn C', namXuatBan: 2021, soLuong: 8},
      // ]

      setBooks(res);
    } catch (e) {
      setBooks([]);
      setErr(e?.message || "Lỗi xử lý dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getAllBooks();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  const onSubmit = async (payload, id) => {
    try {
      setMessage("");
      setErr("");
      setLoading(true);
      if (id) {
        await apiSach.hanndleUpdate(id, payload);
      } else {
        await apiSach.hanndleCreate(payload);
      }
      await getAllBooks();
      setMessage(id ? "Cập nhật thành công" : "Thêm mới thành công");
      setSelectted(null);
    } catch (e) {
      setErr(e?.message || "Lỗi xử lý dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      if (!selected?.id) {
        setErr("Chưa chọn bản ghi để xoá");
        return;
      }

      setLoading(true);
      setShowDeleteModal(false);
      await apiSach.onDelete(selected.id);
      await getAllBooks();
      setMessage("Đã xoá thành công");
      setSelectted(null);
    } catch (e) {
      setErr(e?.message || "Lỗi xử lý dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    if (!selected?.id) {
      setErr("Chưa chọn bản ghi để xoá");
      return;
    }
    setShowDeleteModal(true);
  };

  return (
    <>
      <Navbar 
        bg="dark" 
        variant="dark" 
        className="mb-4" 
        sticky="top"
        style={{ 
          background: 'linear-gradient(135deg, #3A5BA0 0%, #2C4A85 100%)', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <Container style={{ maxWidth: '1400px' }}>
          <Navbar.Brand style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            📚 Quản lý Thư viện
          </Navbar.Brand>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="outline-light"
              onClick={getAllBooks}
              disabled={isLoading}
              style={{ borderRadius: '15px', paddingLeft: '20px', paddingRight: '20px', fontWeight: '600' }}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Đang tải...
                </>
              ) : (
                <>🔄 Tải lại</>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline-warning"
              onClick={() => setSelectted(null)}
              disabled={!selected}
              style={{ borderRadius: '15px', paddingLeft: '20px', paddingRight: '20px', fontWeight: '600' }}
            >
              ✖️ Bỏ chọn
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={handleDeleteClick}
              disabled={!selected}
              style={{ borderRadius: '15px', paddingLeft: '20px', paddingRight: '20px', fontWeight: '600' }}
            >
              🗑️ Xoá
            </Button>
          </div>
        </Container>
      </Navbar>

      <div style={{ 
        position: 'fixed', 
        top: '80px', 
        right: '20px', 
        zIndex: 9999,
        minWidth: '350px',
        maxWidth: '450px'
      }}>
        {message && (
          <Alert 
            variant="success" 
            dismissible 
            onClose={() => setMessage('')} 
            className="d-flex align-items-center shadow-lg" 
            style={{ 
              borderRadius: '10px', 
              border: 'none',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>✅</span>
            <span>{message}</span>
          </Alert>
        )}
        {err && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => setErr('')} 
            className="d-flex align-items-center shadow-lg" 
            style={{ 
              borderRadius: '10px', 
              border: 'none',
              animation: 'slideInRight 0.3s ease-out',
              marginTop: message ? '10px' : '0'
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>❌</span>
            <span>{err}</span>
          </Alert>
        )}
      </div>

      <Container style={{ maxWidth: '1400px' }}>
        <SachForm
          selected={selected}
          onSubmit={onSubmit}
          onReset={() => setSelectted(null)}
          dangXuLy={isLoading}
        />
        <SachTable books={books} onSelected={setSelectted} selected={selected} />
      </Container>

      {/* Footer */}
      <footer style={{ 
        marginTop: '60px',
        background: 'linear-gradient(135deg, #3A5BA0 0%, #2C4A85 100%)',
        color: 'white',
        padding: '40px 0 20px 0',
        boxShadow: '0 -4px 6px rgba(0,0,0,0.1)'
      }}>
        <Container style={{ maxWidth: '1400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Nhóm Sinh viên Thực hiện</h4>
            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Quản lý Thư viện</p>
          </div>
          
          <div className="row g-3">
            {[
              { msv: 'K25DTCN313', name: 'Vũ Văn Thanh' },
              { msv: 'K25DTCN284', name: 'Đặng Anh Đức' },
              { msv: 'K25DTCN291', name: 'Đỗ Đức Huy' },
              { msv: 'K25DTCN311', name: 'Đỗ Hữu Tự' },
              { msv: 'K25DTCN275', name: 'Đậu Thị Tuyết Anh' },
              { msv: 'K25DTCN289', name: 'Lưu Thanh Hùng' }
            ].map((sv, index) => (
              <div key={index} className="col-md-4 col-sm-6">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '15px 20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>
                    {sv.msv}
                  </div>
                  <div style={{ fontSize: '0.95rem', opacity: 0.95 }}>
                    {sv.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px', 
            paddingTop: '20px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.9rem',
            opacity: 0.9
          }}>
            <p className="mb-0">© 2025 Học viện Công nghệ Bưu chính Viễn thông. All rights reserved.</p>
          </div>
        </Container>
      </footer>

      {/* Modal xác nhận xóa */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header 
          closeButton 
          style={{ 
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', 
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title>
            <span style={{ fontSize: '1.2rem' }}>⚠️ Xác nhận xóa</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '25px' }}>
          <p style={{ fontSize: '1.05rem', marginBottom: '15px' }}>
            Bạn có chắc chắn muốn xóa sách này không?
          </p>
          {selected && (
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              borderLeft: '4px solid #dc3545'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Mã sách:</strong> {selected.maSach}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Tên sách:</strong> {selected.tenSach}
              </div>
              <div>
                <strong>Tác giả:</strong> {selected.tacGia}
              </div>
            </div>
          )}
          <p style={{ color: '#dc3545', marginTop: '15px', marginBottom: 0, fontSize: '0.9rem' }}>
            ⚠️ Hành động này không thể hoàn tác!
          </p>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', padding: '15px 25px' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            style={{ borderRadius: '20px', paddingLeft: '25px', paddingRight: '25px' }}
          >
            ❌ Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={onDelete}
            disabled={isLoading}
            style={{ 
              borderRadius: '20px', 
              paddingLeft: '25px', 
              paddingRight: '25px',
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              border: 'none'
            }}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" /> Đang xóa...
              </>
            ) : (
              <>🗑️ Xác nhận xóa</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default App;
