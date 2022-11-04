package com.example.producingwebservice;

import io.spring.guides.gs_producing_web_service.Message;
import io.spring.guides.gs_producing_web_service.ObjectFactory;
import io.spring.guides.gs_producing_web_service.User;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.sql.*;
import java.util.GregorianCalendar;


public class DataBaseFunctions {

    static Db objConnectDb = new Db();
    static Connection connection = objConnectDb.getConnection();

    public static User[] listUsersDB() throws SQLException {
        User[] users = new User[checkTableSize()];
        PreparedStatement ps;
        int i=0;
        ResultSet rs = null;
        try{
            String query = "select *  from users";
            ps = connection.prepareStatement(query);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        while (rs.next()) {
            ObjectFactory objectFactory = new ObjectFactory();
            User newUser = objectFactory.createUser();
            newUser.setId(rs.getInt(1));
            newUser.setUsername(rs.getString(2));
            newUser.setPassword(rs.getString(3));
            newUser.setName(rs.getString(4));
            newUser.setSurname(rs.getString(5));

            XMLGregorianCalendar xmlDate =null;
            GregorianCalendar gc =new GregorianCalendar();
            gc.setTime(rs.getDate(6));
            try {
                xmlDate = DatatypeFactory.newInstance()
                        .newXMLGregorianCalendar(gc);
                newUser.setBirthdate(xmlDate);
            } catch (Exception e) {
                e.printStackTrace();
            }

            newUser.setGender(rs.getString(7));
            newUser.setIsActive(rs.getBoolean(8));
            newUser.setUsertype(rs.getString(9));
            newUser.setEmail(rs.getString(10));
            newUser.setAddress(rs.getString(11));
            users[i]=newUser;
            i=i+1;
        }
        return users;
    }

    public static void insertUser(User user) {
        PreparedStatement ps;
        try{
            String query = "insert into users(username,password,name,surname,birth_date,gender,is_active,user_type,email,address) " +
                    "values(?,?,?,?,?,?,?,?,?,?)";
            ps = connection.prepareStatement(query);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3,user.getName());
            ps.setString(4,user.getSurname());
            ps.setString(6,user.getGender());
            ps.setDate(5,new Date(user.getBirthdate().toGregorianCalendar().getTime().getTime()));
            ps.setBoolean(7,false);
            ps.setString(8,user.getUsertype().toString());
            ps.setString(9,user.getEmail());
            ps.setString(10,user.getAddress());
            ps.executeUpdate();
            ps.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static int checkTableSize() throws SQLException {
        PreparedStatement ps;
        ResultSet rs=null;
        try{
            String query = "select count(*) from users";
            ps = connection.prepareStatement(query);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        rs.next();
        return rs.getInt(1);
    }

    public static int checkMessageTableSize() throws SQLException {
        PreparedStatement ps;
        ResultSet rs=null;
        try{
            String query = "select count(*) from message";
            ps = connection.prepareStatement(query);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        rs.next();
        return rs.getInt(1);
    }

    public static void removeUserDB(String username){
        PreparedStatement ps;
        try{
            String query = "delete from users where username = ?";
            ps = connection.prepareStatement(query);
            ps.setString(1,username);
            ps.executeUpdate();
            ps.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void saveMessageToDB(Message message) {
        PreparedStatement ps;
        try{
            String query = "insert into message(send_to,sent_from,message) values(?,?,?)";
            ps = connection.prepareStatement(query);
            ps.setString(1, message.getTo());
            ps.setString(2, message.getFrom());
            ps.setString(3, message.getMessageBody());
            ps.executeUpdate();
            ps.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static Message[] getInboxDB(String username) throws SQLException {
        int size = checkMessageTableSize();
        Message[] inbox = new Message[size];
        int i=0;
        PreparedStatement ps;
        ResultSet rs = null;
        try{
            String query = "select *  from message where send_to = ?";
            ps = connection.prepareStatement(query);
            ps.setString(1,username);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        while (rs.next()) {
            Message msg = new Message();
            msg.setTo(rs.getString(1));
            msg.setFrom(rs.getString(2));
            msg.setMessageBody(rs.getString(3));
            inbox[i]=msg;
            i++;
        }
        if(size>(i)){
            Message[] result = new Message[i];
            System.arraycopy(inbox, 0, result, 0, i);
            return result;
        }
        return inbox;
    }

    public static Message[] getOutboxDB(String username) throws SQLException {
        int size = checkMessageTableSize();
        Message[] outbox = new Message[size];
        int i = 0;
        PreparedStatement ps;
        ResultSet rs = null;
        try{
            String query = "select *  from message where sent_from = ?";
            ps = connection.prepareStatement(query);
            ps.setString(1,username);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        while (rs.next()) {
            Message msg = new Message();
            msg.setTo(rs.getString(1));
            msg.setFrom(rs.getString(2));
            msg.setMessageBody(rs.getString(3));
            outbox[i]=msg;
            i++;
        }
        if(size>(i)){
            Message[] result = new Message[i];
            System.arraycopy(outbox, 0, result, 0, i);
            return result;
        }
        return outbox;
    }

    public static void updatePasswordDB(String username,String newPassword){
        PreparedStatement ps;
        try{
            String query = "update users set password = ? where username = ?";
            ps = connection.prepareStatement(query);
            ps.setString(1,newPassword);
            ps.setString(2,username);
            ps.executeUpdate();
            ps.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static boolean findUserByUsernameAndPassword(String username, String password) throws SQLException {
        PreparedStatement ps;
        ResultSet rs = null;
        try{
            String query = "select *  from users where username = ? and password = ?";
            ps = connection.prepareStatement(query);
            ps.setString(1,username);
            ps.setString(2,password);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return rs.next();
    }

    public static boolean findUserByUsername(String username) throws SQLException {
        PreparedStatement ps;
        ResultSet rs = null;
        try{
            String query = "select *  from users where username = ?";
            ps = connection.prepareStatement(query);
            ps.setString(1,username);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        assert rs != null;
        return rs.next();
    }

    public static boolean isAdmin(String username) throws SQLException {
        PreparedStatement ps;
        ResultSet rs = null;
        try{
            String query = "select *  from users where username = ?";
            ps = connection.prepareStatement(query);
            ps.setString(1,username);
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        assert rs != null;
        if(rs.next())return rs.getString(9).equals("admin");
        else return false;
    }
}
