import { useEffect, useState } from "react";
import { Alert, Button, Container, Navbar, Spinner } from "react-bootstrap";
import { SachForm, SachTable } from "./components";
import { apiSach } from "./services/api";

const App = () => {
  const [books, setBooks] = useState([]);
  const [selected, setSelectted] = useState(null);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setLoading] = useState(false);

  const getAllBooks = async () => {
    try {
      setLoading(true);
      const res = await apiSach.getAllBooks();
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
      setBooks([]);
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
      if (!confirm("Xác nhận xoá bản ghi đã chọn?")) {
        return;
      }

      setLoading(true);
      await apiSach.onDelete(selected.id);
      await getAllBooks();
      setMessage("Đã xoá thành công");
      setSelectted(null);
    } catch (e) {
      setBooks([]);
      setErr(e?.message || "Lỗi xử lý dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-3">
        <Container>
          <Navbar.Brand>📚 Quản lý Thư viện</Navbar.Brand>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="outline-light"
              onClick={getAllBooks}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Đang tải...
                </>
              ) : (
                "Hiển thị"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline-warning"
              onClick={() => setSelectted(null)}
            >
              Bỏ chọn
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={onDelete}
              disabled={!selected}
            >
              Xoá
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container>
        {message && <Alert variant="success">{message}</Alert>}
        {err && <Alert variant="danger">{err}</Alert>}

        <SachForm
          selected={selected}
          onSubmit={onSubmit}
          onReset={() => setSelectted(null)}
          dangXuLy={isLoading}
        />
        <SachTable books={books} onSelected={setSelectted} />
      </Container>
    </>
  );
};

export default App;
