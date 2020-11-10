import React, { Component, useState, useEffect } from "react"
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const emailRegex = RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const Register = ({ onRouteChange, loadUser }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const onSubmitsignin = (event) => {
        event.preventDefault();
        if (!emailRegex.test(email)) {
            alert("enter a valir email adress")
        }
        if (!password || !name) {
            alert("fill the inputs please")
        } else {
            fetch(proxyurl + "https://heroku-face-detection-api.herokuapp.com/register", {
                method: "post",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email, password, name })
            })
                .then(response => response.json())
                .then(user => {
                    if (user._id) {
                        loadUser(user)
                        onRouteChange("home")
                    } else {
                        alert("something went wrong")
                    }
                })
        }
    }

    return (
        <article className="br4 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input
                                onChange={e => setName(e.target.value)}
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name" id="name" />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                                onChange={e => setEmail(e.target.value)}
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email" id="email-address" />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input
                                onChange={e => setPassword(e.target.value)}
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            onClick={onSubmitsignin}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit"
                            value="signin" />
                    </div>
                </div>
            </main>
        </article>
    )
}

export default Register