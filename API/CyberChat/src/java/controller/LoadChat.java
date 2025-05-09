/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.ChatStatus;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "LoadChat", urlPatterns = {"/LoadChat"})
public class LoadChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

//        JsonObject responseObject = new JsonObject();
        //create hibernate session
        Session session = HibernateUtil.getSessionFactory().openSession();

        //get logged user mobile and other user mobile from request
        ///LoadChat?loggedUserMobile=762206166&&otherUserMobile=783808525
        String loggedUserMobile = request.getParameter("loggedUserMobile");
        String otherUserMobile = request.getParameter("otherUserMobile");

        //get logged user
        Criteria criteria1 = session.createCriteria(User.class);
        criteria1.add(Restrictions.eq("mobile", loggedUserMobile));
        User loggedUser = (User) criteria1.uniqueResult();

        //get other user
        Criteria criteria2 = session.createCriteria(User.class);
        criteria2.add(Restrictions.eq("mobile", otherUserMobile));
        User otherUser = (User) criteria2.uniqueResult();

        //get chats
        Criteria criteria3 = session.createCriteria(Chat.class);

        criteria3.add(Restrictions.or(
                Restrictions.and(
                        //msg from logged user sent to other user
                        Restrictions.eq("fromUser", loggedUser),
                        Restrictions.eq("toUser", otherUser)
                ),
                Restrictions.and(
                        //msg from other user sent to logged user
                        Restrictions.eq("fromUser", otherUser),
                        Restrictions.eq("toUser", loggedUser)
                )
        )
        );
    

        //sort chats
        criteria3.addOrder(Order.asc("dateTime"));

        //get chat list
        List<Chat> chatList = criteria3.list();

        //get chat status = 2 (seen)
        ChatStatus chatStatus = (ChatStatus) session.get(ChatStatus.class, 2);

        //create chat array
        JsonArray chatArray = new JsonArray();

        //create date time format
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd yyyy, hh:mm: a");

        //read chat list
        for (Chat chat : chatList) {

            //create chat item
            JsonObject chatItem = new JsonObject();

            //Start : -----------------------------------
            //Add data to chat item 
            chatItem.addProperty("message", chat.getMessage());
            System.out.println(chat.getMessage());
            chatItem.addProperty("dateTime", dateFormat.format(chat.getDateTime()));

            //get chat only from other user
            if (chat.getFromUser().getMobile().equals(otherUser.getMobile())) {

                //add side to chat object
                chatItem.addProperty("side", "left");

                //get only unseen chats (chatStatus = 1)
                if (chat.getChatStatus().getId() == 1) {
                    //update chat status ->seen
                    chat.setChatStatus(chatStatus);
                    session.update(chat);
                }

            } else {
                //get chat only sent by logged user

                //add side to chat object
                chatItem.addProperty("side", "right");
                chatItem.addProperty("status", chat.getChatStatus().getId());//1 =  unseen ,  2 =  seen
            }

            //add chat item to chat array
            chatArray.add(chatItem);

        }

//        responseObject.add("chatArray", chatArray);
        //update database
        session.beginTransaction().commit();
        session.close();

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(chatArray));

    }

}
