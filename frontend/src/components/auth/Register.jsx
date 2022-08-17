import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

import classes from "./AuthForm.module.scss";

function Register(props) {
  const register = async (e) => {
    e.preventDefault();
    const user = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    try {
      await axios.post(`https://todoist-mern-clone.herokuapp.com/api/auth/register`, user);
      toast.success("Registered successfully");
      props.switchForm()
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={classes.register}>
      <h1 className={classes.title}>Register</h1>
      <form className={classes.authForm} onSubmit={register}>
        <label htmlFor="name">
          Full Name:
          <input name="name" type="text" placeholder="Full Name" required />
        </label>
        <label htmlFor="email">
          email:
          <input name="email" type="email" placeholder="email" required />
        </label>
        <br />
        <label htmlFor="password">
          password:
          <input
            name="password"
            type="password"
            placeholder="password"
            required
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      <div className={classes.switch_form}>
        <p>
          already have an account?
          <button onClick={props.switchForm}>log in</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
