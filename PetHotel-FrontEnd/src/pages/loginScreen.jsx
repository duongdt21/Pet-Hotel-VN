import React from "react";
import "./loginScreen.scss";
import { Login, Register } from "./local";
import Navbar from "../components/Navbar";
class loginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true
    };
  }

  componentDidMount() {
    this.rightSide.classList.add("right");
  }

  changeState() {
    const { isLogginActive } = this.state;

    if (isLogginActive) {
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left");
    } else {
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");
    }
    this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }

  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Register" : "Login";
    const currentActive = isLogginActive ? "login" : "register";
    return (
      <div style={{
        minHeight: '1000px'
      }}> 
        <Navbar/>
        <div className="App mt-5">
      
      <div className="login">
        <div className="container" ref={ref => (this.container = ref)}>
          {isLogginActive && (
            <Login containerRef={ref => (this.current = ref)} />
          )}
          {!isLogginActive && (
            <Register containerRef={ref => (this.current = ref)} />
          )}
        </div>
        <RightSide
          current={current}
          currentActive={currentActive}
          containerRef={ref => (this.rightSide = ref)}
          onClick={this.changeState.bind(this)}
        />
      </div>
    </div>
      </div>
      
    );
  }
}

const RightSide = props => {
  return (
    <div
      className="right-side"
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};

export default loginScreen;
