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
import model.Mail;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "SendEmailOtp", urlPatterns = {"/SendEmailOtp"})
public class SendEmailOtp extends HttpServlet {

   @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        String otp = generateOtp(); // Generate the OTP

        JsonObject userObject = new JsonObject();

        userObject.addProperty("mobile", requestJsonObject.get("mobile").getAsString());
        userObject.addProperty("country", requestJsonObject.get("country").getAsString());
        userObject.addProperty("countryCode", "+" + requestJsonObject.get("countryCode").getAsString());
        userObject.addProperty("name",  requestJsonObject.get("name").getAsString());
        userObject.addProperty("email", requestJsonObject.get("email").getAsString());
        userObject.addProperty("password", "");
        userObject.addProperty("emailOtp", otp);
        userObject.addProperty("mobileOtp", "");
        
         /*send verification email
                    start*/
                    Thread sendMailThread = new Thread() {
                        @Override
                        public void run() {
                            Mail.sendMail(requestJsonObject.get("email").getAsString(), "CyberChat OTP :" + otp,
                                    "<!DOCTYPE html>\n"
                                    + "<html lang=\"en\">\n"
                                    + "<head>\n"
                                    + "    <meta charset=\"UTF-8\">\n"
                                    + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
                                    + "    <title>Verification Code</title>\n"
                                    + "    <style>\n"
                                    + "        body {\n"
                                    + "            margin: 0;\n"
                                    + "            padding: 0;\n"
                                    + "            font-family: Arial, sans-serif;\n"
                                    + "            background-color: #f4f4f4;\n"
                                    + "        }\n"
                                    + "        .container {\n"
                                    + "            width: 100%;\n"
                                    + "            max-width: 600px;\n"
                                    + "            margin: auto;\n"
                                    + "            background-color: #ffffff;\n"
                                    + "            border-radius: 8px;\n"
                                    + "            overflow: hidden;\n"
                                    + "            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n"
                                    + "        }\n"
                                    + "        .header {\n"
                                    + "            background-color: #003366;\n"
                                    + "            padding: 20px;\n"
                                    + "            text-align: center;\n"
                                    + "            color: #ffffff;\n"
                                    + "        }\n"
                                    + "        .content {\n"
                                    + "            padding: 20px;\n"
                                    + "            text-align: center;\n"
                                    + "        }\n"
                                    + "        .code {\n"
                                    + "            font-size: 24px;\n"
                                    + "            font-weight: bold;\n"
                                    + "            color: #003366;\n"
                                    + "            margin: 20px 0;\n"
                                    + "        }\n"
                                    + "        .footer {\n"
                                    + "            background-color: #f4f4f4;\n"
                                    + "            padding: 20px;\n"
                                    + "            text-align: center;\n"
                                    + "            color: #666666;\n"
                                    + "            font-size: 14px;\n"
                                    + "        }\n"
                                    + "    </style>\n"
                                    + "</head>\n"
                                    + "<body>\n"
                                    + "    <div class=\"container\">\n"
                                    + "        <div class=\"header\">\n"
                                    + "            <h1>Verification Code</h1>\n"
                                    + "        </div>\n"
                                    + "        <div class=\"content\">\n"
                                    + "            <p>Hello,</p>\n"
                                    + "            <p>Thank you for registering with us. Please use the following code to verify your email address:</p>\n"
                                    + "            <div class=\"code\">\n"
                                    + "                " + otp + "\n"
                                    + "            </div>\n"
                                    + "            <p>If you did not request this, please ignore this email.</p>\n"
                                    + "        </div>\n"
                                    + "        <div class=\"footer\">\n"
                                    + "            <p>&copy; 2024 CyberChat. All rights reserved.</p>\n"
                                    + "        </div>\n"
                                    + "    </div>\n"
                                    + "</body>\n"
                                    + "</html>");
                        }

                    };
                    sendMailThread.start();
                    /*send verification email
                    end*/

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
