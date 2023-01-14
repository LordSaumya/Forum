import React, { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

export default function Toast(notif) {
    const toast = useToast();
    useEffect(() => {
        if (notif) {
            let [toastTitle, toastDesc, toastStatus] = [null, null, null];
            if (notif === "accountCreated") {
                toastTitle = "Account created.";
                toastDesc = "Your account has been created";
                toastStatus = "success";
            } else if (notif === "loggedIn") {
                toastTitle = "Logged in.";
                toastDesc = "You are now logged in.";
                toastStatus = "success";
            } else if (notif === "threadDeleted") {
                toastTitle = "Thread deleted.";
                toastDesc = "The thread has been deleted.";
                toastStatus = "error";
            } else if (notif === "permissionDenied") {
                toastTitle = "Permission denied.";
                toastDesc = "You do not have access to this page.";
                toastStatus = "error";
            } else if (notif === "threadCreated") {
                toastTitle = "Thread created";
                toastDesc = "Your thread is live!";
                toastStatus = "success";
            } else if (notif === "threadEdited") {
                toastTitle = "Thread edited";
                toastDesc = "Your thread has been edited!";
                toastStatus = "success";
            } else if (notif === "commentEdited") {
                toastTitle = "Comment edited";
                toastDesc = "Your comment has been edited!";
                toastStatus = "success";
            } else if (notif === "changesDiscarded") {
                toastTitle = "Changes discarded";
                toastDesc = "Your changes have been discarded";
                toastStatus = "error";
            } else if (notif === "commentDeleted") {
                toastTitle = "Comment deleted";
                toastDesc = "The comment has been deleted";
                toastStatus = "error";
            } else if (notif === "commentCreated") {
                toastTitle = "Comment created";
                toastDesc = "Your comment has been posted";
                toastStatus = "success";
            } else if (notif === "emailChanged") {
                toastTitle = "Email changed";
                toastDesc = "Your email has been changed.";
                toastStatus = "success";
            } else if (notif === "passwordChanged") {
                toastTitle = "Password changed";
                toastDesc = "Your password has been changed.";
                toastStatus = "success";
            } else if (notif === "loggedOut") {
                toastTitle = "Logged out.";
                toastDesc = "You have succesfully logged out.";
                toastStatus = "success";
            } else if (notif === "notLoggedIn") {
                toastTitle = "Not logged in.";
                toastDesc = "You are not logged in.";
                toastStatus = "error";
            } else if (notif === "deletedAccount") {
                toastTitle = "Account deleted.";
                toastDesc = "Your account has been deleted.";
                toastStatus = "warning";
            } else if (notif === "bioEdited"){
                toastTitle = "Bio edited.";
                toastDesc = "Your bio has been edited.";
                toastStatus = "success";
            } else {
                toastTitle = "Error";
                toastDesc = "An unknown error has occured.";
                toastStatus = "error";
            }

            toast({
                title: toastTitle,
                description: toastDesc,
                status: toastStatus,
                duration: 5000,
                isClosable: true,
            });
            notif = null;
        }
    }, []);
}