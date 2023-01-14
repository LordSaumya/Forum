//Imports
import React from 'react';
import { useState } from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import {
    Box,
    Button,
    Container,
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Textarea,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';

//Body

//Form to edit bio
function BioForm(props) {
    const Navigate = useNavigate();
    const username = useSelector(state => state.username);
    const [bio, setBio] = useState(props.bio);
    const isBioError = bio.length > 150 || bio.split("\n").length > 5;
    const user_id = useSelector(state => state.id);

    //Updates bio
    const handleUpdateBio = (event) => {
        event.preventDefault();
        const data = {
            //Strips bio of any HTML tags, and then replaces line breaks with HTML line breaks
            bio: ((bio.replaceAll(/<([\w\-/]+)( +[\w\-]+(=(('[^']*')|("[^"]*")))?)* *>/g, "")).replaceAll(/(?:\r\n|\r|\n)/g, '<br />')),
        }
        console.log("data", data);
        console.log("user_id", user_id);
        fetch('https://highgear.herokuapp.com/users/' + user_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => { redirectUpdate(data); })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    //Redirects to user page with location parameters
    const redirectUpdate = (data) => {
        console.log(data);
        Navigate("/ProfilePage/" + username, { state: { typeNotification: "bioEdited" } });
    }

    const handleBioInput = (event) => {
        setBio(event.target.value);
    }

    return (
        <Container minWidth="80%" padding="0">
            <form onSubmit={handleUpdateBio}>
                <FormControl isInvalid={isBioError}>
                    <FormLabel>Your bio:</FormLabel>
                    <Textarea value={bio} onChange={handleBioInput} resize="none" whiteSpace="pre-line"/>
                    {!(isBioError) ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp; Lookin' good!</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;The bio cannot be longer than 150 characters or 5 lines!</FormErrorMessage>)}
                </FormControl>
                <Button
                    mt={4}
                    colorScheme={isBioError ? "grey" : "teal"}
                    type="submit"
                    disabled={isBioError}
                >
                    Update Bio
                </Button>
            </form>
        </Container>
    );
}


//Main container for edit bio page
export default function EditBio() {
    const username = useParams().username;
    const currentUser = useSelector(state => state.username);
    const Navigate = useNavigate();

    //Fetches user data
    const user = UseFetch('https://highgear.herokuapp.com/users/s/' + username)[0];

    if (user && (username === currentUser)) {
        return (
            <>
                <Box>
                    <Navbar />
                    <Box align="center">
                        <Heading>Edit Bio</Heading>
                    </Box>
                    <BioForm bio={user.bio ? (user.bio).replaceAll("<br />","\n") : ""} />
                </Box>
            </>
        );
    } else {
        Navigate("/", { state: { typeNotification: "permissionDenied" } });
    }
}