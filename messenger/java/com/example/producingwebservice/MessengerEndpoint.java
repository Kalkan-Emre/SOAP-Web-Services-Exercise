package com.example.producingwebservice;

import io.spring.guides.gs_producing_web_service.*;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.sql.SQLException;
import java.util.List;

import static com.example.producingwebservice.DataBaseFunctions.*;

@Endpoint
public class MessengerEndpoint {
    private static final String NAMESPACE_URI = "http://spring.io/guides/gs-producing-web-service";


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetUserListRequest")
    @ResponsePayload
    public GetUserListResponse getUserList(@RequestPayload GetUserListRequest request) throws SQLException {
        GetUserListResponse response = new GetUserListResponse();
        response.getUserList().addAll(List.of(listUsersDB()));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "AddUserRequest")
    @ResponsePayload
    public AddUserResponse addUser(@RequestPayload AddUserRequest request){
        AddUserResponse response = new AddUserResponse();
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setBirthdate(request.getBirthdate());
        user.setGender(request.getGender());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setIsActive(request.isIsActive());
        user.setUsertype(request.getUsertype());
        insertUser(user);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "RemoveUserRequest")
    @ResponsePayload
    public RemoveUserResponse removeUser(@RequestPayload RemoveUserRequest request){
        RemoveUserResponse response = new RemoveUserResponse();
        String username = request.getUsername();
        removeUserDB(username);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "SendMessageRequest")
    @ResponsePayload
    public SendMessageResponse sendMessage(@RequestPayload SendMessageRequest request){
        SendMessageResponse response = new SendMessageResponse();
        Message message = new Message();
        message.setTo(request.getTo());
        message.setMessageBody(request.getBody());
        message.setFrom(request.getFrom());
        saveMessageToDB(message);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetInboxRequest")
    @ResponsePayload
    public GetInboxResponse getInbox(@RequestPayload GetInboxRequest request) throws SQLException {
        GetInboxResponse response = new GetInboxResponse();
        response.getInbox().addAll(List.of(getInboxDB(request.getTo())));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetOutboxRequest")
    @ResponsePayload
    public GetOutboxResponse getOutbox(@RequestPayload GetOutboxRequest request) throws SQLException {
        GetOutboxResponse response = new GetOutboxResponse();
        response.getOutbox().addAll(List.of(getOutboxDB(request.getFrom())));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "UpdatePasswordRequest")
    @ResponsePayload
    public UpdatePasswordResponse updatePassword(@RequestPayload UpdatePasswordRequest request) throws SQLException {
        UpdatePasswordResponse response = new UpdatePasswordResponse();
        updatePasswordDB(request.getUsername(),request.getPassword());
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "LogInRequest")
    @ResponsePayload
    public LogInResponse LogIn(@RequestPayload LogInRequest request) throws SQLException {
        LogInResponse response = new LogInResponse();
        response.setValid(findUserByUsernameAndPassword(request.getUsername(),request.getPassword()));
        response.setAdmin(isAdmin(request.getUsername()));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "IsAdminRequest")
    @ResponsePayload
    public IsAdminResponse IsAdmin(@RequestPayload IsAdminRequest request) throws SQLException {
        IsAdminResponse response = new IsAdminResponse();
        response.setAdmin(isAdmin(request.getUsername()));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUsernameRequest")
    @ResponsePayload
    public GetUsernameResponse getUsername(@RequestPayload GetUsernameRequest request) throws SQLException {
        GetUsernameResponse response = new GetUsernameResponse();
        response.setValid(findUserByUsername(request.getUsername()));
        return response;
    }

}