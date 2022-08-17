import React, { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Layout from "../components/Layout";
import classes from "./Auth.module.scss";

function Auth() {
  const [newUser, setNewUser] = useState(false);
  function switchForm() {
    setNewUser(!newUser);
  }
  return (
    <Layout>
      <div className={classes.form_container}>
        {newUser ? (
          <Register switchForm={switchForm} />
        ) : (
          <Login switchForm={switchForm} />
        )}
      </div>
    </Layout>
  );
}

export default Auth;
