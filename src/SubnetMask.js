import React from 'react'
import './App.css';
import $ from 'jquery'

class SubnetMask extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      classes: {
        'A': true,
        'B': true,
        'C': true
      },
      networkAddress: {
        o1: "",
        o2: "",
        o3: "",
        o4: ""
      },
      numSubnets: "",
      classesError: false,
      user: {
        username: ''
      }
    };
    
    
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleNextProblemClick = this.handleNextProblemClick.bind(this);
    this.checkAddressClassAnswer = this.checkAddressClassAnswer.bind(this);
    this.checkDefaultSubnetAnswer = this.checkDefaultSubnetAnswer.bind(this);
    this.checkCustomSubnetAnswer = this.checkCustomSubnetAnswer.bind(this);
    this.checkTotalNumberSubnets = this.checkTotalNumberSubnets.bind(this);
    this.checkTotalNumberHostAddresses = this.checkTotalNumberHostAddresses.bind(this);
    this.checkTotalNumberUsableAddresses = this.checkTotalNumberUsableAddresses.bind(this);
    this.checkNumberBitsBorrowed = this.checkNumberBitsBorrowed.bind(this);
  }
  
  getRandomParameters() {
    let classes = [];
    if(this.state.classes.A === true) classes.push('A');
    if(this.state.classes.B === true) classes.push('B');
    if(this.state.classes.C === true) classes.push('C');
    
    let randClass = classes[Math.floor(Math.random()*classes.length)];

    let networkAddress = {};
    let numSubnets = 2;
    if(randClass === 'A'){
      networkAddress.o1 = Math.floor(Math.random() * 127)
      numSubnets = Math.floor(Math.random() * (257 - 2) + 2)
    }
    if(randClass === 'B'){
      networkAddress.o1 = Math.floor(Math.random() * (193-128) + 128)
      numSubnets = Math.floor(Math.random() * (129 - 2) + 2)
    }
    if(randClass === 'C'){
      networkAddress.o1 = Math.floor(Math.random() * (225-193) + 193)
      numSubnets = Math.floor(Math.random() * (33 - 2) + 2)
    }
    networkAddress.o2 = Math.floor(Math.random() * 256)
    networkAddress.o3 = Math.floor(Math.random() * 256)
    networkAddress.o4 = 0;
    this.setState({networkAddress: networkAddress, numSubnets: numSubnets})
  }
  
  getNetworkClass(){
    if(this.state.networkAddress.o1 < 127){
      return 'A';
    } else if(this.state.networkAddress.o1 < 193 && this.state.networkAddress.o1 > 127){
      return 'B';
    } else if(this.state.networkAddress.o1 < 224 && this.state.networkAddress.o1 > 192){
      return 'C';
    }
    return false
  }
  
  getBitsBorrowed(){
    return Math.ceil(Math.log2(this.state.numSubnets));
  }
  
  getTotalHostAddresses(){
    let bits = 0;
    let bb = this.getBitsBorrowed();
    let netClass = this.getNetworkClass();
    if(netClass === 'A') bits = 24 - bb;
    if(netClass === 'B') bits = 16 - bb;
    if(netClass === 'C') bits = 8 - bb;
    return Math.pow(2, bits);
  }
  
  checkAddressClassAnswer(e){
    let netClass = this.getNetworkClass(this.state.networkAddress.o1);
    if(netClass === e.target.value.toUpperCase()){
      $('#addressClassAnswer').addClass('is-valid');
    } else {
      $('#addressClassAnswer').removeClass('is-valid');
    }
  }
  
  checkDefaultSubnetAnswer(e){
    let netClass = this.getNetworkClass(this.state.networkAddress.o1);
    let correct = false;
    if(netClass === 'A' && e.target.value === '255.0.0.0'){
      correct = true;
    } else if(netClass === 'B' && e.target.value === '255.255.0.0'){
      correct = true;
    } else if(netClass === 'C' && e.target.value === '255.255.255.0'){
      correct = true;
    }
    if(correct === true){
      $('#defaultSubnetAnswer').addClass('is-valid');
    } else {
      $('#defaultSubnetAnswer').removeClass('is-valid');
    }
  }
  
  checkCustomSubnetAnswer(e){
    let bitsBorrowed = this.getBitsBorrowed();
    let netClass = this.getNetworkClass(this.state.networkAddress.o1);
    
    let csm;
    if(netClass === 'A') csm = '255';
    if(netClass === 'B') csm = '255.255';
    if(netClass === 'C') csm = '255.255.255';
    while(bitsBorrowed > 0){
      if(bitsBorrowed > 7){
        csm += '.255';
      } else {
        let mask = 0;
        for(let i=1; i <= bitsBorrowed; i++){
          mask += Math.pow(2, 8-i);
        }
        csm += "." + mask;
      }
      bitsBorrowed -= 8;
    }
    while(csm.split('.').length < 4) csm += ".0";
  
    if(e.target.value === csm){
      $('#customSubnetAnswer').addClass('is-valid');
    } else {
      $('#customSubnetAnswer').removeClass('is-valid');
    }
  }
  
  checkTotalNumberSubnets(e){
    if(e.target.value === Math.pow(2, this.getBitsBorrowed()).toString()){
      $('#totalNumberSubnets').addClass('is-valid');
    } else {
      $('#totalNumberSubnets').removeClass('is-valid');
    }
  }
  
  checkTotalNumberHostAddresses(e){
    if(e.target.value === this.getTotalHostAddresses().toString()){
      $('#totalNumberHostAddresses').addClass('is-valid');
    } else {
      $('#totalNumberHostAddresses').removeClass('is-valid');
    }
  }
  
  checkTotalNumberUsableAddresses(e){
    let total = this.getTotalHostAddresses() - 2;
    if(e.target.value === total.toString()){
      $('#totalNumberUsableAddresses').addClass('is-valid');
    } else {
      $('#totalNumberUsableAddresses').removeClass('is-valid');
    }
  }
  
  checkNumberBitsBorrowed(e){
    if(e.target.value === this.getBitsBorrowed().toString()){
      $('#totalNumberBitsBorrowed').addClass('is-valid');
    } else {
      $('#totalNumberBitsBorrowed').removeClass('is-valid');
    }
  }

  handleCheckboxChange(e) {
    let state = {...this.state.classes}
    let targetClass = e.target.id.substr(-1);
    
    if(state[targetClass] === true){
      state[targetClass] = false
    } else {
      state[targetClass] = true
    }
    let error = false;
    if(state.A === false && state.B === false && state.C === false){
      $('#nextProblemButton').prop('disabled', true)
      error = true
    } else {
      $('#nextProblemButton').prop('disabled', false)
    }
    this.setState({classes: state, classesError: error})
  }
  
  handleNextProblemClick(e){
    let fields = ['addressClassAnswer', 'defaultSubnetAnswer', 'customSubnetAnswer','totalNumberSubnets','totalNumberHostAddresses','totalNumberUsableAddresses','totalNumberBitsBorrowed']
    fields.forEach(e=>{
      $('#' + e).val("");
      $('#' + e).removeClass('is-valid');
    });
    this.getRandomParameters();
  }
  
  componentDidMount(){
    this.getRandomParameters();
  }
  render() {
    return <div>
      <div className="container-fluid">
        <div className="row pt-1">
          <div className="col-sm-6">
            <span>Select Network Classes &nbsp;</span>
            <div className="form-check form-check-inline">
              <input className="form-check-input" 
                type="checkbox" 
                id="networkClassA" 
                value="A"
                onChange={this.handleCheckboxChange}
                checked={this.state.classes.A} />
              <label className="form-check-label" htmlFor="networkClassA">A</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" 
                type="checkbox" 
                id="networkClassB" 
                value="B"
                onChange={this.handleCheckboxChange}
                checked={this.state.classes.B} />
              <label className="form-check-label" htmlFor="networkClassB">B</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" 
                type="checkbox" 
                id="networkClassC" 
                value="C"
                onChange={this.handleCheckboxChange}
                checked={this.state.classes.C} />
              <label className="form-check-label" htmlFor="networkClassC">C</label>
            </div>
            {this.state.classesError ? <span className="text-danger">Select at least 1 network class!</span> : ""}
          </div>
          <div className="col-sm-6 text-right">
            <div>
              <button type="button"
                id="nextProblemButton"
                className="btn btn-primary"
                onClick={this.handleNextProblemClick} >Next Problem</button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="container-fluid subnet-form">
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Number of needed subnets
          </div>
          <div className="col-sm-6">
            {this.state.numSubnets}
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Network Address
          </div>
          <div className="col-sm-6">
            {this.state.networkAddress.o1 + "." + this.state.networkAddress.o2 + "." + this.state.networkAddress.o3 + "." + this.state.networkAddress.o4}
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Address Class
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input type="text" className="form-control w-25" id="addressClassAnswer" onChange={this.checkAddressClassAnswer}/>
            </div>
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Default Subnet Mask
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input type="text" className="form-control w-25" id="defaultSubnetAnswer" onChange={this.checkDefaultSubnetAnswer} />
            </div>
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Custom Subnet Mask
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input type="text" className="form-control w-25" id="customSubnetAnswer" onChange={this.checkCustomSubnetAnswer} />
            </div>
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Total Number of Subnets
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input type="text" className="form-control w-25" id="totalNumberSubnets" onChange={this.checkTotalNumberSubnets} />
            </div>
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Total Number of hosts addresses
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input type="text" className="form-control w-25" id="totalNumberHostAddresses" onChange={this.checkTotalNumberHostAddresses} />
            </div>
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Number of usable addresses
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input type="text" className="form-control w-25" id="totalNumberUsableAddresses" onChange={this.checkTotalNumberUsableAddresses} />
            </div>
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-sm-6 text-right">
            Number of bits borrowed
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input type="text" className="form-control w-25" id="totalNumberBitsBorrowed" onChange={this.checkNumberBitsBorrowed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

export default SubnetMask
