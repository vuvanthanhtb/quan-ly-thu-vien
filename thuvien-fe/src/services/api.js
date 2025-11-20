const API_ROOT = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function methodRequest(endpoint, opts = {}) {
  try {
    const res = await fetch(API_ROOT + endpoint, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    const data = await res.json();
     if (!res.ok) {
      const msg =
        data?.message ||
        `Lỗi ${res.status}: ${res.statusText || "Máy chủ phản hồi không hợp lệ"}`;
      throw new Error(msg);
    }
    return data;
  } catch (e) {
    throw new Error(e.message || "Lỗi kết nối đến máy chủ");
  }
}

export const apiSach = {
  getAllBooks: () => methodRequest("/api/sach"),
  hanndleCreate: (payload) =>
    methodRequest("/api/sach", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  hanndleUpdate: (id, payload) =>
    methodRequest(`/api/sach/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  onDelete: (id) => methodRequest(`/api/sach/${id}`, { method: "DELETE" }),
};
