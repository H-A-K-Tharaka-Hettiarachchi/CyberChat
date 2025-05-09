/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Country;
import entity.User;
import entity.UserStatus;
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
@WebServlet(name = "SaveEmail", urlPatterns = {"/SaveEmail"})
public class SaveEmail extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("success", false);

        String countryId = requestJsonObject.get("country").getAsString();
        String mobile = requestJsonObject.get("mobile").getAsString();
        String email = requestJsonObject.get("email").getAsString();

        //get country from country id
        Country country = (Country) session.get(Country.class, Integer.valueOf(countryId));

        //get user
        Criteria criteria1 = session.createCriteria(User.class);
        //filter by mobile
        criteria1.add(Restrictions.eq("mobile", mobile));
        //filter by country
        criteria1.add(Restrictions.eq("country", country));
        //filter by email

        if (!criteria1.list().isEmpty()) {
            //add new email

            User user = (User) criteria1.uniqueResult();
            user.setEmail(email);
            user.setEmailOtp(requestJsonObject.get("emailOtp").getAsString());
            user.setMobile(mobile);
            user.setMobileOtp(requestJsonObject.get("mobileOtp").getAsString());
            user.setName(requestJsonObject.get("name").getAsString());
            user.setPassword("");

            //get user status 2 = offline
            UserStatus userStatus = (UserStatus) session.get(UserStatus.class, 2);
            user.setUserStatus(userStatus);

            user.setRegisteredDateTime(new Date());

            session.update(user);
            session.beginTransaction().commit();

            responseObject.addProperty("success", true);

        }

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));

        session.close();

    }
}
