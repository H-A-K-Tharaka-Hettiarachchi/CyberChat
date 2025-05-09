/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "SendMobileOtp", urlPatterns = {"/SendMobileOtp"})
public class SendMobileOtp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        String otp = generateOtp(); // Generate the OTP

        JsonObject userObject = new JsonObject();

        userObject.addProperty("mobile", requestJsonObject.get("mobile").getAsString());
        userObject.addProperty("country", requestJsonObject.get("country").getAsString());
        userObject.addProperty("countryCode", "+" + requestJsonObject.get("countryCode").getAsString());
        userObject.addProperty("name", "");
        userObject.addProperty("email", "");
        userObject.addProperty("password", "");
        userObject.addProperty("emailOtp", "");
        userObject.addProperty("mobileOtp", otp);

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(userObject));

    }

    private String generateOtp() {
        // Generate a random 6-digit OTP
        int otp = (int) (Math.random() * 900000) + 100000; // Generates a 6-digit OTP
        return String.valueOf(otp);
    }
}
