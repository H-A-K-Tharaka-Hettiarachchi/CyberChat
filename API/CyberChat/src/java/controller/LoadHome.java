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
import entity.UserStatus;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
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
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "LoadHome", urlPatterns = {"/LoadHome"})
public class LoadHome extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        //response json object
        JsonObject responsejson = new JsonObject();

        //success false
        responsejson.addProperty("success", false);

        try {

            //create hibernate session
            Session session = HibernateUtil.getSessionFactory().openSession();

            //get logged user mobile from request
            String userMobile = request.getParameter("mobile");

            //search logged user by mobile
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("mobile", userMobile));

            System.out.println(userMobile);

//            User loggedUser = (User) criteria1.list().get(0);
            User loggedUser = (User) criteria1.uniqueResult();

            //search other user
            Criteria criteria2 = session.createCriteria(User.class);
            criteria2.add(Restrictions.ne("mobile", loggedUser.getMobile()));

            //get chat status 1=(delivered)
            ChatStatus chatStatus = (ChatStatus) session.get(ChatStatus.class, 1);

            //get all other users
            List<User> otherUserList = criteria2.list();

            //create array for store other all user's chats
            JsonArray chatArray = new JsonArray();

            //read all other users
            for (User otherUser : otherUserList) {

                //Start : ------------------------------------------
                //Get Caht List wise one user
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

                criteria3.addOrder(Order.desc("dateTime"));
                criteria3.setMaxResults(1);
                //Get Caht List wise one user
                //End : ------------------------------------------

                //Start : ------------------------------------------
                // Get count of Unseen Messages
                Criteria criteri4 = session.createCriteria(Chat.class);
                criteri4.add(
                        Restrictions.and(
                                //msg from other user sent to logged user
                                Restrictions.eq("fromUser", otherUser),
                                Restrictions.eq("toUser", loggedUser)
                        )
                );
                criteri4.add(Restrictions.eq("chatStatus", chatStatus));
                criteri4.setProjection(Projections.rowCount());

                Long countResult = (Long) criteri4.uniqueResult();
                String chatCount = String.valueOf(countResult);
               
                // Get count of Unseen Messages
                //End : ------------------------------------------

                //create object for store one chat row data
                JsonObject chatItem = new JsonObject();

                //Start : ----------------------------
                //storing other user's data
                chatItem.addProperty("otherUserMobile", otherUser.getMobile());// other user mobile
                chatItem.addProperty("otherUserName", otherUser.getName());//other user name
                chatItem.addProperty("otherUserStatusId", otherUser.getUserStatus().getId());//other user status

                //get application path
                String applicationPath = request.getServletContext().getRealPath("");//default path
                //path of profile pictures storing
                String newApplicationPath = applicationPath.replace("build" + File.separator + "web", "web");//my path
                //making path of user's profile image stored
                String profileImagePath = newApplicationPath + File.separator //my path
                        + "profile-images" + File.separator //main folder
                        + "profile" + otherUser.getMobile()//unique user's folder
                        + File.separator + "image" + otherUser.getMobile() + ".png";//image file

                //creating new file
                File profileImageFile = new File(profileImagePath);
                // check the image file already exists or not
                if (profileImageFile.exists()) {
                    //image found
                    chatItem.addProperty("profileImageFound", true);
                } else {
                    //image not found
                    chatItem.addProperty("profileImageFound", false);
                }
                //storing other user's data
                //End : ----------------------------

                //storing other user's chat data
                //Start : ----------------------------
                //get chat list early searched
                List<Chat> chatList = criteria3.list();

                //check chats available or not
                if (chatList.isEmpty()) {
                    //chats not available

                    chatItem.addProperty("message", "Say Hello!");
                    chatItem.addProperty("dateTime", "");
                    chatItem.addProperty("chatStatusId", 0);//msg sent by logged user
                    chatItem.addProperty("chatCount", 0);

                } else {
                    //chats available

                    // Define time and date formats to display results
                    SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MMM/yyyy ");
                    SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm a");

                    //Start : ------------------------------------
                    //create msg date time formats
                    Calendar today = Calendar.getInstance(); // Example: "12/10/2024"
                    Calendar yesterday = Calendar.getInstance();
                    yesterday.add(Calendar.DAY_OF_YEAR, -1); // Example: "11/10/2024"

                    Calendar chatCalendar = Calendar.getInstance();
                    chatCalendar.setTime(chatList.get(0).getDateTime()); // Example chat date: "11/10/2024"

                    if (chatCalendar.get(Calendar.YEAR) == today.get(Calendar.YEAR)
                            && chatCalendar.get(Calendar.DAY_OF_YEAR) == today.get(Calendar.DAY_OF_YEAR)) {

                        chatItem.addProperty("dateTime", timeFormat.format(chatCalendar.getTime())); // Example: "15:30"

                    } else if (chatCalendar.get(Calendar.YEAR) == yesterday.get(Calendar.YEAR)
                            && chatCalendar.get(Calendar.DAY_OF_YEAR) == yesterday.get(Calendar.DAY_OF_YEAR)) {

                        chatItem.addProperty("dateTime", "Yesterday"); // Example: "Yesterday"
                    } else {
                        chatItem.addProperty("dateTime", dateFormat.format(chatCalendar.getTime())); // Example: "11/10/2024"
                    }
                    //create msg date time formats
                    //End : ------------------------------------

                    //Start : ------------------------------------
                    //storing chat data
                    chatItem.addProperty("message", chatList.get(0).getMessage());
                    
                    //check from msg or sent msg
                    if (chatList.get(0).getFromUser() == otherUser) {
                        chatItem.addProperty("chatStatusId", 0);
                    } else {
                        chatItem.addProperty("chatStatusId", chatList.get(0).getChatStatus().getId());
                    }

                    if (chatCount.isEmpty()) {
                        chatItem.addProperty("chatCount", 0);
                    } else {
                        chatItem.addProperty("chatCount", chatCount);
                    }

                    //storing chat data
                    //End : ------------------------------------
                }

                chatArray.add(chatItem);
            }

            responsejson.addProperty("success", true);

            responsejson.addProperty("chatArray", gson.toJson(chatArray));
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responsejson));

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
