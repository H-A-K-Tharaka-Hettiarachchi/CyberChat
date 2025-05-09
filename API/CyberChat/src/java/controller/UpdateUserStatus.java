/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.UserStatus;
import java.io.IOException;
import java.io.PrintWriter;
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
@WebServlet(name = "UpdateUserStatus", urlPatterns = {"/UpdateUserStatus"})
public class UpdateUserStatus extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {
            Gson gson = new Gson();

            //response json object
            JsonObject responsejson = new JsonObject();

            //success false
            responsejson.addProperty("success", false);

            //create hibernate session
            Session session = HibernateUtil.getSessionFactory().openSession();

            //get logged user mobile from request
            String userMobile = request.getParameter("mobile");
            String status = request.getParameter("status");

            //search logged user by mobile
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("mobile", userMobile));

            User user = (User) criteria1.uniqueResult();

            if (status.equals("online")) {
                //get user status 1=(online)
                UserStatus userStatus = (UserStatus) session.get(UserStatus.class, 1);
                user.setUserStatus(userStatus);
                responsejson.addProperty("success", true);
                responsejson.addProperty("msg", "Online");
            } else {
                //get user status 2=(offline)
                UserStatus userStatus = (UserStatus) session.get(UserStatus.class, 2);
                user.setUserStatus(userStatus);
                responsejson.addProperty("success", true);
                responsejson.addProperty("msg", "Offline");
            }

            //update user status
            session.update(user);
            session.beginTransaction().commit();

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responsejson));

            session.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
