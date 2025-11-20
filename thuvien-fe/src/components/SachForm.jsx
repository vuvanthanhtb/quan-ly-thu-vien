import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Alert, Card } from "react-bootstrap";

const SachForm = (props) => {
  const { selected, onSubmit, onReset, dangXuLy } = props;
  const [maSach, setMaSach] = useState("");
  const [tenSach, setTenSach] = useState("");
  const [tacGia, setTacGia] = useState("");
  const [namXuatBan, setNamXuatBan] = useState("");
  const [soLuong, setSoLuong] = useState(0);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    if (selected) {
      setMaSach(selected.maSach || "");
      setTenSach(selected.tenSach || "");
      setTacGia(selected.tacGia || "");
      setNamXuatBan(selected.namXuatBan ?? "");
      setSoLuong(selected.soLuong ?? 0);
      setLoi("");
    } else {
      thietLapMacDinh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function thietLapMacDinh() {
    setMaSach("");
    setTenSach("");
    setTacGia("");
    setNamXuatBan("");
    setSoLuong(0);
    setLoi("");
  }

  function thucHienSubmit(e) {
    e.preventDefault();
    if (!maSach.trim() || !tenSach.trim() || !tacGia.trim()) {
      setLoi("Thiếu trường bắt buộc: mã sách / tên sách / tác giả");
      return;
    }
    const payload = {
      maSach: maSach.trim(),
      tenSach: tenSach.trim(),
      tacGia: tacGia.trim(),
      namXuatBan: namXuatBan === "" ? null : Number(namXuatBan),
      soLuong: Number(soLuong) || 0,
    };
    onSubmit(payload, selected?.id);
  }

  function resetForm() {
    thietLapMacDinh();
    onReset?.();
  }

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Form onSubmit={thucHienSubmit}>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Mã sách</Form.Label>
                <Form.Control
                  value={maSach}
                  onChange={(e) => setMaSach(e.target.value)}
                  placeholder="VD: S001"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tên sách</Form.Label>
                <Form.Control
                  value={tenSach}
                  onChange={(e) => setTenSach(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tác giả</Form.Label>
                <Form.Control
                  value={tacGia}
                  onChange={(e) => setTacGia(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Label>Năm</Form.Label>
                <Form.Control
                  type="number"
                  value={namXuatBan}
                  onChange={(e) => setNamXuatBan(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  value={soLuong}
                  onChange={(e) => setSoLuong(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {loi && (
            <Alert variant="warning" className="mt-3">
              {loi}
            </Alert>
          )}

          <div className="d-flex gap-2 mt-3">
            <Button type="submit" disabled={dangXuLy}>
              {selected ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={resetForm}
              disabled={dangXuLy}
            >
              Reset
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SachForm;
