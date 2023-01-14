import React from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import moderatorList from './moderatorsList.json';
import {
  useToast,
  Box,
  Text,
  Link,
  Button,
  Heading,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Collapse,
  Input,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import Toast from './Toast.js';
const bcrypt = require('bcryptjs');

function ThreadContainer(props) {
  const Navigate = useNavigate();
  const username = useParams().username;
  const isUser = useSelector(state => state.username) === username;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this thread?")) {
      fetch('http://localhost:4000/forum_threads/' + props.id, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          Navigate("/ParamNavigator", { state: { typeNotification: "threadDeleted", page: "ProfilePage/" + username } });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  const handleUpdate = () => {
    Navigate("/editThread/" + props.id);
  }


  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" height="50px" border="1px" borderRadius="5px" padding="10px" margin="5px">
      {isUser
        ? <><Button onClick={handleDelete} colorScheme="red" size="sm" variant="outline"><FaTrashAlt /></Button>
          &nbsp;
          <Button onClick={handleUpdate} colorScheme="green" size="sm" variant="outline"><FaPencilAlt /></Button>
          &nbsp;&nbsp;
          <Divider orientation="vertical" />
          &nbsp;&nbsp;
        </>
        : <></>
      }
      <Link maxWidth="40vw" overflow="hidden" href={"/threads/" + props.id}><Heading size="md">{props.title}</Heading></Link>
    </Box>
  );
}

function CommentContainer(props) {
  const Navigate = useNavigate();
  const username = useParams().username;
  const isUser = useSelector(state => state.username) === username;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      fetch('http://localhost:4000/forum_threads/' + props.ForumThread_id + '/comments/' + props.id, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          Navigate("/ParamNavigator", { state: { typeNotification: "commentDeleted", page: "ProfilePage/" + username } });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  const handleUpdate = () => {
    Navigate("/editComment/" + props.ForumThread_id + ":" + props.id);
  }

  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" height="50px" border="1px" borderRadius="5px" padding="10px" margin="5px">
      {isUser
        ? <><Button onClick={handleDelete} colorScheme="red" size="sm" variant="outline"><FaTrashAlt /></Button>
          &nbsp;
          <Button onClick={handleUpdate} colorScheme="green" size="sm" variant="outline"><FaPencilAlt /></Button>
          &nbsp;&nbsp;
          <Divider orientation="vertical" />
          &nbsp;&nbsp;
        </>
        : <></>
      }
      <Link maxWidth="40vw" overflow="hidden" href={"/threads/" + props.ForumThread_id}><Heading size="md"><div dangerouslySetInnerHTML={{ __html: props.content }}></div></Heading></Link>
    </Box>
  );
}

function EditEmail() {
  const [emailInput, setEmailInput] = React.useState('');
  const id = useSelector(state => state.id);
  const username = useSelector(state => state.username);
  const Navigate = useNavigate();
  const userData = UseFetch('http://localhost:4000/users/');
  const usedEmails = userData ? userData.map((user) => user.email) : [];
  const isEmailError = usedEmails.includes(emailInput) || emailInput === "" || !emailInput.includes("@") || !emailInput.includes(".") || emailInput.indexOf("@") > emailInput.indexOf(".") || emailInput.indexOf("@") === 0 || emailInput.indexOf(".") === 0 || emailInput.indexOf("@") === emailInput.length - 1 || emailInput.indexOf(".") === emailInput.length - 1 || emailInput.indexOf("@") === emailInput.indexOf(".") - 1 || !emailInput.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  const handleEmailChange = (event) => {
    setEmailInput(event.target.value);
  }

  const handleEmailSubmit = () => {
    if (!isEmailError) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      };
      fetch('http://localhost:4000/users/' + id, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Email changed successfully!");
          console.log(data);
          Navigate("/ParamNavigator", { state: { typeNotification: "emailChanged", page: "ProfilePage/" + username } });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  return (
    <Box width="90%">
      <form autoComplete='off'>
        <FormControl id="email" isInvalid={isEmailError} isRequired>
          <FormLabel>New email address</FormLabel>
          <Input type="email" placeholder="Email address" onChange={handleEmailChange} />
          {!isEmailError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;We will never share your email</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;This email is invalid or already in use.</FormErrorMessage>)}
        </FormControl><br />
        <Button onClick={handleEmailSubmit} colorScheme={isEmailError ? "red" : "green"} size="sm" variant="outline" disabled={isEmailError}>Submit</Button>
      </form>
    </Box>
  );
}

function EditPassword() {
  const id = useSelector(state => state.id);
  const navigate = useNavigate();
  const username = useSelector(state => state.username);
  const userData = UseFetch('http://localhost:4000/users/' + id);
  const [oldPasswordInput, setOldPasswordInput] = React.useState('');
  const [newPasswordInput, setNewPasswordInput] = React.useState('');
  const isOldPasswordError = oldPasswordInput.length === 0 || (userData && !bcrypt.compareSync(oldPasswordInput, userData.password));
  const isNewPasswordError = newPasswordInput === "" || newPasswordInput.length < 8 || !newPasswordInput.match(/[a-z]/) || !newPasswordInput.match(/[A-Z]/) || !newPasswordInput.match(/[0-9]/);

  const handleOldPasswordChange = (event) => {
    setOldPasswordInput(event.target.value);
  }
  const handleNewPasswordChange = (event) => {
    setNewPasswordInput(event.target.value);
  }

  const handlePasswordSubmit = () => {
    const salt = bcrypt.genSaltSync(10);
    if (!isOldPasswordError && !isNewPasswordError) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        //Hashes the new password before sending it to the server
        body: JSON.stringify({ password: bcrypt.hashSync(newPasswordInput, salt) })
      };
      fetch('http://localhost:4000/users/' + id, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Password changed successfully!");
          console.log(data);
          navigate("/ParamNavigator", { state: { typeNotification: "passwordChanged", page: "ProfilePage/" + username } });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }
  return (
    <Box width="90%">
      <FormControl id="oldPassword" isInvalid={isOldPasswordError} isRequired>
        <FormLabel>Old password</FormLabel>
        <Input type="password" autocomplete="new-password" placeholder="Old password" onChange={handleOldPasswordChange} />
        {!isOldPasswordError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;Your password is correct</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;This password is incorrect.</FormErrorMessage>)}
      </FormControl><br />
      <Collapse in={!isOldPasswordError} animateOpacity>
        <FormControl id="newPassword" isInvalid={isNewPasswordError} isRequired>
          <FormLabel>New password</FormLabel>
          <Input type="password" placeholder="New password" onChange={handleNewPasswordChange} />
          {!isNewPasswordError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;Your password is strong</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.</FormErrorMessage>)}
        </FormControl><br />
      </Collapse>
      <Button onClick={handlePasswordSubmit} colorScheme={isOldPasswordError || isNewPasswordError ? "red" : "green"} size="sm" variant="outline" disabled={isOldPasswordError || isNewPasswordError}>Submit</Button>
    </Box>
  );
}

function DeleteAccount() {
  const id = useSelector(state => state.id);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
  const isMod = mods.includes(useSelector(state => state.username));

  const [passwordInput, setPasswordInput] = React.useState('');
  const userData = UseFetch('http://localhost:4000/users/' + id);
  const isPasswordError = passwordInput.length === 0 || (userData && !bcrypt.compareSync(passwordInput, userData.password));

  const handlePasswordChange = (event) => {
    setPasswordInput(event.target.value);
  }

  const logOutOnDelete = () => {
    const action = { type: "LOGOUT" };
    dispatch(action);
  }


  const handleDeleteSubmit = () => {
    if (!isPasswordError && window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      };
      fetch('http://localhost:4000/users/' + id, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Account deleted successfully!");
          console.log(data);
          logOutOnDelete();
          Navigate("/Registration", { state: { typeNotification: "deletedAccount" } });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }
  return (
    <Box width="60%">
      <Text fontSize="sm" color="red.500"><WarningIcon />{isMod ? " As a moderator, you may not delete your account" : " This action is irreversible. All of your content will be deleted."}</Text><br />
      {!isMod ?
        (<>
          <FormControl id="password" isInvalid={isPasswordError} isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="Password" onChange={handlePasswordChange} />
            {!isPasswordError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;Your password is correct</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;This password is incorrect.</FormErrorMessage>)}
          </FormControl><br />
          <Button onClick={handleDeleteSubmit} colorScheme={isPasswordError ? "red" : "green"} size="sm" variant="outline" disabled={isPasswordError || isMod}>Submit</Button><br />
        </>) : <></>
      } </Box>);
}

function DeleteMod(props) {
  const user = UseFetch("http://localhost:4000/users/s/" + props.username)
  const Navigate = useNavigate();
  const id = user ? user[0].id : null;
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      };
      fetch('http://localhost:4000/users/' + id, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Account deleted successfully!");
          console.log(data);
          Navigate("/ModDashboard", { state: { typeNotification: "deletedAccount" } });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  return (
    <><Button onClick={handleDelete} colorScheme="red" size="lg" variant="outline">Delete Account</Button>< br /></>
  );
}

export default function Profile() {
  const userData = UseFetch('http://localhost:4000/users');
  const usernames = userData ? userData.map((user) => user.username) : [];
  const username = useParams().username;
  const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
  const isMod = mods.includes(useSelector(state => state.username));
  const isUser = useSelector(state => state.username) === username;
  let threads = UseFetch('http://localhost:4000/forum_threads');
  threads = threads && userData ? threads.filter((thread) => thread.User_id === userData.find((user) => user.username === username).id) : [];
  const comments = UseFetch('http://localhost:4000/users/' + username + '/comments');
  const toast = useToast();
  const location = useLocation();
  let notif = location.state ? location.state.typeNotification : null;

  Toast(notif);

  return (
    <Box>
      <Navbar currentPage="profile" />
      {!userData || usernames.includes(username) ? <></> : <Navigate to="/" />}
      <Box align="center">
        <Heading>{isUser ? "Your" : username + "'s"} Profile</Heading>< br />
        <br />
        <Divider />
        <br />
        <Heading size="md">{isUser ? "Your " : username + "'s"} Content</Heading>
        <br />
        <Box display="flex">
          <Box align="center" flex="50%" borderRight="1px">
            {threads ? <><Heading size="md">Threads</Heading><br /></> : <></>}
            <div style={{ overflowY: "scroll", overflowX: "hidden", whiteSpace: "nowrap", maxHeight: "400px", justifyContent: "center", display: "inline-block" }}>
              {threads ? threads.map((thread) => <ThreadContainer key={thread.id} id={thread.id} title={thread.title} />) : <></>}
            </div>
            {threads ? threads.length === 0 ? <Text>No threads posted</Text> : <></> : <></>}
          </Box>
          <Box align="center" flex="50%">
            {comments ? <><Heading size="md">Comments</Heading><br /></> : <></>}
            <div style={{ overflowY: "scroll", whiteSpace: "nowrap", maxHeight: "400px", overflowX: "hidden", justifyContent: "center", display: "inline-block" }}>
              {comments ? comments.map((comment) => <CommentContainer key={comment.id} ForumThread_id={comment.ForumThread_id} id={comment.id} content={comment.content} />) : <></>}
            </div>
            {comments ? (comments.length === 0 ? <Text>No comments posted</Text> : <></>) : <></>}
          </Box>
        </Box>
        <br />
        <Divider />
        {isUser
          ? <>
            <br />
            <Heading size="md">Edit Profile</Heading>
            <br />
            <Box display="flex">
              <Box flex="50%" align="center" margin="10px" borderRight="1px">
                <Heading size="sm">Change Email Address</Heading>
                <br />
                Your current email address is {userData ? userData.find((user) => user.username === username).email : "loading..."}
                <EditEmail />
              </Box>
              <Box flex="50%" align="center">
                <Heading size="sm">Change Password</Heading>
                <br />
                <EditPassword />
              </Box>
            </Box>
            <br />
            <Divider />
            <br />
            <Heading size="md">Delete Account</Heading>
            <br />
            <DeleteAccount />
          </>
          : <></>
        }
        {
          isMod && !mods.includes(username)
            ? <>
              <br />
              <DeleteMod username={username} />
            </>
            : <></>
        }
        <br />
      </Box>
    </Box>
  );
}