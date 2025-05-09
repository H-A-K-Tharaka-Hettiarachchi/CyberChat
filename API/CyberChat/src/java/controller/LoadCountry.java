/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Country;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "LoadCountry", urlPatterns = {"/LoadCountry"})
public class LoadCountry extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();

        Criteria criteria = session.createCriteria(Country.class);

        //create chat array
        JsonArray countryArray = new JsonArray();

        List<Country> countryList = criteria.list();

        for (Country country : countryList) {

            //create chat object
            JsonObject countryObject = new JsonObject();
            countryObject.addProperty("id", country.getId());
            countryObject.addProperty("code", country.getCode());
            countryObject.addProperty("name", country.getCountry());

            //get chat only from other user
            //add chat pbject onto chat array
            countryArray.add(countryObject);
        }

        session.close();

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(countryArray));

    }

}
