/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.ChatStatus;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "SendChat", urlPatterns = {"/SendChat"})
public class SendChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        //create response object
        JsonObject responseJosn = new JsonObject();
        responseJosn.addProperty("success", false);

        //SendChat?loggedUserMobile=779276166&&otherUserMobile=762206166&&message=Hello
        Session session = HibernateUtil.getSessionFactory().openSession();

        String loggedUserMobile = request.getParameter("loggedUserMobile");
        String otherUserMobile = request.getParameter("otherUserMobile");
        String message = request.getParameter("message");

        //get logged user
        Criteria criteria1 = session.createCriteria(User.class);
        criteria1.add(Restrictions.eq("mobile", loggedUserMobile));
        User loggedUser = (User) criteria1.uniqueResult();

        //get other user
        Criteria criteria2 = session.createCriteria(User.class);
        criteria2.add(Restrictions.eq("mobile", otherUserMobile));
        User otherUser = (User) criteria2.uniqueResult();

        //get chat status = 1 (unseen)
        ChatStatus chatStatus = (ChatStatus) session.get(ChatStatus.class, 1);

        //save chat
        Chat chat = new Chat();
        chat.setChatStatus(chatStatus);
        chat.setDateTime(new Date());
        chat.setFromUser(loggedUser);
        chat.setToUser(otherUser);
        chat.setMessage(message);

        session.save(chat);
        try {
            session.beginTransaction().commit();
            responseJosn.addProperty("success", true);
            session.close();

            //send response
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJosn));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
