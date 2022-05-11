import React, { useState } from "react";

export default function Forms() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [formErrors, setFormErrors] = useState("");
  const [emailErrors, setEmailErrors] = useState("");

  const onUsernameChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    setUsername(value);
  };
  const onEmailChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    setEmailErrors("");
    setEmail(value);
  };
  const onPwdChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    setPwd(value);
  };
  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "" || email === "" || pwd === "") {
      setFormErrors("All fields are required");
    }
    if (!email.includes("@")) {
      setEmailErrors("Email is required");
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        value={username}
        onChange={onUsernameChange}
        type="text"
        placeholder="Username"
        required
      />
      <input
        value={email}
        onChange={onEmailChange}
        type="email"
        placeholder="Email"
        required
      />
      {emailErrors}
      <input
        value={pwd}
        onChange={onPwdChange}
        type="password"
        placeholder="Password"
        required
      />
      <input type="submit" value="Create Account" />
      {formErrors}
    </form>
  );
}
