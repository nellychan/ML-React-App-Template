import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: {
        DAY_OF_WEEK: 1,
        MONTH: 1,
        BusyFactor: 1,
        Hourofdeparture_converted: 1
      },
      result: ""
    };
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }

  handlePredictClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isLoading: true });
    fetch('http://127.0.0.1:5000/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => {
        this.setState({
          result: response.result,
          isLoading: false
        });
      });
  }

  handleCancelClick = (event) => {
    this.setState({ result: "" });
  }

  render() {
    const isLoading = this.state.isLoading;
    const formData = this.state.formData;
    const result = this.state.result;

    var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    var text = ""; 
    var DAY_OF_WEEK = []
    //for (var i = 1; i <= 7; i = +(i + 1).toFixed(1)) {
      for (var i=0; i< DAYS.length; i++) {
            //text += DAYS[i] + "<br>";
      DAY_OF_WEEK.push(<option key = {DAYS[i]} value = {DAYS[i]}>{DAYS[i]}</option>);
    }          
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var text = "";    
    for (var i=0; i< month.length; i++) {                    
    var MONTH = []
    //for (var i = 1; i <= 12; i = +(i + 1).toFixed(1)) {
      MONTH.push(<option key = {month[i]} value = {month[i]}>{month[i]}</option>);
    }
    var BusyFactor = []
    for (var i = 1; i <= 5; i = +(i + 1).toFixed(1)){
      BusyFactor.push(<option key = {i} value = {i}>{i}</option>);
    } 
    var hour = ["0000 - 0700", "0700 - 0900", "0900 - 1100", "1100 - 1300", "1300 - 1500", "1500 - 1700", "1700 - 1900", "1900 - 2000", "2000 - 2400"]
    var text = "";  
     for (var i=0; i< hour.length; i++) {                    
    var Hourofdeparture_converted = []
    for (var i = 1; i <= 9; i = +(i + 1).toFixed(1)) {              
      Hourofdeparture_converted.push(<option key = {hour[i]} value = {hour[i]}>{hour[i]}</option>);
    }
    return (
      <Container>
        <div>
          <h1 className="title">Flight Delay Predictor</h1>
        </div>
        <div className="content">
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Day of the week</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.DAY_OF_WEEK}
                  name="DAY_OF_WEEK"
                  onChange={this.handleChange}>
                  {DAY_OF_WEEK}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Month</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.MONTH}
                  name="MONTH"
                  onChange={this.handleChange}>
                  {MONTH}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Origin</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.BusyFactor}
                  name="BusyFactor"
                  onChange={this.handleChange}>
                  {BusyFactor}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Time</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.Hourofdeparture_converted}
                  name="Hourofdeparture_converted"
                  onChange={this.handleChange}>
                  {Hourofdeparture_converted}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Row>
              <Col>
                <Button
                  block
                  variant="success"
                  disabled={isLoading}
                  onClick={!isLoading ? this.handlePredictClick : null}>
                  { isLoading ? 'Making prediction' : 'Predict' }
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  disabled={isLoading}
                  onClick={this.handleCancelClick}>
                  Reset prediction
                </Button>
              </Col>
            </Row>
          </Form>
          {result === "" ? null :
            (<Row>
              <Col className="result-container">
                <h5 id="result">{result}</h5>
              </Col>
            </Row>)
          }
        </div>
      </Container>
    );
  }
}

export default App;
