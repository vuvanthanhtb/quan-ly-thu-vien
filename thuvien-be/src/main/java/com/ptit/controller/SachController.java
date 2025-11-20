package com.ptit.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ptit.entity.Sach;
import com.ptit.service.SachService;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;

import static com.ptit.constants.Message.*;

public class SachController {
    private final SachService sachService = new SachService();
    private final Gson gson = new GsonBuilder().serializeNulls().create();

    // GET /api/sach
    public void danhSach(HttpExchange ex) throws IOException {
        responseResult(ex, 200, sachService.getAllSach());
    }

    // GET /api/sach/{id}
    public void chiTiet(HttpExchange ex, long id) throws IOException {
        Sach s = sachService.getSachById(id);
        if (s == null) {
            responseResult(ex, 404, Map.of("tb", KHONG_TIM_THAY));
            return;
        }
        responseResult(ex, 200, s);
    }

    // POST /api/sach
    public void taoMoi(HttpExchange ex) throws IOException {
        Sach s = docBody(ex, Sach.class);
        if (s == null || rong(s.getMaSach()) || rong(s.getTenSach()) || rong(s.getTacGia())) {
            responseResult(ex, 400, Map.of("tb", THIEU_TRUONG));
            return;
        }
        if (sachService.getSachByMa(s.getMaSach()) != null) {
            responseResult(ex, 409, Map.of("tb", MA_TRUNG));
            return;
        }
        long id = sachService.createSach(s);
        s.setId(id);
        responseResult(ex, 201, s);
    }

    // PUT /api/sach/{id}
    public void capNhat(HttpExchange ex, long id) throws IOException {
        if (sachService.getSachById(id) == null) {
            responseResult(ex, 404, Map.of("tb", KHONG_TIM_THAY));
            return;
        }
        Sach s = docBody(ex, Sach.class);
        if (s == null || rong(s.getMaSach()) || rong(s.getTenSach()) || rong(s.getTacGia())) {
            responseResult(ex, 400, Map.of("tb", THIEU_TRUONG));
            return;
        }
        Sach trung = sachService.getSachByMa(s.getMaSach());
        if (trung != null && !Objects.equals(trung.getId(), id)) {
            responseResult(ex, 409, Map.of("tb", MA_TRUNG));
            return;
        }
        boolean ok = sachService.updateSach(id, s);
        if (ok) responseResult(ex, 200, sachService.getSachById(id));
        else responseResult(ex, 500, Map.of("tb", LOI_CHUNG));
    }

    // DELETE /api/sach/{id}
    public void xoa(HttpExchange ex, long id) throws IOException {
        if (sachService.getSachById(id) == null) {
            responseResult(ex, 404, Map.of("tb", KHONG_TIM_THAY));
            return;
        }
        boolean ok = sachService.deleteSach(id);
        responseResult(ex, ok ? 200 : 500, Map.of("tb", ok ? DA_XOA : LOI_CHUNG));
    }

    // ---- tiện ích I/O ----
    private <T> T docBody(HttpExchange ex, Class<T> kieu) throws IOException {
        try (InputStream is = ex.getRequestBody(); Reader r = new InputStreamReader(is, StandardCharsets.UTF_8)) {
            return gson.fromJson(r, kieu);
        }
    }

    private void responseResult(HttpExchange ex, int ma, Object duLieu) throws IOException {
        byte[] b = gson.toJson(duLieu).getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        ex.sendResponseHeaders(ma, b.length);
        try (OutputStream o = ex.getResponseBody()) {
            o.write(b);
        }
    }

    private boolean rong(String s) {
        return s == null || s.isBlank();
    }
}
