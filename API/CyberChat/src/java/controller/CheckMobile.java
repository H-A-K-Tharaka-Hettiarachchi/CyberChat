/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Country;
import entity.User;
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
@WebServlet(name = "CheckMobile", urlPatterns = {"/CheckMobile"})
public class CheckMobile extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();

        //country id
        String countryId = request.getParameter("cid");
        //mobile
        String mobile = request.getParameter("mobile");

        //get country from country id
        Country country = (Country) session.get(Country.class, Integer.valueOf(countryId));

        //get user
        Criteria criteria1 = session.createCriteria(User.class);
        //filter by mobile
        criteria1.add(Restrictions.eq("mobile", mobile));
        //filter by country
        criteria1.add(Restrictions.eq("country", country));

        JsonObject userObject = new JsonObject();

        if (criteria1.list().isEmpty()) {
            //register new user

            userObject.addProperty("mobile", mobile);
            userObject.addProperty("country", country.getId());
            userObject.addProperty("countryCode", country.getCode());
            userObject.addProperty("name", "");
            userObject.addProperty("email", "");
            userObject.addProperty("password", "");
            userObject.addProperty("emailOtp", "");
            userObject.addProperty("mobileOtp", "");

        } else {
            //loggin user

            User user = (User) criteria1.uniqueResult();

            userObject.addProperty("mobile", user.getMobile());
            userObject.addProperty("country", user.getCountry().getId());
            userObject.addProperty("countryCode", user.getCountry().getCode());
            userObject.addProperty("name", user.getName());
            userObject.addProperty("email", user.getEmail());
            userObject.addProperty("password", user.getPassword());
            userObject.addProperty("emailOtp", user.getEmailOtp());
            userObject.addProperty("mobileOtp", user.getMobileOtp());
            
            System.out.println(user.getEmail());
            
        }

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(userObject));

        session.close();
    }

}
