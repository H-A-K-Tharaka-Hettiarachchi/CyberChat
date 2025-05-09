/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
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
@WebServlet(name = "CheckEmail", urlPatterns = {"/CheckEmail"})
public class CheckEmail extends HttpServlet {

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
        criteria1.add(Restrictions.and(
                Restrictions.ne("mobile", mobile),
//                Restrictions.ne("country", country),
                Restrictions.eq("email", email)
        ));
        //filter by country
//        criteria1.add();
        //filter by email
//        criteria1.add();

        if (criteria1.list().isEmpty()) {

            System.out.println(mobile);
           
            System.out.println(email);
            //add new email
            responseObject.addProperty("success", true);
            responseObject.addProperty("msg", "new");
           
        } else {
            //already using email

            //check another  user using this email
            //  Criteria criteria2 = session.createCriteria(User.class);
            //filter by mobile
            //  criteria2.add(Restrictions.ne("mobile", mobile));
            //filter by country
            //  criteria2.add(Restrictions.ne("country", country));
            //filter by email
            //  criteria2.add(Restrictions.eq("email", email));
            //  if (!criteria2.list().isEmpty()) {
            //already using  email another user
            responseObject.addProperty("success", true);
            responseObject.addProperty("msg", "using");
          
            //  }

        }

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));

        session.close();

    }

}
