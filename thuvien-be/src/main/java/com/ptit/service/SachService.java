package com.ptit.service;

import com.ptit.entity.Sach;
import com.ptit.repository.ConnectMysql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.ptit.constants.Message.*;

public class SachService {
    public List<Sach> getAllSach() {
        Connection connect = null;
        Statement statement = null;
        ResultSet rs = null;
        List<Sach> list = new ArrayList<>();
        try {
            connect = ConnectMysql.getConnection();
            statement = connect.createStatement();

            String sql = "SELECT id, ma_sach, ten_sach, tac_gia, nam_xuat_ban, so_luong FROM sach ORDER BY id ASC";
            rs = statement.executeQuery(sql);

            while (rs.next()) {
                list.add(mapSach(rs));
            }
        } catch (SQLException e) {
            System.out.println(SACH_DANH_SACH_ERR);
            e.printStackTrace();
        } finally {
            closeQuietly(rs);
            closeQuietly(statement);
            if (connect != null) {
                ConnectMysql.closeConnection(connect);
            }
        }
        return list;
    }

    public Sach getSachById(long id) {
        Connection connect = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        Sach s = null;
        try {
            connect = ConnectMysql.getConnection();
            String sql = "SELECT id, ma_sach, ten_sach, tac_gia, nam_xuat_ban, so_luong FROM sach WHERE id = ?";
            ps = connect.prepareStatement(sql);
            ps.setLong(1, id);
            rs = ps.executeQuery();
            if (rs.next()) {
                s = mapSach(rs);
            }
        } catch (SQLException e) {
            System.out.println(SACH_INFO_ERR);
            e.printStackTrace();
        } finally {
            closeQuietly(rs);
            closeQuietly(ps);
            if (connect != null) {
                ConnectMysql.closeConnection(connect);
            }
        }
        return s;
    }

    public Sach getSachByMa(String maSach) {
        Connection connect = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        Sach s = null;
        try {
            connect = ConnectMysql.getConnection();
            String sql = "SELECT id, ma_sach, ten_sach, tac_gia, nam_xuat_ban, so_luong FROM sach WHERE ma_sach = ?";
            ps = connect.prepareStatement(sql);
            ps.setString(1, maSach);
            rs = ps.executeQuery();
            if (rs.next()) {
                s = mapSach(rs);
            }
        } catch (SQLException e) {
            System.out.println(SACH_INFO_ERR);
            e.printStackTrace();
        } finally {
            closeQuietly(rs);
            closeQuietly(ps);
            if (connect != null) {
                ConnectMysql.closeConnection(connect);
            }
        }
        return s;
    }

    public long createSach(Sach s) {
        Connection connect = null;
        PreparedStatement ps = null;
        ResultSet keys = null;
        long id = -1L;
        try {
            connect = ConnectMysql.getConnection();
            String sql = "INSERT INTO sach (ma_sach, ten_sach, tac_gia, nam_xuat_ban, so_luong) VALUES (?,?,?,?,?)";
            ps = connect.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, s.getMaSach());
            ps.setString(2, s.getTenSach());
            ps.setString(3, s.getTacGia());
            if (s.getNamXuatBan() == null) ps.setNull(4, Types.INTEGER); else ps.setInt(4, s.getNamXuatBan());
            ps.setInt(5, s.getSoLuong() == null ? 0 : s.getSoLuong());
            ps.executeUpdate();

            keys = ps.getGeneratedKeys();
            if (keys.next()) id = keys.getLong(1);
        } catch (SQLException e) {
            System.out.println(SACH_CREATED_ERR);
            e.printStackTrace();
        } finally {
            closeQuietly(keys);
            closeQuietly(ps);
            if (connect != null) {
                ConnectMysql.closeConnection(connect);
            }
        }
        return id;
    }

    public boolean updateSach(long id, Sach s) {
        Connection connect = null;
        PreparedStatement ps = null;
        boolean ok = false;
        try {
            connect = ConnectMysql.getConnection();
            String sql = "UPDATE sach SET ma_sach = ?, ten_sach = ?, tac_gia = ?, nam_xuat_ban = ?, so_luong = ? WHERE id = ?";
            ps = connect.prepareStatement(sql);
            ps.setString(1, s.getMaSach());
            ps.setString(2, s.getTenSach());
            ps.setString(3, s.getTacGia());
            if (s.getNamXuatBan() == null) ps.setNull(4, Types.INTEGER); else ps.setInt(4, s.getNamXuatBan());
            ps.setInt(5, s.getSoLuong() == null ? 0 : s.getSoLuong());
            ps.setLong(6, id);
            ok = ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println(SACH_UPDATED_ERR);
            e.printStackTrace();
        } finally {
            closeQuietly(ps);
            if (connect != null) {
                ConnectMysql.closeConnection(connect);
            }
        }
        return ok;
    }

    public boolean deleteSach(long id) {
        Connection connect = null;
        PreparedStatement ps = null;
        boolean ok = false;
        try {
            connect = ConnectMysql.getConnection();
            String sql = "DELETE FROM sach WHERE id = ?";
            ps = connect.prepareStatement(sql);
            ps.setLong(1, id);
            ok = ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println(SACH_DELETED_ERR);
            e.printStackTrace();
        } finally {
            closeQuietly(ps);
            if (connect != null) {
                ConnectMysql.closeConnection(connect);
            }
        }
        return ok;
    }

    private Sach mapSach(ResultSet rs) throws SQLException {
        Sach s = new Sach();
        s.setId(rs.getLong("id"));
        s.setMaSach(rs.getString("ma_sach"));
        s.setTenSach(rs.getString("ten_sach"));
        s.setTacGia(rs.getString("tac_gia"));
        int nx = rs.getInt("nam_xuat_ban");
        s.setNamXuatBan(rs.wasNull() ? null : nx);
        s.setSoLuong(rs.getInt("so_luong"));
        return s;
    }

    private void closeQuietly(AutoCloseable a) {
        if (a == null) return;
        try {
            a.close();
        } catch (Exception ignore) {
        }
    }
}
