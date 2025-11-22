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
  const [errors, setErrors] = useState({
    maSach: "",
    tenSach: "",
    tacGia: "",
    namXuatBan: "",
    soLuong: ""
  });
  const [touched, setTouched] = useState({
    maSach: false,
    tenSach: false,
    tacGia: false,
    namXuatBan: false,
    soLuong: false
  });

  useEffect(() => {
    if (selected) {
      setMaSach(selected.maSach || "");
      setTenSach(selected.tenSach || "");
      setTacGia(selected.tacGia || "");
      setNamXuatBan(selected.namXuatBan ?? "");
      setSoLuong(selected.soLuong ?? 0);
      setLoi("");
      setErrors({
        maSach: "",
        tenSach: "",
        tacGia: "",
        namXuatBan: "",
        soLuong: ""
      });
      setTouched({
        maSach: false,
        tenSach: false,
        tacGia: false,
        namXuatBan: false,
        soLuong: false
      });
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
    setErrors({
      maSach: "",
      tenSach: "",
      tacGia: "",
      namXuatBan: "",
      soLuong: ""
    });
    setTouched({
      maSach: false,
      tenSach: false,
      tacGia: false,
      namXuatBan: false,
      soLuong: false
    });
  }

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "maSach":
        if (!value.trim()) {
          error = "Mã sách không được để trống";
        }
        break;
      case "tenSach":
        if (!value.trim()) {
          error = "Tên sách không được để trống";
        }
        break;
      case "tacGia":
        if (!value.trim()) {
          error = "Tác giả không được để trống";
        }
        break;
      case "namXuatBan":
        if (value && (Number(value) < 1800 || Number(value) > new Date().getFullYear())) {
          error = `Năm xuất bản phải từ 1800 đến ${new Date().getFullYear()}`;
        }
        break;
      case "soLuong":
        if (value && Number(value) < 1) {
          error = "Số lượng phải lớn hơn 0";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const value = { maSach, tenSach, tacGia, namXuatBan, soLuong }[field];
    const error = validateField(field, value);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "maSach":
        setMaSach(value);
        break;
      case "tenSach":
        setTenSach(value);
        break;
      case "tacGia":
        setTacGia(value);
        break;
      case "namXuatBan":
        setNamXuatBan(value);
        break;
      case "soLuong":
        setSoLuong(value);
        break;
      default:
        break;
    }
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  function thucHienSubmit(e) {
    e.preventDefault();
    
    // Validate tất cả các trường
    const newErrors = {
      maSach: validateField("maSach", maSach),
      tenSach: validateField("tenSach", tenSach),
      tacGia: validateField("tacGia", tacGia),
      namXuatBan: validateField("namXuatBan", namXuatBan),
      soLuong: validateField("soLuong", soLuong)
    };
    
    setErrors(newErrors);
    setTouched({
      maSach: true,
      tenSach: true,
      tacGia: true,
      namXuatBan: true,
      soLuong: true
    });

    // Kiểm tra nếu có lỗi
    if (Object.values(newErrors).some(error => error !== "")) {
      setLoi("Vui lòng kiểm tra lại các trường bắt buộc");
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
    <Card className="mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}>
      <Card.Header style={{ background: 'linear-gradient(135deg, #3A5BA0 0%, #2C4A85 100%)', color: 'white', borderRadius: '15px 15px 0 0', padding: '15px 20px' }}>
        <h5 className="mb-0">
          {selected ? '✏️ Cập nhật thông tin sách' : '➕ Thêm sách mới'}
        </h5>
      </Card.Header>
      <Card.Body style={{ padding: '25px' }}>
        <Form onSubmit={thucHienSubmit}>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>🏷️ Mã sách</Form.Label>
                <Form.Control
                  value={maSach}
                  onChange={(e) => handleChange("maSach", e.target.value)}
                  onBlur={() => handleBlur("maSach")}
                  placeholder="VD: S001"
                  isInvalid={touched.maSach && errors.maSach}
                  style={{ borderRadius: '8px', border: touched.maSach && errors.maSach ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                />
                {touched.maSach && errors.maSach && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {errors.maSach}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>📖 Tên sách</Form.Label>
                <Form.Control
                  value={tenSach}
                  onChange={(e) => handleChange("tenSach", e.target.value)}
                  onBlur={() => handleBlur("tenSach")}
                  placeholder="Nhập tên sách"
                  isInvalid={touched.tenSach && errors.tenSach}
                  style={{ borderRadius: '8px', border: touched.tenSach && errors.tenSach ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                />
                {touched.tenSach && errors.tenSach && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {errors.tenSach}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>✍️ Tác giả</Form.Label>
                <Form.Control
                  value={tacGia}
                  onChange={(e) => handleChange("tacGia", e.target.value)}
                  onBlur={() => handleBlur("tacGia")}
                  placeholder="Nhập tên tác giả"
                  isInvalid={touched.tacGia && errors.tacGia}
                  style={{ borderRadius: '8px', border: touched.tacGia && errors.tacGia ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                />
                {touched.tacGia && errors.tacGia && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {errors.tacGia}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>📅 Năm</Form.Label>
                <Form.Control
                  type="number"
                  value={namXuatBan}
                  onChange={(e) => handleChange("namXuatBan", e.target.value)}
                  onBlur={() => handleBlur("namXuatBan")}
                  placeholder="2024"
                  min="1800"
                  max={new Date().getFullYear()}
                  isInvalid={touched.namXuatBan && errors.namXuatBan}
                  style={{ borderRadius: '8px', border: touched.namXuatBan && errors.namXuatBan ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                />
                {touched.namXuatBan && errors.namXuatBan && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block', fontSize: '0.7rem' }}>
                    {errors.namXuatBan}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>📊 SL</Form.Label>
                <Form.Control
                  type="number"
                  value={soLuong}
                  onChange={(e) => handleChange("soLuong", e.target.value)}
                  onBlur={() => handleBlur("soLuong")}
                  placeholder="1"
                  isInvalid={touched.soLuong && errors.soLuong}
                  style={{ borderRadius: '8px', border: touched.soLuong && errors.soLuong ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                />
                {touched.soLuong && errors.soLuong && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block', fontSize: '0.7rem' }}>
                    {errors.soLuong}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-3">
            <Button 
              type="submit" 
              disabled={dangXuLy}
              style={{ 
                borderRadius: '25px', 
                paddingLeft: '25px', 
                paddingRight: '25px',
                background: 'linear-gradient(135deg, #3A5BA0 0%, #2C4A85 100%)',
                border: 'none',
                fontWeight: '600'
              }}
            >
              {selected ? '💾 Cập nhật' : '➕ Thêm mới'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={resetForm}
              disabled={dangXuLy}
              style={{ 
                borderRadius: '25px', 
                paddingLeft: '25px', 
                paddingRight: '25px',
                fontWeight: '600'
              }}
            >
              🔄 Reset
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SachForm;
