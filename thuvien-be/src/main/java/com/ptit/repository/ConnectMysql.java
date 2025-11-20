package com.ptit.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import static com.ptit.constants.Message.*;

public class ConnectMysql {
    private static final String URL = "jdbc:mysql://localhost:3306/thuvien";
    private static final String USER = "root";
    private static final String PASSWORD = "root";

    public static Connection getConnection() {
        Connection connect = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            connect = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println(CONN_SUCCESS);

        } catch (SQLException | ClassNotFoundException e) {
            System.out.println(CONN_ERR);
            e.printStackTrace();
        }
        return connect;
    }

    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
                System.out.println(CONN_CLOSED);
            } catch (SQLException e) {
                System.out.println(CONN_ERR);
                e.printStackTrace();
            }
        }
    }
}
