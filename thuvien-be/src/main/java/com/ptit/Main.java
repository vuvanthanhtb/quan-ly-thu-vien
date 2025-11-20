package com.ptit;

import com.ptit.controller.SachController;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.ptit.constants.Message.METHOD_NOT_ALLOWED;
import static com.ptit.constants.Message.NOT_FOUND;

public class Main {
    public static void main(String[] args) throws Exception {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        startServer(port);
        System.out.println("Server chay tai http://localhost:" + port);
    }

    private static void startServer(int port) throws IOException {
        HttpServer srv = HttpServer.create(new InetSocketAddress(port), 0);
        SachController ctrl = new SachController();

        srv.createContext("/api/sach", ex -> {
            try {
                addCorsHeaders(ex);
                if (ex.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                    ex.sendResponseHeaders(204, -1);
                    return;
                }

                String path = ex.getRequestURI().getPath();
                String method = ex.getRequestMethod();

                if ("GET".equals(method) && path.equals("/api/sach")) {
                    ctrl.danhSach(ex);
                    return;
                }
                if ("POST".equals(method) && path.equals("/api/sach")) {
                    ctrl.taoMoi(ex);
                    return;
                }

                Matcher m = Pattern.compile("^/api/sach/([0-9]+)$").matcher(path);
                if (m.matches()) {
                    long id = Long.parseLong(m.group(1));
                    switch (method) {
                        case "GET" -> ctrl.chiTiet(ex, id);
                        case "PUT" -> ctrl.capNhat(ex, id);
                        case "DELETE" -> ctrl.xoa(ex, id);
                        default -> methodNotAllowed(ex);
                    }
                    return;
                }
                notFound(ex);
            } finally {
                ex.close();
            }
        });

        srv.setExecutor(null);
        srv.start();
    }

    private static void notFound(HttpExchange ex) throws IOException {
        byte[] b = NOT_FOUND.getBytes();
        ex.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        ex.sendResponseHeaders(404, b.length);
        ex.getResponseBody().write(b);
    }

    private static void methodNotAllowed(HttpExchange ex) throws IOException {
        byte[] b = METHOD_NOT_ALLOWED.getBytes();
        ex.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        ex.sendResponseHeaders(405, b.length);
        ex.getResponseBody().write(b);
    }

    private static void addCorsHeaders(HttpExchange ex) {
        ex.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        ex.getResponseHeaders().add("Access-Control-Max-Age", "86400");
    }
}
