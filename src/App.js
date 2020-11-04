import React, { Component } from 'react';
import Clarifai, { FACE_EMBED_MODEL } from "clarifai";
import './App.css';
import Navigation from "./components/Navigation/Navigation"
import Logo from "./components/Logo/Logo"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm"
import Rank from "./components/Rank/Rank"
import FaceRecognition from "./components/FaceRecognition/FaceRecognition"
import Signin from "./components/Singin/Signin"
import Register from "./components/Register/Register"
import Particles from "react-particles-js"

const app = new Clarifai.App({
  apiKey: "3b993b6bb1514ca7a5bb3d8afe72eb6a"
})

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

// const deleteThis = {
//   top_row: "",
//   left_col: "",
//   bottom_row: "",
//   right_col: ""
// }

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: "",
      imageUrl: "",
      faceBox: {},
      route: "signin",
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById("inputimage")
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      // rightCol ---> it is made like this because the right column is on the right side so we wanna get the number wich is the total percentage minus the width starting from the left hand side.
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ faceBox: box }) //or in ES6 you can do ({box}) if the argument and the state are called the same way
  }


  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => {
        console.log(err);
      })
  }

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false })
    } else if (route === "home") {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, imageUrl, route, faceBox } = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === "home" ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={faceBox} imageUrl={imageUrl} />
          </div>
          : (
            this.state.route === "signin" ? <Signin onRouteChange={this.onRouteChange} /> :
              <Register onRouteChange={this.onRouteChange} />
          )

        }
      </div>
    )
  }
}

export default App;
