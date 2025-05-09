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
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        String mobile = request.getParameter("mobile");
        String name = request.getParameter("name");
        String countryId = request.getParameter("country");
        String mobileOtp = request.getParameter("mobileOtp");
        String email = request.getParameter("email");
        String emailOtp = request.getParameter("emailOtp");

        Part profileImage = request.getPart("profileImage");

        JsonObject requestJsonObject = gson.fromJson(request.getParameter("user"), JsonObject.class);

        Session session = HibernateUtil.getSessionFactory().openSession();

        //search user from mobile number 
        Criteria criteria1 = session.createCriteria(User.class);
        criteria1.add(Restrictions.eq("mobile", mobile));

        if (!criteria1.list().isEmpty()) {
            //mobile number already used

            //search country
            Criteria criteria3 = session.createCriteria(Country.class);
            criteria3.add(Restrictions.eq("id", Integer.valueOf(countryId)));

            if (!criteria3.list().isEmpty()) {

                Country country = (Country) criteria3.uniqueResult();

                User user = (User) criteria1.uniqueResult();
                user.setCountry(country);
                user.setEmail(email);
                user.setEmailOtp(emailOtp);
                user.setMobile(mobile);
                user.setMobileOtp(mobileOtp);
                user.setName(name);
                user.setPassword("");

                //get user status 2 = offline
                UserStatus userStatus = (UserStatus) session.get(UserStatus.class, 2);
                user.setUserStatus(userStatus);

                user.setRegisteredDateTime(new Date());

                session.update(user);
                session.beginTransaction().commit();

                //check image
                if (profileImage != null) {
                    //image selected

                    //get application real path
                    String applicationPath = request.getServletContext().getRealPath("");
                    //change the directry and make new one
                    String newApplicationPath = applicationPath.replace("build" + File.separator + "web", "web");

                    //create common folder for store profile images
                    File mainFolder = new File(newApplicationPath + "//profile-images//");
                    //create inner folder wise user
                    File userFolder = new File(newApplicationPath + "//profile-images//profile" + mobile);
                    //save the folders
                    mainFolder.mkdir();
                    userFolder.mkdir();

                    //save image in created folder
                    File file1 = new File(userFolder, "image" + mobile + ".png");
                    InputStream inputStream1 = profileImage.getInputStream();
                    Files.copy(inputStream1, file1.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
                responseJson.addProperty("success", true);

            } 

            }else {

                //search country
                Criteria criteria2 = session.createCriteria(Country.class);
                criteria2.add(Restrictions.eq("id", Integer.valueOf(countryId)));

                if (!criteria2.list().isEmpty()) {

                    Country country = (Country) criteria2.uniqueResult();

                    User user = new User();
                    user.setCountry(country);
                    user.setEmail("");
                    user.setEmailOtp("");
                    user.setMobile(mobile);
                    user.setMobileOtp(mobileOtp);
                    user.setName(name);
                    user.setPassword("");

                    //get user status 2 = offline
                    UserStatus userStatus = (UserStatus) session.get(UserStatus.class, 2);
                    user.setUserStatus(userStatus);

                    user.setRegisteredDateTime(new Date());

                    session.save(user);
                    session.beginTransaction().commit();

                    //check image
                    if (profileImage != null) {
                        //image selected

                        //get application real path
                        String applicationPath = request.getServletContext().getRealPath("");
                        //change the directry and make new one
                        String newApplicationPath = applicationPath.replace("build" + File.separator + "web", "web");

                        //create common folder for store profile images
                        File mainFolder = new File(newApplicationPath + "//profile-images//");
                        //create inner folder wise user
                        File userFolder = new File(newApplicationPath + "//profile-images//profile" + mobile);
                        //save the folders
                        mainFolder.mkdir();
                        userFolder.mkdir();

                        //save image in created folder
                        File file1 = new File(userFolder, "image" + mobile + ".png");
                        InputStream inputStream1 = profileImage.getInputStream();
                        Files.copy(inputStream1, file1.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                    responseJson.addProperty("success", true);

                }

            session.close();
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));
        }

    }
}
