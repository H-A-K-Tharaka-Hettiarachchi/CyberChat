package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author KSHPRIME
 */
@Entity
@Table(name = "user")
public class User implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "mobile", length = 13, nullable = false)
    private String mobile;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @Column(name = "name", length = 60, nullable = true)
    private String name;

    @Column(name = "email", length = 60, nullable = true)
    private String email;

    @Column(name = "password", length = 45, nullable = true)
    private String password;

    @Column(name = "email_otp", length = 8, nullable = true)
    private String emailOtp;

    @Column(name = "mobile_otp", length = 8, nullable = true)
    private String mobileOtp;

    @Column(name = "registered_date_time", nullable = false)
    private Date registeredDateTime;

    @ManyToOne
    @JoinColumn(name = "user_status_id")
    private UserStatus userStatus;

    public User() {
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the mobile
     */
    public String getMobile() {
        return mobile;
    }

    /**
     * @param mobile the mobile to set
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * @return the country
     */
    public Country getCountry() {
        return country;
    }

    /**
     * @param country the country to set
     */
    public void setCountry(Country country) {
        this.country = country;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the emailOtp
     */
    public String getEmailOtp() {
        return emailOtp;
    }

    /**
     * @param emailOtp the emailOtp to set
     */
    public void setEmailOtp(String emailOtp) {
        this.emailOtp = emailOtp;
    }

    /**
     * @return the mobileOtp
     */
    public String getMobileOtp() {
        return mobileOtp;
    }

    /**
     * @param mobileOtp the mobileOtp to set
     */
    public void setMobileOtp(String mobileOtp) {
        this.mobileOtp = mobileOtp;
    }

    /**
     * @return the registeredDateTime
     */
    public Date getRegisteredDateTime() {
        return registeredDateTime;
    }

    /**
     * @param registeredDateTime the registeredDateTime to set
     */
    public void setRegisteredDateTime(Date registeredDateTime) {
        this.registeredDateTime = registeredDateTime;
    }

    /**
     * @return the userStatus
     */
    public UserStatus getUserStatus() {
        return userStatus;
    }

    /**
     * @param userStatus the userStatus to set
     */
    public void setUserStatus(UserStatus userStatus) {
        this.userStatus = userStatus;
    }

  
}
