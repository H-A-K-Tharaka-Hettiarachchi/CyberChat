/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
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
 * @author ASUS
 */
@Entity
@Table(name = "chat")
public class Chat implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "from_user_id")
    private User fromUser;

    @ManyToOne
    @JoinColumn(name = "to_user_id")
    private User toUser;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "date_time", nullable = false)
    private Date dateTime;

    @ManyToOne
    @JoinColumn(name = "chat_status_id")
    private ChatStatus chatStatus;

    public Chat() {
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
     * @return the fromUser
     */
    public User getFromUser() {
        return fromUser;
    }

    /**
     * @param fromUser the fromUser to set
     */
    public void setFromUser(User fromUser) {
        this.fromUser = fromUser;
    }

    /**
     * @return the toUser
     */
    public User getToUser() {
        return toUser;
    }

    /**
     * @param toUser the toUser to set
     */
    public void setToUser(User toUser) {
        this.toUser = toUser;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the dateTime
     */
    public Date getDateTime() {
        return dateTime;
    }

    /**
     * @param dateTime the dateTime to set
     */
    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }

    /**
     * @return the chatStatus
     */
    public ChatStatus getChatStatus() {
        return chatStatus;
    }

    /**
     * @param chatStatus the chatStatus to set
     */
    public void setChatStatus(ChatStatus chatStatus) {
        this.chatStatus = chatStatus;
    }

 
    
}
