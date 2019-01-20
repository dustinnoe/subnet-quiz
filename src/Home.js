import React from 'react'
import Nav from './Nav'
import SubnetMask from './SubnetMask'

class Home extends React.Component {
  render() {
    return <div>
        <Nav />
        <SubnetMask />
    </div>
  }
}

export default Home