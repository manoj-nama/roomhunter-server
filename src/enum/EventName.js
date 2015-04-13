/**
 * This defines the Service event types.
 * */
"use strict";

module.exports = {

    //When some error occurs
    ERROR: "ERROR",

    //When new user is created
    USER_CREATED: "USER_CREATED",

    //When new user is updated
    USER_UPDATED: "USER_UPDATED",

    //When the job is done
    DONE: "DONE",

    //When the job is already done
    NO_CHANGE: "NO_CHANGE",

    //When the user is not an ADMIN user
    NOT_OWNER: "NOT_OWNER",

    //When the entity us not processable. the data with ID is not found.
    NOT_FOUND: "NOT_FOUND",

    //When the user does not have rights on that data
    UNAUTHORIZED: "UNAUTHORIZED"
};