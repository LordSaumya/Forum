import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Spinner } from '@chakra-ui/react';

export default function ParamNavigator() {
    const username = useSelector(state => state.username);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    setInterval(() => setLoading(false), 50);
    const redirectToIndex = setTimeout(() => navigate(username ? "/" : "/Registration", {state: {typeNotification: "ERROR"}}), 2000);
    const location = useLocation();
    const notif = location.state ? location.state.typeNotification : null;
    const page = location.state ? location.state.page : null;
    console.log(notif, page);

    if (page && notif) {
        clearTimeout(redirectToIndex);
        navigate("/" + page, {state: {typeNotification: notif}})
    };


    return (
        <Box height = "100vh" width = "100%" align = "center"><Spinner top = "50vh" position = "absolute" size = "xl"/></Box>
    )
}
