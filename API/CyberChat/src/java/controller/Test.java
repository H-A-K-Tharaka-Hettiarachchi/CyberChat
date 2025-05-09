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
@WebServlet(name = "Test", urlPatterns = {"/Test"})
public class Test extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responsejson = new JsonObject();
        responsejson.addProperty("success", false);

        try {

            Session session = HibernateUtil.getSessionFactory().openSession();

            String userMobile = request.getParameter("mobile");

            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.ne("mobile", userMobile));

            User user = (User) criteria.uniqueResult();

            //get user status 1=(online)
            UserStatus userStatus = (UserStatus) session.get(UserStatus.class, 1);

            //update user status
            user.setUserStatus(userStatus);
            session.update(user);

            //get other user
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.ne("mobile", user.getMobile()));

            //get chat status 1=(delivered)
            ChatStatus chatStatus = (ChatStatus) session.get(ChatStatus.class, 1);

            List<User> otherUserList = criteria.list();

            JsonArray jsonChatArray = new JsonArray();
            for (User otherUser : otherUserList) {

                //Get Caht List
                Criteria criteria2 = session.createCriteria(Chat.class);
                criteria2.add(Restrictions.or(
                        Restrictions.and(
                                Restrictions.eq("fromUser", user),
                                Restrictions.eq("toUser", otherUser)
                        ),
                        Restrictions.and(
                                Restrictions.eq("fromUser", otherUser),
                                Restrictions.eq("toUser", user)
                        )
                )
                );

                criteria2.addOrder(Order.desc("id"));
                criteria2.setMaxResults(1);

                // Create a separate criteria for counting
                Criteria countCriteria = session.createCriteria(Chat.class);
                countCriteria.add(Restrictions.or(
                        Restrictions.and(
                                Restrictions.eq("fromUser", user),
                                Restrictions.eq("toUser", otherUser)
                        ),
                        Restrictions.and(
                                Restrictions.eq("fromUser", otherUser),
                                Restrictions.eq("toUser", user)
                        )
                ));
                countCriteria.add(Restrictions.eq("chatStatus", chatStatus));

                countCriteria.setProjection(Projections.rowCount());

                Long countResult = (Long) countCriteria.uniqueResult();
                System.out.println("Result count: " + countResult);

                
                
                
                //create chat Item json to send front end data
                JsonObject jsonChatItem = new JsonObject();

                jsonChatItem.addProperty("otherUserId", otherUser.getId());
                jsonChatItem.addProperty("otherUserMobile", otherUser.getMobile());
                jsonChatItem.addProperty("otherUserName", otherUser.getName());
                jsonChatItem.addProperty("otherUserStatus", otherUser.getUserStatus().getId());

                String applicationPath = request.getServletContext().getRealPath("");
                String newApplicationPath = applicationPath.replace("build" + File.separator + "web", "web");
                String otherUserAvatarImagePath = newApplicationPath + File.separator + "profile-images" + File.separator + "profile" + otherUser.getMobile()
                        + File.separator + "image" + otherUser.getMobile() + ".png";

                File otherUserAvatarImageFile = new File(otherUserAvatarImagePath);

                if (otherUserAvatarImageFile.exists()) {
                    //image found
                    jsonChatItem.addProperty("profileImageFound", true);
                } else {
                    //image not found
                    jsonChatItem.addProperty("profileImageFound", false);
                }

                //get chat list
                List<Chat> dbChatList = criteria2.list();

                // Define time and date formats to display results
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MMM/yyyy ");
                SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm a");

                if (dbChatList.isEmpty()) {
                    //No Conversation
                    jsonChatItem.addProperty("message", "");
                    jsonChatItem.addProperty("dateTime", "");
                    jsonChatItem.addProperty("chatStatusId", 2);//Seen
                    jsonChatItem.addProperty("chatCount", "");

                } else {
                    //Found Conversation

                    Calendar today = Calendar.getInstance(); // Example: "12/10/2024"
                    Calendar yesterday = Calendar.getInstance();
                    yesterday.add(Calendar.DAY_OF_YEAR, -1); // Example: "11/10/2024"

                    Calendar chatCalendar = Calendar.getInstance();
                    chatCalendar.setTime(dbChatList.get(0).getDateTime()); // Example chat date: "11/10/2024"

                    if (chatCalendar.get(Calendar.YEAR) == today.get(Calendar.YEAR)
                            && chatCalendar.get(Calendar.DAY_OF_YEAR) == today.get(Calendar.DAY_OF_YEAR)) {

                        jsonChatItem.addProperty("dateTime", timeFormat.format(chatCalendar.getTime())); // Example: "15:30"

                    } else if (chatCalendar.get(Calendar.YEAR) == yesterday.get(Calendar.YEAR)
                            && chatCalendar.get(Calendar.DAY_OF_YEAR) == yesterday.get(Calendar.DAY_OF_YEAR)) {

                        jsonChatItem.addProperty("dateTime", "Yesterday"); // Example: "Yesterday"

                    } else {

                        jsonChatItem.addProperty("dateTime", dateFormat.format(chatCalendar.getTime())); // Example: "11/10/2024"
                    }

                    jsonChatItem.addProperty("message", dbChatList.get(0).getMessage());
//                    jsonChatItem.addProperty("dateTime", dateFormat.format(dbChatList.get(0).getDateTime()));
                    jsonChatItem.addProperty("chatStatusId", dbChatList.get(0).getChatStatus().getId());
                    jsonChatItem.addProperty("chatCount", countResult);
                }

                //Get Caht Lst
                jsonChatArray.add(jsonChatItem);

            }

            responsejson.addProperty("success", true);

            responsejson.addProperty("jsonChatArray", gson.toJson(jsonChatArray));

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responsejson));
            //response.getWriter().write(gson.toJson(responsejson));

            session.beginTransaction().commit();
            session.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
